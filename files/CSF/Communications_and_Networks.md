---
layout: default
title: "Communications and Networks Notes"
---


## File Systems

### Unix I/O
- `C` provides `FILE*` data type to represent a "file handle":
	- It can be interpreted as a *source of input* or *destination for output*.
	- There are the *standard file handles*: `stdin`, `stdout`, and `stderr`.
	- The named files and devices can be opened using `fopen`.
	- In particular, the `fprint`, `fread`, etc. functions can take `FILE*` data.

```c
printf("Hello world\n");                   // print to stdout
fprintf(stdout, "Hello world\n");          // explicitly print to stdout
```
- Unix-based systems (such as `Linux` and `MacOS`) use *file descriptors* to refer to:
	- files,
	- devices (such as terminals), and
	- other kind of communication channels (such as network connections).
- A file descriptor is an `int`, and the `C` file handle (`FILE*`) is a wrapper for a file descriptor:
	- In particular, the *file descriptor* is a small integer value identifying an open file. It is really an index into a file table (process data structure) belong to the process.
	- Each entry in the table points to a *file object*, which contains:
		- pointer to a *vnode* (or *virtual node*), a structure representing actual file data, in files/terminal devices/pipes/network connections/etc.
		- file position (the offset of next byte to be read or written, for random-access files), and
		- reference count.![[vnode.jpg]]
	- Multiple file descriptors can refer to the same file object, realized by `dup(fd)` and `dup2(fd1, fd2)` which creates a new descriptors referring to the same file objects.
	- In particular, when a child process it created by `fork`, it inherits the parent process's file table.
- In general, the concept of *file* is a sequence of bytes that can be read and written sequentially:
	- For some files, random access is possible (read/write at *arbitrary* locations).
	- The canonical way of defining a file is a sequence of bytes stored on a medium such as disk or SSD.
	- More broadly, any objects that can be treated as a file (for reading/writing bytes) is a file, which includes the follows:
		- Terminals,
		- Pipes (e.g. `cat file.txt | wc -l`),
		- Network connections, and
		- Peripheral devices.
- Unix *filesystem* is a hierarchical namespace for files:
	- The system starts from the *root directory* (`/`), and navigates through a sequence of at least 0 *intermediate directories*.
	- The directories, such as `/usr/bin/gcc`, would locate to a file in the system. ![[File_system.jpg]]
- A *system call* is a mechanism allowing a process to request a service from the operating system:
	- To the running programs, the system calls are function calls.
	- System calls are *very low-level*, but most programming languages provide a *run-time* library with *higher-level* languages.
	- In `C`, we have the following examples:
		- `open`, `read`, and `write` are system calls, they return a `int` as file descriptor (return `-1` when fails).
		- `fopen`, `fread`, and `fwrite` are run-time library functions, they return a `FILE *` as the file pointer (return `NULL` when fails).
- To ensure *asynchronous notification*, Unix uses *signals*, which are similar to hardware interrupts (but delivered to programs):
	- Programs can register a *signal handler* function to receive the signals.
	- Some of the signals are:
		- `SIGSEGV`: The segmentation violation, or segmentation fault.
		- `SIGINT`: Interruption, typically by `CTRL-C`.
		- `SIGALRM`: Software timer alert.
	- System calls can be interrupted when receiving a signal.

### I/O Examples in `C`
- In `C` language, the most basic I/O example is by the system calls, using the low-level function calls.
- `open` opens a named file, and returns the file descriptor:
	- The flags are one of `O_RDONLY` (read only), `O_WRONLY` (write only), or `O_RDWR` (read and write mode), `O_CREAT` (create file if not exist), `O_EXCL` (precent creating file if it exists), `O_APPEND` (open file and put curser at the end).
	- With `O_CREAT` flag, mode specify the access permission bits.

```c
int open(const char *pathname, int flags, mode_t mode);
```
- `close` closed the system call from the file descriptor, returns `0` for success and `-1` for failure.

```c
int close(int fd);
```
- `read` reads `n` bytes of data from the specified file descriptor, placing data read in `buf` and returns the number of bytes read, `0` on `EWOF`, or `-1` for error:
	- A *short read* happens when fewer than `n` bytes were read. It might be because that:
		- it reaches end of file (`EOF`),
		- some data is not available yet (especially in network connection), or
		- line buffering by terminal.

```c
ssize_t read(int fd, void *buf, size_t n);
```
- To deal with short read, one can implement a function that read `n` bytes from `fd` and read until `n` bytes read, reach `EOF`, or `-1` for error:

```c
ssize_t read_fully(int fd, void *buf, size_t n) {
	char *p = buf;
	// read in while we have not achieved n
	while (p < (char *) buf + n) {
		size_t remaining = n - (p - (char *) buf);
		ssize_t rc = read(fd, p, remaining);
		if (rc == 0) { // reached EOF
			break;
		} else if (rc > 0) { // record the read
			p += rc;
		} else if (errno != EINTR) { // check if iterrupted
			return -1; 
		}
	}
	// return number of correct reads
	return (ssize_t) (p - (char *) buf);
}
```
- `write` writes `n` bytes from `buf` to specified file descriptor, it returns the number of bytes written, or `-1` on error:
	- Akin to `read`, `write` can also return a short write (fewer than `n` bytes are written). Then a `write_fully` can be implemented.

```c
ssize_t write(int fd, const void *buf, size_t n);
```
- Note that `read` and `write` is more proficient when handling buffer at the same time, which give rise to *buffered read* and *write*:
	- Specifically, during a *system call*, it involves calling into the operating system kernel, meaning that it requires:
		- saving and restoring the registers,
		- switching processor privilege levels,
		- checking system call arguments, and 
		- carrying out the system call (I/O, data transfer to/from program buffer).
	- Thus, first reading/writing into the buffer in memory and flush to the file when buffer is full or before closing the file is a more efficient choice.
- In `C` library, the `FILE *` objects have internal budder, so `fgetc` and `fputc` does not have system call every time. One needs to `close` the file pointer when there are writing.

```c
FILE *in = fopen("input.txt", "r");       // open for input
FILE *out = fopen("output.txt", "w");     // open for output
int c = fgetc(in);
if (c < 0) {
	fprintf(stderr, "failed"); return 1;  // error handling
}
if (c != fputc(c, out)) {
	fprintf(stderr, "failed"); return 1;  // error handling
}
fclose(in);                               // close in, not necessary
fclose(out);                              // close out, necessary
```


## Networks Connections

### Network Interface
- Network allow communication between computers, access remote data, and share information.
- To connect to a network, a computer device needs a network interface:
	- networks uses ethernet or Infiniband (wired), and Wi-Fi(802.11) or cellular modem (wireless).
	- To the computing device, or the host, the network is like a peripheral device. The network interface device notifies the host CPU and RAM when data arrives from the network. ![[Internet_interface.png]]
- *Protocol Stack* is needed to allow network applications to communicate over the attached network interface(s), as the network protocols are layered:
	- The issue is to consider compatibility for different network technologies, identifying the devices, and data routing.
	- Network security involves the security requirements while the controlling access should only permit authorized agent access to the data and services.

|          Level           |                      Protocol Information                      |   Type    |
| :----------------------: | :------------------------------------------------------------: | :-------: |
| application / user space |                  application protocal (HHTP)                   |  message  |
|          kernel          |                    transport protocol (TCP)                    |  packets  |
|          kernel          |                     network protocol (IP)                      | datagrams |
|          kernel          |                 link layer protocal (ethernet)                 |  frames   |
|   transmission medium    | physical layer protocol <br>(ethernet over CAT 6 twisted pair) |  signals  |

### TCP/IP
- The TCP/IP is a suite of *internet-working* protocols, *i.e.*, connecting lots of physical networks together, including when they use different technologies/protocols.
- The two versions are IPv4 and IPv6:
	- IPv4 has 32 bit addresses (not enough) and widely deployed.
	- IPv6 has 128 bit addresses, and not as widely deployed.
- IP (Internet Protocol) is the underlying network protocol in the TCP/IP protocol suite:
	- Ultimately, all data is sent and received using IP datagrams, the fixed-size packets of data using IP addresses.
	- IP is an unreliable protocol: when a datagram is sent, it might not reach the recipient.
		- When a router received two packets to the same destination, it will drop the packet, so it has unsent packets. Therefore, there needs to be a bounded queue waiting (unbounded implies unbounded waiting time). However, the bounded queue would drop the packets when full,
	- Transport protocols (such as TCP and UDP) are layered on top of IP, they uses the IP datagram, namely:
		- consists of header followed by data,
		- may be fragmented and reassembled, and
		- protocol field indicates which transport protocol is being used.![[IP_datagram.png]]
- TCP (Transmission Control Protocol) is a connection protocol layered on IP (value in Protocol field is `6`), it allows the creation of virtual connections between peer systems on network:
	- A connection is a bidirectional data stream, data sent in both directions.
	- Data is guaranteed to be delivered in the order sent.
	- Connection can be closed.
	- TCP is a reliable protocol. If any data is lost en route, it is automatically resent.
		- In particular, TCP require acknowledgement of data sent, so no acknowledgement implies that the packet dropped and will be retransmitted.
- UDP (User Datagram Protocol) is a datagram protocol layered on IP (value in Protocol field is `17`), it is:
	- Not connection-oriented: data could be received in any order, no fixed duration of conversation.
	- Used in applications where minimizing latency is important and data loss can be tolerated.
	- UDP is unreliable, as data sent might not be received.

### Addressing and Routing
- There are two kinds of address:
	- Network address: address of a network interface within the overall internet (such as IPv4 address).
	- Hardware address: a hardware-level address of a network interface (such as ethernet MAC address).
- Network address is used to make routing decisions at the scale of the overall internet:
	- it conveys information about the network on which the interface can be found.
	- a router makes routing decisions based on a network address.
- Hardware address is used to deliver a data packet to a destination within the local network:
	- a switch makes routing decisions based on a hardware address.![[Address_reality.png]]
- Router has a choice of outgoing links on which to send the packet:
	- Each router has a routing table specifying which link to use based on matching the network part of the destination address.
	- Routing algorithms: try to deliver packets efficiently, and avoid routing loops.

### Sockets
- *Unix sockets* are API to allow programs to communicate over networks, it is designed to work with many underlying protocols:
	- Socket can be interpreted as “communications endpoint”, and it appears to process as a file descriptor.
	- There are several types of sockets:
		- Server socket: used by server to accept connections from clients (not used for actual exchange of data).
		- Client socket: used to exchange data between client and server systems.
- Sockets incites system calls, namely some of the follows:
	- `socket`: create an unconnected socket.
	- `bind`: associate a socket with a network interface identified by a network address.
	- `listen`: make a socket a server socket (to allow incoming connections).
	- `accept`: wait for an incoming connection.
	- `connect`: initiate a connection to a remote system.
- Socket API is designed to work with many underlying network technologies:
	- `struct sockaddr` is the *supertype* for all network addresses:
		- It has a `type` field is at beginning of struct to distinguish variants, for example, if `type` field contains `AF_INET`, it’s an IP address.
		- `struct sockaddr_in` is the *subtype* for IP addresses.
- The first main function for a server socket is to `create_server_socket`:

```c
int create_server_socket(int port) {
	// initilize the IP address
	struct sockaddr_in serveraddr = {0};
	
	// create socket of "byte swapping" and transport (TCP)
	int ssock_fd = socket(AF_INET, SOCK_STREAM, 0);
	if (ssock_fd < 0) {
		// check if the creation is failed
		fatal("socket failed");
	}
	
	// set parameters to correspond to the ssock_fd struct
	serveraddr.sin_family = AF_INET;
	serveraddr.sin_addr.s_addr = htonl(INADDR_ANY);
	serveraddr.sin_port = htons((unsigned short)port);
	
	// attempt to associate address with network
	if (bind(ssock_fd, (struct sockaddr *) &serveraddr,
        sizeof(serveraddr)) < 0) {
        // check if the bind failed
        fatal("bind failed");
    }
	
    // listen with backlog of 5, which can have queue of 5
    if (listen(ssock_fd, 5) < 0) {
	    // check if connection succeed
	    fatal("listen failed");
	}
	
    // return the file descriptor number
    return ssock_fd;
}
```
- Then, we also need to have function waiting for incoming connections:

```c
int accept_connection(int ssock_fd, struct sockaddr_in clientaddr) {
	// get the length of the client address
	unsigned clientlen = sizeof(clientaddr);
	
	// wait for the incomming connection
	int childfd = accept(ssock_fd, (struct sockaddr *) &clientaddr,
	                     &clientlen);
	
	// check the file descriptor
	if (childfd < 0) {
		// check if creation fails
	    fatal("accept failed");
	}
	
	// return the file descriptor
	return childfd;
}
```
- Eventually, we have the main server loop as:

```c
int main(int argc, char **argv) {
	// parameters of the buffer, port number
	char buf[256];
	int port = atoi(argv[1]);
	
	// create the server socket and store the file descriptor
	int ssock_fd = create_server_socket(port);
	
	// server loop
	while (1) {
		// structure of the IP address
	    struct sockaddr_in clientaddr;
	    
	    // accept the connection and
	    int clientfd = accept_connection(ssock_fd, &clientaddr);
	    
		/* below are the commands that could vary */
		
		// read from the client to buffer
	    ssize_t rc = read(clientfd, buf, sizeof(buf));
	    if (rc > 0) { // if the read is non-zero
		    // write the buffer back to client 
			write(clientfd, buf, rc);
		}
		
		/* the commands that could vary ends */
		
		// close the client
	    close(clientfd);
	}
}
```
- Reading from the server sometimes results in short read and write. In the `csapp.h` and `csapp.c`, there are implementation for loops to `read` and some code for convience:

```c
// data type wrapping a file descriptor and allowing buffered input
typedef struct {
    int rio_fd;                /* Descriptor for this internal buf */
    int rio_cnt;               /* Unread bytes in internal buf */
    char *rio_bufptr;          /* Next unread byte in internal buf */
    char rio_buf[RIO_BUFSIZE]; /* Internal buffer */
} rio_t;

// simplified interface for connecting to a server by specifying host name (or address) and port
int open_clientfd(char *hostname, char *port);

// open a server socket given port name as string
int open_listenfd(char *port);

// Robustly read n bytes (unbuffered)
ssize_t rio_readn(int fd, void *usrbuf, size_t n);

// Robustly write n bytes (unbuffered)
ssize_t rio_writen(int fd, void *usrbuf, size_t n);

// Associate a descriptor with a read buffer and reset buffer
void rio_readinitb(rio_t *rp, int fd); 

// Robustly read n bytes (buffered)
ssize_t	rio_readnb(rio_t *rp, void *usrbuf, size_t n);

// Robustly read a text line (buffered)
ssize_t	rio_readlineb(rio_t *rp, void *usrbuf, size_t maxlen);
```

## Networks Communications

### Hostnames
- DNS (Domain Name Service) assign meaningful names (such as `ugradx.cs.jhu.edu`) to network addresses (such as `128.220.224.100`):
	- `getaddrinfo` can look up network address for hostname.

### Application Protocols
- *Application protocol* determines how data is exchanged by instances of an application program:
	- Usually between a server and a client, while the other possibility is *peer to peer* (P2P) applications.
	- Example: HTTP, (HyperText Transport Protocol), which is used by web browsers and web servers.
- In general the application protocols adapt the following:
	- Synchronous: The connected peers take turns talking.
		- Asynchronous protocols is possible, but significantly more complicated to implement.
	- Client/server protocol: client sends request, server sends response.
		- This process repeats as necessary.
	- Message format: both peers must be able to determine where each message starts and ends.
		- Also, each peer must be able to determine the meaning of each received message.
	- *Text-based protocols* are common because they are easy to debug and reason about.
- An example server can be the following addition server. It's server loop is:

```c
int main(int argc, char *argv[]) {
	// check the input argument
	if (argc != 2) { fatal("Usage: ./arithserver <port>"); }
	// connect to the sever using the the given port
	int server_fd = open_listenfd(argv[1]);
	// check if the connection succeeded
	if (server_fd < 0) {
		fatal("Couldn't open server socket\n"); 
	}
	// keep track of if we are keep going
	int keep_going = 1;
	// start the while loop
	while (keep_going) {
		// create the client connection
	    int client_fd = Accept(server_fd, NULL, NULL);
	    // check the connection
		if (client_fd > 0) {
			// if the connection is successful
		    keep_going = chat_with_client(client_fd);
		    // close the connection
		    close(client_fd); 
	    }
	}
	// close server socket
	close(server_fd); 
	// return 0 for nothing wrong
	return 0;
}
```
- Note that here, a `chat_with_client` function is implemented:

```c
int chat_with_client(int client_fd) {
	// fields of data and numericals
	rio_t rio; int sum = 0, val;
	// initilize the read function
	rio_readinitb(&rio, client_fd);
	
	// initialize the buffer to hold results
	char buf[1024];
	// read line from client
	ssize_t rc = rio_readlineb(&rio, buf, sizeof(buf));
	if (rc < 0) { return 1; } // error reading data from client
	
	// check if it is exiting
	if (strcmp(buf, "quit\n") == 0 || strcmp(buf, "quit\r\n") == 0) {
		return 0;
	} else {
		// have file pointer as buffer to read the buffer
	    FILE *in = fmemopen(buf, (size_t) rc, "r");
	    // loop through the integers and add the values
	    while (fscanf(in, "%d", &val) == 1) { sum += val; }
	    // close the file pointer
	    fclose(in);
	    // print the sum to the buffer
	    snprintf(buf, sizeof(buf), "Sum is %d\n", sum);
	    // write the buffer information back to the client
	    rio_writen(client_fd, buf, strlen(buf));
	    // return 1 to keep going
	    return 1;
	}
}
```
- Correspondingly, below is an example of a client implementation:

```c
int main(int argc, char *argv[]) {
	if (argc != 4) { // check the number of arguments
		fatal("Usage: ./arithclient <hostname> <port> <message>");
	}
	
	// open the client by hostname and port
	int fd = open_clientfd(argv[1], argv[2]);
	if (fd < 0) { // check if clients are created successfully
		fatal("Couldn't connect to server");
	}
	
	rio_writen(fd, argv[3], strlen(argv[3])); // send message to server
	rio_writen(fd, "\n", 1);                  // send empty new line
	
	rio_t rio;                 // initilize field holding information
	rio_readinitb(&rio, fd);   // read response from server
	char buf[1000];            // get the buffer ready
	
	// read from the buffer
	ssize_t n = rio_readlineb(&rio, buf, sizeof(buf));
	if (n > 0) {
		// print the message back
		printf("Received from server: %s", buf);
	}
	
	// close the client by file descriptor
	close(fd);
	return 0;
}
```

### HTTP Webpage
- The application layer is at the top of the network protocol stack, it is consists of applications: web browsers/servers, email clients/servers, P2P file sharing apps, etc.
- A synchronous client/server protocol used by web browsers, web servers, web clients, and web services is the HTTP 1.1:
	- Client sends request to server, server sends back a response.
	- Each client request specifies a verb (`GET`, `POST`, `PUT`, etc.) and the name of a resource.
	- Requests and responses may have a body containing data.
	- The body’s content type specifies what kind of data the body contains.
- All HTTP messages share the same general form:
	- First line: describes meaning of message,
	- Zero or more headers: metadata about message, and
	- Optional body: payload of actual application data (HTML document, image, etc.).
- The protocol is text-based, with lines used to delimit important structures:
	- Each line terminated by `CR` (ASCII 13) followed by `LF` (ASCII 10).
	- Line continuation using backslash (`\`) allowed for headers.
	- The header is in the form of `Name: Content`, where `Host` specify which host server is accessed and `Content-Type` specifies the type of the body.
```HTTP
GET /1024/768 HTTP/1.1
Host: placekitten.com
User-Agent: curl/7.58.0
Accept: */*
```
- `GET` is the method, which is requesting to get resource data, `/1024/768` is the source, and `HTTP/1.1` is the version. In particular, we have the `Host` specifying the web server and `Accept` indicating what file types the client is prepared to receive.
- `HTTP` response indicates the protocol version, status code, and reason phrase. Some notable ones are:
	- `200` is OK, `403` is Forbidden, and `404` is Not Found. 
	- In the response `Transder-Encoding` header indicates the encoding of the body, `Connection: keep-alive` header invites the client to keep the connection open and reused for subsequent requests.
- In evaluating the client information, we can use `curl`, which is a command-line HTTP client:
	- The `-v` option makes it print the first line and headers of the HTTP request and responses:
```bash
curl -v http://placekitten.com/1920/1080 -o kitten.jpg
```
- The server and client for the HTTP data is similar to the previous implementation, what is notable is that it should have the following structures to hold the information:

```c
/* data type for message headers */
struct Header {
	char *name;               /* name of header */
	char *content;            /* content of header */
};

/* Message data type, represents a request from a client */
struct Message {
	int num_headers;          /* number of headers */
	struct Header **headers;  /* array of headers */
	char *method;             /* the method */
	char *resource;           /* the resource requested */
};
```
- Then, the server would check the message and access validity. In particular, a sending text response is necessary.

```c
void server_generate_text_response(int clientfd, const char *response_code, const char *reason, const char *msg) {
	writestr(clientfd, "HTTP/1.1 ");    // HTTP Version
	writestr(clientfd, response_code);  // response code
	
	writestr(clientfd, " ");            // space
	writestr(clientfd, reason);         // reason
	writestr(clientfd, "\r\n");         // space
	/* could generate headers... */
	writestr(clientfd, "\r\n");         // space
	writestr(clientfd, msg);            // message
}
```
- In creating the HTTP server, one should check the URL validity, then reading and responding to the messages.

### Untrusted Data
- It is incredibly important to realize that data read from the client is untrusted:
	- A network application which connects to untrusted peers must assume that they are malicious.
- In general, never under any circumstances:  
	- trust that data is properly formatted,
	- trust no special characters are present, or
	- trust that message size limits are not exceeded.
- One specific malicious attempt is on buffer overflow:
	- A buffer overflow occurs when malicious peer sends more data than can be received into the recipient’s buffer.
	- When the buffer overflow occurs, `sscanf` could have overflow the buffer.
	- If the recipient’s buffer is stack allocated, the malicious client could *overwrite the return address* in the current stack frame with an arbitrary value.
	- When the function returns, it jumps to an address controlled by the malicious peer.
	- For example: it could be possible for the client to cause the program to call the system function, which executes an arbitrary program as a subprocess.
	- One possible way to prevent overflow is by setting the field size no less than the size of the buffer.

## Concurrency and Synchronization

### Threads
- The previous server loop does not allow communicating with multiple threads at the same time.
- One way of reaching concurrency is by processes created by `fork`:
	- it requires significant data structure, such as address space data structure, open file table, process context data, etc.
	- switching the address space could result in the lose of useful contexts built up in cache and TLB.
- *Threads* are a mechanism for concurrency within a single process/address space:
	- Thread is a *virtual CPU* (program counter and registers) and each thread can be executing a different stream of instruction.
	- Compared to processes, threads are lightweight, requiring only:
		- context (memory in which to save register values when thread is suspended),
		- a stack (for the stack), and
		- thread-local storage for per-thread variables,
	- while all of these variables are not shared. The threads share the address space, open file tables, and the process context data.

### Pthreads
- The Pthreads (POSIX threads) are standard API for using threads on Unix-like systems. It allows:
	- creating threads and waiting for them to complete, and
	- synchronizing threads.
- The Pthreads are used both for *concurrency* and *parallelism* (on multicore machines, the threads can execute in parallel).
- Some basic concepts for the `pthread_t` is:
	- `pthread_t` is the thread id data type, each running thread has a distinct thread id,
	- *Thread attributes* is the runtime characteristics of a thread:
		- Many programs will just create threads using the default attributes.
	- *Attached vs. detached*: a thread is attached if the program will explicitly call `pthread_join` to wait for the thread to finish.
- `pthread_create` creates a new thread, the thread id is stored in variable pointed-to by `thread` parameter. The `attr` parameter specifies attributes (`NULL` for default attributes):
	- The created thread executes the `start_routine` function, which passed `arg` as its parameter.
	- Returns `0` if successful.

```c
int pthread_create(pthread_t *thread, const pthread_attr_t *attr,
                   void *(*start_routine) (void *), void *arg);
```
- `pthread_join` waits for specified thread to finish. Only *attached* threads can be waited for:
	- Value returned by exited thread is stored in the variable pointed-to by `retval`:
	- Returns `0` if successful.

```c
int pthread_join(pthread_t thread, void **retval);
```
- `pthread_self` allows a thread to find out its own thread id.

```c
pthread_t pthread_self(void);
```
- `pthread_detach` changes the specified thread to be detached, so that its resources can be freed without another thread explicitly calling `pthread_join`:
	- Returns `0` if successful.
	- When a detached thread terminates, its resources are automatically released back to the system without the need for another thread to join with the terminated thread.

```c
int pthread_detach(pthread_t thread);
```

### Multithreaded Web Server
- A web server can be created using multiple threads to allow multiple connections:
	- server will create a thread for each client connection,
	- created threads are detached: the server program doesn’t wait for them to complete,
	- There are no limit on number of threads that can be created (ideally), and 
	- only the main function is different than previous versions.
- First, we need to have `struct ConnInfo` to represents a client connection:
	- It’s useful to pass an object containing data about the task the thread has been assigned to the thread’s start function.

```c
struct ConnInfo {
	int clientfd;                // client file descriptor
    const char *webroot;         // store where files are
};
```
- There, we will also have a worker function, executed by client connection threads:
	- Here, a created thread detaches itself, handles the client request, closes the client socket, frees its `ConnInfo` object, then returns.

```c
void *worker(void *arg) {
	struct ConnInfo *info = arg;
	pthread_detach(pthread_self());  // detach
	server_chat_with_client(info->clientfd, info->webroot);
	close(info->clientfd);
	free(info);                      // free the structure
	return NULL;
}
```
- Moreover, the main loop shall be modified

```c
while (1) {
	// create the client file descriptor
	int clientfd = Accept(serverfd, NULL, NULL);
	if (clientfd < 0) { // handle error
		fatal("Error accepting client connection");
	}
	
	// dynamically allocate the ConnInfo else they will cover in loops
	struct ConnInfo *info = malloc(sizeof(struct ConnInfo));
	info->clientfd = clientfd;
	info->webroot = webroot;
	
	pthread_t thr_id;
	// create a thread to call the worker function and with info.
	if (pthread_create(&thr_id, NULL, worker, info) != 0) {
		fatal("pthread_create failed");
	}
}
```

### Shared Memory
- Main issue with writing multithreaded programs is that the threads execute in the same address space, so they share memory:
	- A variable written by one thread may be read by another.
	- This can be useful for communication between threads, but can also be dangerous:
		- for example, `strtok` (for tokenizing C character string, retains state between calls) and `gethostbyname`returns pointer to global `struct hostent` object might need to communication in between.
		- Some functions need *reentrancy*, which means function can be safely *reentered* before a currently executing call to the same function completes.
		- Non-reentrant functions are dangerous for multithreaded programs (and also call issues when called from recursive functions).
- When writing *reentrant functions*:  
	- Don’t use global variables,
	- Memory used by a reentrant function should be limited to local variables (on stack), or heap buffers not being used by other threads, and
	- it is a good idea to have functions receive explicit pointers to memory they should use.
- For example `strtok` splits a string into tokens, and reentrant `strtok_r` function makes the progress variable explicit by taking a pointer to it as a parameter.

```c
char *strtok(char *_str_, const char *_delims_);
char *strtok_r(char *_str_, const char *_delim_, char **_saveptr_);
```
- For many (but not all) multithreaded programs, it’s useful to have explicit communication/interaction between threads:
	- Concurrently-executing threads can use shared data structures to communicate,
	- But concurrent modification of shared data is likely to lead to violated data structure invariants, corrupted program state, etc.
	- Synchronization mechanisms allow multiple threads to access shared data cooperatively, realized by *queues*.

### Parallel Computation: Mandelbrot Set
- Parallel computation can be used to solve the problem of Mandelbrot set, namely the question that:
	- Assume $$C$$ is a complex number and $$Z_0 = 0 + 0i$$. The recursive definition is as follows:
	\[ Z_{n+1} = Z_n^2 + C, \]
	- and if the magnitude never reach $$2$$ after finite number of iterations, it is in the Mandelbrot set, otherwise, it is not.
- The problem is *embarrassingly parallel* problem. We can create `functions` doing complex operations and visualize the points on the plane.
- During the process, we can speed up the computation by doing the computation for different points in parallel on multiple CPU cores, namely:
	- Use an array to store iteration counts (one per complex number),
	- create fixed number of computation threads,
	- assign a subset of array elements to each computation thread, and
	- when all threads have finished, use iteration counts to render image.
- In particular, we can use the parallelism of threads on multiple cores as processes to execute the work.![[fork_join_parallel.png]]

### Thread Synchronization
- *Atomicity* guarantees that either all operations occur, or no operations occur at all.
- Incrementing the counter (`obj->count++`) is not atomic, as we should think of `var++` as meaning:

```c
reg = var;
reg = reg + 1;
var = reg;
```
- and when threads are executing concurrently, it’s possible for the variable to change between the time its value is loaded and the time the updated value is stored:
	- When there are many increments done together, there will be *data race* happening, which causes *lost updates*.
- As *concurrent access* can mess up something as simple as an integer counter, so will it mess up more complicated data structure, such as linked list, balanced tree, etc.
	- In data structures, there are invariants which must be preserved, while mutations (insertions, removals) often violate these invariants temporarily.
	- This is not a problem in a sequential program because the operation will complete (and restore invariants) before anyone notices.
	- This is a huge problem in concurrent program where multiple threads could access the data structure at the same time.
- Thus, we need *synchronization* to protect shared data from concurrent access.
- A *critical section* is a region of code in which mutual exclusion must be guaranteed for correct behavior.
	- Mutual exclusion means that at most one concurrent task (thread) may be accessing shared data at any given time.
	- Enforcing mutual exclusion in critical sections guarantees atomicity, *i.e.*, code in critical section executes to completion without interruption.
	- For the shared counter program, the update to the shared counter variable is a critical section.
- *Semaphores* and *mutexes* are two types of synchronization constructs available in `pthreads`, both of them can be used to guarantee mutual exclusion:
	- Semaphores can also be used to manage access to a *finite resource*, while
	- *Mutexes* (mutual exclusion locks) are simpler.

### Mutexes
- For mutexes, they encapsulates the following information:
	- `pthread_mutex_t`: is data type for a `pthreads` mutex,
	- `pthread_mutex_init`: initialize a mutex,
	- `pthread_mutex_lock`: locks a mutex for exclusive access:
		- If another thread has already locked the mutex, calling thread must wait,
	- `pthread_mutex_trylock`: attempt to lock a mutex object:
		- If successful, it returns `0`, if the data structure is already locked, return `-1`, and do not lock it.
	- `pthread_mutex_unlock`: unlocks a mutex:
		- If any threads are waiting to lock the mutex, one will be woken up and allowed to acquire it when it is unlocked,
	- `pthread_mutex_destroy`: destroys a mutex (once it is no longer needed).
- When using a mutex to protected a shared data structure:
	- Associate a pthread_mutex_t variable with each instance of the data structure.
	- Initialize with pthread_mutex_init when the data structure is initialized.
	- Each critical section is protected with calls to `pthread_mutex_lock` and `pthread_mutex_unlock`.
	- Destroy mutex with pthread_mutex_destroy when data structure is deallocated.
- Hence, when attempting to modify the worker function, we must first modify the data structure:

```c
typedef struct {
	volatile int count;
	pthread_mutex_t lock;     // mutex lock
} Shared;
```
- Correspondingly, we change the worker function:

```c
void *worker(void *arg) {
	// create the shared object as pointer
	Shared *obj = arg;
	// loop through the increment process
	for (int i = 0; i < NUM_INCR/NTHREADS; i++) {
		// lock the object
		pthread_mutex_lock(&obj->lock);
		// increment, then
		obj->count++;
		// unlock the object
		pthread_mutex_unlock(&obj->lock);
	}
	return NULL;
}
```
- Eventually, we modify the main loop as:

```c
int main(void) {
	Shared *obj = calloc(1, sizeof(Shared));
	// initialize the mutex lock
	pthread_mutex_init(&obj->lock, NULL);
	
	pthread_t threads[NTHREADS];
	for (int i = 0; i < NTHREADS; i++) {
		pthread_create(&threads[i], NULL, worker, obj);
	}
	for (int i = 0; i < NTHREADS; i++) {
		pthread_join(threads[i], NULL);
	}
	printf("%d\n", obj->count);
	// destroy the lock in the end
	pthread_mutex_destroy(&obj->lock);
	return 0;
}
```
- In the modified version, the incrementation will be successful, there will be large time tradeoffs, as the `mutex` locks have to wait on the incrementation:
- Contention occurs when multiple threads try to access the same shared data structure at the same time.
- Some costs associated with synchronization are:
	1. Cost of entering and leaving critical section (e.g., locking and unlocking a mutex).
	2. Reduced parallelism due to threads having to take turns (when contending for access to shared data).
	3. Cost of OS kernel code to suspend and resume threads as they wait to enter critical sections.
- These costs can be significant. Best performance occurs when threads synchronize relatively infrequently. Thus, shared counter example is a pathological case.
- In `C++`, we can use *guard objects* to create critical sections. Specifically, a guard object has a reference to a `mutex`:
	- The constructor locks the mutex, and the destructor unlocks the mutex.
	- The lifetime of the guard object is the extent of the critical section, which guarantees that the mutex will be released.
	- This avoids deadlocks due to mutex not being released (e.g., because of control flow, an exception, etc.)

```cpp
class Guard {
	public:
	Guard(pthread_mutex_t &lock) : lock(lock) {
		// lock in the constructor
		pthread_mutex_lock(&lock);
	}
	
	~Guard() {
		// unlock as it is destructed
		pthread_mutex_unlock(&lock);
	}

	private:
	// copy constructor and assignment operator prohibitted
	Guard(const Guard &);
	Guard &operator=(const Guard &);
	pthread_mutex_t &lock;
};
```
- When using a `Guard`, we have it constructed in the braces:
	- braces are important, because they define the scope (and lifetime) of the guard object.

```cpp
// Assume m_lock is a mutex
{  
	Guard g(m_lock);  
	/* ...code of critical section...*/
}
```
- The `Guard` is not entirely the same with mutex lock, as the mutex locks could be not unlocked in the case of a break or exception, resulting in deadlock.

### Semaphores
- A semaphore is a more general synchronization construct. When created, semaphore is initialized with a nonnegative integer count value.
- There are two operations:
	- $$P$$ (proberen): waits until the semaphore has a non-zero value, then decrements the count by one.
	- $$V$$ (verhogen): increments the count by one, waking up a thread waiting to perform a $$P$$ operation if appropriate.
	- In particular, a mutex can be modeled as a semaphore whose initial value is $$1$$.
- On the implementation level, we have:
	- Semaphore data type as `sem_t`.
	- `sem_init`: initialize a semaphore with specified initial count.
	- `sem_destroy`: destroy a semaphore when no longer needed.
	- `sem_wait`: wait and decrement ($$P$$).
	- `sem_post`: increment and wake up waiting thread ($$V$$).
- Semaphores are useful for managing access to a limited resource:
	- For example we can limit maximum number of threads in a server application, here we initialize semaphore with desired maximum number of threads, and use $$P$$ operation before creating a client thread, and use $$V$$ operation when client thread finishes.
- An application is on the bounded queue:
	- Initially, the queue is initially empty, and can have up to a fixed maximum number of elements.
	- When enqueuing an item, thread waits until queue is not full.
	- When dequeuing an item, thread waits until queue is not empty.
	- Implementation-wise, we use two semaphores and one mutex:
		- slots semaphore: tracks how many slots are available,
		- items semaphore: tracks how many elements are present, and
		- Mutex is used for critical sections accessing queue data structure.
- For the data type, it must contain the `struct` as:

```c
typedef struct {
	void **data;
	unsigned max_items, head, tail;
	sem_t slots, items;              // semaphores
	pthread_mutex_t lock;            // mutex lock
} BoundedQueue;
```
- For the operations, we shall modify as follows:

```c
BoundedQueue *bqueue_create(unsigned max_items) {
	BoundedQueue *bq = malloc(sizeof(BoundedQueue));
	bq->data = malloc(max_items * sizeof(void *));
	bq->max_items = max_items;
	bq->head = bq->tail = 0;
	
	// initialize the semaphores, first zero means shared
	sem_init(&bq->slots, 0, max_items);
	sem_init(&bq->items, 0, 0);
	
	// initialize the mutex
	pthread_mutex_init(&bq->lock, NULL);

	return bq;
}

void bqueue_enqueue(BoundedQueue *bq, void *item) {
	// wait for semaphore
	sem_wait(&bq->slots);         /* wait for empty slot */
	
	// mutex lock
	pthread_mutex_lock(&bq->lock);
	bq->data[bq->head] = item;
	bq->head = (bq->head + 1) % bq->max_items;
	// mutex unlock
	pthread_mutex_unlock(&bq->lock);
	
	// release the semaphore
	sem_post(&bq->items);         /* item is available */
}

void *bqueue_dequeue(BoundedQueue *bq) {
	// wait for semaphore
	sem_wait(&bq->items);             /* wait for item */
	
	// mutex lock
	pthread_mutex_lock(&bq->lock);
	void *item = bq->data[bq->tail];
	bq->tail = (bq->tail + 1) % bq->max_items;
	// mutex unlock
	pthread_mutex_unlock(&bq->lock);
	
	// release the semaphore
	sem_post(&bq->slots);             /* empty slot is available */
	return item;
}

void bqueue_destroy(BoundedQueue *bq) {
	// destroy the lock and semaphores
	sem_destroy(&bq->slots);
	sem_destroy(&bq->items);
	pthread_mutex_destroy(&obj->lock);
}
```
- Synchronized queues are extremely useful in multithreaded programs:
	- In particular they are useful for producer/consumer relationships between threads:
		- Producer enqueues items,
		- Consumer dequeues items, and
		- Bounded queue to ensures that producer doesn't get too far ahead of consumer.
- More generally, a queue can be used to send a message to another thread.
- Creating threads incurs some overhead.
	- *Prethreading* is when the program creates a fixed number of threads ahead of time, assigns work to them as it becomes available.
	- Queues are an ideal mechanism to allow the “supervisor” thread to send work to the worker threads.
	- A queue can also be used for messages sent from the workers back to the supervisor thread.

### Sequential Computation: Conway's Game of Life
- The Conway's game of life has the following rules:
	- Grid-based cellular automaton, cells are alive (1) or dead (0).
	- Live cells with 2 or 3 live neighbors survive.
	- Dead cells with 3 live neighbors become alive.
	- Otherwise, cell dies (or stays dead).
- Over many generations, complex patterns can emerge.
- Conway’s game of life is not quite an *embarrassingly parallel computation*, *i.e.*, Computation of generation $$n$$ must finish before computation of generation $$n + 1$$ can start:
	- We could start a new batch of worker threads each generation, but we’ll repeatedly pay the thread startup and teardown costs
- We develop the prethreading approach, where we:
	- Create fixed set of worker threads,
	- “Command queue” allows supervisor thread to send tasks to the workers, and
	- “Done queue” allows workers to notify supervisor thread when tasks are finished.
- With the actual implementation, we got about a $$2\times$$ speedup using four threads Relatively large chunks of work were assigned:
	- The costs of synchronization amortized over relatively large amounts of sequential computation done by worker threads,
- Hence, queues are an effective mechanism for communication between threads.

### Concurrency Issue: Dead Locks
- Use of blocking synchronization constructs such as semaphores and mutexes can lead to *deadlock*, where the program hangs indefinitely.

```c
// Data structure
typedef struct {
	volatile int count;
	pthread_mutex_t lock, lock2;
} Shared;
---------------------------------
// thread 1 critical section
pthread_mutex_lock(&obj->lock);
pthread_mutex_lock(&obj->lock2);
obj->count++;
pthread_mutex_unlock(&obj->lock2);
pthread_mutex_unlock(&obj->lock);
---------------------------------
// thread 2 critical section
pthread_mutex_lock(&obj->lock2);
pthread_mutex_lock(&obj->lock);
obj->count++;
pthread_mutex_unlock(&obj->lock);
pthread_mutex_unlock(&obj->lock2);
```
- In this example, Thread 1 acquires `obj->lock` and waits to acquire `obj->lock2` whereas Thread 2 acquires `obj->lock2` and waits to acquire `obj->lock`, thus neither can make progresses.
- We can use a *resource allocation graph*, where:
	- Nodes represent threads and lockable resources,
	- Edges between threads and resources,
	- Edge from resource to thread: thread has locked the resource, and
	- Edge from thread to resource: thread is waiting to lock the resource.
- In the diagrams, cycle indicates a deadlock.![[Dead_lock.png]]
- Deadlocks can only occur if:
	- threads attempt to acquire multiple locks simultaneously, and
	- there is not a globally-consistent lock acquisition order.
- Trivially, if threads only acquire one lock at a time, deadlocks can’t occur. 
- Otherwise, maintaining a consistent lock acquisition order also works.
- A good approach to avoiding self-deadlock is:
	- avoid acquiring locks in helper functions, and
	- make “higher-level” functions (often, the “public” API functions of the locked data structure) responsible for acquiring locks.

### Condition Variables for Threads
- Condition variables are another type of synchronization construct supported by pthreads. They allow threads to wait for a condition to become true: for example:
	- Wait for queue to become non-empty,
	- Wait for queue to become non-full, etc.
- They work in conjunction with a mutex.
- The conditional variable encapsulates the following:
	- `pthread_cond_t`: Data type for conditional variable,
	- `pthread_cond_init`: initialize a condition variable,
	- `pthread_cond_destroy`: destroy a condition variable,
	- `pthread_cond_wait`: wait on a condition variable, unlocking mutex (so other threads can enter critical sections),
	- `pthread_cond_broadcast`: wake up waiting threads because condition may have been enabled.
- In the BoundedQueue data type, the data structure would become:

```c
typedef struct {
	void **data;
	unsigned max_items, count, head, tail;
	pthread_mutex_t lock;
	pthread_cond_t not_empty, not_full;   // use conditions here
} BoundedQueue;
```
- Then, the member functions would also change, correspondingly:

```c
BoundedQueue *bqueue_create(unsigned max_items) {
	BoundedQueue *bq = malloc(sizeof(BoundedQueue));
	bq->data = malloc(max_items * sizeof(void *));
	bq->max_items = max_items;
	
	bq->count = bq->head = bq->tail = 0;
	pthread_mutex_init(&bq->lock, NULL);  // have mutrx lock initialized
	
	pthread_cond_init(&bq->not_full, NULL);   // condition lock
	pthread_cond_init(&bq->not_empty, NULL);  // condition lock
	return bq;
}

void bqueue_enqueue(BoundedQueue *bq, void *item) {
	pthread_mutex_lock(&bq->lock);
	
	while (bq->count >= bq->max_items) { // wait until it is non-full
		pthread_cond_wait(&bq->not_full, &bq->lock);
	}
	
	bq->data[bq->head] = item;
	bq->head = (bq->head + 1) % bq->max_items;
	bq->count++;
	
	pthread_cond_broadcast(&bq->not_empty); // wake up thread for empty
	
	pthread_mutex_unlock(&bq->lock);
}
```
- Condition variables follows the below conditions:
	- Each condition variable must be associated with a mutex.
	- Multiple condition variables can be associated with the same mutex.
	- The mutex must be locked when waiting on a condition variable.
	- `pthread_cond_wait` releases the mutex, then reacquires it when the wait is ended (by another thread doing a broadcast).
	- `pthread_cond_wait` must be done in a loop:
		- Since spurious wakeups are possible, so waited-for condition must be re-checked.
	- Use `pthread_cond_broadcast` whenever a condition might have been enabled.

### Amdahl’s Law
- During parallelizing a computation: the goal is to make the computation complete as fast as possible.
- Suppose that $$t_s$$ is the sequential running time, and $$t_p$$ is the parallel running time, the speedup (denoted $$S$$) is $$t_s/t_p$$.
- Let $$P$$ be the number of processor cores. In theory, speedup $$S$$ cannot be greater than $$P$$. So, in the ideal case:
	\[ S = P = \frac{t_s}{t_p}, \]
	implying that: 
	\[ t_p = \frac{t_s}P. \]
	- Note that: 
	\[ \lim_{p\to\infty}t_p = \lim_{p\to\infty}\frac{t_s}P = 0, \]
	meaning that throwing an arbitrary number of cores at a computation should improve performance by an arbitrary factor, which is ideal.
- When speedup $$S = P$$, we have perfect scalability, but in reality, this is difficult to achieve because parallel computations generally have some sequential overhead which cannot be (easily) parallelized, such as:
	- Divide up work,
	- Synchronization overhead,
	- Combining solutions to subproblems, etc.
- Say that, for some computational problem, the proportions of inherently sequential and parallelizable computation are $$w_s$$ and $$w_p$$, respectively, such that $$w_s+w_p=1$$. If we normalize the sequential execution time $$t_s$$. Parallel execution time using $$P$$ cores is: 
\[t_p = w_s + \frac{w_p}P = w_s+\frac{1-w_s}P, \]
thus speeding up $$P$$ cores gives: 
\[S = \frac{t_s}{t_p}=\dfrac{1}{w_s + \frac{1-w_s}{P}}.\]
- Now, as $$P\to\infty$$, $$\frac{1-w_s}P\to 0$$, so:
\[S\to \frac{1}{w_s}. \]
Thus, this is regardless of how many cores we use.
- Amdahl’s Law: Suppose the proportion of inherently sequential computation ($$w_s$$) is independent of the problem size.
- Gustafson-Barsis’s Law: for some important computations, the proportion of parallelizable computation scales with the problem size:
	- These are called *scalable* computations, and
	- Such computations can realize speedups proportional to $$P$$ for a large number of processors.

### Atomic Machine Instructions
- Modern processors typically support atomic machine instructions, these are atomic even when used on shared variables by multiple threads.
- Some ways to use the atomic machine instructions:
	- Assembly language,
	- Compiler intrinsics, or
	- Language support.
- Typical examples of atomic machine instructions are:
	- Increment and decrement,
	- Exchange (swap contents of two variables),
	- Compare and swap (compare register and variable, if equal, swap variable’s contents with another value), and
	- Load linked/store conditional (load from variable, store back to variable only if variable wasn’t updated concurrently).
- In x86-64 memory instructions can have a `lock` prefix to guarantee atomicity, e.g.:
```asm
	.globl atomic_increment
atomic_increment:
	lock; incl (%rdi)
	ret
```
- Some `C` functions are atomic:

```c
void atomic_increment(volatile int *p);
//...
atomic_increment(&obj->count);
```
- `gcc` has a number of intrinsic functions for atomic operations E.g., atomic increment:

```c
__atomic_fetch_add(&obj->count, 1, __ATOMIC_ACQ_REL);
```
- The `C11` standard introduces the `_Atomic` type qualifier:

```c
typedef struct {
	_Atomic int count; // protected with atomic type
} Shared;
```
- Atomic machine instructions can be the basis for lock-free data structures. The basic ideas are:
	- Data structure must always be in a valid state.
	- Transactional: mutators speculatively create a proposed update and attempt to commit it using compare-and-swap (or load linked/ store conditional):
		- Retry transaction if another thread committed an update concurrently, invalidating proposed update.
	- Issue: waits and wake-ups are not really possible:
		- E.g., when trying to dequeue from an empty queue, can’t easily wait for item to be available, calling thread must spin.

### Concurrency and Parallelism
- In general, servers (including web servers) should receive requests from many clients, simultaneously:
	- Here *concurrency* implies processing involving multiple tasks that can execute asynchronously with respect to each other, some examples are multiple server/client conversations could be ongoing at the same time.
- The web server could serve multiple clients concurrently.
- Concurrency is different from parallelism:
	- Consider two tasks $$A$$ and $$B$$, consisted of a sequence of instructions.
	- In concurrency, $$A$$ and $$B$$ can happen at any order, *i.e.*, $$A$$ can happen before or after $$B$$ happens.
	- In parallelism, $$A$$ and $$B$$ are executed at the same time. In particular, parallel execution requires multiple processors or cores.
	- Parallelism implies concurrency, but the converse is not necessarily true.

### Concurrency with Processes
- In particular, `fork` system call makes a new child process duplicating the parent process including inheriting open files.
- Hence, each time the server accepts a connection, it can `fork` a child process to handle communication with that client:
	- Here, multiple child processes can be executing concurrently.
	- OS kernel is responsible for allocating CPU time and handling the I/O.
	- With *shared memory*, we can achieve interprocess communications, which is allowing processes to sent messages available to another client (possible by `mmap` and semaphores).
- In the design with concurrent processes, we want to limit the number of simultaneous child processes, as processes are heavyweight in terms of system resources:
	- Before starting a child process, the server loop will wait to make sure fewer than the maximum number of child processes are running.
	- In particular, we need to have system calls allowing parent process to receive the exit status for a child process (`wait` or `waitpit`), as if the parent does not wait for the child, the child becomes a zombie process.
	- A parent process can handle the `SIGCHLD` signal in order to be notified when a child process exits.
- Implementation-wise, the parent should keep a count of how many child processes are running, and use `wait` system call and `SIGCHLD` signal handler to detect which child processes are completed.
- Here, we first need to implement `sigchld_handler` function in the parent process:

```c
/* current number of child processes running */
int g_num_procs;

void sigchld_handler(int signo) {
	int wstatus;
	// call wait to save in the wstatus
	wait(&wstatus);
	// when the process exits
	if (WIFEXITED(wstatus) || WIFSIGNALED(wstatus)) {
		// decrement the number of processes
		g_num_procs--;
	}
}
```
- At the same time, we register the sigchld_handler function as a handler for the SIGCHLD signal:
	- When a child process terminates, the OS kernel will deliver a `SIGCHLD` signal, and the `sigchld_handler` function will be called.


```c
struct sigaction sa;
sigemptyset(&sa.sa_mask);
sa.sa_flags = 0;
sa.sa_handler = sigchld_handler;   // set sigchld_handler as hander.
sigaction(SIGCHLD, &sa, NULL);
```
- During the implementation, we need to consider about *data-race* conditions:
- In the following case, the number of process could decrease before the `wait` (the other process could exit at any time):
	- In this case, we would have `wait` waiting for nothing when `MAX_PROCESSES = 1`, and potentially leading to deadlocks. 

```c
 while (g_num_procs >= MAX_PROCESSES) {
	int wstatus;
	wait(&wstatus);
	/* later code omitted */
}
```
- In another case, we also need to mind the decrements, they are not atomic, so there could be data loss so we no longer keep track of the total number of processes:
	- If a `SIGCHLD` signal is received after the initial value of `g_num_procs` is read, but before the updated value of tmp is stored back to `g_num_procs`, data race occurs.

```c
g_num_procs--;
----------------------
int tmp = g_num_procs;
tmp = tmp - 1;
g_num_procs = tmp;
```

- A *data race* is a (potential) bug where two concurrently-executing paths access a shared variable, and at least one path writes to the variable:
	- when paths “race” to access shared data, outcome depends on which one “wins”.
	- it is a special case of a race condition, a situation where an execution outcome depends on unpredictable event sequencing.
	- A data race can cause data invariants to be violated (e.g., `g_num_procs` accurately reflects the number of processes running).
	- This is fundamentally due to that OS kernel could deliver a signal at any time.
- The solution is synchronization, by implementing a protocol to avoid uncontrolled access to shared data:
	- `sigprocmask`: allows program to block and unblock a specific signal or signals.
	- The idea is to block `SIGCHLD` whenever `g_num_procs` is being accessed by program code to prevent `sigchld_handler` from unexpectedly modifying `g_num_procs`.
- First, we have the `toggle_sigchld` function:

```c
void toggle_sigchld(int how) {
	sigset_t sigs;
	sigemptyset(&sigs);            // initialize an empty set
	sigaddset(&sigs, SIGCHLD);     // add the SIGCHLD to set
	// block/unblock all the signals of SIGCHLD
	sigprocmask(how, &sigs, NULL);
}
```
- There, we use to protect accesses to `g_num_procs`:

```c
while (1) {  
	wait_for_avail_proc();  
	int clientfd = accept(/* code omitted in between */) 
	toggle_sigchld(SIG_BLOCK);  
	g_num_procs++;        // protect on above and below
	toggle_sigchld(SIG_UNBLOCK);  
	pid_t pid = fork();  
	if (pid < 0) {
		fatal("fork failed");
	} else if (pid == 0) { /* in child */
		server_chat_with_client(clientfd, webroot);
		close(clientfd);
		exit(0);
	}
	close(clientfd);
}
```
- Note on the number of file descriptor. As when a subprocess is forked, the child process inherits the parent process’s file descriptors.
- In the web server, the forked child process inherits `clientfd`, the socket connected to the client. Conveniently, since we want the child process to handle the client’s request.
- Thus, importantly, the parent process must close `clientfd`, otherwise the web server will have a file descriptor leak. At the same time:
	- OS kernel should imposes limit on number of open files per process,
	- When too many file descriptors open, it shouldn’t open any more files or sockets.
- Before calling fork, web server should call `wait_for_avail_proc`, it calls wait if too many processes are currently running:

```c
void wait_for_avail_proc(void) {
	// block SIGCHLD in advance
	toggle_sigchld(SIG_BLOCK);
	while (g_num_procs >= MAX_PROCESSES) {
		// check the number of processes
		int wstatus;
		wait(&wstatus);
		if (WIFEXITED(wstatus) || WIFSIGNALED(wstatus)) {
			// decrement the number
			g_num_procs--;
		}
	}
	// unblock SIGCHLD in advance
	toggle_sigchld(SIG_UNBLOCK);
}
```
- When a program receives a signal, it can interrupt the currently-executing system call. Special handling is required for accept system call to wait for connection from client:
	- When errno is `EINTR`, it indicates that the system call was interrupted.

```c
int clientfd;
do {
	clientfd = accept(serverfd, NULL, NULL);
} while (clientfd < 0 && errno == EINTR); // check if it is interrupted
if (clientfd < 0) {
	fatal("Error accepting client connection");
}
```

### I/O Multiplexing
- I/O blocking could occur, *i.e.*, the server is not responsive while:
	1. Waiting for client connection to arrive  
	2. Waiting to receive data from client  
	3. Waiting to send data to client (sometimes required by TCP protocol)
- Operations such as `accept`, `read`, and `write` can block, meaning that the OS kernel suspends the calling thread until the operation has completed:
	- E.g., when calling accept, the calling thread is blocked until a request for a new client connection, and while a thread is blocked, it can’t do anything else.
	- We want a way to support multiple simultaneous clients, and have the server be responsive, using a single thread.
- Modern operating systems support nonblocking I/O. In Unix/Linux, a file descriptor can be made nonblocking:
	- All operations that would normally block are guaranteed not to block if the filed descriptor is nonblocking, and
	- If a blocking operation (`accept`, `read`, `write`) is invoked, but it can’t be completed immediately:
		- the operation returns an error, or
		- `errno` is set to `EWOULDBLOCK` error code.
- When a `C` library or system call function fails, errno is set to an integer error code to indicate the reason for the failure, which is available using `#include <errno.h>`.
- This is actually not a global variable (because that wouldn’t work in a multithreaded program), its actual definition in the Linux C library (`glibc`) is:

```c
extern int *__errno_location (void) __THROW __attribute_const__;

# define errno (*__errno_location ())
```
- `__errno_location` function returns a pointer to an integer variable allocated in thread-local storage, so each thread has its own `errno`.
	- Hence, we need to find out which file descriptor are ready to perform I/O.
- I/O multiplexing is an alternative approach for supporting multiple simultaneous client connections:
	- Basic idea: server maintains sets of active file descriptors (mostly client connections, but also for file I/O).
	- Main server loop uses `select` or `poll` system call to check which file descriptors are ready, meaning that a read or write can be performed without blocking.
	- Compared to using processes or threads for concurrency:
		- Advantage: less overhead (CPU, memory) per client connection than processes or threads,
		- Disadvantage: higher code complexity.
- Here, we use the select system call:
	- `readfds`, `writefds`, and `exceptfds` are sets of file descriptors,
	- `select` waits until at least one file descriptor has become ready for reading or writing, or has an exceptional condition.
	- `readfds`, `writefds`, and/or `exceptfds` are modified to indicate the specific file descriptors that are ready
	- `timeout` specifies maximum amount of time to wait, `NULL` means indefinitely

```c
int select(int nfds, fd_set *readfds, fd_set *writefds,
           fd_set *exceptfds, struct timeval *timeout);
```
- An `fd_set` represents a set of file descriptors, with the following operations:
	- `FD_ZERO(&set)`: make `set` empty,
	- `FD_SET(fd, &set)`: add `fd` to `set`,
	- `FD_CLR(fd, &set)`: remove `fd` from `set`,
	- `FD_ISSET(fd, &set)`: `true` if `fd` is in set, `false` otherwise.
- The implementation is as follows:
```pseudo
create server socket, add to active fd set

while (1) {
	wait for fd to become ready (select or poll)
	
	if server socket ready {
	  accept a connection, add it to set
	}
	
	for fd in client connections {
		  if fd is ready for reading, read and update connection state
		  if fs is ready for writing, write and update connection state
	}
}
```
- The main difficulty of using I/O multiplexing is that communication with clients is event-driven. When data is read from the client, event-processing code must figure out what to do with it:
	- Data read might be a partial message,
	- Similar issue when sending data to client: data might need to be sent in chunks,
	- Maintaining and updating state of client connections is more complicated compared to code for process- or thread-based concurrency, we can just use normal loops and control flow.
- The protocol is to read one line of text from client, send same line back, repeat until quit is received, with the following data structure:

```c

#define CONN_READING  0

#define CONN_WRITING  1

#define CONN_DONE     2

struct Connection {
	char in_buf[BUFFER_SIZE];        // data received from client
	char out_buf[BUFFER_SIZE];       // data to be sent to client
	int in_count, out_pos, out_count;// recording count and position
	int state;                       // state is one of the above
};
```
- A synchronous network protocol can be modeled as a state machine:
	- In a protocol implementation using threads or processes for concurrency, state is implicit.
	- When implementing a protocol with I/O multiplexing, state must be explicit.![[state_machine.png]]
- In particular, it is still suggested to use non-blocking for `select` or `poll` to determine when file descriptors are ready.

```c
void make_nonblocking(int fd) {
	int flags = fcntl(fd, F_GETFL, 0);
	if (flags < 0) {
		fatal("fcntl failed: could not get flags");
	}
	
	// set to non-blocking state
	flags |= O_NONBLOCK;
	if (fcntl(fd, F_SETFL, flags) < 0) {
		fatal("fcntl failed: could not set flags");
	}
}
```
- Particularly, server has two `fd_sets`, `readfds` and `writefds`, which specify the file descriptors that the server wants to check for being ready to read (`readfds`) or write (`writefds`).
- The server socket and the client file descriptors of all connections in the `CONN_READING` state are placed in `readfds`,
- The client file descriptors of all connections in the `CONN_WRITING` state are placed in `writefds`.
- Each call to select determines which file descriptors in `readfds` are ready for reading, and which file descriptors in `writefds` are ready for writing, and:
	- if the server socket file descriptor is ready for reading, it means that a connection request has arrived (and a call to accept will not block).
- In particular, the service client connections would have the `client_do_write` and `client_do_read`, which is complicated and determine if the complete message is received.

```c
for (int fd = 0; fd <= maxfd; fd++) {
	if (client_conn[fd] != NULL) {
		struct Connection *conn = client_conn[fd];
		if (FD_ISSET(fd, &readfds)) {   // check if it is in the set
			  client_do_read(fd, conn);
		}
		if (FD_ISSET(fd, &writefds)) {  // check if it is in the set
			  client_do_write(fd, conn);
		}
		if (conn->state == CONN_DONE) { // check if it is done
			  close(fd);
			  free(conn);
			  client_conn[fd] = NULL;
		}
	}
}
```

### Coroutines
- One way to reduce the complexity of I/O multiplexing is to implement communication with clients using coroutines:
	- coroutines are, essentially, a lightweight way of implementing threads, but
	- with runtime cost closer to function call overhead.
- Each client connection is implemented as a coroutine:
	- When a client file descriptor finds that a client `fd` is ready for reading or writing, it yields to the client coroutine.
	- Client coroutine will do I/O, and then yield back to the main routine.
- We use `conn->state` to help the main routine know when to schedule the coroutine (based on the readiness of its file descriptor for reading or writing), and
- The `co_readline` and `co_write_fully` functions are “coroutine-aware” I/O functions which yield back to the main routine if a call to read or write would block.
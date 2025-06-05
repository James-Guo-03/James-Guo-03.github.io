# Basic C++ Notes

## `C++` Structures:
### `C++` Comparing with `C`:
#### `C++` special features:
- The `C++` language contains:
	- Classes – like Java `classes`.
	- Templates – like Java `generics`.
	- Standard Template Library – like `java.util`.
	- More convenient text input & output.
#### `C++` inheriting `C`:
- Many features/concepts from `C` language are also relevant in `C++`:
	- types: `int`, `char`, `float`, `double`, pointer types:
		- `C++` adds `bool` (equals either `true` or `false`).
		- `C++` includes the `std` library with `string`, `vector`, ...
	- numeric representations & properties.
	- operators: assignment, arithmetic, relational, logical.
	- arrays, pointers, `*` and `&`, pointer arithmetic.
	- control structures: `if`/`else`, `switch`/`case`, `for`, `while`, `do`/`while`.
	- pass-by-value (still the default), pass by address:
		- including new *pass by reference*.
	- stack vs. heap, scope & lifetime for variables.
	- `struct` (with minor differences):
		- including new concept of `class`.
- `C++` can use any `C` headers, such as `assert.h`, `math.h`, `ctype.h`, `stdlib.h`, ...
	- when using `#include` drop the `.h` and add `c` in the beginning:
		- e.g.: `#include <assert.h>` in `C` becomes `#include <cassert>`.
### `C++` Compiler:
#### `C++` programming files:
- Source files `<filename>.cpp`:
	- The program code.
	- Contains definitions for *functions* and *methods* of *classes* declared in a `.h` file:
		- The `.h` file for templated class cannot be included in `.cpp` file.
	- Use `#include` into include corresponded `.h` files.
- Header files `<filename>.h`:
	- Group together declarations.
	- Declare `struct` and `class` for object oriented programming (*oop*).
	- Included using `#include` in appropriate files.
	- When having templated `class`, the definition shall go into a `.inc` or `.inl` file.
	- Header files often has *header guards* when it contains definitions, which prevents definition duplications (giving *compiler errors*) when multiple `.cpp` files include the same `.h` file, as follows:
```cpp
// rectangle.h:  
// include lines like this at the top; change the all-caps
// name to match the file name, rectangle.h in this case
#ifndef RECTANGLE_H  
#define RECTANGLE_H

class Rectangle { // structure
	private:
	int height;
	int width;
	public:
	Rectangle(int h = 0, int w = 0) : height(h), width(w) { };
	int get_height();
	int get_width();
};

// include this line at the bottom
#endif
```
- Inclusion files `<filename>.inc` or `<filename>.inl`:
	- The inclusion file serves as the extra lines for a templated class.
	- The templated files needs to be included by `#include <filename>.inc`.
- Intermediate object files `<filename>.o`:
	- Translated from source files (`.c` files).
	- Needed to be *linked* to executable file.
- Executable file `<filename>.out`:
	- Executable file.
	- Execute using `./<executable>`.
- Makefile `Makefile`:
	- Producing linking and compiling with less repetition.
#### `Makefile` in `C++`:
- `Makefile` is a tool that helps keeping track of which files need to be recompiled.
	- Save time by not re-compiling unnecessarily.
	- Replacing the complicated recompile code for different files.
- With the name of `Makefile` or `makefile`, the compiling uses only `make`.
- `Makefile` uses the `bash` syntax:
	- Lines in a makefile that begin with `#` are comments.
	- `$` expands the variables being predefined.
	- First (topmost) target listed is default target to run.
	- `target_name` is a list of files on which target depends.
	- Disambiguate `Tab` with spaces in the file.
	- Multiple targets can be triggered by making a single target.
- Sample `Makefile` file:
```bash
# Makefile:

CC=g++  
CFLAGS=-std=c++11 -pedantic -Wall -Wextra

main: mainFile.o functions.o  
	$(CC) -o main mainFile.o functions.o

mainFile.o: mainFile.cpp functions.h
	$(CC) $(CFLAGS) -c mainFile.cpp

functions.o: functions.cpp functions.h
	$(CC) $(CFLAGS) -c functions.cpp

clean:  
	rm -f *.o main
```
#### `enum` type:
- An enumeration is a distinct type whose value is restricted to a range of values.
- An enum can include several explicitly named constants (“enumerators”):
	- the values of the constants are integer numbers.
- Unscoped `enum` has each enumerator is associated with a value of the underlying type:
	- the values can be converted to their underlying type.
	- and the underlying type can be explicit.
```cpp
enum Foo { a, b, c = 10, d, e = 1, f, g = f + c };
//a = 0, b = 1, c = 10, d = 11, e = 1, f = 2, g = 12
enum color : char { red, yellow, green = 20, blue };
color col = red;  
char n = blue; // n == 21
```
- Scoped `enum` does not allow comparison of different `class`:
	- the keywords `class` and `struct` are exactly equivalent.
```cpp
enum class Color { red, yellow, blue };  
enum class MyColor { myblue, myyellow, myred };  
Color col = Color::red;  
if (col == MyColor::myred) { // Compiler will give an error.
	// ...
}
```
#### `lambdas` functions:
- A function can be passed into a function as a `functor`:
	- The `functor` has definition of `return_type (*cmp)(const void *, const void *)` of comparing void pointers
```cpp
#include <iostream>
#include <cstdlib>
template <typename T>
int compare_T (const void *v1, const void *v2) {
	if (*(const T*)v1 < *(const T*)v2) return -1;
	else if (*(const T*)v2 < *(const T*)v1) return 1;
	else return 0;
}

template <typename T>
void my_qsort(T *values, size_t count, int (*cmp)(const void *, const void *)) {
	// the variable cmp is the functor used ^^^^ as a function input.
	qsort(values, count, sizeof(T), cmp);
}

int main( void ) {
	int v[12];
	size_t sz = sizeof(v) / sizeof(int);  
	for (unsigned int i = 0; i < sz; i++) v[i] = rand()%100;
	for (unsigned int i = 0; i < sz; i++ ) {
		std::cout << " " << v[i] ; std::cout << std::endl;
	}
	my_qsort(v, sz, compare_T<int>);
	// the function ^^^^^^^^^^^^^^ is passed as a functor variable.
	for (unsigned int i = 0; i < sz ; i++) {
		std::cout << " " << v[i] ; std::cout << std::endl;
	}
	return 0;
}
```
- The `lambdas` function allows quick declaration of a `functor` inline of the function call:
	- In format of `[ captured-scope ]( param ){ code-block }`, the function has:
		- `captured-scope` representing all local variables that the function has access to, use `&` for capturing by reference, and a single `&` for capturing all variables by reference.
		- `param` are the parameters with type and variable name that the function takes as input.
		- `code-block` includes all the operations and returns some objects, its type is derived by the compiler.
	- If there are multiple returns, they need to be of the same type, else the compiler cannot know what to case.
#### `auto` keyword:
- By using the `auto` keyword, the compiler could determine the type for certain variables:
	- `auto` acts the same as the definition of the type.
- For inputting `functor` in functions, use of `auto` keyword and `typename` of `T_cmp` allows us to not give the full `functor type`, that is:
```cpp
#include <iostream>
#include <cstdlib>

template <typename T, typename T_cmp>
void my_qsort(T *values, size_t count, T_cmp cmp) {
	// the variable cmp is the functor ^^^^^ is by typename here.
	qsort(values, count, sizeof(T), cmp);
}

int main( void ) {
	int v[12];
	size_t sz = sizeof(v) / sizeof(int);  
	for (unsigned int i = 0; i < sz; i++) v[i] = rand()%100;
	for (unsigned int i = 0; i < sz; i++ ) {
		std::cout << " " << v[i] ; std::cout << std::endl;
	}
	auto sort_lambda = [&](const void *v1, const void *v2){
		if (*(const T*)v1 < *(const T*)v2) return -1;
		else if (*(const T*)v2 < *(const T*)v1) return 1;
		else return 0;
	}
	my_qsort(v, sz, sort_lambda);
	// the function ^^^^^^^^^^^ is passed as with auto.
	for (unsigned int i = 0; i < sz ; i++) {
		std::cout << " " << v[i] ; std::cout << std::endl;
	}
	return 0;
}
```
- The `auto` keyword can also be used for iterators with:
```cpp
auto it = c.cbegin();
```
### `C++` Compiling and Debugging:
#### Steps of Compiler in `C++`:
- `C++` follows the same steps of *Preprocessor*, *Compiler*, and *Linker*.
- `C++` allows debugging through `GDB` and `valgrind`.
#### `C++` Compiling Command:
- Compile using GNU `C++` compiler (`g++`) to compile, link, and create executable.
- The standard compiling command is `g++ -std=c++11 -Wall -Wextra -pedantic <c_file>`:
	- `-std=c++11` flag implies that the program uses standard `C++11` complier to compile.
	- `-Wall` flag enables all the warnings about constructions that some users consider questionable, and that are easy to avoid (or modify to prevent the warning), even in conjunction with macros.
	- `-Wextra` flag enables some extra warning flags that are not enabled by `-Wall`.
	- `-pedantic` flag issues all the warnings demanded by strict ISO C. It rejects all programs that use forbidden extensions, and some other programs that do not follow ISO C.
- There are also other optional commands:
	- `-o` flag places output in designate `filename`, *regardless* the output type.
	- `-g` flag produces *debugging information* in the operating system's native format.
	- `-c` flag compiles to `.o` file.
#### GNU debugger, `GDB`:
- `gdb` helps running program in a way that allowing:
	- Flexibly `pause` and `resume`.
	- Print out the values of `variables` during the program. 
	- Check where errors (*e.g.* Segmentation Faults) happen.
- When using `gdb`, the executable should be compiled with `-g`, which packages up the source code (“*debug symbols*”) along with the executable, that is:
	- `gcc -std=c++11 -Wall -Wextra -pedantic <c_file> -o <executable_file> -g`.
- When running `gdb`, it runs the executable file:
	- For normal execution, use: `gdb --args <executable> <input> ...`
	- For execution that takes *command-line input*, use: `gdb --args random_crash input.txt`
- `break` command makes the code pause in `gdb`, and it set before the code starts running:
	- Debugger to pause as the program starts: `break main`
	- Debugger to pause as the program enters a function: `break <function_name>`
- `run` command start the program, which immediately pauses after the first break.
- `next` or `n` command executes the statement on the current line and moves onto the next:
	- If the statement contains a function call, `gdb` executes with `next` without pausing.
- `step` command begins to execute the statement on the current line:
	- If the statement contains a function call, it steps into the function and pauses there.
- `print` or `p` command prints out the value of a variable:
	- Print a variable in the scope: `print <var_name>`
- `list` command shows the current code block.
- `backtrace` command tracks the call stack, especially in *recursions*:
	- Going up a stack: `up <optional_number_of_stacks>`
	- Going down a stack: `down <optional_number_of_stacks>`
- `help` commands provide prompt for help:
	- Help advancing through the program: `help running`
	- Help printing commands: `help show`
#### Memory Track, `valgrind`:
- `valgrind` finds memory usage mistakes:
	- Invalid memory accesses (*e.g.* array index out of bounds).
		- This is attempts to dereference pointers to memory that is *not owned*.
	- Memory leaks (*i.e.*, failure to free dynamically-allocated memory).
		- This is failing to *deallocate* a block of memory that is allocated.
- When using `valgrind`, the executable should be compiled with `-g`, which packages up the source code (“*debug symbols*”) along with the executable, that is:
	- `gcc -std=c++11 -Wall -Wextra -pedantic <c_file> -o <executable_file> -g`.
- When running `valgrind`, it runs the executable file:
	- `valgrind --leak-check=full --show-leak-kinds=all ./<executable> <args> ...`
	- The program’s output is *interleaved* with `valgrind` messages.
### `C++` References:
#### Reference type:
- Reference variable is an *alias*, another name for an existing variable (memory location).
	- Used in many situations where *pointers* would be used in `C`.
	- References have restrictions that make them *safer*:
		- Can’t be `NULL`.
		- Must be initialized immediately.
		- Once set to alias a variable, *can’t* later be set to alias another.
- To declare a reference, use `type& var`, where `&` comes after the type.
- References provide pointer-like functionality while hiding the raw pointers themselves.
- Function parameters with *reference type* are passed *by reference*:
	- it is like passing *by pointer* but without the extra syntax inside the function.
```cpp
void swap(int& a, int& b) { // Swaps two ints by reference.
    int tmp = a;
    a = b;
    b = tmp;
}
```
- Once a reference is set to alias a variable, it cannot later be set to alias another variable:
	- When the reference is changed, then the original value changes.
	- Reference variable must be initialized immediately and can't be `NULL`.
#### References in functions:
- In `C++`, a variable can be passed into functions via:
	- Pass by value: when passed by value, the variable is deep copied into the function.
	- Pass by reference: when passed by reference, the alias will be passed and the variable could be modified.
	- Pass by pointer: `C++` allows pass by pointer, so the values would be modified correspondingly.
-  We may also have references as a `return` type of the function:
	- When a reference is returned, changing the value of reference would change the original value.
	- A local variable should not be returned as a reference, since it will be out of scope.
- In general, we pass by reference when passing objects and use:
	- `const` reference if modification is not permitted.
		- Pass by reference avoids making copies, so it is more efficient.
	- normal reference otherwise.
#### `const` references:
- A reference can be `const`, then one can’t subsequently assign via that reference.
	- This is achieved by `const int& c = a` which adds `const` protection.
	- Even so, one can still assign to the original non-`const` variable, or via a non-`const` reference to it.
	- When attempting to assign value to `const` references, there will be *error*.
### I/O in `C++`:
#### `<iostream>` header in `C++`:
- `<iostream>` library allows the basic input or output stream from or to a stream:
	- The stream for standard output is `std::cout`.
	- The stream for standard error output is `std::cerr`.
		- The output stream *overload* the operator `<<` so it concatenates the output to the stream.
		- The output stream ends a line by `std::endl`.
		- E.g. `std::cout << "Hello" << 1 << std::endl;`
	- The stream of standard input is `std::cin`.
		- The input stream *overload* the operator >> so it extracts a `string` from the input stream by space or separation in the stream.
		- E.g. `std::cin >> var_1;`
		- `cin.get(char&)` takes in a `char` by reference and modify the value of the `char` to the next `char` in the input `stream`.
	- When certain desired output/input formatting is needed, one can use `<cstdio>` package and `printf` with `scanf` from `C`.
#### `<fstream>` header in `C++`:
- `fstream` header handles the I/O for files:
- `ofstream` is for writing to a file:
```cpp
#include <iostream>
#include <fstream>
int main() {
	std::ofstream ofile( "hello.txt" );
	ofile << "Hello, World!" << std::endl; 
	return 0;
}
```
- `ifstream` is for reading from a file:
```cpp
#include <iostream>
#include <fstream>
#include <string>
int main() {
	std::ifstream ifile( "hello.txt" );
	if (!ifile.is_open()) {
		std::cout << "failed to open hello.txt" << std::endl;
		// indicate that open fails
		return 1;
	}
	std::string word; 
	while (ifile >> word) {
		std::cout << word << std::endl;
		// prints each word in ifile
	}
	return 0;
}
```
- `fstream` is for reading and writing to/from a file:
	- `<<` and `>>` operators are for file I/O.
#### `stringstream` as buffer:
- `stringstream` is a temporary string (“buffer”) that stores the data instead of reading or writing to a file or console.
```cpp
#include <iostream>
#include <sstream>
int main(){
	std::stringstream ss;  
	ss << "Hello, world!" << std::endl;    // Stores the string in.
	std::cout << ss.str();                 // Return it as a string.
	return 0;
}
```
- `stringstream` is a string buffer contains a sequence of characters.
- `str()` function can be used to get the content of the buffer:
	- `str(string)` sets the content of the buffer to the string argument  
	- `<<` and `>>` operators can be used with `stringstream` to insert/extract content.
- Inside the `stringstream` (buffer), each element, during output, is separated by whitespace.
- The `stringstream` also comes with buffers that only do reading or writing:
	- `istringstream` is for reading only and only takes `>>` for extracting strings.
	- `ostringstream` is for writing only and only takes `<<` for inputing strings.
#### Object Oriented Programming from `ios`:
- The `ios` class follows the structure of:
```UML
-                     ios
-                   /     \
-            istream       ostream
-           /       \     /       \
-   ifstream       iostream       ofstream
-                  /      \  
-            fstream    stringstream
```
- `istream` and `ostream` are both derived from `ios`  
- `iostream` inherits from both `istream` and `ostream`:
	- multiple inheritance is allowed in `C++`. 
- stream extraction operator (`>>`) is defined for all `istreams`.
- stream insertion operator (`<<`) defined for all `ostreams`.
- `fstream` and `stringstream` are both derived from `iostream`:
	- they can use both `>>` and `<<` on them for input or output.
- `stringstream` inherits from `istream` and `ostream`:
	- operators `<<` and `>>` are defined for reading/writing from/to a `stringstream`.
	- we can use member function `.str()` to get the string out of the object.
### `C++` Standard Template Library:
#### `C++` Namespaces:
- Most `C++` functionality lives in namespace called `std`, if it is not included at the top, one needs to write the fully qualifies name each time:
	- One can include the namespace at the top of the `.cpp` file.
	- Use of `using` in header file is prohibited, since it *affects all the source files* that include that header, even indirectly, which can lead to confusing *name conflicts*.
- Use of `using namespace std;` is prohibited since it is too broad:
	- This is a catch-all way to include everything in the `std` namespace, whether needed or not.
	- This causes confusion due to *accidental name conflicts*.
- The standard use of `using` should be in `.cpp` file, at the top as:
```cpp
using std::cout;
using std::endl;
// More to be added if needed.
```
- Likewise, `using` or `typedef` can help to reduce the clutter and bring related type declarations closer:
```cpp
	typedef map<int, string> TMap;      // map type
	typedef TMap::iterator TMapItr;     // map iterator type
	// or using:
	using TMap = map<int,string>;       // map type
	using TMapItr = TMap::iterator;     // map iterator type
```
#### `string` in `C++`:
- `C++` strings have similar user-friendliness of `java`/`python` strings, it had less details like null terminators.
- To include, we should have `#include <string>` at the top:
	- The full name is `std::string`.
	- One can have `using std::string` at the top of the `.cpp` file so one does not need to include `std` namespace every time.
- A string can be initialized in multiple ways:
```cpp
string s1 = "world";   // intialization directly
string s2("hello");    // intialization directly
string s3(3, 'a');     // intialize as "aaa"
string s4;             // intialize empty string
string s5 = s2;        // deep copy of s2 to s5
```
- Strings in `C++` can be arbitrarily long:
	- The `C++` library cares about the memory:
		- Memories are *dynamically allocated* and *adjusted* as needed.
		- Memories are *freed* when the string goes out of scope.
- Operators works in string:

| Operator | Usage |
|:--------:|-------|
| `=` | assigning literal to string|
| `>>` | put one whitespace-delimited stream input |
| `<<` | write the string to output stream |
| `getline(stream, string)` | read to end of line from the stream |
| `=` | deep copying |
| `+` | returning new string being concatenation |
| `+=` or `s1.append(s2)` | appending one string to the end of another |
| `==` `!=` `<` `>` `<=` `>=`| relational operators, compare by `char` order |
- `string` has methods that contains information of the `string`:
	- `s.length()` returns the length of the string (ignore `\0` for `C++`).
	- `s.empty()` return false when there is at least 1 character.
	- `s.capacity()` returns the bytes of memory allocated, each `char` is one byte.
	- `s.substr(offset, howmany)` gives a substring from `offset` for `howmany` letter.
	- `s.c_str()` returns the `C`-style `const char *` array representing strings.
	- `s[i]` and `s.at(i)` accesses the `i+1`-th character, but `s.at(i)` does *bounds check*.
	- `s.push_back(char)` append for a single character.
	- `s.clear()` set to empty string.
	- `s.insert(size_t, const string&)` inserts a copy of the string at some position, `s.insert(size_t, size_t, char)` inserts a `char` for consecutive times.
	- `s.erase(size_t pos = 0, size_t len = npos)` remove a length of characters from the indicated start position.
	- `s.replace(size_t pos, size_t len, const string& str)` replaces the portion of the string spanned by `pos` and `len` to the copy of `str`.
#### Templates in `C++`:
- Templates are a way of writing an *object* or *function* so they can work with *any type*.
	- Defining a template is simultaneously *defining a family of related objects/functions*.
- In the following example, the `template<typename T>` allows almost all types of data.
```cpp
template<typename T>
struct Node {  
   T payload; // 'T' is placeholder for a type Node *next;
   Node *next;
};

template<typename T>
void print_list(Node *head) {
    Node<T> *cur = head;
    while(cur != NULL) {
        cout << cur->payload << " ";
        cur = cur->next;
    }
    cout << endl;
}
```
- One can use `class` to represent a `typename` and the typename shall be included everywhere when needed:
```cpp
template<typename T>
int sum_every_other(const T& ls) {
	int total = 0;  
	// Specifying typename T for the iterator.
	for (typename T::const_iterator it = ls.cbegin();
	    it != ls.cend(); ++it) {
		total += *it;
		if(++it == ls.cend()) { break; }
	}
	return total;
}
```
- Templated classes are helpful for object oriented programming.
#### `array` – fixed-length array  
- `array` is a array with a fixed length.
	- Use `#include <array>` to use it.
	- Use `[ ]` to access elements.
	- Declare by `std::array<int, 3> a = {1, 2, 3};` for use.
#### `vector` – dynamically-sized array:
- `vector` is an array that automatically grows/shrinks as you need more/less room.
	- Use `#include <vector>` to use it.
	- Use `[ ]` to access elements, like arrays.
	- Allocation, resizing, deallocation handled by `C++`.
	- Like Java’s `java.util.ArrayList` or Python’s `list` type.
- To use a vector, we have:
	- For namespaces, use `using std::vector`.
	- For declaring a vector, use `vector<std::string> names`.
	- To add elements in the back, use `names.pushback("a")`.
	- To access the number of elements, use `names.size()`.
	- To access the first or last, use `names.front()` or `names.back()`.
	- To return and delete final element, use `names.pop_back()`.
	- To `erase`, `insert`, `clear`, `at`, `empty` just like strings.
	- To swap elements, use `names.swap(vector)` to swap contents of the two vectors.
	- `begin`/`end`/`rbegin`/`rend`/`cbegin`/`cend` are iterators for beginning/end respectively.
- Allocations happen automatically and everything is deallocated when it goes out of scope.
- To get through vector, we can use an `iterator`, which is a clever pointer to move around:
```cpp
for (vector<string>::iterator it = names.begin();
	 it != names.end(); ++it) {
	cout << *it <<endl;
}
```
#### `map` – associative list, or dictionary:
- Collection of `keys`, each with an associated `value`:
	- Like Java’s `java.util.HashMap` or `TreeMap` or Python’s `dict` (dictionary) type.
	- Use `#include <map>` to use it.
	- Use `[ ]` to access values by keys.
- To use a map, we have:
	- For namespaces, use `using std::map`.
	- For declaring a map, use `map<int, std::string> id_to_names`.
	- Add a key and value, use `id_to_names[1] = "A"`.
- A map can only associate 1 value with a key.
	- To get the number of keys, use `id_to_name.size()`.
	- To check if the map contains a given key, use `id_to_name.find(key) != id_to_name.end()`.
- An iterator iterates through the keys via `map<int, std::string>::iterator`.
	- Iterator moves over the keys in *ascending order*, the reverse iterator moves in *descending order*.
	- To dereference a map iterator, `it->first` is the key and `it->second` is the value.
#### `pair` – quick pair for output:
- For functions returning multiple values, use `pair`, it allows returning two things of different type:
	- `iterator` is a `pair`.
	- use pair by defining `#include <utility>;`
	- declare `pair` by `std::pair<int, string> = std::make_pair(1, "2");`
#### `tuple` – pair with unlimited amount of elements:
- tuple is like pair but with as many fields as you like:
	- Define by `#include <tuple>`.
	- Using namespace of `using std::tuple` and `using std::make_tuple`.
	- Declare by `tuple<int, int, float> = make_tuple(1, 2 3.0f)`.
#### `iterator` – quickly iterate through the object:
- With `iterator` (or `reverse_iterator`), one can modify the data structure via the dereferenced iterator. With `const_iterator` (or `const_reverse_iterator`), the data are protected.

|Type|`++it`|`–it`|Get with|`*it` type|
|--|---|---|---|---|
|`iterator`|forward|back|`.begin()` / `.end()`|-|
|`const_iterator`|forward|back|`.cbegin()` / `.cend()`|`const`|
|`reverse_iterator`|back|forward|`.rbegin()` / `.rend()`|-|
|`const_reverse_iterator`|back|forward|`.crbegin()` / `.crend()`|`const`|
#### `algorithm` – algorithms for functions:
- `algorithm` includes certain algorithms that can help quick coding.
	- Include algorithms header by `#include <algorithm>`.
	- `std::sort(begin_iterator, end_iterator, order_function)` sorts the arrays though the ascending order or the order specified by a `bool` comparison function.
	- `std::find(begin_iterator, end_iterator, value)` looks for the `value` through iterators, and will return the  `end_iterator` if nothing is found.
	- `std::count(begin_iterator, end_iterator, value)` counts how many times `value` appears through iterators, and will return the number of occurrence.
#### Other templates:
- `set` – set with each element can appear at most once.
- `list` – linked list.
- `stack` – last-in first-out (LIFO).
- `deque` – double-ended queue, flexible combo of LIFO/FIFO, has `pop_front()`.
### Dynamic Memory Allocation in `C++`:
#### Dynamically allocating pointers:
-  `new` and `delete` are the `C++` versions of `malloc` and `free` in `C`.
	- `new` not only allocates the memory, it also calls the appropriate constructor if used on a class type.
	- `new` and `delete` are *keywords* rather than *functions*, so they are called without `(...)`.
```cpp
int main() {  
	int *iptr = new int;           // allocate a pointer to int.
	*iptr = 10;
	// more code with iptr.
	delete iptr;                   // deallocate the pointer.
}
```
#### Dynamically allocating arrays:
-  `new` and `delete []` are for dynamically allocating/deallocating arrays.
	- when allocating arrays, use `T *a = new T[n]` to allocate an array of `n` elements of type `T`.
	- when deallocating, use `delete [] a` for deallocating anything created as above.
```cpp
int main() {  
	double *d_array = new double[10];          // allocating the array.
	for(int i = 0; i < 10; i++) {
		std::cout << (d_array[i] = i * 2) << " ";
	}
	std::cout << std::endl;
	delete[] d_array;                          // deallocating the array.
	return 0;
}
```
### `Exceptions` in `C++`:
#### Exceptions:
- Exceptions are to indicate a fatal error has occurred, where there is no reasonable way to continue from the point of the error.
	- It might be possible to continue from somewhere else, but not from the point of the error.
	- Exceptions are more flexible; often less error prone, more concise than manually propagating errors back through the chain of callers.
- When an exception is thrown, a `std::exception` object is created.
	- Could be included as `#include <stdexcept>`
	- Exception types ultimately derive from `std::exception` base class.
	- Exception's type and contents (accessed via `.what()`) describe what went wrong.
- The `exception` class derives into:
	- `bad_alloc`.
	- `logic_error`: such as `length_error`, `domain_error`, `out_of_range`, and `invalid_argument`.
	- `runtime_error`: `range_error`, `overflow_error`, and `underflow_error`.
	- `bad_cast`.
- An exception can be thrown by:
```cpp
throw std::exception("exception message");
```
- One can use `try`-`catch` block to catch an exception:
	- The order of `catch` should be from most to least specific.
```cpp
int main() {  
	vector<int> vec = {1, 2, 3};
	try {
		cout << vec.at(3) << endl;  
	} catch(const std::out_of_range &e) {
		cout << "Out of Range: " << endl << e.what() << endl;
	} catch(const std::logic_error &e) {
		cout << "Logic Error: " << endl << e.what() << endl;
	} catch(const std::exception &e) {
		cout << "Exception: " << endl << e.what() << endl;
	} 
	return 0;
}
```
- The exceptions thrown would be tried to be caught to broader scope:
	- If we unwind all the way to the point where our scope is an entire function, we jump back to the caller and continue the unwinding.
	- If exception is never caught – i.e. we unwind all the way through `main` – exception info is printed to console and program exits.
	- Unwinding causes local variables to go out of scope:
		- As destructors always called when object goes out of scope, regardless of whether scope is exited because of reaching end, return, break, continue, exception.
#### Customized `Exceptions`:
- One can define their own exception class, derived from exception:
	- Since exceptions are related through inheritance, one can choose whether to catch a base class (thereby catching more different things) or a derived class.
```cpp
#ifndef EXCEPTION_H
#define EXCEPTION_H
#include <stdexcept>
#include <string>
class PlotException : public std::runtime_error {
public:
	PlotException(const std::string &msg) : std::runtime_error(msg) { }
	PlotException(const PlotException &other) : std::runtime_error(other) { }
	~PlotException() { }
};

#endif // EXCEPTION_H
```
## Object Oriented Programming in `C++`:
### Basic `class` in `C++`:
#### `class`:
- `C++` is an object-oriented programming language that supports putting related functionality as part of the object (in comparison with `struct`).
- A `class` definition is like a blueprint defining a type:
	- Objects of that type are created from that blueprint.  
	- Once we define a class, we have one blueprint from which we can create 0 or more objects.
	- Each of the objects is an instance of the class and has its own copies of all instance variables.
- The use of `const` as modifier in method header indicates that this function will not modify any member fields:
```cpp
void print() const { /* code in between */ }
```
- Fields and member functions can be `public`, `private` or `protected`.
	- We use `public:` and `private:` to divide class definition into sections according to whether members are `public` or `private`.
	- Everything is `private` by default.
- A `public` field or member function can be accessed freely by any code with access to the class definition (code that includes the `.h` file)
- A `private` field or member function can be accessed from other member functions in the `class`, but not by a user of the `class`.
```cpp
class Rectangle {
public:
	double area() const {  
		// definition inside class
		return width * height;         // allowed
	}
// code in between
private:
	double width, height;
};

int main() {
	Rectangle r;
	std::cout << r.width << std::endl; // not allowed
	return 0;
}
```
- A class field cannot be immediately initialized when they are declared unless it is a `static` field.
	- A `static` field is independent with instances of the `class`.
	- A `static` function is not associated with any object.
#### Style for `class`:
- Class definition goes in a `.h` file.
- Functions can be declared and defined inside `class { ... }`;
	- Only define member function inside the `class` definition if it’s very short., known as the *in-lining* the function definition.
- When the function definition is long, put a prototype in the class definition and define the member function in a `.cpp` file:
	- One needs to qualify the function with the class scope as `Clasname::function(parameters) { code }` in the `.cpp` files.
```cpp
// Rectangle.h
#ifndef RECTANGLE_H
#define RECTANGLE_H
class Rectangle {
	// code in between
	double get_width() const {
		return width;            // short definition inside class
	}
	double get_area() const;     // long definition has prototype only
};
#endif

// Rectangle.cpp
#include "Rectangle.h"
double Rectangle::area() const { // definition outside class
	return width * height;
}
```
#### Constructors:
- Default constructor for a class is a member function that `C++` calls when you declare a new variable of that class without any initialization:
	- A constructor is a member function you can define yourself.
	- If you define it, it should be `public`.
	- The function name must match the `class` name exactly.
	- Called a default constructor if it takes no arguments.
```cpp
class Rectangle {
public:
    // default constructor for Rectangle
	Rectangle() { /* definition in between */ }
	// code in between
};

int main() {  
	Rectangle r;  // Rectangle's default constructor is called
	return 0;
}
```
- At least one constructor would be the provided, or the compiler generates a default one:
	- For the compiler generated once:
		- For built-in types (`int`, `doubles`,. . . ), the instance variables aren’t initialized (so they have *garbage values*).
		- For instance variables of `class` types, their default constructor for that class type is called.
- `C++` syntax allows initializer list, which saves wastes for initializing and then assigning:
```cpp
IntAndString() : i(7), s("hello") { }
```
- Constructors can also take arguments, allowing caller to “customize” the object:
	- Here, strings can take a string argument as a parameter:
```cpp
string s1("Hello");          // invoces a non-default constructor
string s2 = "Hello";         // invoces a non-default constructor as well
```
- When we supplied an alternate (that is, non-default) constructor, there is no implicitly-created default constructor.
	- During the constructor parameter conflicts, the initializer list is fine, but definition required `this` pointer:
```cpp
class MyThing {
public:
	MyThing(int init) : init(init) { }
    // initializer list      ^^^^ is fine
    void set_i(int init) { this->init = init;}
    // using this pointer  ^^^^^^ to clarify
private:
	int init;
};
```
- When having an array of instances of a `class` type, this requires the class to have a default constructor:
	- Alternatively, one can use list-initialization to initialize the array or use `STL` such as `vector`.

{% raw %}

```cpp
// myThing4.cpp:
#include <iostream>
#include <vector>

class MyThing {
public:
	// no default constructor
	MyThing(int init) : init(init) { }
private:  
	int init;
};

int main() {  
	// use list-initialization to initialize the array  
	MyThing s[10] = {{0},{1},{2},{3},{4},{5},{6},{7},{8},{9}};
	// use empty vector and reserve 10 elements
	std::vector<MyThing> s  
	s.reserve(10);  
	for (int i = 0; i < 10; ++i) {
		// initialization using emplace_back  
		s.emplace_back(i);  
	}
	return 0;
}
```

{% endraw %}

#### Destructors:
- Since `new` in `C++` also calls the constructors, it is common for a constructor to obtain a resource (allocate memory, open a file, etc) that should be released when the object is destroyed.
- A class destructor is a method called by `C++` when the object’s lifetime ends or it is otherwise deallocated (with `delete`).
- A destructor’s name is the name of the class prepended with ~:
	- E.g. `~Rectangle()`
- The destructor is always automatically called when object’s lifetime ends, including when it is deallocated:
	- It’s a convenient place to clean up, as it is automatic.
	- No need to go hunting for all the places to put `object.clean_up()`.
```cpp
// sequence.h:
class Sequence {
public:
	Sequence() : array(NULL), size(0) { }
	// The non-default constructor allocates an array
	Sequence(int sz) : array(new int[sz]), size(sz) { 
		for (int i = 0; i < sz; i++) {
			array[i] = i;
		}
	}
	~Sequence() { delete[] array; } // destructor needed
	// more funtionalities
private:
	int *array;
	int size;
};
```
- Copy constructor initializes the instance by having a reference to another instance of the object.
	- The implicit (compiler-generated) one for a class does simple field-by-field copy, even for pointers.
	- Thus, we need to write one if the `class` manages heap memory.
	- The copy constructor should conduct deep copy.
- A copy constructor is used in the following situations:
	- when making an explicit call to a constructor feeding it an already-created class object:
		- E.g. `Rational r2(r1);`
	- when sending a `class` object to a function using pass-by-value.
	- when a `class` object is returned from a function by value.
#### Initialization and Assignment:
- `=` can be interpreted as:
	- `=` in a declaration:
		- E.g. `int a = 4;` (initialization).
		- This involves the constructors.
	- `=` elsewhere:
		- E.g. `a = 4;` (assignment).
		- This involves the assignment operator.
- In many `class` that manages resources, it has a non-trivial destructor, then one needs to take care of how it is copied.
	- Rule of 3: If you have a non-trivial destructor, you should also define a copy constructor and `operator=`.
	- If the copy constructor or `operator=` are not specified, the compiler adds implicit version that shallow copies, which:
		- Simply copies the contents of the fields
		- Class fields will have their corresponding copy constructors or `operator=` functions called.
		- Pointers to heap memory will simply be copied, without the heap memory itself being copied.
```cpp
// Copy constructor
Image(const Image& o) : nrow(o.nrow), ncol(o.ncol) {
	// Do a *deep copy*, similarly to the non-default constructor  
	image = new char[nrow * ncol];
	for(int i = 0; i < nrow * ncol; i++) {
		image[i] = o.image[i];
	}
}

// Assignment operator
Image& operator=(const Image& o) {  
	delete[] image; // deallocate previous image memory
	nrow = o.nrow;  
	ncol = o.ncol;  
	image = new char[nrow * ncol];  
	for(int i = 0; i < nrow * ncol; i++) {
        image[i] = o.image[i]; // having deep copy
    }
    return *this; // for chaining
    }
```
#### Templated class
- Just like templated `struct`, we can make `class` templated in `C++`:
```cpp
// ll_temp.inc:

#include <iostream>
template<typename T> class Node {  
public:
	Node(T pay, Node<T> *nx) : payload(pay), next(nx) { }
	void print() const {  
		const Node<T> *cur = this;
		while(cur != NULL) {
			std::cout << cur->payload << ' ';
			cur = cur->next;
		}
		std::cout << std::endl;
	}
private:  
	T payload;
	Node<T> *next;
};
```
- The main file must include `#include "ll_temp.h"` and `#include "ll_temp.h"`.
	- This is not a `.cpp` file as compiler does not instantiate the type until first use, thus will cause a compiler issue.
- For `friend` function, it must use a different `typename` variables (such as `<typename U>`), since it must be separable with the definition of the `typename` in the templated class.
### Overloading:
#### Function Overloading:
- `C++` compiler can distinguish functions with same name but different parameters.
- It cannot distinguish functions with same name and parameters but different `return` types.
#### Operator Overloading:
- `C++` allows definition of new `classes`, and we can define new meanings for operators within the types:
	-  Overloading means putting another definition for a name.
	- Contrast overloading with overriding, where we replace a definition of a name.
- We can overload most operators:
	- E.g. `+`, `-`, `*`, `/`, `<`, `|`, `&`, `=`, `[]`, `==`, `!=`, `<<`, etc.
	- The new meanings for operators should be intuitive.
- To specify a new definition for an operator with symbol `S`, we define a method called `operatorS`.
	- The compiler understands that expressions using the infix operator `+` applied to the types specified in the method should map to the above function.
```cpp
// insertion_eg2.cpp:

#include <iostream> #include <vector>
using std::cout; using std::endl; using std::vector; using std::ostream;

ostream& operator<<(ostream& os, const vector<int>& vec) { 
	for (vector<int>::const_iterator it = vec.cbegin();
	     it != vec.cend(); ++it) {
		os << *it << ' ';
	}
	return os;
}

int main() {  
	const vector<int> vec = {1, 2, 3};  
	cout << vec << endl;    // this prints with overload operator <<.
	return 0;
}
```
- Note that taking `ostream& os` in first parameter and returning `os` enables chaining:
	- Taking `const vector<int>&` as second parameter allows the `vector<int>` to appear as a right operand in a `operator<<` call.
- Operator overloading can be between instances of classes:
	- Between instances of the class, we can define overloaded operators inside the class with another instance of the class so it has access to the `private` fields.
```cpp
// rational.h
class Rational {
public:
	//...
	Rational operator+(const Rational& right) const;
private:  
	int num; //numerator
	int den; //denominator
};

// rational.cpp
Rational::operator+(const Rational& right) const {
	int sum_num = this->num * right.den + right.num * this->den;
	int sum_den = this->den * right.den;
	Rational result(sum_num, sum_den);
	return result;
}
```
- The `return` type is the object since the `return` calls the copy constructor to return a copy of the object:
	- If there are pointers or arrays in the fields, there needs to be a defined copy constructor else it does a shallow copy by field.
- The following operators cannot be overloaded:
	- `::` for scope resolution.
	- `.` for member access.
	- `.**` for member access through pointer to member.
	- `?:` for ternary conditional.
#### `friend` keyword:
- We can make use of the friend keyword to give the method “almost-member” status:
	- during the operator overload involving private fields of a class, the `friend` keyword allows access to private member variables.
	- the `friend` keyword method is not an actual member of the `class`.
```cpp
// rational.h
class Rational {
public:
	// ...
	friend ostream& operator<<(ostream& os, const Rational& r);
private:
	int num; //numerator
	int den; //denominator
};

// rational.cpp
#include "rational.h"
ostream& operator<<(ostream& os, const Rational& r) {
	os << r.num << "/" << r.den << ' ';
	return os;
}
```
### `class` Structures:
#### Inheritance:
- Classes we use are often related to each other, they can have:
	- `is-a` relationship, a type of inheritance.
	- `has-a` relationship, a type of composition or aggregation.
- Derived class inherits from base class:
	- There are multiple levels of access:
		- `public` inheritance: access of members in the base class is passed down and preserved.
		- `private` inheritance: access of the members in the base class is only accessible to itself and its derived classes.
		- `protected` inheritance: by default, the access of the members are within the class.
	- Derived class inherits most members of base class, whether public, protected or private:
		- only  public and protected members can be accessed directly.
	- Does not inherit constructors and assignment operator if explicitly defined.
	- Derived class cannot `delete` things it inherited and it cannot pick and choose what to inherit.
		- However, derived class can `override` inherited member functions, which is substituting own implementation for base class’s.
	- Derived classes don’t inherit constructors, but (usually) need to call their base class constructor to initialize inherited data members:
		- We do this with the base class name in `C++`.
		- The base class constructor call must be the first thing in the derived class constructor.
```cpp
// account.h:
class Account {
public:
    Account() : balance(0.0) { }
    Account(double initial) : balance(initial) { }
	void credit(double amt) { balance += amt; }
	void debit(double amt) { balance -= amt; }
	double get_balance() const { return balance; }
	
private:  
	double balance;
};

class SavingsAccount : public Account {
public:
    SavingsAccount(double initial, double rate) :
    Account(initial), annual_rate(rate) { }
    // member function, defined in .cpp file
    double total_after_years(int years) const;
    
private:  
	double annual_rate;
};
```
- If the base class constructor call is missing, then a default constructor for the base class will be called automatically
	- gets error if the default constructor for the base class doesn’t exist.
- When a derived class object is created, its inherited (base) parts must be initialized *before* any newly defined parts by executing a base constructor (default or explicit call to one)
- When the lifetime of a derived class object is about to end, two destructors are called: the one defined for the derived object and *then* the one defined for the base class:
	- Either destructor may be explicitly defined, or just the provided default.
- In `C++`, a class could inherit multiple base classes, via multiple arguments:
```cpp
class A { ... };
class B { ... };
class C: public A, public B { ... };
```
#### Polymorphism:
- A derived class pointer can be declared using a base class pointer but initialized as a derived class:
```cpp
Account *acc = new SavingsAccount(100.0, 5.00);
```
- A variable of a derived type can be passed into function by reference as though it has the base type:
```cpp
void print_account_type(const Account& acct) {
    cout << acct.type() << endl;
}

int main() {
    //...
    SavingAccount saving_acct(100.0, 5.00);
    print_account_type(saving_acct);
    return 0;
}
```
- Without the `virtual` keyword, the function call will be on the class type that the reference is declared in the function definition, when needing to call the actual derived class method, one need to use *dynamic binding*:
	- We need to define all the functions as `virtual` so the function of the actual class is called.
```cpp
class Account {
public:
	// ...
	virtual std::string type() const { return "Account"; }
	// ...
};

class SavingsAccount : public Account {
public:
	// ...  
	virtual std::string type() const { return "SavingsAccount"; }
	// ...
};
```
- Note that `virtual` only works for passing by reference, as when passed by object, the copied version discards the derived class information.
	- In this case, the copied instance has base class memory layout, which means the virtual function is pointing to the base class when not passing by reference.
#### Dynamic Dispatch:
- When the compiler lays out a derived object in memory, it puts the data of the base class first, thus we can cast a derived class to its base class:
	- In this case, the compiler *slices out* the derived class, i.e. ignores the contents of memory past the base data. 
	- This is known as the *object slicing*.
- When the function has a `virtual` keyword, it indicates that a method may be overriden by a derived class.
	- The virtual table (dynamic dispatch) uses the base class’s implementation by default *if the derived class doesn’t have one*.
	- The keyword `override` defends the function override when there could potentially not be overriden function from the base class.
```cpp
class Account {
public:
	virtual string type() const { return "Account"; }
};

class SavingAccount : public Account {
public:
	virtual string type() const override { return "SavingAccount"; }
	// use override in derived  ^^^^^^^^ class defensively
};
```
#### Abstract Class:
- When a derived class has a function of the same name with the base class, it will hide the function declaration in the base class even if they have different parameters.
	- The only way to access the function is by `var.BaseClass::function(param)`.
- In a base class, one may define a pure virtual function by having it equals `0`:
	- In the memory layout, it means set the address of the virtual function to `nullptr`.
	- When we declare a pure virtual function:
		- We do not give it an implementation
	        * Makes the class it’s declared in an abstract class
	        * We cannot create a new object with the type,  though we might be able to create an object from a derived type.
```cpp
class Shape {
public:
	virtual double size() const = 0;
	// ...
};
```
- When a class has one or more pure virtual functions, it cannot be instantiated. Then, it is abstract.
	- The derived class can be instantiated if it provides an implementation for the pure virtual function.
		- If we do not override the pure virtual function in derived class, then derived class also becomes abstract class.
	- Another way to make a class abstract is give it only non-`public` constructors, then:
		- It can’t instantiate the abstract class because the constructor can’t be called from the outside.
		- Whereas the derived class can still use `protected` constructor in the base class.
- We can have pointers and references of abstract class type but not concrete objects.
- Any class with `virtual` member functions should also have a `virtual` destructor, even if the destructor does nothing:
	- This is defensive programming, as else, when the destructor for the base class is called, it could not call the destructor for the derived class causing memory leak.
#### UML Diagram:
- Unified Modeling Language (UML) helps us visualize relationships.
	- Class names go in rectangles.
	- Directed arrow goes from derived class (A) to base class (B).
		- `class A — IS-A —> class B`.
	- Diamond at a containing class (A) goes to the contained class (B).
		- `class A <>— HAS-A — class B`.
#### Iterators for Containers:
- For container classes, one can implement an iterator class nested in the class:
	- Minimally, one needs to define:
		- Inequality: `operator!=`.
		- Dereference: `operator*`.
		- Pre-increment: `operator++`.
	- Additionally, one needs to handle:
		- Equality: `operator==`.
		- Arrow (for class member access): `operator->`.
	- Our enclosing (container) class should then also define methods named `begin` and end, `which` return iterators to the first item in the collection, and the just-past-last element in the collection, respectively.
```cpp
// MyNode.h
#ifndef MYNODE_H
#define MYNODE_H

// A single node holding payload data of any type
template <typename T>
class MyNode {
	public:
	T data;          // payload
	MyNode<T> *next; // pointer to following node
	// two-argument constructor
	MyNode<T>(int d, MyNode<T>* n) : data(d), next(n) { }
};  

#endif

// MyList.h
#ifndef MYLIST_H
#define MYLIST_H

#include <iostream>
#include "MyNode.h"

// A linked list template
template<typename T>
class MyList {
	private:
	MyNode<T>* head; // pointer to first node in linked list
	public:
	// nested class for iterator
	class iterator {
		MyNode<T>* ptr;
		public:
		iterator(MyNode<T>* initial) : ptr(initial) { }
		iterator& operator++() {
			ptr = ptr->next;
			return *this;
		}
		bool operator!=(const iterator& o) const {
			return this->ptr != o.ptr;
		}
		T& operator*() { return *ptr; }
		T* operator->() { return ptr; }
	};
	iterator begin() { return iterator(head); }
	iterator end() { return nullptr; }

	class const_iterator {
		const MyNode<T>* ptr;
		public:
		const_iterator(const MyNode<T>* initial) : ptr(initial) { }
		const_iterator& operator++() {
			ptr = ptr->next;
			return *this;
		}
		bool operator!=(const iterator& o) const {
			return this->ptr != o.ptr;
		}
		const T& operator*() { return *ptr; }
		const T* operator->() { return ptr; }
	};
	const_iterator cbegin() const { return const_iterator(head); }
	const_iterator cend() const { return nullptr; }

  // MyList constructor which takes a begin and end iterator.
	template<typename Itr>
	MyList<T>(Itr i_begin, Itr i_end) {
		MyNode<T>* ptr = head;
		while (i_begin != i_end) {
			*ptr = new MyNode<T>(i_begin->data, nullptr);
			ptr = ptr->next;
			++i_begin;
		}
	};

	MyList<T>() : head(nullptr) { } // create empty linked list
    
	~MyList<T>() {                // deallocate all nodes
		while(head != nullptr) {
		    MyNode<T> *next = head->next;
		    delete head;
		    head = next;
		}
	}

	void insertAtHead(const T& d) {  // create new MyNode and add at head
		head = new MyNode<T>(d, head);
	}

	void insertAtTail(const T& d) {  // create new MyNode and add at tail
		if(head == nullptr) {
		    head = new MyNode<T>(d, nullptr);
		} else {
			MyNode<T>* cur = head;
		    while(cur->next != nullptr) {
			    cur = cur->next;
		    }
	    cur->next = new MyNode<T>(d, nullptr);
		}
	}

  // get const pointer to head node
  const MyNode<T>* get_head() const { return head; }

};

#endif
```
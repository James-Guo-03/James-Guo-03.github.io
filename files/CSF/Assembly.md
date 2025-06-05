---
layout: default
title: "Assembly Notes"
---


## Introduction to Machine Code

### Compilation into Machine Code
- A computer can only directly execute the machine code:
	- The program interprets the high-level code and carries out the specified computation.
	- The compilation process translates the high-level code into machine code.
- A `C` program can be compiled using the following way:
	- Step 1. Compile `C` **source code** to **Assembly code**:
		- `gcc -S program.c`
	- Step 2. Assemble the **Assembly code** to **Object code**:
		- `gcc -c program.s`
	- Step 3. Link the **Object code** to Executable:
		- `gcc -o program program.o`

### `x86-64` Assembly Programming
- The assembly code has complete control over hardware and helps understanding the code.
- The assembly optimize performance-critical code.
- The assembly could implement code generators.
- The `x86-64` architecture us based in the AMD64 CPUs.


### Optimizations
- The limitation for the optimizing compilers are:
	- The program behavior cannot be changed, especially under pathological conditions.
	- Extensive procedure or optimization among different files are hard.
	- The compiler must be conservative when in doubt.
- **Code Motion** reduces the computation performed if they have the same result, especially in a loop.
- **Replacing costly operation** uses add and shift instead of multiply or divide.
- **Reduce procedure calls** omits function calls in loops when the value is unchanged.
- Prevent memory aliasing and introducing local variables (same element of array to local variable).
- Use **Instruction-Level Parallelism**, which is having multiple operations at the same time.


## `x86-64` Structures

### Registers Usages
- **Registers** are the *smallest data holding elements* that are built into the processor's hardware itself:
	- **Registers** are the *temporary storage locations* that are directly accessible by the **processor**.
- Registers have their types and usages, there are sixteen 64-bit registers:

| Register(s) | Note |
|:----------:|:------|
|`%rip`|Instruction pointer, which contains the code address of next instruction to be updated. (Control flow changes the value of `%rip`.)|
|`%rax`|Function return value, which is the register that stores the return value. (Larger return types like structs are returned using the stack.)|
|`%rdi`, `%rsi`, `%rdx`, `%rcx`, `%rbx`|The function parameters to be passed, in order.|
|`%rsp`| Stack pointer, the pointer to the **top most** element in the stack.|
|`%rsb`| Frame pointer, used to keep track of the base of the current stack frame.|
|`%r8`, ..., `%r15`| Registers|

- In the above registers, `%rip` and `%rsp` are specifically used. The other are general-purpose registers:
	- ​`%rax​`, ​`%rcx`​, ​`%rdx`​, ​`%rdi​`, ​`%rsi​`, `%rsp`, and `%r8-r11` are considered **caller-save registers**, meaning that they are *not necessarily saved across function calls*.
	- ​`%rbx`, `%rbp`, and `%r12-r15` are **callee-save registers**, meaning that *they are saved across function calls*.

### Register Structures
- From the changes from 16 to 64 bits, the registers can be divided into:
	- Low byte (`0 Byte`), Second lowest byte (`1 Byte`), Lowest 2 bytes (`0-1 Byte`), and Lowest 4 bytes (`0-3 Byte`).
- In `x86-64`, memory is a big array of byte-sized storage locations:
	- Each location has an address of 64 bit.
	- Only some ranges of addresses are mapped to actual memory.
	- Each data could be stored as `globals`, `heap`, or `stack`.
- The **stack** is a runtime data structure:
	- A stack frame represents an in-progress function call, containing:
		- **Return address**. The address of instructions where control return when function returns.
		- **Local variables** and **temporary data**.


### Data Section
- Assembly allows data sections as the structure of the code:
	- `.section .rodata` allows read-only data.
	- `.section .global` allows global variables.
	- `.section .code` are the code.
- Inside the `.code` section, a **label**  marks the location of a chunk of code or data:
	- Labels are the memory addresses in the assembly code.
	- Labels would allow classifying code and jumping around the code.
	- The main 

```asm
/* hello.S */
.section .rodata
sFmt: .string "Result is %u\n"  // Read-only Variable

.section .data
val: .space 4                   // Global Variable

.section .text
	.globl main                 // Main function
main:
	subq $$8, %rsp               // Stack alignment
	/* Code here */

nameOfLabel:
	/* Code here */
	movq $$sFmt, %rdi
	movq $$10, val
	movq val, %esi
	call printf                 // Function call
	addq $$8, %rsp               // Stack alignment 
	ret
```

### Stack Manipulation
- Functions or subroutines are the pushed to the stack when called:
	- Arguments 1–6 passed in `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, and `%r9`.
	- Argument 7 and beyond, and “large” arguments such as pass-by-value struct data, passed on stack.
	- Integer or pointer return value returned in `%rax`.
- `%rsp` contains address of current “top” of stack:
	- Important: stack grows towards lower addresses, so top of stack is at lower address than bottom of stack.
	- Instruction pointer register `%rip` contains code address of next instruction to be updated.
- Stack manipulation of `push` and `pop`:
	- Used for saving and restoring register values on the stack.
	- `push` decrement the `%rsp` by operand size, and then copy operand to `(%rsp)`.
	- `pop` copies `(%rsp)` to operand, and increment `%rsp` by operand size.
	- In a stack with function calls, as the stack address has to be a multiple of 16, there either needs have `push` adding up to a decrement of multiple of 16 or use `subq $$8 %rsp` to align the stack (others if necessary) to make it a multiple of 16.

|Instruction|Note|
|:--|:--|
|`pushq %rbp`|Decrement `%rsp` by 8, then store contents of `%rbp` in memory location `%rsp`|
|`popq %rbp`|Load contents of memory location `%rsp` into `%rbp` then increment `%rsp` by 8|

- Otherwise memory allocation is available on the stack:
	- To allocate `n` bytes, subtract `n` from `%rsp` and updated %rsp is a pointer to the beginning of the allocated memory.
	- To deallocate `n` bytes, add `n` to `%rsp`.
	- As instructions such as push and pop change `%rsp`, one needs to use the frame pointer register `%rbp` to keep track of allocated memory area.

### Array
- Array is sequence of elements, each being a variable:
	- All elements have the same type, the element type.
	- Number of elements is fixed at time of array creation.
	- If `p` is the name of an array, a can also be considered to be a pointer to the first element of the array (i.e., the base address).
	- Thus, `p + i` points to the element i positions past the one `p` points to, and `p - i `points to the element `i` positions before the one `p` points to.
	- For pointers `p` and `q`, such that `p+i=q`, then `q-p=i`, which is a signed type called `ptrdiff_t` to represent the difference between pointer values:
		- It must be a signed type since the difference could be negative.

```asm
sum_elts_idx:
    movl $$0, %eax
    movl $$0, %r10d

.LsumLoop:
    cmpl %esi, %r10d
    jae .LsumLoopDone
    addl (%rdi,%r10,4), %eax     /* access array element */
    incl %r10d
    jmp .LsumLoop

.LsumLoopDone:
    ret

sum_elts_ptr:
    movl $$0, %eax
    leaq (%rdi,%rsi,4), %r10    /* gets array pointer */

.LsumLoop:
    cmpq %r10, %rdi
    jae .LsumLoopDone
    addl (%rdi), %eax
    addq $$4, %rdi
    jmp .LsumLoop

.LsumLoopDone:
    ret
```
- Multidimensional arrays in `C` are laid out in row-major order, so first dimension is considered “rows”, second dimension is considered “columns”.

### Struct
- `struct` (a.k.a. “record”) is a heterogenous data type consisting of an arbitrary number of fields with arbitrary types.
- To access a field within a struct instance, need to know the base address of the struct instance and the offset of the field being accessed:
	- Such information should be settle during run-time, they are typically stored
- Compiler must ensure that memory accesses are properly aligned:
	- $$n$$ byte int variable must have its storage allocated at an address that is a multiple of $$n$$.
	- When laying out the fields of a struct type, the compiler may need to add padding before or after fields to ensure correct alignment.

```asm
/* Note that first three arguments are in %rdi, %rsi, and %rdx */


#define PLAYER_X_OFFSET 0

#define PLAYER_Y_OFFSET 4

move_player:
    addl %esi, PLAYER_X_OFFSET(%rdi)  /* p->x += dx */
    addl %edx, PLAYER_Y_OFFSET(%rdi)  /* p->y += dy */
    ret
```

### Buffer Overflow
- `C` is a memory-unsafe language:
	- No bounds checking of array accesses.
	- No restrictions on pointers.
- Invalid memory references are an all-too-common source of bugs in `C` programs:
	- If lucky, an invalid memory reference will crash the program with a segmentation violation, a.k.a. `segfault`.
	- A much worse consequence of an invalid memory store: data is corrupted:
		- A variable or array element is overwritten.
		- A saved register value or temporary value is overwritten.
		- A return address is overwritten, which causes security issues.
- The **stack canary** method can detect stack smashing:
	- On procedure entry, store a “stack canary” value near the return address.
	- Prior to return, check the canary value, if canary was modified, terminate program.
	- Canary value generated randomly, cannot easily be guessed.
	- Return address (in theory) can’t be overwritten without also overwriting canary value.

## Assembly Operations

### Assembly Execution
- Assembly code is a sequence of *instructions* and is executed *sequentially*:
	- Each instruction has a mnemonic, which represents the execution.
	- The instructions have one or two operands that specify data values (input/output):
		- In the `AT&T` syntax, the first operand is **source** and the second is **destination**.

### Operands
- The **instruction mnemonics** sometimes use *suffixes* to indicate the operand size:

|Suffix|Byte|Bits|Note|
|:-:|:-:|:-:|:-:|
|`b`|1|8|"Byte"|
|`w`|2|16|"Word"|
|`l`|4|32|"Long" word|
|`q`|8|64|"Quad" word|

- In particular, the size suffix can be omitted, but it is helpful for readability and bugs catching.
- Let `R` be a register, `N` be an immediate, and `S` be a number of 1, 2, 4, or 8, the following are the operands:

|Type|Syntax|Example|Note|
|:-:|:-:|:-:|:-|
|Memory ref| `Addr`| `count` | Content of memory location specified by absolute memory address|
|Immediate | `$$N` | `$$8` or `$$arr` |`$$arr` is the address of `arr`. Immediate refers to a constant value, e.g. ​`0x8048d8e`​ or ​`48​`|
|Register| `R` | `%rax` | Register `%rax` |
|Memory reg|`(R)`| `(%rax)`| The dereference of an address|
|Memory reg| `N(R,R,S)`|`8(%rax,%rsi,4)`| Address $$= \texttt{\%rax} + (\texttt{\%rsi} \times 4) + 8$$ |


### Data movements
- The most assembly code is data movement.
- `mov` copies source operand to destination operand:
	- It can be applied to Registers, Memory location (only one operand can be memory location), and Immediate value (source operand only).

|Instruction|Note|
|:-|:-|
|`movq $$42, %rax`| Store the constant value `42` in `%rax`|
|`movq %rax, %rdx`| Copy 8 byte value from `%eax` to `%rdi`|
|`movl %eax, 4(%rdx)`| Copy 4 byte value from `eax` to memory at address `%rdx+4`. Note that storing a value of lower bits clears the upper bits.|
|`movswl %ax, %edi`| When moving signed values, it must use signed-extension, which is filling the upper bits with the first digit|
|`movzwl %ax, %edi`| When moving unsigned values, it must use zero-extension, which is filling the upper bits with the 0|

- Converting allows single argument to have a type conversion on the `%rax` register.

|Instruction|Note|
|:--|:--|
|`cwtl`|Convert word in `​%ax`​ to doubleword in `​%eax`​ (sign-extended)|
|`cltq`|Convert doubleword in `​%eax`​ to quadword in `​%rax`​ ​(sign-extended)|
|`cqto`|Convert quadword in `%rax` to octoword in `%rdx:%rax`|


### Arithmetic Operations
- **ALU** (or Arithmetic Logic Unit) is hardware component that does computation.
- `lea` instruction loads effective addresses, for computing memory references:
	- `lea` does not set condition code, such as *overflow*.
	- The operation is also `r(p,q,S)`, where it evaluates to $$p+(q\times S)+r$$.
- `add` and `sub` instructions add and subtract integer values:
	- They take in two operands, the second operand is modified to store result.
	- Overflow is possible in `add` or `sub`.
	- The operation `addq $$8, %rsp` is `%rsp = %rsp + 8`.
	- Likewise, `subq $$8, %rsp` is `%rsp = %rsp - 8`.
- `inc` and `dec` are increment or decrement by 1:
	- It takes one operand and can be either register or memory.
	- Overflow is possible in `inc` and `dec`.
	- The operation `incl 4(%rbp)` is incrementing the 32 bit value at address `%rbp+4`.
	- The operation `decq %rdi` is decrement `%rdi`.
- `shl`, `sar`, and `shr` are the shifts:
	- `shl` is the left shift , in which overflow implies:
	- `sar` is the shifts in the value of the sign bit, while `shr` shifts in zeroes, while both discards the remainder.
	- Shift left/right for $$n$$ position is multiplying/dividing $$2^n$$.

```asm
	movl $$0xFFFF0000, %esi
	shll $$1, %esi              /* set %esi to 0xFFFE0000, overflows */
	movl $$0xFFFF0000, %esi
	sarl $$1, %esi              /* set %esi to 0xFFFF8000 */
	movl $$0xFFFF0000, %esi
	shrl $$1, %esi              /* set %esi to 0x7FFF8000 */
```
- `and`, `or`, `xor`, and `not` for bitwise operator:

```asm
	 /* Note: 0x30 = 00110000b,
              0x50 = 01010000b */
    movb $$0x30, %al; movb $$0x50, %bl
    andb %bl, %al      /* set %al=0x10 (00010000b) */
    movb $$0x30, %al; movb $$0x50, %bl
    orb %bl, %al       /* set %al=0x70 (01110000b) */
    movb $$0x30, %al; movb $$0x50, %bl
    xorb %bl, %al      /* set %al=0x60 (01100000b) */
    movb $$0x30, %al
    notb %al           /* set %al=0xCF (11001111b) */
```
- Multiplication uses `imul` or `mul`:
	- When `imul` takes 2 operands, it multiplies with sign the operands and truncate:
		- `imulq %rdi, %rsi` sets `%rsi` to $$\texttt{\%rdi}\times\texttt{\%rsi}$$ and truncated to 64 bit.
	- When `imul` takes 1 operand, it multiplies with sign:
		- `imulq %rdi` sets `%rdx:%rax` to signed product  $$\texttt{\%rax}\times\texttt{\%rdi}$$.
	- For `mul`, it takes 1 operand, it multiplies unsigned:
		- `mulq` `%rdi` sets `%rdx:%rax` to unsigned product  $$\texttt{\%rax}\times\texttt{\%rdi}$$.
- Division with `idivq` and `divq`:
	- For both signed and unsigned division, the 128-bit dividend goes to `%rdx:%rax`, and the 64-bit quotient result in `%rax` and 64-bit remainder result in `%rdx`.
	- When having a 64-bit dividend, set `%rdx` to 0 when it is unsigned division, and replicate the sign bit by `cqto` of `%rax`.

```asm
	movq %0, %rdx           /* set the leading 64 bit to zero *
	movq %r11, %rax         /* move the ending 64 bit *
	divq %r10               /* unsigned division *
```

### Control Flow
- **Unconditional jumps** uses `jmp`. Since it is unconditional, it does not directly impact decisions.
- Condition codes are status bits updated by most ALU instructions to indicate the outcome of the instruction, it embraces a variety of flag:

|Flag|Condition|
|:-:|:-|
|`CF`|carry flag (unsigned operation overflowed)|
|`ZF`|zero flag (result was 0)|
|`SF`|sign flag (result was negative)|
|`OF`|overflow flag (signed operation overflowed)|

- `cmp` instruction is the same as `sub`, except that it doesn’t modify the “result” operand:
	- Useful for comparing integer values.
	- AT&T syntax puts the operands in the opposite order.
	- `cmpl %eax, %ebx` computes `%ebx - %eax` and sets condition codes appropriately.
- `test` instruction is the same as `and`, but doesn’t modify the “result” operand:
	- `testl $$0x80, %eax` sets `ZF` (zero flag) iff bit 7 of `%eax` is 0.
- `setX` instructions set a single byte to 0 or 1 depending on whether a condition code bit is set:
	- Useful to get the result of a comparison as a data value.
	- `setz %al` set `%al` (low byte of `%rax`) to 1 iff `ZF` (zero flag) is set.
- **Conditional jump** allows us to use the result of a comparison in order to influence a conditional jump instruction:
	- Used for implementing if/else logic and eventually-terminating loops.

|Instruction|Condition for jump|Meaning|
|:-|:-|:-|
|`je`,`jz`|`ZF`|jump if equal|
|`jl`|`SF ^ OF`|jump if less|
|`jle`|`(SF ^ OF) \ ZF`|jump if less than or equal|
|`jg`|`~(SF ^ OF) & ~ZF`|jump if greater|
|`jge`|`~(SF ^ OF)`|jump if greater than or equal|
|`ja`|`~CF & ~ZF`|jump if above (unsigned)|
|`jae`|`~CF`|jump if above or equal (unsigned)|
|`jb`|`CF`|jump if below (unsigned)|
|`jbe`|`CF \ ZF`|jump if below or equal (unsigned)||


```asm
/* assembly code */
	cmp op2, op1
	/* jX jumps to .LelsePart if the condition evaluates as false */
	jX .LelsePart
	/* code if true */
	jmp .Lout

.LelsePart:
	/* code if false */

.Lout:
	/* rest of code... */
```
- In terms of looking up values, one could use a **jump table**:
	- It is an array of code addresses with $$\mathcal O(1)$$.
	- Look up entry, jump to that location.

```asm
main:
	subq $$8, %rsp

	/* code for getting the input */
	
	/* check whether month number is in range, if not, jump to
	 * the default case */
	movl monthNum, %esi
	cmpl $$1, %esi
	jl .LDefaultCase
	cmpl $$12, %esi
	jg .LDefaultCase

	/* convert to 0-indexed and jump to appropriate case */
	dec %esi
	jmp *.LJumpTable(,%esi,8)

.L31DaysCase:
	/* Handle cases */
	jmp .LSwitchDone

.L30DaysCase:
	/* Handle cases */
	jmp .LSwitchDone

.LFebCase:
	/* Handle cases */
	jmp .LSwitchDone

.LDefaultCase:
	/* Handle out of bound cases */

.LSwitchDone:
	addq $$8, %rsp
	ret

.LJumpTable:
	.quad .L31DaysCase /* this is an array of pointers *
	.quad .LFebCase
	.quad .L31DaysCase
	/* the rest are the same but omitted */
```
- Control flow changes the value of `%rip`.

### Loops

- The loop shall use a `reg` for counter and `jX` is a conditional jump which, when taken, terminates loop.


```asm
	jmp .LcheckCond

.Ltop:
	/* loop body */

.LcheckCond:  
	cmp value, reg
	jX .Ltop

    /* code following loop... */*
```
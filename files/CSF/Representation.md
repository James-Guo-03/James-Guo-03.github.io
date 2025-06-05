---
layout: default
title: "Representation Notes"
---


##  Data Representation

### Discrete Representation
- Digital computers use a **discrete representation** for all data, which allow the number to have one set of possible values where the set of possible values is *enumerable*:
	- The discrete data representation corresponds to the high voltage (1) and low voltage (0).
- There are multiple base representations, for base $$n$$, we have integers represented by:
$$
abc_n = a\cdot n^2 + b\cdot n^1 + c\cdot n^0,
$$
where $$a,b,c$$ are digits from $$0$$ to $$n-1$$ and the places are powers of $$n$$.
- Base $$10$$ is the arbitrary, but this applies for all bases.
- Binary is the base $$2$$ representation, where each digit is $$0$$ or $$1$$ and the places are powers of $$2$$. The computer hardware fundamentally operates on binary data:
	- When decoding the binary number, one can multiply the binary digit with $$2$$ to the power of position and add the digits together.
	- When encoding the binary number, one shall compare if the number is divisible by each power of $$2$$ from the largest to the smallest.
- Octal is the base $$8$$ representation, where each digit is from $$0$$ to $$7$$ and the places are powers of $$8$$:
	- Octal number can be interpreted as grouping **three** binary digits from the right.
- Hexadecimal is the base $$16$$ representation, there each character from $$0$$ to $$15$$ uses $$a$$ to $$f$$ for $$10$$ to $$15$$ and the places are power of $$16$$:
	- Hexadecimal number can be interpreted as grouping **four** binary digits from the right.
- Modern computer accesses data in chunks of $$8$$ bits, or **1 byte**:
	- Larger chunks of data are formed from multiple bytes.
	- The typical `C` data type depends on bytes

|Data type|Bytes used in 32-bit system|Bytes used in 64-bit system|
|-:|:-:|:-:|
|`char`|1|1|
|`short`|2|2|
|`int`|4|4|
|`long`|4|8|

### Memory Representation
- Conceptually, the memory (RAM) is a sequence of byte-sized storage locations:
	- Each byte storage location has an integer address.
	- `0` is the lowest address, where as 32-bit and 64-bit processors have different highest addresses.
	- A 32-bit system can directly address $$2^{32}$$ bytes ($$\sim$$ 4GB) and a 64-bit system can (in theory) directly access $$2^{64}$$ bytes ($$\sim$$ 16 777 216 TB):
		- where 1GB $$=2^{30}$$ byte and 1TB $$=2^{40}$$ byte.
- In the memory, when storing a $$n$$-bit word, the $$n/8$$ contiguous bytes are used:
	- The natural alignment must have an address of an $$n$$-byte word having an address that is exactly a multiple of $$8$$.
	- In `C`, we can print the memory addresses by `"%p"` for the pointer, where addresses can be identifies as in the malloced buffer, as global variables or on the stack.

### Bit-wise Operators
- `C` allows bitwise operators where we think of each bit (`1` or `0`) as Boolean values (`true` or `false`).

|$$a$$|$$b$$|and $$a \& b$$|or $$a\backslash b$$| xor $$a\land b$$ | negation $$\sim a$$|
|:-:|:-:|:-:|:-:|:-:|:-:|
|0|0|0|0|0|1|
|0|1|0|1|1|1|
|1|0|0|1|1|0|
|1|1|1|1|0|0|

- To set bit $$n$$ of variable $$x$$ to 1, we have

```c
	x |= (1 << n);
```
- To set bit $$n$$ of variable $$x$$ to 0, we have:

```c
	x &= ~(1 << n);
```
- To get just the lowest $$n$$ bits of variable $$x$$, we have:

```c
	x & ~(~0U << n);
```

## Binary Data

### Signed Integer Representation
- **Sign magnitude representation** lets the most significant bit be a sign bit – $$0$$ is positive and $$1$$ is negative:
	- The downsides are that there are two representations of 0 and the arithmetic is complicated by sign.
- **Ones' complement** inverts all bits of $$x$$ to represent $$-x$$:
	- The downsides are that there are two representations of 0 and the arithmetic is slightly complicated.
- **Two's complement** lets the most significant bit to represent $$-2^{w-1}$$:
	- It is identical to the unsigned representation except the most significant digit is the inverse of the unsigned representation.
	- This representation presents $$[-2^{w-1},2^{w-1}-1]$$, which is not symmetric.
	- For two's complement, the unsigned addition yields correct result for signed values.
	- Hence, the subtraction would be adding the two's complement of the second argument.
	- The additive inverse $$-x$$ can be computed by inverting all bits of $$x$$, then adding $$1$$.

### Extension and Truncation
- For **signed extension** for *two's complement*, the strategy is to add all the prior digits of the most significant digit:
	- `1011` extends to `11111011` and `0011` extends to `00000011`.
- For **unsigned extensions**, the strategy is to just pad with `0` in the front:
	- `1011` extends to `00001011`.
- For **truncation**, it reduces the number of bits in the representation of an integer, which would lose the information and potentially change the number:
	- Truncation chops off bits from the left side of the bit string and whatever remains is the new representation.
- The conversion between **signed** and **unsigned** values do not change the underlying representation as bits:
	- `10010110` means `-106` for signed but `150` for unsigned.
- Hence, the type casting is always suggested so the conversions are explicit even if they are unnecessary. 

### Integer Arithmetics
- Addition of unsigned values starts at the least significant digit and carry excess into next-most-significant digit:
	- If the sum of $$w$$-bit (unsigned) integer value is too large to represent using a $$w$$-bit word, *overflow* occurs, in which the effective sum of integers $$a$$ and $$b$$ is $$a+b\pmod{2}$$.
- The addition of signed values takes the exact same procedures, the signed overflow implies that if the sum exceeds $$2^{w-1}-1$$ or is less than $$-2^{w-1}$$, it will become negative/positive correspondingly.
- The subtraction of two's complement is by inverting all bits then adding one, which is equivalent to subtracting from a bit-string consisting of all 1 bits.
- Shifts move the bits in a value some number of positions left or right. The bit shifted could be 0 or 1 depending on operand type:
	- Shift left by 1 bit is multiply by 2 and shift right by 1 bit is divide by 2.
	- Note that shifts are faster than actual CPU integer multiply and divide instructions.
	- Left shift into or past the sign bit are undefined behavior.
	- The right shift must identify if it is signed or not, else it will yield different behaviors.
- In size conversion, when integer values are converted to a different-size:
	- Unsigned/signed small to unsigned/signed large has value preserved.
	- Unsigned/signed large to unsigned/signed small could have value changed.
- Conversions between signed and unsigned type could generate surprising results.

### Floating-Point Representation
- The computers can also represent floating-point values, as $$\mathrm{ratio}\cong\mathrm{fraction}$$.
- Binary numbers can also be representing floating-point values.
- In IEEE 754 floating point standard, the *single precision* float uses 4 bytes.
- For a number $$\pm1.x\times 2^y$$, the sign bit records sign:
	- The first bit (31) is the bit representing the sign (0 is positive and 1 is negative).
	- The next 8 bits (30-23) are the bits representing the exponent.
	- The last 23 bits (22-0) are the bits representing the fractions (mantissa).
	- Note that the leading 1 is omitted as it contains no information.
- For double precision, there is 1 bit for sign, 11 bits for exponents, and 52 bits for fraction.
- In converting between binary and decimal floating points, we have:
	- $$x=1.abcd\times 2^y$$ for $$x = 1\cdot 2^y + a\cdot 2^{y-1} + b\cdot 2^{y-2} + c\cdot 2^{y-3}$$.
	- When converting decimals to binaries, the integer parts can first be converted, then each decimal digit can be get from the carry when multiplying by $$2$$.
- Special cases for floating-point representations:

|Exponent|Fraction|Object|
|:-:|:-:|:-:|
|0|0|zero|
|0|>0|denormalized number, which is $$0.x\times 2^{-126}$$
|1-254| anything| floating point number|
|255|0|infinity|
|255| >0| NaN (not a number)|

- In calculating additions with scientific notation, we first bring the two numbers the same as higher number:
	- During this process, the precision might lost for the more precise number.
	- Then, the calculation is made and the solution would be round then.
	- When normalizing the sum, when there is overflow or underflow, an Exception would be thrown.
- In calculating multiplication with scientific notation, we add their exponents and multiply their fraction. Eventually normalize the product by increasing or decreasing the exponent and set the sign:
	- If there is an overflow or underflow when normalizing, there will be an Exception.

# Basic Java Notes

## Basic Text Output

Java uses `System.out.*` statements to print a text to the screen.

### Unformatted Print

Print within the same line: `System.out.print();`

Print with a new line at the end: `System.out.println();`

### Formatted Print

Print formatted: `System.out.printf();` or `System.out.format();`

***Format specifiers and formatting***

| Format specifier	| Data type(s)	| Notes |
|:-----------------:|:-------------:|:------|
|`%c`	|char	|Prints a single Unicode character
|`%d`	|int, long, short	|Prints a decimal integer value.
|`%o`	|int, long, short	|Prints an octal integer value.
|`%h`	|int, char, long, short	|Prints a hexadecimal integer value.
|`%f`	|float, double	|Prints a floating-point value.
|`%e`	|float, double	|Prints a floating-point value in scientific notation.
|`%s`	|String	|Prints the characters in a String variable or literal.
|`%%`	|	|Prints the "%" character.
|`%n`	|	|Prints the platform-specific new-line character.

<br/>

|Sub-specifier	|Description	|
|:--------------:|:-----------|
|width	|Specifies the minimum number of characters to print. With longer characters, the value will be unchanged; with fewer characters, the output will be padded with spaces (or 0's if the '`0`' flag is specified).
|.precision |	(*For floating-point*:) Specifies the number of digits to print following the decimal point. The default precision of 6 is used. <br/> (*For String*:) Specifies the maximum number of characters to print, truncate the extra characters.
|flags	|`-`: Left aligns the output given the specified width, padding the output with spaces. <br/> `+`: Prints a preceding `+` sign for positive values. Negative numbers are always printed with the - sign. <br/> `0`: Pads the output with 0's when the formatted value has fewer characters than the width. <br/> space: Prints a preceding space for positive value.

<br/>

***Output Format***

```java
System.out.printf("%(flags1)(width1)(.precision1)specifier1...%(flags2)(width2)(.precision2)specifier2", var1, var2);
```

### Flushing Output

The PrintStream method `flush()` flushes the stream's buffer contents. `System.out.flush();` is called when a newline is printed. 

## Variables

In a program, a variable is a named item used to hold a value.

### Variable Assignments

An assignment assigns a variable with a value. That assignment means the variable is assigned with something, while keeping that value during subsequent assignments, until it is assigned again.

In programming, `=` is an assignment of a left-side variable with a right-side value.

***Reserved Keywords***

```java
abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while
```

***Constant Variables***

Constant variables, known as final variables, should not be chanced in the code by adding `final` before variable declaration.


### Primitives Type

A primitive type variable directly stores the data for that variable type.

`boolean`

- The boolean data type has only two possible values: `true` and `false`.
- Use this data type for simple flags that track true/false conditions.

`char`

- 16-bit Unicode character, ranging from `\u0000` (or 0) to `\uffff` (or 65,535 inclusive).
- For ASCII Table, `0` or numbers from `48`, `A` or capitalized letters from `65`, and `a` or lowercase letters from `97`.

`byte`, `short`, `int`, and `long`

- Used for integers.
- `byte`: 8-bit, range of $$[-128,127]$$.
- `short`: 16-bit, range of $$[-32768,32767]$$.
- `int`: 32-bit, range of $$[-2^{31},2^{31}-1]$$.
- `long`: 64-bit, range of $$[-2^{63},2^{63}-1]$$.

`float` and `double`

- Used for floating decimals.
- `float`: 32-bit, range of $$[-3.4\times10^{38},3.4\times10^{38}]$$.
- `double`: 64-bit, range of $$[-1.7\times10^{308},1.7\times10^{308}]$$.
- For floating-point, the comparison should use `Math.abs(a - b) < 0.0001`.

***Wrapper Class***
Java provides several wrapper classes that are built-in reference types that augment the primitive types. The wrapper class has the only field of primitive type with relations below.

|Primitive type| `char` | `int` | `double` | `boolean` | `long` |
|:------------:|:----:|:---:|:------:|:-------:|:----:|
|Wrapper Class| `Character` | `Integer` | `Double`| `Boolean` | `Long` |

***Overflow***

A variable cannot store a number larger than the maximum supported by the variable's data type. An overflow occurs when the value being assigned to a variable is greater than the maximum value the variable can store. This will error in being too large.

### Reference Type

- A reference type variable can refer to an instance of a class, also known as an object.
- `String` is a sequence of characters and a subclass of `Objects`.
- Reference type variable points to an `object` or an `array`.

## Classes

To use a class, a program must include an import statement that informs the compiler of the class' location.

### Math Class

From `java.lang.Math`, imported by defult.

Fields:

- `E`: $$e$$, the base of the natural logarithms.
- `PI`: $$\pi$$, the ratio of the circumference of a circle to its diameter.

Methods:

- `abs(int/double a)`: Returns the absolute value.
- `sqrt(int/double a)`, `cbrt(int/double a)`: Returns square root or cube root.
- `sin(int/double a)`, `asin(int/double a)`, `sinh(int/double a)` ...: Trigonometric functions.
- `exp(int/double a)`, `pow(int/double a, int/double b)`: Operator for exponential.

### Scanner Class

Import by `import java.util.Scanner;`.

Initialize by `Scanner keyboard = new Scanner(System.in);` for input.

Methods:

- `next()`, `nextInt()`, and `nextDouble()`: Finds and returns the next complete token as `String`, `int`, and `double`.
- `nextLine()`: Advances past the current line and returns the input that was skipped as `String`.
- `hasNext()`: Returns `true` the scanner has the next token. 
- `hasNextInt()` and `hasNextDouble()`: Returns `true` if the next token can be interpreted as a `int` and `double`.
- `hasNextLine()`: Returns true if there is another line in the input of this scanner.

### Random Class

Import by `import java.util.Random;`.

Initialize by `Random rand = new Random();`.

Methods:

- `nextInt()`: Returns a pusedorandom `int`.
- `nextdouble()`: Returns a pusedorandom uniformly distributed `double` value between 0.0(inclusive) and 1.0(exclusive).
- `nextGaussian()`: Returns a pusedorandom Gaussian distributed `double` value with mean 0.0 and standard deviation 1.0.
- `nextInt(int bound)`: Returns a pusedorandom `int` between 0 (inclusive) and the specified value (exclusive).  

### String Class

From `java.lang.String`, import by defult.

Methods:

- `charAt(int index)`: Returns the `char` value at the specified index.
- `compareTo(String anotherString)` and `compareToIgnoreCase(String str)`: Compares two strings lexicographically catching or ignoring cases. Return the subtraction of the first different character or the difference in length. Returns 0 if they are same; negative `int` if this string is lexicographically less; and positive `int` if this string is lexicographically greater.
- `concat(String str)`: Concatenates the specified string to the end of this string.
- `startsWith(String prefix)` and `endsWith(String suffix)`: Returns `true` if this string starts/ends with the specified prefix/suffix.
- `equals(Object anObject)` and `equalsIgnoreCase(String str)`: Returns `true` if it is a string and are the same matching or ignoring cases.
- `length()`: Returns the `int` length of this string.
- `indexOf(int/String ch)` and `lastIndexOf(int/String ch)`: Returns the `int` index within this string of the first/last occurrence of the specified. Returns `-1` if unfound.
- `indexOf(int/String ch, int fromIndex)` and `lastIndexOf(int/String ch, int fromIndex)`: Returns the `int` index within this string of the first/last occurrence of the specified, starting the search at the specified index.  Returns `-1` if unfound.
- `isEmpty()`: Returns `true` iff `length()` is `0`.
- `toCharArray()`: Converts this string to a new character array.
- `toUpperCase()` and `toLowerCase()`: Converts all of the characters in this String to upper/lower case.
- `replace(char oldChar, char newChar)`: Returns a string resulting from replacing all occurrences of `oldChar` in this string with `newChar`.
- `replaceAll(String regex, String replacement)` and `replaceFirst(String regex, String replacement)`: Replaces each/first substring of this string that matches the given regular expression with the given replacement.
- `trim()`: Returns a string whose value is this string, with any leading and trailing whitespace removed.

## Selection

In a program, a branch is a sequence of statements only executed under a certain condition. 

### If-Else If-Else-branch

```java
	if (expression) {
		// Statements
	} else if (expression) {
		// Statements
	} ... else {
		// Statements
	}
```

### Switch Statement
A switch statement can more clearly represent multi-branch behavior involving a variable being compared to constant values.

Omitting the break statement for a case will cause the statements within the next case to be executed. 

```java
switch (expression) {
   case constantExpr1: 
      // Statements
      break;
   case constantExpr2:
      // Statements
      break;
   ...
   default: // If no other case matches
      // Statements
      break;
}
```

### Order of Evaluation

In the code, the order is followed as:

- `()`: operations in the parentesis.
- `!` and `(casting)`: negation and casting.
- `*`, `/`, and `%`: multiplication, division, and modulus (`%` generates a negative residue with negative input).
- `+`, `-`: addition and subtraction.
- `<`, `>`, `<=`, and `>=`: relation operator.
- `==` and `!=`: equals and not equals.
- `&&`: and.
- `||`: or.
- `=`: variable assignment.

### DeMorgan's Law

- The negation of a disjunction is the conjunction of the negations.
- The negation of a conjunction is the disjunction of the negations.

Specifically, this means that `(!(A || B))` is equivalent to `(!A && !B)` and `(!(A && B))` is equivalent to `(!A || !B)`.

## Loops

Code that will be run repetitively until a specified condition is met.

### While Loop

A while loop repeatedly executes a list of sub-statements (loop body) while the loop's expression evaluates to true. Each loop is an iteration.

Once entering the loop body, execution continues to the body's end, even if the expression would become false midway through.

```java
	while (expression) {
		// Statements
}
```

### Do-While Loop

Do-While loop works like the while loop but the statement is excuted at least once.

```java
	do {
		// Statements
	} while (expression);
```

### For Loop

A for loop is a loop with three parts at the top: a loop variable initialization, a loop expression, and a loop variable update.

A for loop describes iterating a specific number of times more naturally than a while loop.

```java
	for (initialExpression; conditionExpression; updateExpression) {
		// Statements
	}
```

### Nested Loops

A nested loop is a loop that appears in the body of another loop. The nested loops are commonly referred to as the inner loop and outer loop.

### Break and Continue

A `break` statement in a loop causes an immediate exit of the loop. A break statement can sometimes yield a loop that is easier to understand.

A `continue` statement in a loop causes an immediate jump to the loop condition check. A continue statement can sometimes improve the readability of a loop.

## Method

A method is a named list of statements.

- A method definition consists of the new method's name and a block of statements.
- A method call is an invocation of a method's name, causing the method's statements to execute.
- The method's name can be any valid identifier. A block is a list of statements surrounded by braces.
- A method may return one value using a return statement and takes some parameters.

```java
	public static returnType methodName(paramType paramName, ...) {
		// Statements
	}
```

Each method call creates a new set of local variables, forming part of what is known as a stack frame. A return causes those local variables to be discarded.

- Primitive variables will not be changed but reference type variables will be modified if modified in the method.

### Recursion Methods

A method may call other methods, including calling itself. A method that calls itself is a recursive method.

### Method Overloading

Sometimes a program has two methods with the same name but differing in the number or types of parameters, known as method name overloading or just method overloading.

- The compiler determines which method to call based on the argument types.
- More than two same-named methods is allowed as long as each has distinct parameter types. 
- A method's return type does not influence overloading. Thus, having two same-named method definitions with the same parameter types but different return types still yield a compiler error.

### Testing

Testing tests if the code works properly.
The test involves:

- valid and invalid values,
- boundary cases and data ranges,
- literal (white-box) and random (black-box) values.

### Unit Testing

Each sub-routine should be throughly tested independent from the other sub-routines.

Apply Black-box and White-box testing to each unit.

### Regression Testing

Re-test the cases in the previous versions.

Apply the original test suite of the previous version.

### Black-box Testing

Program code is hidden from the testers.

Being comprehensive, meaning to throw as many testing to check if the output is the same as expected.

### White-box Testing

Program code known to the testers.

Throw targeted input at the code to throughly test all the excution branch that has been written in the program (i.e., all decisions, repetition between starting and ending values).

Test the correctness of the code that has been written thus far.

## File I/O

InputStream and OutputStream are necessary for information to flow in JAVA.

### FileInputStream Class

`FileInputStream` opens a file. The class can be imported by `import java.io.FileInputStream`.

`FileInputStream` could throw IOExceptions. The class can be imported by `import java.io.IOException`.

When methods includes `FileInputStream`, the method `throws IOException`.

Reading `FileInputStream` involves a `Scanner`, therefore meaning to be imported by `import java.util.Scanner`.

A `FileInputStream` is initialized and followed by:

```java
	FileInputStream fileInputStream = new FileInputStream(filename);
	Scanner inFS = new Scanner(fileInputStream);
```

Then, the `Scanner` can be read by the `Scanner` class.

Afterwards, the `Scanner` and `FileInputStream` can be closed by:

```java
	inFS.close();
	fileInputStream.close();
```

### FileOutputStrean Class

`FileOutputStream` writes a file. The class can be imported by `import java.io.FileOutputStream`.

`FileOutputStream` could throw IOExceptions. The class can be imported by `import java.io.IOException`.

When methods includes `FileOutputStream `, the method `throws IOException`.

Writing in a file involves `PrintWriter`, therefore meaning to be imported by `import java.io.PrintWriter`.

A `FileOutputStream ` is initialized and followed by:

```java
	FileOutputStream fileOutputStream = new FileOutputStream(filename);
	PrintWriter outFS = new PrintWriter(FileOutputStream);
```

Then, the `PrintWriter` can be written by the same approach of `System.out` class.

Afterwards, the `PrintWriter ` and `FileOutputStream ` can be closed by:

```java
	outFS.close();
	fileOutputStream.close();
```

## Arrays

An array is a special variable having one name, but storing a list of data items, with each item being directly accessible.

### 1-D Array

An array is an ordered list of items of a given data type. Each item in an array is called an element. It can be initialized by:

```java
	dataType[] arrayName = new dataType[numElements];
```

or 

```java
	dataType[] arrayName = {a, ..., c};
```

As a reference type, the array as a parameter of a method is modified in the function.

***Printing through loop:***

```java
	public static void print(arrayName.length) {
		System.out.print("[")
		for (int i = 0; i < arrayName.length; i++) {
			System.out.print(arrayName[i]);
			if (i != arrayName.length - 1) {
				System.out.print(", ");
			}
		}
		System.out.println("]");
	}
```

### Perfect Size Array

A perfect size array is an array where the number of elements is exactly equal to the memory allocated.

### Oversize Array

An oversize array is an array where the number of elements used is less than or equal to the memory allocated.

Since the number of elements used in an oversize array is usually less than the array's length, a separate integer variable is used to keep track of how many array elements are currently used.

The Oversize Array are initialized as:

```java
	dataType[] arrayName = new dataType[totalNumElements];
	int arrayNameLength = 0;
```

Oversize arrays are useful when the number of elements stored in the array is not known in advance, or when the number of elements stored in an array varies over time.

To assign a new element to the array, the approach is:

```java
	arrayName[arrayNameLength++] = newElement;
```

### 2-D Array

An array can be declared with two dimensions. `Object[][] myArray = new Object[R][C]` represents a table of int variables with `R` rows and `C` columns, so $$R\times C$$ elements total. 

Or the initialization can be:

{% raw %}

```java
	dataType[][] arrayName = {{a, ..., b}, ..., {c, ..., d}};
```

{% endraw %}

The definition, access, and intiialization works the same for higher dimensions.

When printing for searching values, there should be a nested for loop.

## Advanced Classes

Creating an object consists of two steps: declaring a reference variable of the class type, and assigning the variable with an explicitly allocated instance of the class type.

A reference variable can refer to an instance of a class.

The new operator explicitly allocates an object of the specified class type.

### Class Components

A class contains fields, constuctors, mutators, accessors, and helper methods.

Field:

- The fields are the place where information are stored. They can be declared in the field declaration. Any object created of that class type will initially have those values.
- Most fields are private and can be accessed through accessors.

Constructor:

- Constructor is called when an object of that class type is created, and which can be used to initialize all fields.
- The constructor has the same name as the class. The constructor method has no return type, not even void.
- The default constuctor takes in no input while overloading allows multiple constructors with different parameters as input.

Mutator:

- A mutator method may modify ("mutate") a class' fields.

Accessor:

- An accessor method accesses fields but may not modify a class' fields.

Helper Method:

- Helper Methods are private methods in the class that helps public methods carry out tasks.

### Derived Class

A derived class (or subclass) is a class that is derived from another class, called a base class (or superclass).

- Any class can be a base class.
- The derived class is said to inherit the properties of the base class, i.e., inheritance.
- An object declared of a derived class type has access to all the public members of the derived class as well as the public members of the base class.
- A derived class is declared by placing the keyword extends after the derived class name, followed by the base class name, as of `class Subclass extends Superclass {...}`.

With multiple classes, `this` refers to the fields or method in the current class, while `super` refers to the fields or method in the base class.

### Static and Non-Static

The data types are static and non-static.

***Static fields and method***

The variable is allocated in memory only once during a program's execution. Static variables reside in the program's static memory region and have a global scope. Thus, static variables can be accessed from anywhere in a program.

***Non-Static fields and method***

The variable are different for each instance of the data. The variables will change at different with the reference type to the same class.

### Accessibility

Access specifier specifies the accessibility of the data:


|Specifier	| Description|
|:-----------|:-----------|
|private	|Accessible by self.|
|protected	|Accessible by self, derived classes, and other classes in the same package.|
|public	|Accessible by self, derived classes, and everyone else.|
|no specifier	|Accessible by self and other classes in the same package.|

### Polymorphism

Polymorphism refers to determining which program behavior to execute depending on data types.

- Method overloading is a form of compile-time polymorphism wherein the compiler determines which of several identically-named methods to call based on the method's arguments.
- Runtime polymorphism is when the compiler cannot make the determination but instead during when the program is running.

***Is-a versus Has-a***

Is-a indicates a relationship of some class being a subclass extended from base class. Has-a indicates if the class is using other classes as fields.

### Object Class

All the classes extends from Object Class.

***Override and Overload***

Overrride means that a method is overriding another method from the base class with the same parameters.

Overload means that a method is overloading another method from the base class with different parameters.

***instanceof***

The real type and the container type of a variable can be different, but the real type must be the container type or its subclasses.

When testing if an `Object` is an instance of a class, use `var.instanceof(class)`.

If an `Object` is an instance of a class, we cast by `(class) var`.

## Alogrithm

An algorithm is a sequence of steps for accomplishing a task.

### Big O Notation

Big O notation is a mathematical way of describing how a function (running time) generally behaves in relation to the input size.

In Big O notation, all functions that have the same growth rate (as determined by the highest order term of the function) are characterized using the same Big O notation. All functions with the same growth rate are equivalent in Big O notation.

***Properties:***

- If *f*(x) is a sum of several terms, the highest order term (the one with the fastest growth rate) is kept and others are discarded.
- If *f*(x) has a term that is a product of several factors, all constants (those that are not in terms of x) are omitted.

***Growth rate:***

- $$O(1) < O(N) < O(N\log N) < O(N^2) < O(N^3) < \cdots < O(e^N)$$.
- Rules for determining Big O notation of composite functions:

| Composite function | $$C\cdot O(f(x))$$ | $$C+ O(f(x))$$ | $$g(x)\cdot O(f(x))$$ |  $$g(x)+O(f(x))$$ | 
|:------------------:|:-----:|:------:|:--:|:--:|
| Big O Notation     | $$O(f(x))$$ |  $$O(f(x))$$ | $$O(g(x)\cdot O(f(x)))$$ |  $$O(g(x)+O(f(x)))$$ |

### Sorting Algorithms

***Bubble Sort***

- Bubble sort is a sorting algorithm repeatedly switches the two consecutive elements if they are out of order from left to right.
- $$O(N^2)$$ Complexity.

```java
	int temp;
	for (i = 0; i < numbers.length - 1; ++i) {
		// Nested loop with less in search each iteration
		for (j = 1; j < numbers.length - i; ++j) {
			if (numbers[j-1] > numbers[j]) {
				// Swap numbers[j] and numbers[j-1]
				temp = numbers[j];
				numbers[j] = numbers[j-1];
				numbers[j-1] = temp;
			}
		}
	}
```

***Selection Sort***

- Selection sort is a sorting algorithm repeatedly selects the minimum value of the array from a certain index and switches the current index with the minimal value after it.
- $$O(N^2)$$ Complexity.

```java
	int temp;
	int indexSmallest;
	
	for (i = 0; i < numbers.length - 1; ++i) {
		   // Find index of smallest remaining element
	   indexSmallest = i;
	   for (j = i + 1; j < numbers.length; ++j) {
	      if (numbers[j] < numbers[indexSmallest]) {
	         indexSmallest = j;
	      }
	   }
	   // Swap numbers[i] and numbers[indexSmallest]
	   temp = numbers[i];
	   numbers[i] = numbers[indexSmallest];
	   numbers[indexSmallest] = temp;
	}
```

***Insertion Sort***

- Insertion sort is a sorting algorithm repeatedly inserts the next minimal value from an index into the that index.
- $$O(N^2)$$ Complexity.

```java
	for (i = 1; i < numbers.length; ++i) {
	  j = i;
	  // Insert numbers[i] into sorted part
	  // stopping once numbers[i] in correct position
	  while (j > 0 && numbers[j] < numbers[j - 1]) {
	   
	     // Swap numbers[j] and numbers[j - 1]
	     temp = numbers[j];
	     numbers[j] = numbers[j - 1];
	     numbers[j - 1] = temp;
	     --j;
	  }
	}
```

***Merge Sort***

- Merge sort is a sorting algorithm that divides a list into two halves, recursively sorts each half, and then merges the sorted halves to produce a sorted list.
- The recursive partitioning continues until a list of 1 element is reached, as list of 1 element is already sorted.
- $$O(N\log N)$$ Complexity.

```java
public static void merge(int [] numbers, int i, int j, int k) {
  int mergedSize = k - i + 1;       // Size of merged partition
  int mergedNumbers [] = new int[mergedSize];
  							// Temporary array for merged numbers
  int mergePos;           	// Position to insert merged number
  int leftPos;            	// Position of elements in left partition
  int rightPos;           	// Position of elements in right partition
  mergePos = 0;
  leftPos = i;            	// Initialize left partition position
  rightPos = j + 1;       	// Initialize right partition position
 // Add smallest element from left or right partition
  while (leftPos <= j && rightPos <= k) {
     if (numbers[leftPos] < numbers[rightPos]) {
        mergedNumbers[mergePos] = numbers[leftPos];
        ++leftPos;
     } 
     else {
        mergedNumbers[mergePos] = numbers[rightPos];
        ++rightPos;
     }
     ++mergePos;
  }
 // If left partition is not empty, add remaining elements
  while (leftPos <= j) {
     mergedNumbers[mergePos] = numbers[leftPos];
     ++leftPos;
     ++mergePos;
  }
 // If right partition is not empty, add remaining elements
  while (rightPos <= k) {
     mergedNumbers[mergePos] = numbers[rightPos];
     ++rightPos;
     ++mergePos;
  }
 // Copy merge number back to numbers
  for (mergePos = 0; mergePos < mergedSize; ++mergePos) {
     numbers[i + mergePos] = mergedNumbers[mergePos];
  }
}

public static void mergeSort(int [] numbers, int i, int k) {
  int j;
 if (i < k) {
     j = (i + k) / 2;  // Find the midpoint in the partition
    // Recursively sort left and right partitions
     mergeSort(numbers, i, j);
     mergeSort(numbers, j + 1, k);
    // Merge left and right partition in sorted order
     merge(numbers, i, j, k);
  }
}
```



### Searching Algorithms

***Linear Search***

- Linear search is a search algorithm that starts from the beginning of a list, and checks each element until the search key is found or the end of the list is reached.
- $$O(N)$$ Complexity.

```java
   public static int linearSearch(int [] numbers, int key) {
      int i;
      
      for (i = 0; i < numbers.length; ++i) {
         if (numbers[i] == key) {
            return i;
         }
      }
      
      return -1; /* not found */
   }
```

***Binary Search***

- If the desired contact comes alphabetically before the middle contact, binary search will then search the first half and otherwise the last half. Each step reduces the contacts that need to be searched by half.
- $$O(\log N)$$ Complexity.

```java
   private static int search(String[] data, String target,
                             int lo, int hi) {
      // possible target indices in [lo, hi)
      int middleIndex = (lo + hi) / 2;
      if (lo == hi) return -1;
      String middle = data[middleIndex];
      if (target.equals(middle)) {
         return middleIndex;
      }
      if (target.compareTo(middle) < 0) {
         return search(data, target, lo, middleIndex);
      }
      if (target.compareTo(middle) > 0) {
         return search(data, target, middleIndex + 1, hi);
      }
      return -1;
   }
```

## Exceptions

An exception is an unexpected incident that stops the normal execution of a program.

### Checked/Unchecked Exceptions

Checked Exceptions are the exceptions that are checked at compile time. If some code within a method throws a checked exception, then the method must either handle the exception or it must specify the exception using the throws keyword.

***List of checked exceptions*** 

* ClassNotFoundException,
* InterruptedException,
* InstantiationException,
* IOException,
* SQLException,
* IllegalAccessException,
* FileNotFoundException ...

Unchecked exceptions in Java are those exceptions that are checked by JVM, not by java compiler. They occur during the runtime of a program.

***List of unchecked exceptions***

* ArithmeticException,
* ClassCastException,
* NullPointerException,
* ArrayIndexOutOfBoundsException,
* NegativeArraySizeException,
* ArrayStoreException,
* IllegalThreadStateException,
* SecurityException ...

### Try-Catch Block

To avoid having a program end when an exception occurs, a program can use try and catch blocks to handle the exception during program execution.

- A try block surrounds normal code, which is exited immediately if a statement within the try block throws an exception.
- A catch block catches the thrown exception if its type matches the catch block's parameter type, the code within the catch block executes.
- A final block that will excute regardless if an exception is caught.

### Throwable Class

The `Throwable` class is the superclass of all errors and exceptions in the Java language. Only objects that are instances of this class can be errors or exceptions.

Only this class or one of its subclasses can be the argument type in a catch clause.

- `Throwable` can be constructed using empty parameter or `String` as messsage.
- `getMessage()`: Returns the detail message string of this throwable.
- `getStackTrace()`: Provides programmatic access to the stack trace information printed by `printStackTrace()` as `StackTraceElement[]`.
- `printStackTrace()`: Prints this throwable and its backtrace to the standard error stream.
- `toString()`: Returns a short description of this throwable.

### Exception Class

`Exception` class subclass of `Throwable` class.

- The class `Exception` and any subclasses that are not also subclasses of `RuntimeException` are checked exceptions.
- `RuntimeException` are unchecked exceptions that does not need `throws` declaration in methods.
- `Exception` can be constructed using empty parameter or `String` as messsage.
- Methods of `Exception` class are all inherited from `java.lang.Throwable` or `java.lang.Object`.

## Style

Each programming team has style guidelines for writing code.

### Whitespace

- Each statement usually appears on its own line.
- A blank line can separate conceptually distinct groups of statements, but related statements usually have no blank lines between them.
- Most items are separated by one space (and not less or more). No space precedes an ending semicolon.	
- Sub-statements are indented 3 spaces from parent statement. Tabs are not used as tabs may behave inconsistently if code is copied to different editors. 

### Braces

- For branches, loops, methods, or classes, opening brace appears at end of the item's line. Closing brace appears under item's start.
- For if-else, the else appears on its own line.
- Braces always used even if only one sub-statement.

### Naming	

- Variable/parameter names are camelCase, starting with lowercase.
- Constants use upper case and underscores (and at least two words).
- Variables usually declared early (not within code), and initialized where appropriate and practical.	
- Method names are camelCase with lowercase first.

### Code

- Lines of code are typically less than 80 characters wide.
- Each method should be within 150 lines.
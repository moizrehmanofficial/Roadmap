export interface CodeExample {
  language: string;
  code: string;
  title?: string;
}

export interface Concept {
  id: string;
  title: string;
  what: string;
  why: string;
  when: string;
  how: string;
  examples: CodeExample[];
  terms?: { term: string; definition: string }[];
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  concepts: Concept[];
}

export const topics: Topic[] = [
  {
    id: "javascript",
    title: "JavaScript",
    icon: "JS",
    color: "#f7df1e",
    description: "The foundation of web development",
    concepts: [
      {
        id: "variables",
        title: "Variables & Declarations",
        what: "Variables are named containers that store data values in memory. JavaScript has three ways to declare them: var, let, and const — each with different rules about scope and reassignment.",
        why: "Without variables, you cannot store or reuse any information. They are the single most fundamental building block of any program.",
        when: "Every time you need to save a value — user input, API result, counter, flag, configuration. Variables live in 'scope' — the region of code where they are accessible.",
        how: "Declare with var, let, or const followed by a name, then optionally assign a value with =. Always prefer const by default, use let when the value will change, and avoid var in modern code.",
        terms: [
          { term: "Declaration", definition: "Creating a variable name in memory (let x;)" },
          { term: "Initialization", definition: "Giving a variable its first value (let x = 5;)" },
          { term: "Assignment", definition: "Changing a variable's value after it's declared (x = 10;)" },
          { term: "Hoisting", definition: "JavaScript's behavior of moving var declarations to the top of their scope before code runs" },
          { term: "Scope", definition: "The region of code where a variable is accessible and usable" },
        ],
        examples: [
          {
            language: "javascript",
            title: "var — old way (avoid in modern code)",
            code: `// var is function-scoped and gets hoisted
var name = "Ali";
var name = "Ahmed"; // ✅ No error — var ALLOWS re-declaration (dangerous!)

// Hoisting example — var is mentally moved to the top
console.log(age); // undefined (NOT an error — this is the bug trap!)
var age = 25;
console.log(age); // 25

// var ignores block scope — this is why it's dangerous
if (true) {
  var leaksOut = "I escape the block!";
}
console.log(leaksOut); // "I escape the block!" — oops!`,
          },
          {
            language: "javascript",
            title: "let — block-scoped mutable variable",
            code: `// let respects block scope and can be reassigned
let score = 0;
score = 10; // ✅ Allowed — let CAN be reassigned

// Block scope — variable dies when the block ends
if (true) {
  let blockVar = "inside only";
  console.log(blockVar); // ✅ "inside only"
}
// console.log(blockVar); // ❌ ReferenceError — not accessible here

// Perfect for loop counters
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
// console.log(i); // ❌ ReferenceError — i is gone`,
          },
          {
            language: "javascript",
            title: "const — constant reference (use by default!)",
            code: `// const CANNOT be reassigned after declaration
const API_URL = "https://api.example.com";
// API_URL = "other"; // ❌ TypeError: Assignment to constant variable

// ⚠️ IMPORTANT: const objects/arrays CAN have their contents changed!
const user = { name: "Ali", age: 25 };
user.name = "Ahmed"; // ✅ ALLOWED — changing a property, not the variable
user.role = "admin"; // ✅ ALLOWED — adding a property
// user = {}; // ❌ ERROR — cannot reassign the variable itself

const colors = ["red", "green"];
colors.push("blue"); // ✅ ALLOWED — modifying array contents
// colors = []; // ❌ ERROR

// Use const for: config values, imported modules, object/array references
const MAX_RETRY = 3;
const baseURL = "https://api.example.com/v1";`,
          },
        ],
      },
      {
        id: "scope",
        title: "Scope & Closures",
        what: "Scope defines the region of code where a variable is accessible. Closure is when an inner function 'remembers' variables from its outer function even after the outer function has finished running.",
        why: "Scope prevents naming conflicts between variables. Closures enable powerful patterns like data privacy, factory functions, and React hooks under the hood.",
        when: "Scope applies everywhere you write code. Closures are used in event handlers, setTimeout callbacks, React's useState and useEffect, and any function returned from another function.",
        how: "JavaScript uses lexical scoping — scope is determined by where you WRITE the code, not where it runs. Inner functions can always access outer variables, but not vice versa.",
        terms: [
          { term: "Lexical Scope", definition: "Scope determined by code structure at write-time, not at runtime" },
          { term: "Closure", definition: "A function that retains access to its outer scope even after the outer function returns" },
          { term: "Scope Chain", definition: "JavaScript looks for variables starting at local scope, then moves up to parent scopes until global" },
        ],
        examples: [
          {
            language: "javascript",
            title: "The 3 types of scope",
            code: `// 1. GLOBAL SCOPE — accessible everywhere
const globalVar = "I'm everywhere";

function example() {
  console.log(globalVar); // ✅ works
}

// 2. FUNCTION SCOPE — only inside the function
function myFunction() {
  var functionScoped = "only in here";
  console.log(functionScoped); // ✅ works
}
// console.log(functionScoped); // ❌ ReferenceError

// 3. BLOCK SCOPE — only inside {}
{
  const blockScoped = "only in this block";
  let alsoBlock = "me too";
  console.log(blockScoped); // ✅ works
}
// console.log(blockScoped); // ❌ ReferenceError`,
          },
          {
            language: "javascript",
            title: "Closures — function remembers its birthplace",
            code: `// Inner function remembers outer function's variables
function createCounter() {
  let count = 0; // this variable is "closed over"
  
  return function() {
    count++; // accesses count even after createCounter() finished!
    return count;
  };
}

const counter = createCounter(); // createCounter() has returned
console.log(counter()); // 1
console.log(counter()); // 2 — count is remembered!
console.log(counter()); // 3

// Real-world: React useState uses closures internally
// Each component instance has its own closed-over state

// Practical closure example
function makeMultiplier(multiplier) {
  return (number) => number * multiplier; // closes over multiplier
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15`,
          },
        ],
      },
      {
        id: "data-types",
        title: "Data Types",
        what: "Data types define what kind of value a variable holds. JavaScript has 7 primitive types (string, number, boolean, null, undefined, bigint, symbol) and reference types (objects, arrays, functions).",
        why: "JavaScript needs to know whether '5' means text or a number — so it knows if '5' + 1 = '51' or 6. Understanding types prevents bugs and unexpected behavior.",
        when: "Every time you create a variable or compare values. Type coercion (automatic type conversion) happens in comparisons and operations.",
        how: "Use typeof to check types. Use === (strict equality) instead of == to avoid type coercion bugs. Use Array.isArray() to check for arrays since typeof [] returns 'object'.",
        terms: [
          { term: "Primitive", definition: "Immutable value types: string, number, boolean, null, undefined, bigint, symbol. Stored directly in memory." },
          { term: "Reference Type", definition: "Objects/Arrays stored by reference in memory. Two variables can point to the same object." },
          { term: "Type Coercion", definition: "JavaScript automatically converting one type to another (e.g., '5' + 1 = '51')" },
          { term: "Strict Equality (===)", definition: "Compares both value AND type without coercion. Always prefer over ==" },
        ],
        examples: [
          {
            language: "javascript",
            title: "All 7 primitive types",
            code: `// 1. String — text wrapped in quotes
const name = "Ali";
const greeting = 'Hello';
const template = \`My name is \${name}\`; // template literal

// 2. Number — integers and decimals (one type!)
const age = 25;
const price = 9.99;
const negative = -10;
const infinity = Infinity;
const notNumber = NaN; // "Not a Number" — result of invalid math

// 3. Boolean — only true or false
const isActive = true;
const isLoggedIn = false;

// 4. undefined — variable declared but NOT assigned
let unassigned;
console.log(unassigned); // undefined

// 5. null — INTENTIONAL absence of a value
const data = null; // you deliberately set it to nothing

// 6. BigInt — very large integers (rare, for finance/crypto)
const bigNumber = 9007199254740991n; // n suffix makes it BigInt

// 7. Symbol — unique identifier (rare, advanced)
const id = Symbol("id");
const anotherId = Symbol("id");
console.log(id === anotherId); // false — Symbols are always unique`,
          },
          {
            language: "javascript",
            title: "Type checking and coercion gotchas",
            code: `// typeof checks
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object" ← Famous JS bug! Don't use typeof for null
typeof []          // "object" ← Use Array.isArray() instead
typeof {}          // "object"
typeof function(){}// "function"

// Check for null specifically
const value = null;
value === null; // ✅ true — correct way

// Check for array
Array.isArray([1, 2, 3]); // ✅ true
Array.isArray("hello");   // false

// ⚠️ Type coercion traps with ==
0 == false   // true  ← BAD SURPRISE
1 == "1"     // true  ← BAD SURPRISE
null == undefined // true ← BAD SURPRISE

// ✅ Always use === (strict equality)
0 === false  // false ← correct behavior
1 === "1"    // false ← correct behavior`,
          },
        ],
      },
      {
        id: "functions",
        title: "Functions — All Forms",
        what: "A function is a reusable named block of code that performs a specific task. It can accept inputs (parameters), execute logic, and return an output value.",
        why: "Functions are the primary tool for avoiding code repetition (DRY principle) and creating abstraction. They allow you to name a process and call it anytime.",
        when: "Whenever you have logic you use more than once, or logic complex enough to deserve a name. In React, every component is a function.",
        how: "Define once with function keyword or arrow syntax, call many times. Parameters go in (), body in {}, return sends a value back to the caller.",
        terms: [
          { term: "Parameter", definition: "Variable in function definition: function greet(name) — name is a parameter" },
          { term: "Argument", definition: "Actual value passed when calling: greet('Ali') — 'Ali' is the argument" },
          { term: "Return value", definition: "The value a function sends back with the return keyword" },
          { term: "Pure function", definition: "Always returns same output for same input, no side effects — predictable and testable" },
          { term: "Callback", definition: "A function passed as an argument to another function, to be called later" },
          { term: "Higher-order function", definition: "A function that takes another function as argument or returns one (map, filter, reduce)" },
        ],
        examples: [
          {
            language: "javascript",
            title: "4 ways to write a function",
            code: `// 1. FUNCTION DECLARATION — hoisted, can call before definition
function greet(name) {
  return "Hello, " + name;
}
console.log(greet("Ali")); // "Hello, Ali"

// 2. FUNCTION EXPRESSION — NOT hoisted, stored in variable
const greetExpr = function(name) {
  return "Hello, " + name;
};

// 3. ARROW FUNCTION — modern, concise, no own "this"
const greetArrow = (name) => {
  return "Hello, " + name;
};

// 4. ARROW — short form (single expression = implicit return)
const greetShort = (name) => "Hello, " + name;

// One parameter — parens optional
const double = n => n * 2;
console.log(double(5)); // 10

// No parameters — parens required
const sayHi = () => "Hi!";`,
          },
          {
            language: "javascript",
            title: "Default params, rest, spread, callbacks",
            code: `// Default parameters
function greet(name = "World", greeting = "Hello") {
  return \`\${greeting}, \${name}!\`;
}
greet();            // "Hello, World!"
greet("Ali");       // "Hello, Ali!"
greet("Ali", "Hey") // "Hey, Ali!"

// Rest parameters — collect remaining args into array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10

// Spread — expand array into arguments
const nums = [3, 1, 4, 1, 5, 9];
Math.max(...nums); // 9 (same as Math.max(3, 1, 4, 1, 5, 9))

// Callback — function passed to another function
[1, 2, 3].forEach(function(num) {
  console.log(num);
});

// Arrow callback (most common form)
[1, 2, 3].map(num => num * 2); // [2, 4, 6]

// Higher-order function — returns a function
const makeAdder = (x) => (y) => x + y;
const add5 = makeAdder(5);
add5(3); // 8
add5(10); // 15`,
          },
        ],
      },
      {
        id: "arrays",
        title: "Arrays & Array Methods",
        what: "An array is an ordered, zero-indexed list of values. Array methods are built-in functions to transform, filter, search, and iterate over arrays without manual loops.",
        why: "API responses are almost always arrays. React renders lists from arrays. Array methods like .map(), .filter(), .reduce() are used in every React component you will ever write.",
        when: "Any time you work with lists of things — users, products, posts, search results. Learn these methods before anything else, they appear in every interview and every codebase.",
        how: "Access items by index: arr[0]. Use methods chained: arr.filter(x => x > 5).map(x => x * 2). Most methods return new arrays — they do NOT mutate the original.",
        examples: [
          {
            language: "javascript",
            title: "The 8 methods you'll use every single day",
            code: `const users = [
  { id: 1, name: "Ali",   age: 25, role: "admin" },
  { id: 2, name: "Ahmed", age: 30, role: "user"  },
  { id: 3, name: "Sara",  age: 22, role: "user"  },
  { id: 4, name: "Omar",  age: 28, role: "admin" },
];

// .map() — TRANSFORM each item, returns NEW array of same length
const names = users.map(user => user.name);
// ["Ali", "Ahmed", "Sara", "Omar"]

const cards = users.map(user => ({
  ...user,
  displayName: user.name.toUpperCase(),
}));

// .filter() — KEEP items that pass the test
const admins = users.filter(user => user.role === "admin");
// [{ id: 1, name: "Ali"... }, { id: 4, name: "Omar"... }]

// .find() — FIRST item that passes (or undefined)
const ali = users.find(user => user.name === "Ali");

// .findIndex() — INDEX of first match (or -1)
const idx = users.findIndex(user => user.id === 3); // 2

// .reduce() — reduce to a SINGLE value
const totalAge = users.reduce((sum, user) => sum + user.age, 0); // 105
const byId = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {}); // { 1: {...}, 2: {...} }

// .some() — true if AT LEAST ONE passes
users.some(user => user.role === "admin"); // true

// .every() — true if ALL pass
users.every(user => user.age > 18); // true

// .includes() — check if value exists (for primitives)
["a", "b", "c"].includes("b"); // true`,
          },
          {
            language: "javascript",
            title: "Spread, rest, destructuring with arrays",
            code: `// Spread — copy or merge arrays
const original = [1, 2, 3];
const copy = [...original]; // independent copy

const merged = [...original, 4, 5]; // [1, 2, 3, 4, 5]
const prepended = [0, ...original]; // [0, 1, 2, 3]

// Array destructuring — extract values by position
const [first, second, ...rest] = [10, 20, 30, 40, 50];
// first = 10, second = 20, rest = [30, 40, 50]

// Skip items
const [, , third] = [10, 20, 30]; // third = 30

// Swap variables without temp variable!
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1

// Chaining methods (very common in React)
const result = users
  .filter(user => user.age >= 25)    // keep 25+
  .map(user => user.name)            // extract names
  .sort()                            // alphabetical
  .join(", ");                       // "Ahmed, Ali, Omar"`,
          },
        ],
      },
      {
        id: "objects",
        title: "Objects & Destructuring",
        what: "An object is a collection of key-value pairs that groups related data and functionality. Keys are strings (or symbols), values can be anything.",
        why: "Objects model real-world entities. Every API response, React props, component state, and database row is an object. Mastering objects is essential.",
        when: "Constantly. config objects, API response parsing, component props, function parameters that accept options, state management.",
        how: "Create with {} syntax. Access with dot notation (obj.key) or bracket notation (obj['key']). Destructure to extract values into variables cleanly.",
        examples: [
          {
            language: "javascript",
            title: "Objects: creation, access, methods",
            code: `// Object literal
const user = {
  id: 1,
  name: "Ali",
  age: 25,
  isAdmin: false,
  address: {              // nested object
    city: "Rawalpindi",
    country: "Pakistan"
  },
  greet() {               // method (function as property)
    return \`Hi, I'm \${this.name}\`;
  }
};

// Accessing properties
user.name;             // "Ali" — dot notation
user["age"];           // 25 — bracket notation (dynamic keys)
user.address.city;     // "Rawalpindi" — nested access

// Dynamic key access
const key = "name";
user[key];             // "Ali" — variable as key

// Modifying
user.age = 26;         // change existing
user.email = "ali@example.com"; // add new property
delete user.isAdmin;   // remove property

// Check if property exists
"name" in user;        // true
user.hasOwnProperty("age"); // true`,
          },
          {
            language: "javascript",
            title: "Destructuring, spread, computed keys",
            code: `const user = { name: "Ali", age: 25, role: "admin", city: "Rawalpindi" };

// Basic destructuring
const { name, age } = user;
console.log(name); // "Ali"

// Rename while destructuring
const { name: fullName, age: years } = user;
console.log(fullName); // "Ali"

// Default values
const { role = "user", theme = "dark" } = user;
// role = "admin" (from object), theme = "dark" (default)

// Nested destructuring
const { address: { city } = {} } = user; // safe nested

// Rest in destructuring
const { name: n, ...rest } = user;
// n = "Ali", rest = { age: 25, role: "admin", city: "Rawalpindi" }

// Spread to clone/merge
const updated = { ...user, age: 26 }; // clone + override
const merged = { ...user, ...{ theme: "dark" } };

// Computed property names
const field = "username";
const dynamic = { [field]: "ali123" }; // { username: "ali123" }

// Shorthand when variable name = key name
const name2 = "Ali";
const age2 = 25;
const person = { name2, age2 }; // same as { name2: name2, age2: age2 }`,
          },
        ],
      },
      {
        id: "async",
        title: "Async JavaScript",
        what: "Asynchronous code allows operations (API calls, file reads, timers) to run without blocking the rest of the program. JavaScript is single-threaded, so async patterns are critical.",
        why: "Without async, a single network request would freeze your entire UI for seconds. Async lets your app stay responsive while waiting for slow operations.",
        when: "Every API call, database query, file operation, timer, or any operation that takes time. In React + Next.js this is used constantly.",
        how: "Use async/await syntax. Mark a function with async, then await any Promise-returning call. Wrap in try/catch for error handling.",
        terms: [
          { term: "Promise", definition: "An object representing a future value. Has three states: pending, fulfilled, rejected" },
          { term: "async function", definition: "A function that automatically returns a Promise. Allows use of await inside it" },
          { term: "await", definition: "Pauses execution inside an async function until a Promise resolves. Like 'wait for this to finish'" },
          { term: "Event Loop", definition: "JavaScript's mechanism for handling async operations. The call stack, web APIs, and callback queue work together" },
        ],
        examples: [
          {
            language: "javascript",
            title: "Promises → async/await (modern way)",
            code: `// OLD WAY: Promise chains (callback hell)
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(response => response.json())
  .then(user => {
    console.log(user);
    return fetch(\`/api/posts?userId=\${user.id}\`);
  })
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error(error)); // one catch for all

// ✅ MODERN WAY: async/await — reads like synchronous code
async function fetchUserAndPosts(userId) {
  try {
    // await pauses here until response comes back
    const userResponse = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
    
    if (!userResponse.ok) {
      throw new Error(\`HTTP error! status: \${userResponse.status}\`);
    }
    
    const user = await userResponse.json(); // await again for parsing
    console.log("User:", user);
    
    const postsResponse = await fetch(\`https://jsonplaceholder.typicode.com/posts?userId=\${userId}\`);
    const posts = await postsResponse.json();
    console.log("Posts:", posts);
    
    return { user, posts };
    
  } catch (error) {
    console.error("Something went wrong:", error.message);
    throw error; // re-throw so caller can handle it
  }
}

// Call async function
fetchUserAndPosts(1);`,
          },
          {
            language: "javascript",
            title: "Parallel async with Promise.all",
            code: `// Running multiple async operations in PARALLEL
async function fetchDashboardData(userId) {
  try {
    // ❌ Sequential — slow! Each waits for previous
    // const user = await getUser(userId);
    // const posts = await getPosts(userId);
    // const comments = await getComments(userId);
    
    // ✅ Parallel — all 3 start at the same time!
    const [user, posts, comments] = await Promise.all([
      fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`).then(r => r.json()),
      fetch(\`https://jsonplaceholder.typicode.com/posts?userId=\${userId}\`).then(r => r.json()),
      fetch(\`https://jsonplaceholder.typicode.com/comments?postId=1\`).then(r => r.json()),
    ]);
    
    // All three are done by this line
    return { user, posts, comments };
    
  } catch (error) {
    // Promise.all rejects if ANY promise fails
    console.error(error);
  }
}

// Promise.allSettled — doesn't fail if one rejects
const results = await Promise.allSettled([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/broken-endpoint').then(r => r.json()),
]);
// results[0] = { status: 'fulfilled', value: [...] }
// results[1] = { status: 'rejected', reason: Error }`,
          },
        ],
      },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript",
    icon: "TS",
    color: "#3178c6",
    description: "JavaScript with superpowers",
    concepts: [
      {
        id: "basic-types",
        title: "Basic Types & Annotations",
        what: "TypeScript adds static type annotations to JavaScript. You tell TypeScript what type each variable, parameter, and return value should be — and it catches mismatches before your code runs.",
        why: "Catches bugs at compile time instead of runtime. Provides IDE autocomplete and documentation. Makes large codebases maintainable. Required in most modern React/Next.js projects.",
        when: "In any TypeScript file (.ts or .tsx). Type annotations are optional but recommended everywhere. TypeScript can infer many types automatically.",
        how: "Add : type after variable names, parameters, and function signatures. TypeScript infers types when possible — only annotate when inference isn't clear.",
        examples: [
          {
            language: "typescript",
            title: "Core type annotations",
            code: `// TypeScript infers types automatically — you don't always need to annotate
let name = "Ali";          // inferred as string
let age = 25;              // inferred as number
let active = true;         // inferred as boolean

// Explicit annotations
let username: string = "Ali";
let score: number = 100;
let isLoggedIn: boolean = false;
let data: null = null;
let x: undefined = undefined;

// Arrays
let scores: number[] = [90, 85, 92];
let names: string[] = ["Ali", "Ahmed"];
let mixed: (string | number)[] = ["Ali", 25]; // union type in array

// Tuple — fixed length array with specific types at each position
let point: [number, number] = [10, 20];
let person: [string, number] = ["Ali", 25];

// any — escape hatch, avoid!
let anything: any = "could be anything";
anything = 42;            // no error — any allows this
anything.foo.bar;         // no error — TypeScript gives up on checking

// unknown — safer than any
let value: unknown = getData();
if (typeof value === "string") {
  console.log(value.toUpperCase()); // ✅ must check type first
}

// void — function that returns nothing
function logMessage(msg: string): void {
  console.log(msg);
  // no return statement needed
}

// never — function that NEVER returns (throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
}`,
          },
        ],
      },
      {
        id: "interfaces",
        title: "Interfaces & Type Aliases",
        what: "Interfaces and type aliases define the SHAPE of objects — what properties they must have and their types. Think of them as contracts that objects must fulfill.",
        why: "Ensures every object of that 'shape' has required fields, catching missing or wrongly-typed data instantly. Makes APIs self-documenting.",
        when: "For any object with multiple properties: component props, API responses, function parameters, database row shapes.",
        how: "Use interface for object shapes (extensible, can be merged). Use type for unions, primitives, tuples, or when you need advanced type features.",
        terms: [
          { term: "Optional property (?)", definition: "Property that may or may not exist: name?: string" },
          { term: "Readonly", definition: "Property that cannot be changed after creation: readonly id: number" },
          { term: "Union type (|)", definition: "Value can be one of several types: string | number" },
          { term: "Intersection type (&)", definition: "Value must satisfy ALL types: TypeA & TypeB" },
          { term: "Literal type", definition: "Exact value as a type: 'admin' | 'user' instead of just string" },
        ],
        examples: [
          {
            language: "typescript",
            title: "interface — object contracts",
            code: `// Basic interface
interface User {
  id: number;           // required
  name: string;         // required
  email: string;        // required
  role?: "admin" | "user"; // ? = optional, literal union type
  readonly createdAt: Date; // readonly = cannot change after creation
}

// Using the interface
function greetUser(user: User): string {
  return \`Hello, \${user.name} (\${user.role ?? "user"})\`;
}

const u: User = {
  id: 1,
  name: "Ali",
  email: "ali@example.com",
  createdAt: new Date(),
  // role is optional so we can omit it
};

// u.createdAt = new Date(); // ❌ Error: cannot assign to 'createdAt' — readonly

// Extending interfaces
interface AdminUser extends User {
  permissions: string[];
  lastLogin: Date;
}

// Implementing multiple interfaces
interface Serializable {
  toJSON(): string;
}

interface Printable {
  print(): void;
}

interface Document extends Serializable, Printable {
  title: string;
  content: string;
}`,
          },
          {
            language: "typescript",
            title: "type aliases — more flexible",
            code: `// Type alias for primitives and unions
type ID = string | number;
type Status = "active" | "inactive" | "pending";
type Direction = "up" | "down" | "left" | "right";

// Type alias for objects (similar to interface)
type Point = {
  x: number;
  y: number;
};

// Intersection types — combine types
type Employee = {
  employeeId: number;
  department: string;
};

type UserEmployee = User & Employee; // must have ALL fields from both

// Conditional types (advanced)
type IsString<T> = T extends string ? "yes" : "no";
type Result = IsString<string>; // "yes"

// Key differences: interface vs type
// ✅ interface: can be extended with 'extends', can be merged
// ✅ type: can use unions (|), intersections (&), computed types

// Best practice:
// → Use 'interface' for object shapes you'll extend/implement
// → Use 'type' for unions, primitives, tuples, computed types

// Function types
type Formatter = (value: string) => string;
const uppercase: Formatter = (s) => s.toUpperCase();

// Callback type
type OnChange = (event: React.ChangeEvent<HTMLInputElement>) => void;`,
          },
        ],
      },
      {
        id: "generics",
        title: "Generics",
        what: "Generics allow writing functions, classes, and interfaces that work with ANY type while still being type-safe. The type becomes a parameter.",
        why: "Without generics, you'd either write the same code 10 times for 10 types, or use 'any' and lose all type safety. Generics give you flexibility AND safety.",
        when: "Writing utility functions, API wrappers, data structures, reusable hooks, or any code that should work for multiple types.",
        how: "Use <T> syntax. T (or any letter) is a type variable. TypeScript infers the type when you call the function, or you can specify it explicitly.",
        examples: [
          {
            language: "typescript",
            title: "Generics in functions and interfaces",
            code: `// WITHOUT generics — must write for each type
function getFirstNumber(arr: number[]): number { return arr[0]; }
function getFirstString(arr: string[]): string { return arr[0]; }

// WITH generics — write once, works for any type
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// TypeScript infers the type automatically
getFirst([1, 2, 3]);          // TypeScript knows: returns number
getFirst(["a", "b", "c"]);    // TypeScript knows: returns string
getFirst([{ id: 1 }]);        // TypeScript knows: returns { id: number }

// Or specify explicitly
getFirst<string>(["a", "b"]); // explicit type argument

// Generic with constraint — T must have id property
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Works for any object that has an id!
findById(users, 1);    // ✅ User has id
findById(products, 5); // ✅ Product has id

// Generic interface — super useful for API responses!
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

// One interface, infinite uses
type UsersResponse = ApiResponse<User[]>;
type UserResponse = ApiResponse<User>;
type ProductResponse = ApiResponse<Product>;

// Generic React component (in TypeScript)
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}`,
          },
        ],
      },
      {
        id: "utility-types",
        title: "Utility Types",
        what: "Built-in TypeScript types that transform existing types into new ones. They save you from manually writing common type transformations.",
        why: "Avoid rewriting type definitions. Make your types expressive and correct. Express intent clearly: 'this is a partial User' vs redeclaring everything as optional.",
        when: "Frequently in real projects: form types, API endpoints, component props variations, state management.",
        how: "Use as generic wrappers around existing types: Partial<User>, Pick<User, 'id' | 'name'>, etc.",
        examples: [
          {
            language: "typescript",
            title: "The most useful utility types",
            code: `interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

// Partial<T> — all properties become optional
// Perfect for UPDATE operations where you only send changed fields
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; ... }

async function updateUser(id: number, changes: Partial<User>) {
  // changes might only have { name: "New Name" }
}

// Required<T> — all optional become required
type RequiredUser = Required<User>; // removes all ?

// Pick<T, Keys> — select specific properties
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit<T, Keys> — exclude specific properties
type UserWithoutDates = Omit<User, "createdAt">;
// { id, name, email, role } — no createdAt

type NewUser = Omit<User, "id" | "createdAt">;
// { name, email, role } — for creating new user (no id yet)

// Record<Keys, Type> — object with specific key/value types
type RolePermissions = Record<"admin" | "user", string[]>;
const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  user: ["read"],
};

// ReturnType<T> — extract return type of function
async function getUser() { return { id: 1, name: "Ali" }; }
type FetchedUser = Awaited<ReturnType<typeof getUser>>;
// { id: number; name: string }

// Readonly<T> — prevent mutation
type ReadonlyUser = Readonly<User>;
const frozen: ReadonlyUser = { id: 1, name: "Ali", /* ... */ };
// frozen.name = "X"; // ❌ Error: cannot assign to readonly property`,
          },
        ],
      },
    ],
  },
  {
    id: "react",
    title: "React",
    icon: "⚛",
    color: "#61dafb",
    description: "Building interactive UIs",
    concepts: [
      {
        id: "components",
        title: "Components & JSX",
        what: "A component is a reusable function that returns JSX — an HTML-like syntax embedded in JavaScript. React UIs are built entirely from composing components.",
        why: "Components enable reusability and encapsulation. Build a Button once, use it everywhere with different props. Each component manages its own appearance and logic.",
        when: "Everything in React is a component: the whole page, the header, a button, a modal, a form input. If it appears on screen, it's a component.",
        how: "Write a function with PascalCase name that returns JSX. Export it. Import and use it like an HTML tag.",
        terms: [
          { term: "JSX", definition: "JavaScript XML — HTML-like syntax in JS files. Compiled to React.createElement() calls by Babel" },
          { term: "PascalCase", definition: "Naming convention for components: MyButton, UserCard. React distinguishes components from HTML tags by capitalization" },
          { term: "Fragment (<>)", definition: "Wrapper that lets you return multiple elements without adding extra DOM nodes" },
          { term: "Children", definition: "Content passed between component tags: <Card>This is children</Card>" },
        ],
        examples: [
          {
            language: "tsx",
            title: "Your first component",
            code: `// components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

// Component = function that returns JSX
function Button({ label, onClick, variant = "primary", disabled = false }: ButtonProps) {
  const styles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    // className instead of class
    // onClick handler in camelCase
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`px-4 py-2 rounded font-medium \${styles[variant]} \${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }\`}
    >
      {label}  {/* JavaScript expressions in {} */}
    </button>
  );
}

// JSX rules:
// ✅ Must return single root element (or Fragment <>)
// ✅ className instead of class
// ✅ htmlFor instead of for (on labels)
// ✅ All tags must be closed: <img /> <br />
// ✅ JavaScript in { curly braces }
// ✅ Component names MUST be PascalCase

// Usage in another component
function App() {
  return (
    <>  {/* Fragment — no extra DOM node */}
      <Button label="Save" onClick={() => console.log("saved")} />
      <Button label="Delete" variant="danger" onClick={() => {}} />
      <Button label="Loading..." disabled />
    </>
  );
}

export default Button;`,
          },
        ],
      },
      {
        id: "useState",
        title: "useState",
        what: "useState is a React Hook that lets a component declare and update its own internal data. When state changes, React automatically re-renders the component with the new data.",
        why: "Without state, UIs are static. State enables interactivity — counters, form inputs, toggle menus, fetched data, loading states.",
        when: "Any time data inside a component changes over time and the UI should reflect those changes: user input, toggles, counters, async data, error states.",
        how: "Call useState(initialValue) inside your component. It returns [currentValue, setterFunction]. ALWAYS use the setter to update — never mutate state directly.",
        terms: [
          { term: "Re-render", definition: "React calls your component function again with new state values and updates the DOM" },
          { term: "Setter function", definition: "The second item from useState — call it to update state and trigger re-render" },
          { term: "Functional update", definition: "Pass a function to setter: setState(prev => prev + 1). Use when new state depends on old state" },
          { term: "State batching", definition: "React groups multiple setState calls into one re-render for performance" },
        ],
        examples: [
          {
            language: "tsx",
            title: "useState fundamentals",
            code: `"use client"; // Must be client component for hooks
import { useState } from "react";

// 1. Simple counter
function Counter() {
  // [current value, function to update it]
  const [count, setCount] = useState(0); // 0 = initial value
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// 2. Toggle state
function Toggle() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? "Close" : "Open"} Menu
      </button>
      {isOpen && <nav>Menu content here</nav>}
    </div>
  );
}

// 3. Object state — ALWAYS spread to update
function UserForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "user",
  });

  // ✅ Correct — spread existing state, override specific field
  const updateField = (field: string, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  // ❌ Wrong — mutating state directly
  // user.name = "Ali"; // This does NOT cause a re-render!

  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => updateField("name", e.target.value)}
      />
      <input
        value={user.email}
        onChange={(e) => updateField("email", e.target.value)}
      />
    </form>
  );
}`,
          },
        ],
      },
      {
        id: "useEffect",
        title: "useEffect",
        what: "useEffect lets you run side effects after rendering — things like fetching data, setting up subscriptions, updating the document title, or integrating with non-React libraries.",
        why: "React components should be pure functions (no side effects during render). useEffect is React's dedicated place for code that needs to interact with the outside world.",
        when: "Fetching data on component mount, listening to events, syncing with localStorage, setting up timers, updating page title. The dependency array controls WHEN it runs.",
        how: "useEffect(callback, [dependencies]). Empty [] = run once on mount. [id] = run when id changes. No array = run after every render (usually wrong).",
        examples: [
          {
            language: "tsx",
            title: "useEffect patterns",
            code: `"use client";
import { useState, useEffect } from "react";

// Pattern 1: Fetch data on mount
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // [] = run once when component appears (mounts)
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []); // empty array = run once

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Pattern 2: Re-fetch when a dependency changes
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]); // re-runs whenever userId changes

  return <div>{user?.name}</div>;
}

// Pattern 3: Cleanup (event listeners, subscriptions)
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    // Cleanup function — runs when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // only set up once

  return <p>Window width: {width}px</p>;
}`,
          },
        ],
      },
      {
        id: "hooks-advanced",
        title: "useContext, useRef, useMemo, useCallback",
        what: "Advanced hooks for sharing state globally (useContext), referencing DOM nodes (useRef), caching values (useMemo), and caching functions (useCallback).",
        why: "These solve specific performance and architecture problems: avoid prop drilling, access DOM directly, prevent unnecessary re-calculations and re-renders.",
        when: "useContext: global state like auth/theme. useRef: DOM access, storing values without re-render. useMemo: expensive calculations. useCallback: stable function references for child components.",
        how: "Each hook has a specific signature. useContext reads from a Provider. useRef returns a mutable .current. useMemo/useCallback take a function and dependency array.",
        examples: [
          {
            language: "tsx",
            title: "useContext — avoid prop drilling",
            code: `"use client";
import { createContext, useContext, useState } from "react";

// 1. Create the context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 2. Create provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const data = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then(r => r.json());
    setUser(data.user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook for easy consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}

// 4. Use anywhere in the tree — no prop drilling!
function Header() {
  const { user, logout } = useAuth();
  return (
    <header>
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
}`,
          },
          {
            language: "tsx",
            title: "useRef, useMemo, useCallback",
            code: `"use client";
import { useRef, useMemo, useCallback, useState } from "react";

// useRef — 1. DOM access
function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focusInput = () => {
    inputRef.current?.focus(); // directly access DOM element
  };
  
  return (
    <>
      <input ref={inputRef} type="text" placeholder="Search..." />
      <button onClick={focusInput}>Focus Search</button>
    </>
  );
}

// useRef — 2. Store value without triggering re-render
function Timer() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const start = () => {
    intervalRef.current = setInterval(() => console.log("tick"), 1000);
  };
  
  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  
  return <><button onClick={start}>Start</button><button onClick={stop}>Stop</button></>;
}

// useMemo — cache expensive calculation
function ProductList({ products, category }: Props) {
  // Only recalculates when products or category changes
  const filteredProducts = useMemo(() => {
    console.log("Filtering..."); // watch when this runs
    return products
      .filter(p => p.category === category)
      .sort((a, b) => a.price - b.price);
  }, [products, category]); // dependencies
  
  return <ul>{filteredProducts.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// useCallback — stable function reference
function Parent() {
  const [count, setCount] = useState(0);
  
  // Without useCallback: new function created on every render
  // ChildComponent would re-render every time Parent re-renders
  
  // With useCallback: same function reference between renders
  const handleItemClick = useCallback((id: number) => {
    console.log("Clicked:", id);
  }, []); // no dependencies = created once
  
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ChildComponent onItemClick={handleItemClick} />
    </>
  );
}`,
          },
        ],
      },
    ],
  },
  {
    id: "nextjs",
    title: "Next.js",
    icon: "N",
    color: "#ffffff",
    description: "React framework for production",
    concepts: [
      {
        id: "app-router",
        title: "App Router & File-Based Routing",
        what: "Next.js App Router uses the file system as the router. Every folder in /app represents a URL segment. A page.tsx file makes that route accessible to users.",
        why: "Eliminates manual route configuration. Convention over configuration — learn the folder structure once, never configure routes again.",
        when: "Every page or route in your application. Next.js handles the routing automatically based on your folder structure.",
        how: "Create app/[path]/page.tsx to create a route. Use [param] syntax for dynamic routes. layout.tsx wraps all pages at that level.",
        examples: [
          {
            language: "typescript",
            title: "File system routing",
            code: `// FOLDER STRUCTURE → URL MAPPING
// app/
//   page.tsx                    → /
//   about/page.tsx              → /about
//   dashboard/
//     page.tsx                  → /dashboard
//     layout.tsx                → wraps all dashboard pages
//     settings/page.tsx         → /dashboard/settings
//   blog/
//     page.tsx                  → /blog
//     [slug]/page.tsx           → /blog/any-post-name
//   api/
//     users/route.ts            → /api/users (API endpoint)

// 1. Basic page — app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to DevGuide</h1>
    </main>
  );
}

// 2. Dynamic route — app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string }; // ?query=value
}

export default function BlogPost({ params, searchParams }: PageProps) {
  return <h1>Post: {params.slug}</h1>;
}

// 3. Layout — app/dashboard/layout.tsx
// Wraps all pages inside /dashboard
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside>Sidebar navigation</aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

// 4. Catch-all routes
// app/docs/[...slug]/page.tsx → /docs/a/b/c
// params.slug = ["a", "b", "c"]`,
          },
        ],
      },
      {
        id: "server-client",
        title: "Server vs Client Components",
        what: "Server Components run only on the server — their code never reaches the browser. Client Components run in the browser and support hooks, events, and interactivity. Server is the default.",
        why: "Server components reduce bundle size, improve performance, and allow direct database access. Client components enable interactive features. Using both optimally is core to modern Next.js.",
        when: "Default to Server Components. Add 'use client' ONLY when you need: useState, useEffect, event handlers, browser APIs, or third-party libraries that use hooks.",
        how: "Nothing for Server Components (default). Add 'use client' at the very top of the file for Client Components.",
        examples: [
          {
            language: "tsx",
            title: "Server vs Client Components",
            code: `// =============================================
// SERVER COMPONENT (default — no directive needed)
// =============================================
// ✅ Can: access databases directly, fetch data, use env vars
// ❌ Cannot: useState, useEffect, event handlers, browser APIs

// app/users/page.tsx
import { db } from "@/lib/database"; // direct DB import!

async function UsersPage() {
  // Fetch data DIRECTLY in the component — no useEffect needed!
  const users = await db.query("SELECT * FROM users LIMIT 10");

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;

// =============================================
// CLIENT COMPONENT — needs "use client"
// =============================================
// ✅ Can: useState, useEffect, onClick, onChange, browser APIs
// ❌ Cannot: direct DB access, secret env vars

"use client"; // MUST be first line!
import { useState } from "react";

function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }}
      placeholder="Search..."
    />
  );
}

// =============================================
// PATTERN: Server fetches, Client handles interaction
// =============================================

// app/products/page.tsx (Server Component)
async function ProductsPage() {
  const products = await fetch("/api/products").then(r => r.json());
  
  return (
    <div>
      <SearchBar onSearch={/* ... */} />  {/* Client component inside Server */}
      <ProductList products={products} /> {/* Can be Server if no interactivity */}
    </div>
  );
}`,
          },
        ],
      },
      {
        id: "api-routes",
        title: "API Routes",
        what: "Next.js allows you to create backend API endpoints as files in the app/api/ directory. These run on the server and never expose code to the browser.",
        why: "Build your entire full-stack app in one project. API routes replace the need for a separate Express/Node.js server for simple backends.",
        when: "Form submissions, database operations, authentication, webhooks, or any server-side logic that needs to be called from the client.",
        how: "Create app/api/[endpoint]/route.ts and export named functions GET, POST, PUT, DELETE corresponding to HTTP methods.",
        examples: [
          {
            language: "typescript",
            title: "API routes — full CRUD example",
            code: `// app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // service key for server-side
);

// GET /api/users
// GET /api/users?role=admin  (with query params)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role"); // get query param

  let query = supabase.from("users").select("*");
  if (role) query = query.eq("role", role);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data); // { status: 200 } by default
}

// POST /api/users — create new user
export async function POST(request: NextRequest) {
  const body = await request.json(); // parse request body

  // Validation
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "name and email are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ name: body.name, email: body.email })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") { // unique constraint violation
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// ------------------------------------------------
// Dynamic route: app/api/users/[id]/route.ts
// ------------------------------------------------
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { data, error } = await supabase
    .from("users")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await supabase.from("users").delete().eq("id", params.id);
  return NextResponse.json({ success: true });
}`,
          },
        ],
      },
    ],
  },
  {
    id: "postgresql",
    title: "PostgreSQL",
    icon: "🐘",
    color: "#336791",
    description: "Relational database mastery",
    concepts: [
      {
        id: "sql-basics",
        title: "SQL Fundamentals — CRUD",
        what: "SQL (Structured Query Language) is used to interact with relational databases. Data is stored in tables with rows (records) and columns (fields).",
        why: "Every application needs persistent data storage. SQL is the standard language for querying and manipulating that data across 50+ years of database history.",
        when: "Every time your app reads or writes data: loading a user profile, saving a form, showing a list, updating a record, deleting an item.",
        how: "SELECT reads data, INSERT creates records, UPDATE modifies them, DELETE removes them. WHERE filters results. ORDER BY sorts. LIMIT restricts count.",
        terms: [
          { term: "Table", definition: "Like a spreadsheet — rows are records, columns are fields" },
          { term: "Primary Key", definition: "Unique identifier for each row, usually an auto-incrementing integer (SERIAL)" },
          { term: "Foreign Key", definition: "Column referencing the primary key of another table — creates relationships" },
          { term: "NULL", definition: "Absence of a value. Different from 0 or empty string. Use IS NULL to check for it" },
          { term: "ACID", definition: "Atomicity, Consistency, Isolation, Durability — properties ensuring data integrity" },
        ],
        examples: [
          {
            language: "sql",
            title: "CRUD operations",
            code: `-- CREATE TABLE
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,           -- auto-incrementing integer
  name       VARCHAR(100) NOT NULL,        -- max 100 chars, required
  email      VARCHAR(255) UNIQUE NOT NULL, -- unique across all rows
  role       VARCHAR(20) DEFAULT 'user',   -- default value
  created_at TIMESTAMP DEFAULT NOW()       -- auto timestamp
);

-- INSERT (Create)
INSERT INTO users (name, email)
VALUES ('Ali Ahmed', 'ali@example.com');

-- Insert multiple rows
INSERT INTO users (name, email, role) VALUES
  ('Ahmed Khan', 'ahmed@example.com', 'admin'),
  ('Sara Ali',   'sara@example.com',  'user');

-- SELECT (Read)
SELECT * FROM users;                           -- all columns
SELECT id, name, email FROM users;             -- specific columns
SELECT * FROM users WHERE role = 'admin';      -- filter
SELECT * FROM users WHERE age > 18 AND role = 'user';
SELECT * FROM users WHERE email LIKE '%@gmail.com'; -- pattern
SELECT * FROM users ORDER BY created_at DESC;  -- sort newest first
SELECT * FROM users ORDER BY name ASC LIMIT 10 OFFSET 20; -- pagination

-- UPDATE
UPDATE users
SET name = 'Ali Khan', role = 'admin'
WHERE id = 1;

-- ⚠️ ALWAYS use WHERE with UPDATE/DELETE or you affect ALL rows!
UPDATE users SET role = 'user'; -- affects EVERY user (usually a bug)

-- DELETE
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE created_at < NOW() - INTERVAL '30 days';`,
          },
          {
            language: "sql",
            title: "JOINs — combining tables",
            code: `-- Setup: posts table references users
CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- INNER JOIN — only rows with matches in BOTH tables
SELECT
  users.name,
  posts.title,
  posts.created_at
FROM posts
INNER JOIN users ON posts.user_id = users.id;

-- Alias for cleaner syntax
SELECT
  u.name AS author,
  p.title,
  p.created_at
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE u.role = 'admin'
ORDER BY p.created_at DESC;

-- LEFT JOIN — ALL rows from left table + matching from right
-- Users without posts will appear with NULL post columns
SELECT
  u.name,
  COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id, u.name
ORDER BY post_count DESC;

-- Subquery
SELECT * FROM users
WHERE id IN (
  SELECT DISTINCT user_id FROM posts
  WHERE created_at > NOW() - INTERVAL '7 days'
);`,
          },
        ],
      },
    ],
  },
  {
    id: "supabase",
    title: "Supabase",
    icon: "⚡",
    color: "#3ecf8e",
    description: "PostgreSQL backend made easy",
    concepts: [
      {
        id: "supabase-setup",
        title: "Setup & CRUD Operations",
        what: "Supabase is an open-source Firebase alternative built on PostgreSQL. It provides a database, authentication, file storage, and real-time subscriptions with a clean JavaScript client.",
        why: "Get a full backend (auth, database, storage) without building a server. Perfect for Next.js apps. The client API is clean and TypeScript-native.",
        when: "Building full-stack apps without a dedicated backend. Prototyping, startups, and production apps that don't need custom backend logic.",
        how: "Create project at supabase.com → get URL and anon key → install client → use typed client to query your database.",
        examples: [
          {
            language: "typescript",
            title: "Supabase setup and CRUD",
            code: `// 1. Install: npm install @supabase/supabase-js
// 2. Add to .env.local:
//    NEXT_PUBLIC_SUPABASE_URL=your-project-url
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Type-safe: generate types from your schema
// npx supabase gen types typescript --project-id your-id > types/database.ts

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// CRUD OPERATIONS
// ============================================

// READ — select with filters
const { data: users, error } = await supabase
  .from("users")
  .select("id, name, email")     // specific columns (or "*" for all)
  .eq("role", "admin")           // WHERE role = 'admin'
  .order("created_at", { ascending: false })
  .limit(10);

// SELECT with JOIN (Supabase handles relationships)
const { data: posts } = await supabase
  .from("posts")
  .select(\`
    id, title, content,
    users (id, name, email)
  \`); // auto-joins via foreign key!

// CREATE
const { data: newUser, error: createError } = await supabase
  .from("users")
  .insert({ name: "Ali", email: "ali@example.com", role: "user" })
  .select()    // return the created row
  .single();   // return object instead of array

// UPDATE
const { data: updated } = await supabase
  .from("users")
  .update({ role: "admin" })
  .eq("id", 1)
  .select()
  .single();

// UPSERT — insert if not exists, update if exists
await supabase.from("profiles").upsert({
  user_id: "uuid-here",
  bio: "Updated bio",
});

// DELETE
const { error: deleteError } = await supabase
  .from("users")
  .delete()
  .eq("id", 1);

// ALWAYS check errors!
if (error) console.error("Supabase error:", error.message);`,
          },
          {
            language: "typescript",
            title: "Supabase Auth",
            code: `import { supabase } from "@/lib/supabase";

// ============================================
// AUTHENTICATION
// ============================================

// Sign up with email/password
const { data, error } = await supabase.auth.signUp({
  email: "ali@example.com",
  password: "supersecret123",
  options: {
    data: { // extra profile data
      name: "Ali Ahmed",
      role: "user",
    },
  },
});

// Sign in
const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
  email: "ali@example.com",
  password: "supersecret123",
});

// Sign in with Google (OAuth)
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: \`\${window.location.origin}/auth/callback\`,
  },
});

// Get current user (client-side)
const { data: { user } } = await supabase.auth.getUser();
console.log(user?.id, user?.email);

// Listen for auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    if (event === "SIGNED_IN") console.log("Logged in:", session?.user);
    if (event === "SIGNED_OUT") console.log("Logged out");
  }
);

// Sign out
await supabase.auth.signOut();

// Reset password
await supabase.auth.resetPasswordForEmail("ali@example.com", {
  redirectTo: "https://yourapp.com/reset-password",
});`,
          },
        ],
      },
    ],
  },
  {
    id: "git",
    title: "Git & GitHub",
    icon: "⌥",
    color: "#f05032",
    description: "Version control mastery",
    concepts: [
      {
        id: "git-workflow",
        title: "Daily Git Workflow",
        what: "Git is a distributed version control system that tracks changes to your code over time. GitHub hosts your Git repositories online and enables team collaboration.",
        why: "Never lose work. See every change ever made. Collaborate with a team without overwriting each other's work. Required at every software company.",
        when: "Every day you write code. Commit often (after each small working change). Branch for each feature. PR to merge back to main.",
        how: "The flow: pull → branch → code → add → commit → push → pull request. Use descriptive commit messages.",
        examples: [
          {
            language: "bash",
            title: "Complete daily workflow",
            code: `# ============================================
# FIRST TIME: Clone repository
# ============================================
git clone https://github.com/company/project.git
cd project

# ============================================
# DAILY WORKFLOW
# ============================================

# Step 1: Always start by pulling latest changes
git pull origin main

# Step 2: Create a new branch for your feature/fix
git checkout -b feature/user-authentication
# Naming conventions:
# feature/feature-name  — new functionality
# fix/bug-description   — bug fixes
# chore/task-name       — maintenance, deps
# hotfix/issue          — urgent production fix

# Step 3: Write your code...
# ...

# Step 4: See what changed
git status                          # see changed files
git diff                            # see exact line changes
git diff src/components/Button.tsx  # specific file

# Step 5: Stage changes
git add .                           # stage everything
git add src/components/Button.tsx  # stage specific file
git add -p                          # interactively stage chunks

# Step 6: Commit with descriptive message
git commit -m "feat: add user authentication with Supabase"
# Good commit message format:
# type(scope): description
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting
# refactor: code change without behavior change
# chore: build/dependency updates

# Step 7: Push your branch
git push origin feature/user-authentication

# Step 8: Open a Pull Request on GitHub
# Then: teammate reviews → comments → approve → merge

# ============================================
# OTHER USEFUL COMMANDS
# ============================================

git log --oneline           # see commit history (compact)
git stash                   # save uncommitted changes temporarily
git stash pop               # restore stashed changes
git diff main               # compare your branch to main
git merge main              # bring main changes into your branch
git rebase main             # replay your commits on top of main (cleaner)

# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Discard all local changes (CAREFUL: irreversible!)
git checkout -- .`,
          },
        ],
      },
    ],
  },
  {
    id: "vercel",
    title: "Vercel & Deploy",
    icon: "▲",
    color: "#ffffff",
    description: "Shipping to production",
    concepts: [
      {
        id: "vercel-deploy",
        title: "Deploying to Vercel",
        what: "Vercel is the cloud platform built by the creators of Next.js. It automatically builds and deploys your app when you push to GitHub, with zero configuration.",
        why: "Automated CI/CD means every push to main deploys in ~1 minute. Every PR gets a preview URL. Global CDN means fast loading worldwide.",
        when: "The standard deployment target for any Next.js application. Free tier is generous for personal/small projects.",
        how: "Connect GitHub repo → Vercel detects Next.js → auto-configures build → deploys. Set environment variables in the Vercel dashboard.",
        examples: [
          {
            language: "bash",
            title: "Deploy in 3 steps",
            code: `# ============================================
# DEPLOYING TO VERCEL
# ============================================

# Step 1: Install Vercel CLI (optional but useful)
npm install -g vercel

# Step 2: Login
vercel login

# Step 3: Deploy from project folder
vercel        # preview deployment
vercel --prod # production deployment

# ============================================
# Or use GitHub integration (RECOMMENDED):
# 1. Go to vercel.com → New Project
# 2. Import your GitHub repository
# 3. Vercel auto-detects Next.js settings
# 4. Add environment variables
# 5. Click Deploy → done!
# ============================================

# ============================================
# ENVIRONMENT VARIABLES
# ============================================
# In Vercel Dashboard → Project → Settings → Environment Variables
# Add for: Production, Preview, and Development

# .env.local (NEVER commit this file!)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
SUPABASE_SERVICE_KEY=eyJhbGciOiJ...  # server-only, no NEXT_PUBLIC_

# NEXT_PUBLIC_ prefix = exposed to browser
# Without prefix = server-only (secrets are safe)

# ============================================
# .gitignore — what to NEVER commit
# ============================================
# node_modules/       — dependencies (npm install recreates)
# .env.local          — secrets!
# .env*.local         — all local env files
# .next/              — build output (Vercel builds this)
# *.log               — log files

# ============================================
# vercel.json — optional config
# ============================================`,
          },
          {
            language: "json",
            title: "vercel.json configuration",
            code: `{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/external/:path*",
      "destination": "https://external-api.com/:path*"
    }
  ]
}`,
          },
        ],
      },
    ],
  },
];

export const allConcepts = topics.flatMap(t =>
  t.concepts.map(c => ({ ...c, topicId: t.id, topicTitle: t.title, topicColor: t.color }))
);

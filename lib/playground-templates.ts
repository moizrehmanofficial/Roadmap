/* Starter programs for the playground. */
export const TEMPLATES: Record<string, { label: string; lang: "js" | "ts"; code: string }> = {
  variables: {
    label: "JS: Variables & Scope",
    lang: "js",
    code: `// ✅ Variables & Scope — press Ctrl+Enter to run!

const name = "Ali Ahmed";    // can't be reassigned
let score = 0;               // can be reassigned
score = 42;

// Block scope — let/const die at the end of {}
{
  let blockOnly = "only inside here";
  console.log("Inside:", blockOnly);
}
// console.log(blockOnly); // would throw ReferenceError

// const objects: the REFERENCE is constant, not the contents
const user = { name: "Sara", role: "user" };
user.role = "admin";   // ✅ allowed - changing property
// user = {};           // ❌ error - reassigning variable

console.log("Name:", name);
console.log("Score:", score);
console.log("User:", JSON.stringify(user));

// Hoisting: var is moved to top (avoid var!)
console.log(hoisted);   // undefined (not an error with var)
var hoisted = "I was hoisted";
console.log(hoisted);   // "I was hoisted"`,
  },
  functions: {
    label: "JS: Functions (All Forms)",
    lang: "js",
    code: `// ✅ All 4 ways to write functions

// 1. Declaration — hoisted, can call before it's defined
function greet(name) {
  return "Hello, " + name + "!";
}

// 2. Expression — NOT hoisted
const double = function(n) {
  return n * 2;
};

// 3. Arrow function — concise
const triple = (n) => n * 3;

// 4. Arrow with default params + rest
const sum = (label = "Sum", ...nums) => {
  const total = nums.reduce((a, b) => a + b, 0);
  return label + ": " + total;
};

console.log(greet("Ali"));
console.log("double(5):", double(5));
console.log("triple(5):", triple(5));
console.log(sum("Score", 10, 20, 30, 40));
console.log(sum(undefined, 1, 2, 3));

// Higher-order: function returning a function (closure)
const makeMultiplier = (x) => (y) => x * y;
const times5 = makeMultiplier(5);
const times10 = makeMultiplier(10);
console.log("times5(7):", times5(7));
console.log("times10(7):", times10(7));

// Callback pattern
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);
const squared = evens.map(n => n * n);
console.log("Even squares:", squared);`,
  },
  arrays: {
    label: "JS: Array Methods",
    lang: "js",
    code: `// ✅ The array methods you'll use every single day

const products = [
  { id: 1, name: "Laptop",  price: 999,  category: "tech" },
  { id: 2, name: "Phone",   price: 599,  category: "tech" },
  { id: 3, name: "Desk",    price: 299,  category: "furniture" },
  { id: 4, name: "Chair",   price: 199,  category: "furniture" },
  { id: 5, name: "Monitor", price: 399,  category: "tech" },
];

// .filter() — keep items that match condition
const techItems = products.filter(p => p.category === "tech");
console.log("Tech items:", techItems.length);

// .map() — transform each item into something new
const names = products.map(p => p.name);
console.log("Names:", names.join(", "));

// .find() — first item that matches (or undefined)
const laptop = products.find(p => p.name === "Laptop");
console.log("Laptop price: $" + laptop.price);

// .reduce() — collapse array to single value
const total = products.reduce((sum, p) => sum + p.price, 0);
console.log("Total: $" + total);

// .some() / .every()
console.log("Any over $900?", products.some(p => p.price > 900));
console.log("All over $100?", products.every(p => p.price > 100));

// Chain them together!
const affordable = products
  .filter(p => p.price < 400)
  .map(p => p.name + " ($" + p.price + ")")
  .sort();
console.log("Under $400:", affordable);

// Group by category using reduce
const grouped = products.reduce((acc, p) => {
  if (!acc[p.category]) acc[p.category] = [];
  acc[p.category].push(p.name);
  return acc;
}, {});
console.log("Grouped:", JSON.stringify(grouped, null, 2));`,
  },
  async: {
    label: "JS: Async/Await",
    lang: "js",
    code: `// ✅ Async/Await — fetching real data from an API!

async function getUser(id) {
  console.log("Fetching user " + id + "...");
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/users/" + id
  );
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

async function getPosts(userId) {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?userId=" + userId + "&_limit=3"
  );
  return res.json();
}

// Promise.all — fetch BOTH at the same time (parallel = faster!)
async function loadDashboard() {
  try {
    const start = Date.now();

    const [user, posts] = await Promise.all([
      getUser(1),
      getPosts(1),
    ]);

    console.log("Loaded in " + (Date.now() - start) + "ms");
    console.log("User:", user.name, "- " + user.email);
    console.log("City:", user.address.city);
    console.log("Posts (" + posts.length + "):");
    posts.forEach(p => console.log("  -", p.title));

  } catch (error) {
    console.error("Failed:", error.message);
  }
}

loadDashboard();`,
  },
  closures: {
    label: "JS: Closures",
    lang: "js",
    code: `// ✅ Closures — functions that remember their outer scope

// Counter using closure
function createCounter(start = 0) {
  let count = start; // "closed over" — lives in memory

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    reset()     { count = start; return count; },
    value()     { return count; },
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.reset());     // 10

// Each call has its OWN private scope
const c1 = createCounter(0);
const c2 = createCounter(100);
c1.increment(); c1.increment();
console.log("c1:", c1.value()); // 2
console.log("c2:", c2.value()); // 100 — completely independent!

// Practical factory function
function makeFormatter(prefix, suffix) {
  suffix = suffix || "";
  return function(value) {
    return prefix + value + suffix;
  };
}

const toDollar  = makeFormatter("$");
const toPercent = makeFormatter("", "%");
const toParens  = makeFormatter("(", ")");

console.log(toDollar(42.50));   // $42.5
console.log(toPercent(98.6));   // 98.6%
console.log(toParens("error")); // (error)`,
  },
  objects: {
    label: "JS: Objects & Destructuring",
    lang: "js",
    code: `// ✅ Objects — the backbone of JavaScript

const user = {
  id: 1,
  name: "Ali Ahmed",
  age: 25,
  address: {
    city: "Rawalpindi",
    country: "Pakistan",
  },
  skills: ["JavaScript", "React", "Next.js"],
  greet() {
    return "Hi, I'm " + this.name + " from " + this.address.city;
  },
};

// Dot notation & bracket notation
console.log(user.name);           // Ali Ahmed
console.log(user["address"]["city"]); // Rawalpindi
console.log(user.greet());

// Destructuring — extract into variables
const { name, age, address: { city } } = user;
console.log(name + ", age " + age + ", " + city);

// Rename during destructure
const { name: fullName, role = "developer" } = user;
console.log(fullName + " is a " + role);

// Rest — everything else
const { id, ...profileData } = user;
console.log("Without id:", Object.keys(profileData));

// Spread — copy + override
const updated = { ...user, age: 26, role: "admin" };
console.log("Original age:", user.age);    // 25 (unchanged!)
console.log("Updated age:", updated.age);  // 26

// Dynamic property names
const field = "email";
const withEmail = { ...user, [field]: "ali@example.com" };
console.log("Email:", withEmail.email);

// Object.entries — iterate key/value pairs
const simple = { a: 1, b: 2, c: 3 };
Object.entries(simple).forEach(([key, val]) => {
  console.log(key + " =", val);
});`,
  },
  promises: {
    label: "JS: Promises Deep Dive",
    lang: "js",
    code: `// ✅ Promises — the foundation of async JavaScript

// Creating promises manually
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomSuccess(value, failChance = 0.3) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > failChance) {
        resolve(value);
      } else {
        reject(new Error("Random failure for: " + value));
      }
    }, 100);
  });
}

// Promise.all — ALL must succeed, or it rejects
async function testAll() {
  try {
    const results = await Promise.all([
      randomSuccess("Task A", 0),  // always succeeds
      randomSuccess("Task B", 0),  // always succeeds
      randomSuccess("Task C", 0),  // always succeeds
    ]);
    console.log("All succeeded:", results);
  } catch (e) {
    console.error("One failed:", e.message);
  }
}

// Promise.allSettled — get result of each regardless of failure
async function testAllSettled() {
  const results = await Promise.allSettled([
    fetch("https://jsonplaceholder.typicode.com/todos/1").then(r => r.json()),
    fetch("https://jsonplaceholder.typicode.com/todos/2").then(r => r.json()),
    fetch("https://this-does-not-exist.fake").then(r => r.json()),
  ]);

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log("Todo " + (i+1) + " OK:", r.value.title.slice(0, 30));
    } else {
      console.log("Todo " + (i+1) + " FAILED:", r.reason.message.slice(0, 40));
    }
  });
}

async function run() {
  await testAll();
  await testAllSettled();
}

run();`,
  },
  errorHandling: {
    label: "JS: Error Handling",
    lang: "js",
    code: `// ✅ Custom errors & robust error handling

// Custom error classes
class AppError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details || {};
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(message, "VALIDATION_ERROR", { field });
    this.name = "ValidationError";
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(resource + " #" + id + " not found", "NOT_FOUND", { resource, id });
    this.name = "NotFoundError";
  }
}

// Functions that throw
function validateUser(user) {
  if (!user.name)     throw new ValidationError("name", "Name is required");
  if (!user.email || !user.email.includes("@"))
    throw new ValidationError("email", "Invalid email address");
  if (user.age < 0 || user.age > 150)
    throw new ValidationError("age", "Age must be 0-150");
  return true;
}

const DB = [{ id: 1, name: "Ali", email: "ali@x.com", age: 25 }];
function findUser(id) {
  const u = DB.find(u => u.id === id);
  if (!u) throw new NotFoundError("User", id);
  return u;
}

// Central error handler
function handleError(e) {
  if (e instanceof ValidationError)
    console.log("[VALIDATION] Field '" + e.details.field + "': " + e.message);
  else if (e instanceof NotFoundError)
    console.log("[NOT FOUND] " + e.message);
  else if (e instanceof AppError)
    console.log("[APP ERROR " + e.code + "] " + e.message);
  else
    console.log("[UNKNOWN]", e.message);
}

// Run tests
const tests = [
  () => validateUser({ name: "", email: "x@x.com", age: 25 }),
  () => validateUser({ name: "Ali", email: "bad-email", age: 25 }),
  () => findUser(999),
  () => findUser(1),
];

tests.forEach((test, i) => {
  try {
    const result = test();
    console.log("Test " + (i+1) + " PASSED:", result);
  } catch (e) {
    handleError(e);
  }
});`,
  },

  typescript: {
    label: "TS: Types, Interfaces & Generics",
    lang: "ts",
    code: `// ✅ TypeScript runs here too — types are checked by your editor,
// stripped here, then the JavaScript runs.

interface User {
  id: number;
  name: string;
  role: "admin" | "user";
}

function describe(user: User): string {
  return \`\${user.name} (#\${user.id}) is \${user.role === "admin" ? "an admin" : "a user"}\`;
}

// Generic: works for any element type, keeps the type information
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const users: User[] = [
  { id: 1, name: "Ali", role: "admin" },
  { id: 2, name: "Sara", role: "user" },
];

console.log(describe(users[0]));
console.log("first number:", first([10, 20, 30]));
console.log("first user:", first(users)?.name);

// Utility types
type UserPreview = Pick<User, "id" | "name">;
const preview: UserPreview = { id: 3, name: "Hamza" };
console.log("preview:", preview);`,
  },
};

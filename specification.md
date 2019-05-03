# Specification
## Tokens

This is a list of Toothpick tokens and reserved keywords.

* symbols - `->`, `(`, `)`, `.`, `,`, `[`, `]`, `>`, `$`, `@`
* keywords - `fun`, `return`, `if`, `true`, `false`

## Philosophy
### Functional paradigm

Toothpick is a functional language, which makes it a very readable language. It also elimites a lot of problems from object-oriented languages.

Take the following code as an example:

```js
function getAdults(users) {
  const result = [];

  for (const user of users) {
    if (user.age >= 18) {
      result.push(user);
    }
  }

  return result;
}
```

This code is not very readable. It goes through the list, checks if age is greater, pushes to a temporary variable and then returns a resulting array. The exact same code may be written as follows:

```js
function getAdults(users) {
  return users.filter(user => user.age >= 18);
}
```

This code shows exactly the intent. If I was asked, this function returns a filtered list of users, where each user's age is greater or equal 18. This is the reason functional programming is so great. As a closing remark, let's see how the exact same code looks in Toothpick:

<tp-source>
```
fun get_adults @users ->
  return filter(users, { @user } -> gte(get(@user, 'age'), 18))
.
```
</tp-source>

### Mutation, or rather lack thereof

In Toothpick every structure is not mutable, which means it eliminates a lot of bugs. If you pass a list into a function, its pointer will be passed. If you try to mutate it, its copy will be copied. Take this example for clarification:

In JavaScript, you may mutate a passed list:

```js
function printSorted(array) {
  console.log(array.sort()) // This may be not intentional, but it mutates the original array and prints [1, 2, 3, 4]
}

const array = [1, 4, 3, 2];
console.log(array); // [1, 4, 3, 2]
printSorted(array);
console.log(array); // [1, 2, 3, 4] // the original array's order has been mistakenly changed
```

On the other hand, in Toothpick every operation returns a copy, meaning this is impossible:

<tp-source>
```
fun print_sorted @array ->
  print(sorted(@array)) # prints [1, 2, 3, 4], but the original array is unchanged
.

@array = [1, 4, 3, 2]
print(@array) # [1, 4, 3, 2]
print_sorted(@array)
print(@array) # [1, 4, 3, 2] # the original array's order is not changed
```
</tp-source>

## Constructs
### Literals

There are several types in Toothpick:

* `boolean` - can be either `true` or `false`,
* `string` - it always starts and ends with a single quote, example: `'Hello, World!'`. Double qoutes are not supported as they are less clean, than the single quotes. Embedding variables is also impossible and the only way to format a string is via the `format/2` function,
* `integer` - as in any other programming language it is written as a regular number. Its maximum and minimum values are dependant on the JavaScript engine they are running in,
* `float` - @todo
* `list` - @todo

As you may have noticed, there is no `nil`, `null`, `None`, `undefined` or anything similar. It is intentional to not repeat the [billion dollar mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare).

### Variables

Every variable in Toothpick is prepended with an `@` symbol.
This is to make it easier to use multiple cursors in your editor of choice.
It also allows for better syntax highlighting — function calls and variables may be in different colors.

<tp-source>
```
@a = true
@a = 'Hello'
@c = 42
```
</tp-source>

will be compiled to

```js
let a = true;
a = 'Hello';
let c = 42;
```

As you may have noticed, Toothpick is **not using any delimiter to end a statement**.

### Functions

A function declaration always starts with the `fun` keyword, followed by the function name. After that comes the argument list and an arrow `->` — it informs about the function start. Each function is terminated by a dot `.`.

<tp-source>
```
fun main ->
  return 'Hello, World!'
.
```
</tp-source>

Your function may receive multiple arguments:

<tp-source>
```
fun add_three @a @b @c ->
  return add(add(@a, @b), @c)
.

# Multiline declaration is also supported:

fun add_four
  @a
  @b
  @c
  @d
->
  return add(add(add(@a, @b), @c), @d)
.
```
</tp-source>

will be compiled to

```js
function add_three(a, b, c) {
  return add(add(a, b), c);
}

function add_four(a, b, c, d) {
  return add(add(add(a, b), c), d);
}
```

### If statements

If statements in Toothpick behave the same way `cond` does in Elixir. There is no concept of the else or else if clause. Each if supports as many conditions as you want.

<tp-source>
```
if
  lt(@a, 0) : print('@a is negative')
  gt(@a, 0) : print('@a is positive')
  true : print('@a is equal to 0')
.
```
</tp-source>

is compiled to

```js
if (lt(a, 0)) {
  return print('@a is negative');
} else {
  if (gt(a, 0)) {
    return print('@a is positive');
  } else {
    if (true) {
      return print('@a is equal to 0');
    }
  }
}

// which is exactly the same as

if (lt(a, 0)) {
  return print('@a is negative');
} else if (gt(a, 0)) {
  return print('@a is positive');
} else {
  return print('@a is equal to 0');
}
```

### Return statements

The return statement behaves the same as in any other language that supports the `return` keyword. It makes the expression to be returned from a function and terminates its execution.

<tp-source>
```
return @a # returns the value of @a and terminates a function
return @b # this is never executed
```
</tp-source>

### Lists

Lists are working the same way JavaScript arrays are. In fact, they are compiled into JS arrays.

<tp-source>
```
@a = [1, 2, 3, 4]
```
</tp-source>


### Maps

Toothpick does not support any kind of maps. If you want to create a map, you may create a list of lists, where each sub-list represents a key and a value. For instance, a JavaScript's object may be represented the following way:

<tp-source>
```
# {
#   a: 7,
#   b: [1, 2, 3],
# }

[['a', 7], ['b', [1, 2, 3]]]
```
</tp-source>

This is intentional. Authors have found themselves using `Object.entries` and `Object.fromEntries` or their Lodash's counterparts (`_.toPairs` and `_.fromPairs`) a lot in day-to-day programming. To limit this traversal, maps have been completly elimited from the language. This may be problematic, as `[].find` is `O(n)`, whereas `{}.key` is `O(1)`. This may be solved in future versions of the language, by smart list implementations behind the scenes.

### Pipe operator

The pipe operator is a very useful concept. It dramatically simplifies written code, does not require temporary variables, provides a readable code and makes you read the code from left to right.

Take as an example this piece of code:

```js
return emit(buildStandardizedResponse(renderResponse(dispatchBusinessLogic(getDispatcher(getRouter(getApp(buildDic(loadConfig()))), request), request, new Response()))));
```

Do you know what is happening here? It's pretty hard to grasp what is going on, and even if you wanted to, you'd have to read from right to left — from the most inner pair of parenthesis to the most outer.
To break this down, you may split this code into temporary variables:

```js
const config = loadConfig();
const dic = buildDic(config);
const app = getApp(dic);
const router = getRouter(app);
const dispatcher = getDispatcher(router, request);
const logic = dispatchBusinessLogic(dispatcher, request, new Response());
const render = renderResponse(logic);
const standardizedResponse = buildStandardizedResponse(render);
const response = emit(standardizedResponse);
return response;
```

But this is not ideal, because you have to declate variables you use only once. That is why Toothpick introduces a pipe operator (`>`), so the same code can be written as follows:

<tp-source>
```
return loadConfig()
  > buildDic($)
  > getApp($)
  > getRouter($)
  > getDispatcher($, @request)
  > dispatchBusinessLogic($, @request, new_response())
  > renderResponse($)
  > buildStandardizedResponse($)
  > emit($)
```
</tp-source>

This way, every `$` will be replaced with everything that occurs before it, which makes the following code equivalent:

<tp-source>
```
return emit(buildStandardizedResponse(renderResponse(dispatchBusinessLogic(getDispatcher(getRouter(getApp(buildDic(loadConfig()))), @request), @request, new_response()))))
```
</tp-source>

# Specification
## Tokens

This is a list of Toothpick tokens and reserved keywords.

* symbols - `->`, `(`, `)`, `.`, `,`, `[`, `]`, `>`, `$`, `@`
* keywords - `fun`, `return`, `if`, `true`, `false`

## Philosophy
### Functional paradigm

@todo

### Mutation, or rather lack thereof

@todo

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

@todo

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

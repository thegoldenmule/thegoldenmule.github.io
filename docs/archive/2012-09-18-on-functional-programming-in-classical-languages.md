---
title: "On functional programming in classical languages"
date: 2012-09-18T06:41:22.000Z
original_url: https://thegoldenmule.com/blog/2012/09/on-functional-programming-in-classical-languages/
---

AS3 is certainly not strictly classical (there’s a Class::prototype object for Pete’s sake!), but it’s got a lot of the classical garb. Anyway, today I was rummaging around in a class in our codebase called FunctionUtils and I decided, whilst fixing a few things, why not add a couple of the fun functional constructs?!

## Function::schönfinkeling

_Schönfinkeling,_ or more commonly, [currying](http://en.wikipedia.org/wiki/Currying "Like I knew that name before I went to wikipedia") a function, has mathematical roots. Essentially, you define a function:

$$!C:f(x\_1, …, x\_n) \\rightarrow f'(x\_1, …, x\_{m}) \\epsilon m < n$$ That's right! A function that returns a function. It's easiest to understand using the classic example of addition:

```
function add(a:int, b:int):int {
	return a + b;
}
add(10, 5); // 15
```

Now let’s Schönfinkel this function!

```
var addTen:Function = curry(add, 10);
addTen(5); // 15
```

See what I did there? my curry() function mapped $$add(a, b) \\rightarrow addTen(b)$$. This is pretty straightforward in JavaScript, but there are some limits in AS3. Here’s what I came up with.

```
public function curry(functionRef:Function, ... args):Function {
	// nothing to curry
	if (0 == args.length) {
		return functionRef;
	}

	return function (... arguments):* {
		return functionRef.apply(null, args.concat(arguments));
	};
}
```

Simple right?! One big limitation here is that it returns an “untyped” function, in that where you once had add(a,b), you now have addTen(… args):\*. Not a huge deal, of course, I’m not sure any language comes equipped to deal with typing this kind of thing (feel free to prove me wrong!).

## Function::memoize

I’ll be honest, I’ve used [memoization](http://en.wikipedia.org/wiki/Memoization "It's a fancy word for caching") more times than I probably have had need for. Seriously. It’s so cool I use it to do stupid things. But that’s okay! Typically, memoization is a fancy word for caching return values from a function. Here’s an AS3 implementation:

```
public function memoize(functionRef:Function):Function {
	var cache:Dictionary = new Dictionary(true);

	return function (argument:*):* {
		if (null == cache[argument]) {
			cache[argument] = functionRef.call(null, argument);
		}

		return cache[argument];
	};
}
```

There are a couple of things here that are unfortunate.

Firstly, this really only works with single valued functions, i.e. $$f(x):x\\rightarrow y$$. There’s not a great way (that I’m aware of) to cache by “a bunch of objects”. Secondly, if your function returns null for some input, the value is essentially not cached. Dictionary::hasOwnProperty really only works for string keys, and our key could be an object. Thirdly, flash.utils.Dictionary isn’t a big fan of Function keys, so memoize(memoize(f)) may do something crazy.

That’s it! Quick post!
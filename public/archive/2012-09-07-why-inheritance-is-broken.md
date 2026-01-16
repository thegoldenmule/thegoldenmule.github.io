---
title: "Why Inheritance Is “Broken”"
date: 2012-09-07T21:47:54.000Z
original_url: https://thegoldenmule.com/blog/2012/09/why-inheritance-is-broken/
---

## Prologue

A coworker of mine recently told me that interfaces were for him, a purely academic exercise and that outside of a CS degree, he has never used one. I almost slapped him, railing the age-old battle cry, “favor composition over inheritance!” but all I could do was let out a frail whimper. You see, inheritance is broken. Or, more accurately, inheritance **by itself** produces strongly coupled, rigid, and difficult to maintain code.

Now by inheritance I mean classical (i.e. class-based) single inheritance. I don’t mean multiple inheritance (which is so clearly broken it makes me hurt), or prototypal inheritance (which has apparently been broken until JS became very popular recently), or all of the other strange types of inheritance that may be out there.

Secondly, please take the word ‘broken’ with a grain of salt. I would argue that even the [most grievous flaws](http://c2.com/cgi/wiki?JavaScriptFlaws "Just a few...") in a language are not inherently broken (unless there really is a bug). If they lead to a finished product, it is a contradiction to say that they were broken to begin with. So by ‘broken’, I mean less useful, more error prone–more difficult to use, extend, and transform.

**What does inheritance give us?**

Before I tear inheritance a new one, let me first define exactly what it does. Essentially, when you inherit a class, you are doing three things:

1\. You are copying, line by line, every character of a class’ **implementation** into your class.

2\. You are starting with an already established **contract** with the outside world. The class you inherit from has properties and methods that your class will have too.

3\. You are gaining a **type**. In general, the more strongly typed the language is, the more useful this will be. Compile time checking can greatly speed up development time when types are used.

These three things: **implementation**, **contract**, and **type** are all bundled up into one gigantic monstrosity we call inheritance. It is my goal to inform you, dear Reader, of the exact nature of inheritance, how to look to **composition** to perform the same tasks in a much more useful way, and how to avoid the pitfalls of inheritance.

**Why an implementation is not always the bees knees.**

I dare you to look at the source for mx.core.UIComponent. Did you do it? See, I know you didn’t because you’re still alive to read this.

When I say **implementation** I mean actual lines of code. When you inherit from a class, you are reusing code you or someone else has already written. This sounds great. And really, it is great in some circumstances. But watch out for what I like to call the [Parent-Trap](http://www.imdb.com/title/tt0120783/).

Look back at [UIComponent](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/core/UIComponent.html "*shiver*"). It’s 8 subclasses deep. _Eight_. And look at how much crap subclasses it. Think about how many lines of code are lurking in there. Think about the overhead when you create a new UIComponent _because_ of all the code lurking in there.

_And that’s not even the bad part_.

What happens a lot of times when subclassing is one or more of three things:

1\. Your subclass begins to override more and more of the previous implementations. Slowly you find that you need to override another method because somewhere up the line, one of the possibly 8 implementations of that method is doing something strange, like setting this flag, calling this other method, etc. At this point, you have defeated the purpose of inheriting an implementation as it turns out you aren’t reusing much of it. What’s more, if you’re using a compiled library, sometimes it’s all but impossible to find the source and figure out what’s actually happening.

2\. Your subclass doesn’t really override anything. It adds a few more methods or properties that, based on the fact that you’re not overriding anything, don’t really have a lot to do with the superclass. But that’s the rub. A lot of the time, those properties or methods may be better served elsewhere, and they only bloat your class. Why subclass Sprite to add a function called degreeToRadians()? Yes, I’ve really seen that. That function should be nowhere near Sprite.

3\. There’s an unspoken rule around the office that your classes should never be touched. Essentially, I mean your class structure is [tightly coupled](http://en.wikipedia.org/wiki/Coupling_\(computer_programming\) "Seriously, read this"). You don’t dare change anything in a superclass for fear of destroying one of the millions of subclasses.

Luckily, there’s a general equation governing all of this. As your inheritance structure grows deeper, the reliability and maintainability of your system decreases. It’s as simple as that.

A general rule I stole from [a programming mentor of mine](http://mattbolt.blogspot.com/ "No, it's never updated"), is to stick within **0-2** subclasses deep, maybe even three if I’ve had a lunch-beer. By sticking to a shallow class structure, you gain a lot of the advantages of inheriting an implementation (fast, code reuse) without many of the disadvantages (maintenance, baggage, innocuous bugs, hidden traps somewhere up the inheritance line).

A second way to overcome the pitfalls of inheriting an implementation, is to simply **have** an object rather than subclass it. Sounds stupid easy right? That’s because it really is. A lot of the time, what you actually wish you could do, is cherry pick which functions you could inherit rather than the entire class, and this is one way you might be able to accomplish just that. This is the first method of **composition**, and it’s so easy that a lot of people think they need to overcomplicate things and this can’t be a valid solution. No, in fact it’s a brilliant solution. Next time you want to extend Sprite, slap yourself, remain calm, and just let your class own a Sprite instead.

**The spoken and unspoken contract.**

A class defines two contracts with the outside world. One is very clear: it’s the spoken contract made up of all the typed properties and methods. Your compiler loves this contract. It loves it so much it will never in a million years let you breach it. This contract is incredibly useful for all sorts of reasons.

The second contract, however, is invisible. In AS3 it is particularly invisible. This contract is made up of callback invocations (i.e. _how_ a function is called), dispatched events, dynamically created methods + properties, etc– things the compiler can’t see and can’t check.

When you inherit from a class you inherit both of these contracts. Most of the time we fully understand that we’re getting the first contract, in fact it may be the whole reason to subclass. It may be, however, a contract that is really too large for your object. It has functions and properties that you either just ignore, didn’t know about, or specifically override with a blank implementation because it’s harmful.

The second contract is more difficult to remember. Are there all sorts of events being fired off that your subclass shouldn’t fire or should be fired at different times? Is there a function load(callback:Function) that you wish would call that callback differently? You can definitely override that load function, or finagle your way into not dispatching those events or not creating those dynamic properties and methods, but that would actually be a **breach of unspoken contract**.

It may sound crazy but it’s true.

If you change the way a callback is called in a subclass or what data is sent in an event (or kill that event entirely), you have broken a contract. Shame on you. Think about it: if you see that a class extends LoadableElement, you think: “Awesome, I can call load(callback:Function) and it will invoke the callback with a String.” Or you think “Oh I can listen for LoadableElementEvent.LOADED.” See? Because it’s part of the contract.

The contracts are important, and there are a few strategies to limit the mayhem.

Strategy #1: **Make sure your subclass needs the whole contract it will inherit**. If it only really needs one or two related functions, don’t subclass. Instead, break those out into an interface or even another class which your new class can own an instance of.

Strategy #2: **Prefer the spoken contract**. The spoken contract is much safer than the unspoken, so favor it. Type as much as you can. The compiler will not only disallow a lot of stupidity, it will help you identify bad design.

Strategy #3: **Consider typed asynchronous patterns.** I love callbacks, probably more than the next guy, but they are easy to abuse. In AS3, callbacks are “untyped”–meaning who knows how they’re called. If you’re extending a class that uses callbacks and you need to pass different information through, consider changing the superclass to calling the callback with an object or interface that “wraps” the data you send back. It’s a bit of refactoring work, but it’s worth it.

Another easy win is using a delegate interface instead of a callback so you always know how a callback is invoked. For instance:

```
public interface ICallbackDelegate{
	function success():void;
	function failed():void;
}

public function load(delegate:ICallbackDelegate):void {
	…
	if (success) {
		delegate.success();
	} else {
		delegate.failed();
	}
	...
}
```

This pattern is also a great replacement for events. They don’t always need replaced, mind you, but it can help move part of the unspoken contract to the spoken contract. [Promises](https://github.com/CodeCatalyst/promise-as3 "Read up") may also be a good fit for typing asynchronous actions.

**How inheritance only gives you parallel type.**

As I’ve mentioned before, type is an extremely powerful feature, especially for compiled languages. It can speed up development when you know what you’re working with, and the compiler can do a lot of the grunt work in finding errors for you. Entire books have been written on the importance of type.

One of the benefits of inheritance is that a subclass inherits its parent’s class, so its type is a superset of its parent’s type. So, if there’s a method that acts on a superclass, well then it can act on the subclass as well. Brilliant! Or maybe that’s not the whole story…

This problem is pretty easy to see.

When you have a tree of classes, and at some point down the line, you need a behavior that is in another tree, you can’t inherit from that tree. For a method applyTax(item:RetailItem), that’s great for all the RetailItem subclasses that have a taxPercentage property, but what about when a fruit tax is introduced? You don’t want to write applyTaxForFruit(fruit:Fruit) to cover your fruit classes. That’s silly. It would be easier to dress up like American Indians and toss all of the fruit into the sea. No–you need the **subset of type** that the applyTax() function needs in order to properly apply tax.

This is where **interfaces** (the second method of **composition**) will, quite literally, pwn all ur n00bz. It provides a small nugget of type that can be used wherever a man can dream. An interface just specifies that specific functions exist on an object. [Interface don’t care](http://knowyourmeme.com/memes/honey-badger "Two words: honey badger") how it’s implemented, just that it exists, and in 99% of use cases, you just want to call a function– you don’t care how that function is implemented.

If you used an interface on the fruit taxing situation, you would now have one function: applyTax(taxable:ITaxable), and both RetailItem and Fruit would implement that interface. Now _that’s_ brilliant.

Here’s how I think about it:

1\. Type is so useful we want to use it everywhere. Also we may be forced to by a strongly-typed language.

2\. Using inheritance propagates type in a **parallel** fashion. Type goes from the superclass in the direction of the subclasses, down the inheritance tree.

3\. You only get one shot at inheritance, but to cover every use case down the road, you will need types from many different, **perpendicular** types, i.e. types that are not up the tree and simply can’t be up the tree.

4\. **Interfaces** provide a method of sharing type perpendicularly, as well as in parallel.

This type of perpendicular type is far more useful than parallel type.

**Conclusion.**

I hope you’ve been reading this with a salt shaker by your side. While there are dangers to inheritance, it is, to my chagrin, a decent tool. Just promise me you’ll try to prefer **composition**, and keep in mind the **implementation**, **contract**, and **type** you’ll be inheriting.
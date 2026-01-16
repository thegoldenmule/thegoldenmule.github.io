---
title: "Why you should think five times before writing a singleton"
date: 2012-09-26T02:19:01.000Z
original_url: https://thegoldenmule.com/blog/2012/09/why-you-should-think-five-times-before-writing-a-singleton/
---

In a debate, a common tactic is to concede some small amount of truth _against_ your own viewpoint. It softens up the opposition by getting them to agree with you early on. So here we go:

Singletons are handy and can be useful.

Now on to the debate.

## Common Problems with the Singleton Pattern

**1** **Many languages don’t even support this pattern**. If a language does not support private constructors, it does not support singletons. AS3 engineers think they’ve found brilliant methods of getting around this fact, but they haven’t. If there isn’t a compile time error, you haven’t solved anything.

**2** **You can’t really subclass a singleton in a good way**. Say you’ve got a singleton you want to inherit from–how do you do it? I guess in languages that support it, you use a protected constructor, but regardless, the static method or property that allows access to your instance (getInstance()) will always return an instance of the superclasss, so you will find yourself typing the instance to the subclass every time you use it.

I have seen developers try to use an interface to get around this problem in AS3. So they will do something like this:

```
class MyClass implements IMyClass {
	...

	public function getInstance():IMyClass {
		...
	}
}
```

I suppose this kinda works. Whatever. At this point you’ve over-engineered the crap out of the singleton pattern though, and you’re misusing an interface.

**3 Singletons encourage disuse**. Again, it’s essentially the same drawback as any static reference: you can access it from anywhere! You’ll be tempted to call it in places that you shouldn’t, and your design will suffer.

Here’s the deal: if you are writing utility functions that generate random numbers or format strings, you should just use stateless static functions. If, on the other hand, you just want one of some object–**why not just make one**? Singletons are a bad fit for both of these needs.

**4** **Singletons do not give you control over instantiation**. That’s not strictly true, but in most implementations I’ve seen people do something like:

```
public static function getInstance():MyClass {
	if (null == _instance) {
		_instance = new MyClass();
	}

	return _instance;
}
```

The problem with this is that there is **no explicit time the constructor is called**. If there is anything in the constructor that is dependent on other objects or systems, there’s a very real potential for failure depending on when getInstance() is called.

For example, suppose the MyClass constructor adds an event listener to some object and your app has been running smoothly for years. Then another developer comes along and references MyClass.getInstance() somewhere else, earlier in the execution cycle. But the object MyClass is adding a listener to is null at that point and MyClass throws an error!

**Object creation is hidden** and that’s dangerous.

**5** **Multi-threading is kind of a problem**. Kind of. I’m not a threading guru, but when everything is hitting singletons, you’ve essentially got to make every method atomic. It’s not a good idea to have multithreaded code calling blocking static functions everywhere, and for the exact same reasons you shouldn’t be calling singletons everywhere.

# Solutions

**1 Just create one stupid object**. You should probably even create one object and pass it around so that only things that should access actually can. In lieu of that, add a static reference to an object:

```
public static const myObject:MyClass = new MyClass();
```

Look at that! In a single line of code, no less! This also gives explicit control over instantiation.

**2 Don’t enforce a singleton**. If you just can’t escape the MyClass.getInstance() nonsense for whatever reason, why not take a page from Cocoa?

```
public class MyClass {
	public static const sharedInstance:MyClass = new MyClass();

	public function MyClass() {
		...
		// I'm completely normal!
		...
	}

	...
}
```

There is still a bit of a headache when subclassing, but it is certainly lessened. Also, it’s clear from the naming convention “sharedInstance”, that it’s nothing more than a static reference to an instance. You can still create your own, or feel free \*not\* to use that sharedInstance.
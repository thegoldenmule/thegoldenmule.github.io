---
title: "On conditional compilation in Flex and why it kind of sucks"
date: 2011-09-20T02:29:22.000Z
original_url: https://thegoldenmule.com/blog/2011/09/on-conditional-compilation-in-flex-and-why-it-kind-of-sucks/
---

Flex conditional compilation is kinda like a crappy, finicky version of preprocessor directives in the C family. Compiler constants can be defined and used at compile time to include (or exclude) specific code–or they can be used at run time like regular old consts (except you can’t find them with any of the AS3 [reflection utilities](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/utils/package.html#describeType\(\))). It’s because they serve this duel function (at compile time + run time) that they can be a little tricky to work with.

# An example

Say you’re on a project that targets FlashPlayer and AIR for mobile. In FP you will likely be listening to MouseEvents, but in the AIR version you want to listen to TouchEvents. Unfortunately, you can’t just use an if-statement because FP will crash if you give it an AIR class like the TouchEvent classes. Compiler constants let you compile in your platform specific classes like so:

```
COMPILE_TARGET::air
{
	import flash.events.TouchEvent;
}
```

# The gotcha

In my case, we had compiler constants for both [Ios](https://thegoldenmule.com/blog/?p=160) and Android and I found myself in the exact same scenario as I described above: for Ios and Android I needed to compile in TouchEvent, but I couldn’t compile it into the FlashPlayer version of the game. So I tried doing one of these:

```
(COMPILE_TARGET::ios || COMPILE_TARGET::android)
{
	import flash.events.TouchEvent;
}
```

When I compiled and ran this for AIR this worked wonderfully. FlashPlayer, however, choked on it and died a miserable death, crashing Firefox in the process. It turns out, the syntax above is interpreted more like a static initializer. That is, TouchEvent is compiled in, and the expression is evaluated at runtime rather than at compile time. The mystical compile-time/run-time duality of Flex compiler constants is its own undoing! I had to add a third compiler constant COMPILE\_TARGET::air so that I could compile and run this game properly.
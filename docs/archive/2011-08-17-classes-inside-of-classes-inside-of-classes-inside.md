---
title: "Classes inside of classes inside of classes inside of…"
date: 2011-08-17T22:12:09.000Z
original_url: https://thegoldenmule.com/blog/2011/08/classes-inside-of-classes-inside-of-classes-inside-of/
---

For being so narcissistic, AS3 is not great at reflection (yes, I really just made that joke). You can, however, make life a little easier with the little bit it does have. Awhile ago I was refactoring all our project’s cursor code. We were embedding a bunch of PNGs and going through and initializing them one by one. Adding a new cursor was not only a hassle, but looked downright fugly. Fortunately, my good looks and quick thinking saved the day (mostly the looks part).

Say you embed a PNG like so:

```
[Embed(source="/../assets/cursors/point.png")]
public static const Pointy:Class;
```

I don’t want to have to write additional code to make this stupid thing work. I want one function to iterate over all my embeds and create cursors out of them. I thought I’d use AS3’s favorite (and only) reflection utility: [describeType](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/utils/package.html#describeType\(\) "describeType(describeType)"). But everyone has used that method and everyone has written a blog post about it. There is one gotcha, however, that doesn’t seem to have received much attention.

Say I use describeType to find all of my embeds, then I try:

```
var cursorClass:Class = getDefinitionByName(cursorClassName) as Class;
```

This line always returns null! Turns out, if I want to instantiate a Class that’s a member of another Class, I can’t just use this ordinary method. I have to prefix cursorClassName name with the qualified class name of the Class it’s a member of, like so:

```
var cursorClass:Class = getDefinitionByName(getQualifiedClassName(this) + "_" + cursorClassName) as Class;
```

And voila! My code can now instantiate all our cursors just from an embed tag!
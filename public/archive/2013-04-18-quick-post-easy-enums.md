---
title: "Quick Post: Easy Enums"
date: 2013-04-19T01:28:49.000Z
original_url: https://thegoldenmule.com/blog/2013/04/quick-post-easy-enums/
---

On any engineering team, it’s sometimes difficult to agree on best practices. Everyone has different ideas of good style, consistency, etc. But there’s one thing we’ve reached consensus on: **enums**.

Here is what our best practices say an enum definition should look like (keep in mind, this is only for int valued enums):

```
public enum MyEnum {
	Unset = -1,

	Default,
	...

	NumEnums
}
```

There are a couple of cool things going on here.

First, enums are always initialized to 0, so there MUST be a 0-valued default enum. The rest of the definition comes from making enums easier to use as array indices. If the value is Unset, you know you can’t index into an array with it, and NumEnums will handily give you the length of an array when cast to an int.

Here is where this shines:

```
for (int i = 0, len = (int) MyEnum.NumEnums; i < len; i++) {
	// do stuff
}
```

Handy, eh?
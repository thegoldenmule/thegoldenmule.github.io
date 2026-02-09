---
title: "Quick Post: Currying Func (and variants)"
date: 2013-03-07T04:49:37.000Z
original_url: https://thegoldenmule.com/blog/2013/03/quick-post-currying-func-and-variants/
---

I recently wanted to [curry](http://en.wikipedia.org/wiki/Currying) a Func (and variants). Here’s how I ended up doing it:

```
public static Func Curry(this Func fn, TCurried arg)
{
	return () => fn(arg);
}

public static Func Curry(this Func fn, TCurried arg)
{
	return param => fn(arg, param);
}

public static Func Curry(this Func fn, TCurried arg)
{
	return (param1, param2) => fn(arg, param1, param2);
}
```

This allows you do do some fun stuff!
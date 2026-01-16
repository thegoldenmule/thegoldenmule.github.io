---
title: "More Memoization"
date: 2013-07-25T23:18:45.000Z
original_url: https://thegoldenmule.com/blog/2013/07/more-memoization/
---

I had to cache the results a couple methods recently, and only after I had done it a few times, I realized I should just write a memoization extension for System.Func.

```
public static Func Memoize(this Func func)
{
	Dictionary dict = new Dictionary();

	return input =>
		{
			if (!dict.ContainsKey(input))
			{
				dict[input] = func(input);
			}

			return dict[input];
		};
}
```

With this handy extension, I’m free to have fun with memoizing arbitrary Funcs.

```
Func fib = n =>
	{
		int a = 0;
		int b = 1;

		for (int i = 0; i < n; i++)
		{
			int temp = a;
			a = b;
			b = temp + b;
		}
		return a;
	};

Func memoizedFib = fib.Memoize();
```
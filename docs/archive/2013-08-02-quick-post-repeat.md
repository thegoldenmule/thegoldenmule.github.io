---
title: "Quick Post: Repeat"
date: 2013-08-02T06:55:58.000Z
original_url: https://thegoldenmule.com/blog/2013/08/quick-post-repeat/
---

```
public static void Repeat(this int value, Action callback)
{
	for (int i = 0; i < value; i++)
	{
		callback();
	}
}

...

10.Repeat(DoStuff);

...

Random.Range(10, 20).Repeat(CreateDoodad);
```
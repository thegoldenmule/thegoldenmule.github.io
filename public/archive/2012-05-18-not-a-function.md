---
title: "Not a Function"
date: 2012-05-18T05:08:21.000Z
original_url: https://thegoldenmule.com/blog/2012/05/not-a-function/
---

```
function myFunction(type:int):void {
	switch (type) {
		...
		case AWESOME:
		{
			function doSomething():void {
				...
			}

			...

			doSomething();
		}
		...
	}
}
```

Error: doSomething is not a function.
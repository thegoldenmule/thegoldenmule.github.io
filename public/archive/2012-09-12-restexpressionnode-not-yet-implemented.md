---
title: "RestExpressionNode not yet implemented"
date: 2012-09-12T21:41:52.000Z
original_url: https://thegoldenmule.com/blog/2012/09/restexpressionnode-not-yet-implemented/
---

Perhaps the least helpful MXMLC error message yet:

```
public function log(level:int, message:String, ... rest):void {
	trace(format(level, message, ...rest));
}
```

Apparently calling a function with …rest on accident will present this compiler error…
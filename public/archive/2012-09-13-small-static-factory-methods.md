---
title: "Small Static Factory Methods"
date: 2012-09-14T04:44:59.000Z
original_url: https://thegoldenmule.com/blog/2012/09/small-static-factory-methods/
---

You know how Cocoa classes generally have static methods that serve as factories?

```
return [NSArray arrayWithObjects:obj1, obj2, nil];
```

That’s a dumb example, especially now that you can do @\[obj1, obj2\], but why not do the same in AS3? For instance:

```
return TransactionResponse.FailedResponse();
```

This would replace something like:

```
var response:TransactionResponse = new TransactionResponse();
response.success = true;
return response;
```

Small, slick. Especially handy when you want all of the properties on an object to be read only, i.e. private with getters. BOOM.
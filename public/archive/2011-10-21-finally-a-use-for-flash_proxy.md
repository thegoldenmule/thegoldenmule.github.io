---
title: "Finally! A use for flash_proxy!"
date: 2011-10-21T22:43:07.000Z
original_url: https://thegoldenmule.com/blog/2011/10/finally-a-use-for-flash_proxy/
---

Yes, believe it or not, I have found a semi-valid use for using the [Proxy](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/utils/Proxy.html "This article is a proxy for just reading the documentation...") class. Never heard of it? I’m not surprised– it doesn’t actually exist. The Proxy class is one of those Flash features that I’ve known about for some time, but I’ve never been able to find an actual use for (similar to [custom metadata](https://thegoldenmule.com/blog/?p=13 "Remember this?")). Here’s my story:

I have a collection of DisplayObjects that I want to tween. I want them all to be tweened in exactly the same way and I want to be able to add and remove DisplayObjects from the collection at any time. Since I’m using a tweening library like [eaze](http://code.google.com/p/eaze-tween/ "It's quite nice"), I can only act on one object at a time:

```
eaze(displayObject).to(0.5, {alpha:0.5});
```

So in order to tween all of my objects, I’ve got a couple of options:

1\. Loop through them and do everything by hand. LAME.

2\. Write a wrapper object that propagates property changes through a collection (which is really the same thing, just encapsulated):

```
class Group {
	var collection:Array = [];

	...

	function add(object:Object);
	function remove(object:Object);

	function set alpha(value:Number):void;
	function get alpha():Number;

	...
}
```

Then tween properties on the Group object. The alpha setter would then loop through the collection and set the alphas on all of the objects. The problem here is that I have to have a getter/setter for each property I want to be able to tween. LAME.

This is where I used the Proxy class to over-engineer a complicated solution just so I could finally use flash\_proxy. Basically, you can extend the Proxy class and “…override the default behavior of ActionScript operations (such as retrieving and modifying properties) on an object.” So, using the Proxy class, my new solution looks like:

```
package com.thegoldenmule.utils
{
	import flash.utils.Proxy;
	import flash.utils.flash_proxy;

	dynamic public class ProxyGroup extends Proxy
	{
		private var _objects:Array = [];

		public function ProxyGroup() {

		}

		public function add(object:Object):ProxyGroup {
			if (_objects.indexOf(object) == -1) {
				_objects.push(object);
			}

			return this;
		}

		public function remove(object:Object):ProxyGroup {
			_objects = _objects.splice(_objects.indexOf(object), 1);

			return this;
		}

		override flash_proxy function callProperty(methodName:*, ... args):* {
			var res:*;

			// custom stuff for later?

			return res;
		}

		override flash_proxy function getProperty(name:*):* {
			return _objects.length > 0 ? _objects[0][name] : null;
		}

		override flash_proxy function setProperty(name:*, value:*):void {
			for each (var object:Object in _objects) {
				try {
					object[name] = value;
				} catch (error:Error) {}
			}
		}
	}
}
```

Isn’t it beautiful? Now I can use getter/setter syntax on my GroupProxy object, and \*regardless of what property I’m accessing\*, the changes will propagate to all the members of its collection.

Yes, it may be unnecessary but it’s actually been pretty handy. Grab it (all 48 lines!) on [github](https://github.com/thegoldenmule/ProxyGroup "Really?").
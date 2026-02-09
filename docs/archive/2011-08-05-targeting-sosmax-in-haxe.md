---
title: "Targeting SOSmax in HaXe"
date: 2011-08-05T23:36:55.000Z
original_url: https://thegoldenmule.com/blog/2011/08/targeting-sosmax-in-haxe/
---

As boring as the title sounds (and it does sound boring), it’s a worthwhile investment to get a good logging solution going on whatever platform you’re developing on. I’ve been playing around with [haXe](http://haxe.org "The X is not a chi, LaTeX nerds") lately and I discovered its trace() function to be severely lacking–that is, until I actually read the [documentation](http://haxe.org/doc/cross/trace) (I’m a man, we don’t read documentation). HaXe allows you to write your own implementation and plug it into the trace function by setting haxe.Log.trace to your own custom class.

When developing in Flash or Unity, I like to use [SOSmax](http://www.sos.powerflasher.com/), an XML socket server. So, I wrote a quick interface that redirects trace() to SOSmax.

All you have to do is add

```
new SOSTrace();
```

to your code. Optionally, you can add a server and port. Subsequent calls to trace() will be directed to SOSmax. Additionally, you can specify a log level as the second parameter (defaults to SOSTrace.DEBUG):

```
trace("Log THIS!", SOSTrace.WARN);
```

Finally, you can use replacement–though this is less useful than in AS3, because in HaXe you can actually compile out all the trace() statements with the –no-traces compiler option.

```
trace("Point at ({0}, {1}).", SOSTrace.DEBUG, point.x, point.y);
```

Grab it on [github](https://github.com/thegoldenmule/HaXe-SOSTrace "It's actually a virus--nah, I'm kidding").

UPDATE: Check out [https://thegoldenmule.com/blog/?p=261](https://thegoldenmule.com/blog/?p=261). I’ve since added a JavaScript target as well!
---
title: "SOSTrace — now in JS!"
date: 2011-08-18T22:21:33.000Z
original_url: https://thegoldenmule.com/blog/2011/08/sostrace-now-in-js/
---

It was brought to my attention by a comment in a [previous article](https://thegoldenmule.com/blog/?p=201) that my HaXe trace target should be platform agnostic (I think that’s the right term). In particular, he wanted a trace target for JS and PHP. Well I’m happy to report it took about 5 minutes to add JS support! PHP will have to wait a bit, as the interface for PHP sockets is a bit different, but its day will come soon enough.

The interface hasn’t changed a bit, but in order to get your JS HaXe project set up with SOSTrace, you’ll have to add a short, unfortunate blurb to your compile.hxml. Basically, we still have to use Flash’s XMLSocket class, since JavaScript [WebSockets](http://dev.w3.org/html5/websockets/ "Not completely IE6's fault this time...") are still a ways off. HaXe has foreseen this need and included a nice way of using a simple Flash file as a proxy, just add this to your compile.hxml file:

```
-swf flashsocket.swf
haxe.remoting.SocketWrapper
```

Head over to [github](https://github.com/thegoldenmule/HaXe-SOSTrace) to get the latest source.
---
title: "How to Pwn Web-Apps (for web-app n00bs)"
date: 2011-08-11T21:58:42.000Z
original_url: https://thegoldenmule.com/blog/2011/08/how-to-pwn-web-apps-for-web-app-n00bs/
---

The web is, to put it mildly, a fierce and fickle mistress. As a development platform, it’s like trying to ride a horse-sized stick of margarine and your reins are made of light-sabers. Seriously, I’m talking to you Mozilla, Opera, Google, and whoever shoveled IE together–quit “innovating” (I guess some people use Safari too, and that’s their constitutional right).

Anyway, lately I’ve had the pleasure of writing an HTML5 web-app (I use “HTML5” mostly to impress my readers) that targets all the major browsers plus iPad. I’m not the greatest JS dev, so it’s been tough. But let me tell you: as much as I have just eloquently complained, it’s been a ton of fun. That is not to say, however, that it’s not been a giant pain in the squishables. Oh no–I have my gripes, but more importantly, I have learned some interesting lessons along the way.

If you’re planning on writing a web-app in the near future and you have little experience, take heed to a few basics (and if you disagree or have more tips, share in the comments!):

1\. The most important rule, the one rule to rule them all (and this goes for all languages): steal as much code as you can. Seriously. Odds are, whatever you are trying to do has been done better than you would do it.

2\. Use [jQuery](http://jquery.com/ "The gold standard") or something similar. Use [jQuery-UI](http://jqueryui.com/ "Don't ask me how, it just works") (or some [other](http://www.sencha.com/ "If you've got the cash...") UI [library](http://yuilibrary.com/gallery/ "If you like declining companies...")) and don’t try to write all that crap yourself. The people that write JS frameworks are bred in test-tubes. It’s like the Olympics, they train their whole lives just for the three lines of code they will eventually commit.

3\. Use [Modernizr](http://www.modernizr.com/ "Modernize THIS!") or some other feature detection library. It’ll keep you from thinking about browser sniffing (as fun as that sounds).

4\. Don’t use [JSLint](http://jslint.com/ "I SAID DON'T!"). You’ll not only feel bad about yourself, you’ll start programming like David Flanagan. That’s not altogether a bad thing, but it’s also not altogether a good thing either. Be free! Try [JSHint](http://jshint.com/ "Ah, this is more like it.") instead.

5\. If you’re targeting mobile Safari, you should be aware of Apple’s [custom meta tags](http://developer.apple.com/library/safari/#documentation/appleapplications/reference/SafariHTMLRef/Articles/MetaTags.html "Shh! Apple is clearly trying to keep it secret!"). There is meta for running web apps full-screen on iOS, setting the status bar’s CSS style, and setting the window’s size. The last one is extremely helpful! With it, you can eliminate page scroll on touch + drag.

6\. Many touchscreen devices do \*not\* fire mouse events, instead they fire touch events. If you are targeting touchscreen devices as well as normal, down-to-earth, God-fearing devices, you should get used to listening for both event types. For instance:

```
// the jQuery user's approach
$(obj).bind("mousedown touchstart", mouseDownHandler);

// the philistine's approach
if (obj.addEventListener) {
	obj.addEventListener("mousedown", mouseDownHandler, false);
	obj.addEventListener("touchstart", mouseDownHandler, false);
} else if (obj.attachEvent) {
	obj.attachEvent('onmousedown', mouseDownHandler);
	obj.attachEvent('ontouchstart', mouseDownHandler);
}
```

7\. If you really are using a UI library, be aware that you may need to use a plugin to handle touch events. For instance, the core jQuery-UI library does not handle touch events. This means that some components will misbehave (like the slider) and some may simply not work at all. There are a few solutions for jQuery-UI in particular – [here](http://code.google.com/p/jquery-ui-for-ipad-and-iphone/ "Check it") and [here](http://furf.com/exp/touch-punch/ "PUNCH").

8\. Understand some basic JS design patterns before you start using MyObject.prototype.someMethod everywhere. I think a lot of people come to JS not understanding that with a [little syntactic grace](http://javascript.crockford.com/private.html "Read this you n00b!"), you can hide object information just as well as in classical languages (okay, maybe not \*just\* as well).
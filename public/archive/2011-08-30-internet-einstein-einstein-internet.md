---
title: "Internet, Einstein; Einstein, Internet"
date: 2011-08-31T01:18:32.000Z
original_url: https://thegoldenmule.com/blog/2011/08/internet-einstein-einstein-internet/
---

I love coming up with names for my side projects.  There was the [Terramorphic Genesis Algorithms](https://thegoldenmule.com/blog/?p=80) (yes, like that [Magic](http://gatherer.wizards.com/pages/card/Details.aspx?multiverseid=247328 "Naw I don't play, I'm more into Pokemon") card)  awhile back. Before that I wrote a brilliantly slow physics engine dubbed ARCHAUSS (Archimedes + Gauss). Well now I’d like to keep it simple with a project called _Einstein_. It may prove to be my most worthless project yet–but stay tuned! At least it’s interesting!

Years ago I read a book by Einstein called _Relativity: The Special and General Theories_ (you may have heard of it). In this book he outlines some high school level algebra called the [Lorentz transformations](http://en.wikipedia.org/wiki/Lorentz_transformation) (no, he didn’t come up with the equations) that took classical physics by storm. Basically, he says that there are two seemingly contradictory axioms we need to resolve:

1\. If there are two observers K and K’, “natural phenomena run their course with respect to K’ according to exactly the same general laws as with respect to K.” This is called the principle of relativity.

2\. Light travels in a vacuum at a constant speed, regardless of observer.

In order to solve the apparent paradox, he argues that time itself is not an absolute, neither distance, but both must be transformed depending on your observer.

# Enough theory! What is this post about?!

Through the Lorentz transformation, we discover that if an object is traveling relative to some observer, that observer will see the object shortened in the direction of the object’s motion–but this is only really noticeable for object’s traveling near light speed. I have always wondered what it would look like to actually see this happen and if this kind of thing could be used in a game. So, I’ve written a simple simulator! It’s almost as visually unimpressive as it is useless!

![Whoops.](images/ss-a4c514e5.png)
_Click for live demo_

# What’s the simulator actually doing?

There are several things that separates this from a traditional physics engine:

1\. Everything is HUGE. I haven’t calculated it exactly, but the small screen you’re watching is simulating millions of square kilometers.

2\. There is no collision detection or response. I would like to add some simple collision detection in the coming weeks, but I don’t think I’ll ever write a collision response mechanism. For one, what happens when giant objects collide while moving near the speed of light is… tricky? Possibly unknown? I don’t really know. If you want a \*useful\* collision detection engine, there are plenty of other options.

3\. The frame of reference is interchangeable. In a normal physics engine, each object has position, velocity, rotation, etc. Those values are with respect to some static starting point. That doesn’t quite work for this engine. Instead, everything is an instance of an Observer class. The various state properties are all relative to the engine’s frame of reference–which is one of the Observer instances. The Observer instance the engine is currently using as its reference frame has all of those properties set to zero because, relative to yourself, you are at the origin, moving at zero velocity with no rotation. Because everything is an Observer, the engine is free to switch reference frames, as long as it goes through each Observer’s physical properties and transforms them to the new coordinate system. Cool huh?

4\. Each observer carries its own clock. The simulation starts at t = 0, and each observer’s clock is incremented relative to the reference frame.

# What is this simulator \*not\* doing?

1\. At this point, information is traveling instantaneously, which is a classical notion. For the purposes of a demo, I’m not convinced it matters, but if I were to implement something more (like the near-lightspeed Asteroids game I’m working on) it might.

2\. None of these objects have any acceleration. That’s obviously not a requisite, but it made the demo a bit easier to manage.

The engine is on [github](https://github.com/thegoldenmule/Einstein "Git it now!"), but I suggest you don’t download the source. It’s buggy, unreliable, and has a terrible API. I \*do\* suggest you watch it though, as I plan on doing some large improvements.
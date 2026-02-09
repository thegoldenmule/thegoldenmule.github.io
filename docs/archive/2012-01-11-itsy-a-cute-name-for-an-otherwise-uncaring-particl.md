---
title: "Itsy– a cute name for an otherwise uncaring particle system"
date: 2012-01-12T03:50:16.000Z
original_url: https://thegoldenmule.com/blog/2012/01/itsy-a-cute-name-for-an-otherwise-uncaring-particle-system/
---

There are probably plenty of HTML5 particle systems out there–just pay a visit to old man Google and you’ll see (I didn’t actually look because I was busy assuming I needed to write my own). The problem with all of those other particle systems is that I didn’t write them. Also they probably suck. Again I don’t actually know.

Anyway, mostly as an exercise, I wrote my own and I call it Itsy; both because thegoldenmule is always in a whimsical mood, and because if you don’t make 10 million references to how small (lightweight!) a javascript library is, **it’s not really javascript**.

Itsy core is less than 2kb–that’s not minimized or gzipped, folks. That’s about 100 lines (including verbose comments) of non-stop, unfettered, [balls-to-the-walls](http://www.wordorigins.org/index.php/balls_to_the_wall/ "It's a piloting term!") particle proliferation. Does that mean it can’t really do anything? By no means! Itsy is completely _plugin driven,_ which is a fancy JavaScripty term for: “it uses the well known decorator design pattern.” It comes with many of the basic plugins needed to make all sorts of particles! If you need something it doesn’t come with, don’t make a feature request– write it your-freaking-self, complainer.

How about a quick **example****:**

Say I want a very basic particle emitter that just makes red circles.

```
var emitter = new thegoldenmule.particle.ParticleEmitter([
		new thegoldenmule.particle.Acceleration(0, -0.09),
		new thegoldenmule.particle.Position(x, y, 10),
		new thegoldenmule.particle.BasicRenderer(context, 200, 0, 0, 1, 10)
]);
```

DONZO. Say I want something more sophisticated… A small explosion!

```
var emitter = new thegoldenmule.particle.ParticleEmitter([
		new thegoldenmule.particle.Acceleration(0, -0.09),
		new thegoldenmule.particle.Velocity(3 * Math.PI / 4, 5 * Math.PI / 4, size / 10, size / 10),
		new thegoldenmule.particle.Position(x, y, size),
		new thegoldenmule.particle.Lifetime(1000, 2000),
		new thegoldenmule.particle.EmissionRateFade(50, 0, 100),
		new thegoldenmule.particle.ColorTweenRenderer(context)
				.addColor(0, 255, 255, 200,0.5)
				.addColor(0.3, 255, 255, 50, 0.3)
				.addColor(0.5, 255, 70, 0, 0)
				.addColor(1, 0, 0, 0, 1)
]);
```

BOOM! Awesome, huh? I think the plugin names are fairly descriptive, so I won’t explain what each one does… Also because I’m in a hurry! Grab it on [github](https://github.com/thegoldenmule/Itsy "Grab it NOW!").
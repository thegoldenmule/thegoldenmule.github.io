---
title: "Itsy Updates (plus a bonus tutorial)!"
date: 2012-05-15T05:48:23.000Z
original_url: https://thegoldenmule.com/blog/2012/05/itsy-updates-plus-a-bonus-tutorial/
---

I’ve been working on Itsy lately, because, let’s be honest, my fire demo was only marginally cool. Now, however, even people who aren’t my mom may tell me it looks cool! Check out my new fire:

\[iframe src=”https://thegoldenmule.com/labs/ParticleDemos/examples/newFire.html” width=”100%” height=”400″ width=”400\]

Now that’s an improvement. On to the bonus tutorial.

**\[WARNING: Bonus content ahead.\]**

In [Scorch3d](https://thegoldenmule.com/blog/?p=19 "This one goes to 11"), I wanted to add smoke trails to my projectiles. So I came up with a decent smoke effect and I wrote an Itsy plugin that moves the emitter position as the projectile moves and bam, happy as a peach. For demonstration purposes, I’ve written a second plugin that follows the mouse and adds smoke when you hold down the mouse button:

\[iframe src=”https://thegoldenmule.com/labs/ParticleDemos/examples/smokeTrail.html” width=”100%” height=”400″ width=”400\]

I call the effect, Space Smoke III. Here’s the particle definition:

```
var emitter = new thegoldenmule.particle.ParticleEmitter([
	new thegoldenmule.particle.Lifetime(100, 5000),
	new thegoldenmule.particle.Acceleration(0, -0.0009),
	new thegoldenmule.particle.FollowMouse(3, 10),
	new thegoldenmule.particle.ColorTweenRenderer(context)
			.addColor(0, 20, 50, 50, 255, 0.7)
			.addColor(0.5, 10, 0, 20, 0.3)
			.addColor(1, 0, 0, 0, 0)
			.withRandomSize(1, 3)
]);
```

You’ve seen most of this stuff before, but take a look at the FollowMouse plugin. That’s the custom malarky for following the mouse and droppin’ it like it’s hot. Here’s the implementation of that:

```
thegoldenmule.particle.FollowMouse = function(radius, emissionRate) {
	this.radius = radius;
	this.emissionRate = emissionRate;

	var that = this;
	$(document)
		.mousedown(function() {
			that.mouseDown = true;
		})
		.mouseup(function() {
			that.mouseDown = false;
		})
		.mousemove(function(event) {
			that.mouseEvent = event;
		});
};

thegoldenmule.particle.FollowMouse.prototype = (function() {
	function mouseX(evt) {
		if (evt.pageX) {
			return evt.pageX;
		} else if (evt.clientX) {
			return evt.clientX + (document.documentElement.scrollLeft ?
				document.documentElement.scrollLeft :
				document.body.scrollLeft);
		}

		return null;
	}
	function mouseY(evt) {
		if (evt.pageY) {
			return evt.pageY;
		} else if (evt.clientY) {
			return evt.clientY + (document.documentElement.scrollTop ?
				document.documentElement.scrollTop :
				document.body.scrollTop);
		}

		return null;
	}

	function rand() {
		return 2 * Math.random() - 1;
	}

	return {
		updateGlobal:
			function(emitter) {
				if (this.mouseDown) {
					emitter.emissionRate = this.emissionRate;
				} else {
					emitter.emissionRate = 0;
				}
			},
		initialize:
			function(emitter, particle) {
				particle.x = mouseX(this.mouseEvent) + rand() * this.radius - emitter.x;
				particle.y = mouseY(this.mouseEvent) + rand() * this.radius - emitter.y;
			}
	};
})();
```

Yes, it’s as simple as it looks. The FollowMouse plugin has two simple parameters: the radius about the mouse position to generate smoke, and the emission rate with which to generate it. I then listen for mouse events using jQuery to cheat (all hail jQuery). In the prototype I’ve got two helper functions that determine mouse position, generously donated by  [quirksmode](http://www.quirksmode.org/). Following that, I define two function that are called by the Itsy engine. The first, updateGlobal, is called on each plugin (where defined) during the update loop. This is called before any particle is updated. The second function, initialize, is called when each particle is created. I’m giving it a random position about the mouse position.

And that’s it!

Yes, one day I’ll document all of the functions that may be used within Itsy, but for today, this is all the time I have.
---
title: "QuickPost: Faking gravity"
date: 2012-02-22T03:32:58.000Z
original_url: https://thegoldenmule.com/blog/2012/02/quickpost-faking-gravity/
---

Very recently, I needed an object to shoot into the air and fall realistically, but I didn’t want to import a tweening library or a physics engine. What I needed was some sort of parametric equation that would act like gravity… What would this mysterious equation be… Oh, that’s right, [Newton’s equation of motion](http://en.wikipedia.org/wiki/Equations_of_motion#Newton.27s_2nd_law_for_translation "I second the motion") for constant linear acceleration is already parametric!

So in my update function, I simply calculate the object’s position:

```
var elapsed:Number = 0;

// force of gravity
var gravity:int = 180;

// initial velocity
var v0:int = 100;
_update = function(dt:Number):void {
	_primitive.y = v0 * (elapsed += dt) - gravity * elapsed * elapsed;
};
```

I just fiddled with gravity until I got something that looked good. One more thing: I wanted the object to do a flip as well. This I could do with a simple linear parametric function, but I needed the total time of the tween so it could land correctly. No problem!

```
var elapsed:Number = 0;
var gravity:int = 180;
var v0:int = 100;

// calculate the total time!
var tTot:Number = v0 / gravity;
_update = function(dt:Number):void {
	_primitive.y = Main.SCALE * (v0 * (elapsed += dt) - gravity * elapsed * elapsed);
	_primitive.rotationX = (elapsed / tTot) * 360;
};
```
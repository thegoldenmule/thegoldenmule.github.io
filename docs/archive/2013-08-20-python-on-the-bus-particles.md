---
title: "Python on the Bus: Particles"
date: 2013-08-21T03:39:26.000Z
original_url: https://thegoldenmule.com/blog/2013/08/python-on-the-bus-particles/
---

On my way to work today, I wrote a “particle engine” in Python [on my iPhone](http://omz-software.com/pythonista/ "Buy it."). _Particle engine_ is a fairly generous term (it’s 90 lines) but hey it’s plugged in to the accelerometer!

I used the Pythonista particle demo as an example but I didn’t borrow its implementation as you’ll see. I use a simple ring buffer for particles and emit using a simple physics model where the accelerometer value is the force of gravity (F=ma anyone?). Take a peek– a full xcode project is here:

[https://github.com/thegoldenmule/PythonOnTheBus/tree/master/Particles](https://github.com/thegoldenmule/PythonOnTheBus/tree/master/Particles)
---
title: "Itsy Examples"
date: 2012-01-15T02:49:25.000Z
original_url: https://thegoldenmule.com/blog/2012/01/itsy-examples/
---

Click on the canvases to start + stop each particle emitter. You should probably stop each particle emitter rather than running all three at once. 🙂

```
new thegoldenmule.particle.ParticleEmitter([
	new thegoldenmule.particle.Acceleration(0, -0.09),
	new thegoldenmule.particle.Velocity(3 * Math.PI / 4, 5 * Math.PI / 4, 1, 1),
	new thegoldenmule.particle.Position(0, 0, 10),
	new thegoldenmule.particle.Lifetime(1000, 2000),
	new thegoldenmule.particle.EmissionRateFade(50, 0, 100),
	new thegoldenmule.particle.ColorTweenRenderer(context)
			.addColor(0, 255, 255, 200,0.5)
			.addColor(0.3, 255, 255, 50, 0.3)
			.addColor(0.5, 255, 70, 0, 0)
			.addColor(1, 0, 0, 0, 0.5)
])
```

\[iframe src=”https://thegoldenmule.com/labs/ParticleDemos/examples/smallExplosion.html” width=”100%” height=”400″ width=”400\]

```
new thegoldenmule.particle.ParticleEmitter([
	new thegoldenmule.particle.Acceleration(0, -0.09),
	new thegoldenmule.particle.Velocity(3 * Math.PI / 4, 5 * Math.PI / 4, 1, 1),
	new thegoldenmule.particle.Position(0, 100, 10),
	new thegoldenmule.particle.Lifetime(1000, 2000),
	new thegoldenmule.particle.ColorTweenRenderer(context)
			.addColor(0, 255, 255, 200,0.5)
			.addColor(0.3, 255, 255, 50, 0.3)
			.addColor(1, 255, 70, 0, 0.2)
]);
```

\[iframe src=”https://thegoldenmule.com/labs/ParticleDemos/examples/fire.html” width=”100%” height=”400″ width=”400\]

```
var _emitters = [
	new thegoldenmule.particle.ParticleEmitter([
		new thegoldenmule.particle.Position(0, 0, 150, 70),
		new thegoldenmule.particle.Attractor(0, 0, 1000),
		new thegoldenmule.particle.EmissionRateFade(1, 5, 3000),
		new thegoldenmule.particle.Lifetime(500, 900),
		new thegoldenmule.particle.VelocityRenderer(context, 0.5)
			.withColor(20, 200, 20, 1, 0)
			.withColor(20, 100, 100, 1, 1)
	], 200, 200),
	new thegoldenmule.particle.ParticleEmitter([
		new thegoldenmule.particle.Position(0, 0, 600),
		new thegoldenmule.particle.Attractor(0, 0, 1000),
		new thegoldenmule.particle.EmissionRateFade(1, 10, 3000),
		new thegoldenmule.particle.Lifetime(500, 900),
		new thegoldenmule.particle.ColorTweenRenderer(context)
			.addColor(0, 255, 255, 200, 0.7)
			.addColor(1, 200, 0, 20, 0.2)
			.withRandomSize(1, 3)
	], 200, 200)
];
```

\[iframe src=”https://thegoldenmule.com/labs/ParticleDemos/examples/charging.html” width=”100%” height=”400″ width=”400\]

Download on [github](https://github.com/thegoldenmule/Itsy "An Itsy download").
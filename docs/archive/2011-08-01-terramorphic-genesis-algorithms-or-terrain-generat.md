---
title: "Terramorphic Genesis Algorithms (or Terrain Generation)"
date: 2011-08-01T23:12:26.000Z
original_url: https://thegoldenmule.com/blog/2011/08/terramorphic-genesis-algorithms-or-terrain-generation/
---

My fascination with the game Scorched Earth knows no bounds. One might say I am the [Mother of All Scorched Earth Fans](http://www.google.com/search?sourceid=chrome&ie=UTF-8&q=mother+of+all+games "Just in case you didn't get it..."). One of my earliest fascinations with the game (keep in mind, I was like 10) was that I could play for hours and hours and never play the same level twice. The ground was all shifty! I tried writing my own “Terrain Genesis System,” as I dubbed it, in the mighty [QBasic](http://en.wikipedia.org/wiki/Gorillas_\(video_game\) "The second best game ever"), but most of my terrains ended up looking mysteriously similar to a straight line (this was shortly after I tried to write my own Zork-inspired adventure in QBasic–I had a great story but fleeting gameplay…).

Well guess what? You can shove it, 1991, because I’ve finally caught up with you! I can now generate TWO different types of terrain! I dub my creation: the Terramorphic Genesis Algorithms.

There are two very basic types of terrain generation I have found to be useful, particularly if you’re looking for Scorched Earth-style terrain. The first is called limited-random, the second: circle-hill (I didn’t come up with these uninspired names; definitely not enough mythological references for my taste).

# Limited Random

Limited random terrains are characterized by pointyness, much like the common greyhound. The algorithm is below, presented in technicolor javascript, but it’s easy enough to translate these to AS3 or… really [any other language](http://www.cs.hmc.edu/ACM/3497.html "Try it in this, sucker").

```
function generateLimitedRandom() {
	// create a two-dimensional array
	var heightMap = new Array2(_that.width, _that.height);

	// iterate over every index
	for(var i = 0; i < width - 1; i++){
		for(var j = 0; j < height - 1; j++){
			var a = 0;

			// grab a previous value
			if(i != 0 && j != 0){
				a = (heightMap.get(i - 1, j) + heightMap.get(i, j - 1)) / 2;
			}
			else if( i != 0 && j == 0 ){
				a = heightMap.get(i - 1, j);
			}
			else{
				a = Math.random() * height;
			}

			// add a random number, capped my a maximum increase
			var h = a + maximumHeightIncrease * (Math.random() - 1 / 2);

			// set the value at that index, between predefined boundaries
			heightMap.set(i, j, Math.max(minimumHeight, Math.min(h, maximumHeight)));
		}
	}

	return heightMap;
};
```

Pretty simple, eh? You’re basically just adding a random number to each value, but you’re making it behave by grabbing a previous value. The next type is much more interesting, I swear.

# Circle-Hill

In circle-hill generation, the algorithm picks random coordinates on the two dimensional array and adds a randomly sized hill to each spot.

```
function generateCircleHill() {
	var circleRadiusSquared = circleRadius * circleRadius;

	// make + fill a 2D array
	var heightMap = new Array2(width, height);
	heightMap.fill(50);

	// iterate once per hill you want to add (given by numCircles)
	for(var pd_i = 1; pd_i < numCircles; pd_i++){
		// ~~ is moderately faster than converting these to integers
		var pd_x = ~~(Math.random() * width);
		var pd_y = ~~(Math.random() * height);

		// no iterate over all the values around the hill
		for(var pd_j = 0; pd_j < width - 1; pd_j++){
			for(var pd_k = 0; pd_k < height - 1; pd_k++){
				// only edit those within a certain distance
				var pd_d = (pd_x - pd_j)*(pd_x - pd_j) + (pd_y - pd_k)*(pd_y - pd_k);
				if(pd_d < circleRadiusSquared){
					// change the height trigonometrically
					var pd_a = (circleHeightIncrease / 2) * (1 + Math.cos(Math.PI * pd_d / (circleRadiusSquared)));
					heightMap.set(
						pd_j,
						pd_k,
						Math.min(heightMap.get(pd_j, pd_k) + pd_a, maximumHeight));
				}
			}
		}
	}

	return heightMap;
};
```

Circle-hill generation generally produces much more pleasing terrain than limited-random, but they each have their uses.

Take a look at the [demo page](https://thegoldenmule.com/labs/TerramorphicGenesisAlgorithms/ "Hold on to yer butts...") if you’re interested in seeing what these two algorithms can do. You’ll need a browser that supports the canvas tag–sorry if it doesn’t work on your browser, I did not take the time to test it everywhere. I should note, these algorithms actually create 3D terrain, but in the demo page I am taking cross sections to get the Scorched Earth-style result:

```
for (var i = 0; i < width; i++) {
	var value = map.get(i, CONSTANT);
}
```

If you want the source, head over to [github](https://github.com/thegoldenmule/EasyTerrain "If you dare...").
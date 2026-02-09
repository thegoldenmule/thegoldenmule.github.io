---
title: "Earthican Shader"
date: 2013-01-15T02:38:52.000Z
original_url: https://thegoldenmule.com/blog/2013/01/earthican-shader-2/
---

In my [previous post](https://thegoldenmule.com/blog/?p=661 "Spherical Terrain Generation"), I described a process for generating terrain on a spherical mesh. As the [screenshot](https://thegoldenmule.com/blog/?attachment_id=665 "Beautiful.") showed, the algorithm worked pretty well to give you a lumpy looking planet or asteroid. But– what if you want it to look like Earth? Green continents, blue water? You know the Earth I’m talking about.

Well here’s my first attempt:

![Not bad!](images/world-b2f7837e.png)
_Not bad!_

The caption says it all.

## How does he do it?

In order to get this Earthy feel I really only needed a proper surface shader, since the mesh geometry is uniform across the surface regardless of the bumps and whatnot. First, my properties:

```
_Center ("Center Point", Vector) = (0, 0, 0, 0)
_OceanColor ("Ocean Color", Color) = (0, 0.1, 0.7, 1)
_LandColor ("Land Color", Color) = (0, 0.7, 0.1, 1)
_BlendDistance ("Blend Distance", Float) = 1
_BlendThreshold ("Blend Threshold", Float) = 0.001
```

\_Center defines the center point of the sphere. This is so that I can calculate how high a vertex is, i.e. its distance from the center of the planet. Then there are colors for the ocean and water. \_BlendDistance essentially defines sea level, and \_BlendThreshold defines the distance to blend across. These default values are what you see in the screenshot.

Then we define a vertex program:

```
void vert (inout appdata_full v) {
	float dist = distance(_Center.xyz, v.vertex.xyz);

	// flatten the oceans
	if (dist <= _BlendDistance) {
		v.normal = normalize(v.vertex.xyz);
		v.vertex.xyz = normalize(v.vertex.xyz);
		v.vertex.xyz *= (1 - _BlendThreshold);
	}
}
```

Stupid simple. Essentially you normalize any vertices that are below sea level, thereby smoothing out the oceans. You also want to correct the normals. Finally, we define a surface shader:

```
struct Input {
	float3 worldPos;
};

void surf (Input IN, inout SurfaceOutput o) {
	float dist = distance(_Center.xyz, IN.worldPos);
	float startBlending = _BlendDistance - _BlendThreshold;
	float blendFactor = saturate((dist - startBlending) / _BlendThreshold);

	half4 color = lerp(_OceanColor, _LandColor, blendFactor);

	o.Albedo = color.rgb;
	o.Alpha = color.a;
}
```

I’ve included the Input struct to show that the world position needs sent in as well. This is so that I can apply the correct colors at the correct distances. I use a simple lerp and apply it to the albedo which colors the earth appropriately.

Simple as that!

## Further Thoughts

The only problem with this method, is that it doesn’t give a ton of definition unless you have an extremely high resolution mesh. The mesh above has over ten thousand vertices. For oceans, which only need to look spherical, that’s probably enough, but if you look at the areas where the continents meet the sea, it would be nice if there was more geometry to make the transitions smoother.

An interesting study I may pursue later is iterating over the edges of the land and adding more geometry.

Another idea, which dawns on me now that I’m flattening out oceans in the vertex program, is putting the procedural transformations of vertices actually in the shader, rather than transforming in an iterative fashion on the CPU.

Anyway, just a couple ideas.
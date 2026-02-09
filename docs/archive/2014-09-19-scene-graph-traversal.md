---
title: "Scene Graph Traversal"
date: 2014-09-19T22:59:26.000Z
original_url: https://thegoldenmule.com/blog/2014/09/scene-graph-traversal/
---

**<rant>**

For some reason, Unity has made it a chore to work with their scene graph.

There are loads of problems with it: **there’s no root** so you can’t actually traverse the whole scene without using tags, **there is a terrible traversal API** (IEnumerator or GetChild(int)), **you can’t add and remove** objects from the scene graph, in code it’s **difficult** to tell whether or not a GameObject is a prefab or an instance, there’s **no central management** of the scene, the Transform-GameObject relationship is **simply weird** as there is a 1-1 relationship but only one of them allows graph traversals– the list goes on and on.

Why couldn’t they have a simple [SceneManager](https://github.com/thegoldenmule/boX/blob/master/md/SceneManager.md "Took all of an hour") that makes everything a bit simpler? The Unity scene is literally the same as an XML document– we could use XPath, e4x, or like that link I just shared, some other mashup of the two.

You don’t even need a manager, you could slap it all on the graph node: Transform. All you’d need to manage the scene is a single root node and you could fly!

WE KNOW SO MANY THINGS ABOUT GRAPHS.

Yes yes, I know what you’re thinking: you could just organize your scene such that there’s a root node and you could just write a bunch of extension methods. This is true, but you’re going to be fighting it forever. If you do new GameObject(), guess what, it’s not going to be a child of your root– and extension methods can only go so far.

Sigh.

I am constantly reminded of how terrible Unity is at this. Just this morning I was forced to write this:

```
public static void Walk(this GameObject @this, Action action) where T : Component;

...

myGameObject.Walk(renderer => renderer.enabled = false);
```

Which, while cool, reminds me of exactly how much better Unity could be.

(Image used with [license](https://creativecommons.org/licenses/by/2.0/) by [Noah Sussman](https://www.flickr.com/photos/thefangmonster/352461415).)
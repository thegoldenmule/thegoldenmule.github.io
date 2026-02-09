---
title: "Quick Trick: Generics as a Decorator"
date: 2015-01-06T08:00:09.000Z
original_url: https://thegoldenmule.com/blog/2015/01/quick-trick-generics-as-a-decorator/
---

###  Unity Attributes

Unity likes to use Attributes. They use them all over the place in the Editor to allow you to statically link together Types: like a Type and a class that renders editor controls for that Type:

```
[CustomEditor(typeof(Vector5))]
public class Vector5Editor : Editor
{
	...
}
```

Unity can now look through the assemblies and pull out all classes with the CustomEditor decorator. Now, everytime Unity needs to render controls for a Vector5, it can use this custom implementation. C# is brilliant, right?

Eh, it’s good, but it’s not great because our custom Editor has to extend a class as well as pin on an Attribute. This is not only unnecessary code, it means that Editor has to pass around an Object, which means when you work with whatever API Editor exposes, **you** have to work with an Object.

```
private void OnGUI()
{
	var vector = (Vector5) target;

	...
}
```

D’oh. Editor::target is a stupid Object, not a Vector5.

Instead of using this as a model, consider using generics to link your classes together.

### Enter Generics

Say you are writing a custom editor to work with in game entities. You call these entities **Actors**, cause you want to be cool like Unreal. You also want to let anyone create subclasses of Actor so your Actor system can be, you know, useful.

Like the Unity Editor, you want your editor to be easily extendible, so you want to allow people to write custom editors for their Actor subclasses that will be drawn inside of your editor when necessary. One method is to just mimic Unity’s method of attaching attributes. A better method, I would argue, is to use generics to associate the two classes.

```
public class StaticActorRenderer : ActorRenderer
{
	...

	public void OnGUI()
	{
		// ActorRenderer<>:target is already a StaticActor!
	}

	...
}
```

Now your Actor editor can simply peruse the assemblies for any class that extends ActorRenderer and look at the generic parameter for the association. The generic parameter is your decorator, so you can ditch the Attribute.

In addition, your ActorRenderer base class can perform useful actions on a **typed** entity and can expose a **typed** API.

Yes please.
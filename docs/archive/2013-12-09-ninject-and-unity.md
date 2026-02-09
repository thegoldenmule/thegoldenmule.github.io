---
title: "Ninject and Unity"
date: 2013-12-10T04:42:51.000Z
original_url: https://thegoldenmule.com/blog/2013/12/ninject-and-unity/
---

## The Background

I have searched high and low for a good dependency injection solution that works well with Unity, even when AOT’d. Unfortunately, even my most brilliantly worded Google queries have rendered fruitless results. I’m a little bit ashamed to admit this, but I even tried ‘Binging’ it.

A host of full blown, .NET DI frameworks won’t compile against .NET 2.0 and the remaining libraries usually JIT, meaning they won’t work when compiled to crummy old, JITless iOS. What’s more, it seems that no one in Unity land has figured out how to use MonoBehaviours in conjunction with dependency injection.

## NinjectSettings

When configuring Ninject, there’s a simple flag that controls how the injection mechanism works. Simply tell Ninject to use reflection based injection, rather than JIT.

```
_kernel = new StandardKernel(
	new NinjectSettings
	{
		UseReflectionBasedInjection = true,
		LoadExtensions = false
	},
	new CoreModule());
```

The LoadExtensions setting is also crucial, as it seems that the way Ninject loads in extensions is also illegal.

## Working With MonoBehaviours

I’m not going to go over how to use Ninject, but I will go over my solution for using injection in tandem with GameObjects and Monobehaviours. There are two real possibilities: either you want to inject into a MonoBehaviour, or you want to inject a MonoBehaviour into something else. As a solution to the first, I created a simple class called InjectableMonoBehaviour and call inject from Awake: the earliest possible time I have control after MonoBehaviour construction.

```
protected virtual void Awake() {
	Main.InjectScript(this);
}
```

In Main.cs, I’m doing something equally non-fancy:

```
public static void InjectScript(MonoBehaviour script) {
	if (null == _main)
	{
		GameObject main = GameObject.FindGameObjectWithTag("MainCamera");
		_main = main.GetComponent();
	}

	_main._kernel.Inject(script);
}
```

With InjectableMonoBehavior, I can do incredible things. Check out this MonoBehaviour:

```
public class Touchable : InjectableMonoBehaviour
{
	[SerializeField]
	private Bounds _bounds;

	[Inject]
	public InputController InputController {
		get;
		set;
	}

	// elided
}
```

Now my instance of Touchable magically has a reference to an InputController. Brilliant.

## HierarchyResolver

I’ve covered injecting into MonoBehaviours, so now I’ll cover the more tricksy, injecting MonoBehaviours into other objects.

HierarchyResolver<T> is a subclass of Provider<T>, which is essentially a factory class provided by Ninject. Overriding Provider<T> allows you to specify a specific implementation for the injection of a particular type. This allows me to do a few cool things.

With HierarchyResolver, you can place a MonoBehaviour in the scene, and inject that specific instance through Ninject’s usual injection mechanisms. For instance, say I place a CameraController on the scene’s main camera. If I want to inject that via Ninject, I just have to configure a HierarchyResolver<CameraController> in whatever module you wish:

```
Bind().ToProvider(new HierarchyResolver("MainCamera"));
```

This is binding a Provider<CameraController> to the Ninject module. Additionally, HierarchyResolver can take a tag as a constructor argument. The tag is where a recursive search for the dependency is started. I can leave off the tag if I want to, but using tags will always be more straightforward and performant. In this case, I’ve tagged the scene’s camera with the “MainCamera” tag, so the resolver finds the dependency immediately.

## InjectFromHierarchy

I’ve done one more really cool thing, I think.

The above method of injecting MonoBehaviours into other objects is very useful, but has some shortcomings. Most notably, this method can only resolve a single instance of an object. What if you want to get a little fancier?

I’ve created the attribute InjectFromHierarchy to remedy this.

InjectFromHierarchy extends Ninject’s InjectAttribute, but provides a tag and a query string.

```
[InjectFromHierarchy("HUD", "Readout.Star1")]
public Star LeftStar
{
	get;
	set;
}

[InjectFromHierarchy("HUD", "Readout.Star2")]
public Star RightStar
{
	get;
	set;
}
```

In this example, I have a GameObject tagged “HUD”. Somewhere down in the children (at any level), there is a GameObject named “Readout” with two Star\`s on it: “Star1” and “Star2”. This will grab references to both of those objects and inject them into this class.

COOL.

What’s really cool is that the query string you use is not limited by the conventions of Unity’s Transform::Find. In Unity’s method, you specify direct children with a period. So “HUD.Readout.Star” represents a direct parent-child relationship, HUD->Readout->Star. With this query string, the periods are recursive. So the same query means HUD->…->Readout->…->Star.

I would like to update this in the future to be more similar to [boX’s scene graph query language](https://github.com/thegoldenmule/boX/blob/master/md/SceneManager.md "NBD"), but haven’t had the time as of yet. Also I need to blog about boX sometime…

Get it on [GitHub](https://github.com/thegoldenmule/Unitijection "What a clever name!")!
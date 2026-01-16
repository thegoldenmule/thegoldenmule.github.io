---
title: "Re:flexion!"
date: 2011-10-16T23:45:56.000Z
original_url: https://thegoldenmule.com/blog/2011/10/reflexion/
---

Get it? I used “re:” in the title because it’s the Internet, and that kind of crap flies. I also used “flex” in order to form a poor connection to Flash. If you don’t like it you aren’t really a programmer–just get outta here.

Anyway, on to the fleshly bits of my post.

I was tasked a few months ago with updating/writing/maintaining an isometric level editor for one of our projects. It was an AIR app that stored all the level data in XML. That was all fine and dandy. I was happy to let it keep on churning out XML and whatnot—until I looked at exactly HOW it was storing and retrieving objects to and from XML. It was like (to steal some delicious imagery from whytheluckystiff) an ocean liner crashed into a dinosaur and the dinosaur screamed. My object oriented organs literally instantly went into failure. It wasn’t lupus, it was worse (I won’t even go in to what my functional organs were doing).

So say you’ve got a class called Prop that pertains to a specific type of item in the isometric world, and you want to save it in XML. There were two functions for this one object:

```
propToXML(prop:Prop):XML;
xmlToProp(xml:XML):Prop;
```

Inside both of these functions was a line for each property on the object wanting to be saved in XML. For instance:

```
var prop:Prop = new Prop();
prop.name = xml.@name;
prop.display = new PropDisplay();
prop.display.url = xml.display[0].@url;
return prop;
```

This meant that for every property I wanted to add in the future to this object, I’d have to write an additional two lines to save + load it. TWO LINES! What’s more, xmlToProp would not necessarily be backwards compatible with old XML. It could throw a runtime error (xml.display\[0\].@url might not exist if the XML was saved before I added the display property).

# \[SaveProperty\]

I decided to use Flash’s severely-limited/it-was-a-good-thought-but-kind-of-sucks flash.utils.describeType() to give me all the public properties of each object, then iterate over them and store and load them to and from XML. I was brilliant! The only problem was, some properties I didn’t want to save. After some perusing, however, I found my solution: I’d make up my own metadata! I called it, quite aptly I might add, \[SaveProperty\] and I used it on all properties I wanted to save as XML.

```
[SaveProperty]
public function get name():String {
	return _name;
}

public function set name(value:String):void {
	_name = name;
}
```

I went through every class that needed saving and added my new metadata to each property I wanted saved. I then wrote two functions that could save and load EVERY object:

```
savableObjectToXML(object:Object):XML;
reflectSavablePropertiesOntoObject(xml:XML, object:Object):void;
```

The second function is unfortunate, but I think it’s a good option. I could probably have stored the classnames in XML then use getDefinitionByName and all that nonsense–but Flash is a moron and thus has moronic issues with instantiating classes it doesn’t already know about. So, you’ve got to do something like:

```
var prop:Prop = new Prop();
reflectSavablePropertiesOntoObject(xml, prop);
```

# Enter The Mysterious -save-as3-metadata Compiler Flag

The one catch in all this is that you have to use a compiler flag when you use custom metadata (like \[SaveProperty\]). In FlashBuilder, under Project Properties > Flex Compiler, add “-keep-as3-metadata+=SaveProperty” to the additional compiler arguments field. The process is pretty much the same in FlashDevelop.

I haven’t putting it up on github because I’m not convinced it’s worth it, but if you’d like it, let me know in the comments.
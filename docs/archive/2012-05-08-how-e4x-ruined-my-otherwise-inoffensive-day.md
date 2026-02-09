---
title: "How E4X Ruined My Otherwise Inoffensive Day"
date: 2012-05-08T21:36:01.000Z
original_url: https://thegoldenmule.com/blog/2012/05/how-e4x-ruined-my-otherwise-inoffensive-day/
---

E4X in AS3 is flippin sweet. In fact, when I work in Flash I generally use XML over JSON or any other serialization or data storage solution because I can use E4X queries. I know several developers that embed Flash objects in web pages just so they can parse XML with it and pass it back to JS. Don’t get me wrong, though, Adobe didn’t do this one perfectly either. I have two major complaints against E4X:

1\. Why does XMLList exist? Every query should just return XML.

2\. How the crap do you tell if a node attribute exists or not?

There are probably reasons for the first complaint that are beyond me. All I know is that for years I’ve been haunted by the fact that any query on XML returns an XMLList and any query on an XMLList returns an XMLList, but you can’t easily convert between the two. I would love it if someone could explain to me the need for two separate classes (I suppose if no one comments I’ll just assume I’m right and XMLList shouldn’t exist).

For the second problem, however, I’ve finally found a decent solution. In E4X you can return a node’s attributes like so:

```
var id:int = myXML.@id;
```

However, say you don’t know if that attribute exists or not. Here are a couple of solutions that don’t work:

```
if (myXML.@id) {
	...
}

if (myXML.hasOwnProperty('id')) {
	...
}
```

Obviously, even if the first one worked, the attribute value could be falsy, so that shouldn’t be used even in theory. The second approach seems like it should work, as XML has overridden the hasOwnProperty method. However, it doesn’t.

All you’ve really got to do is trace out the classname of your XML _query_ (trace(getQualifiedClassName(myXML.@id))) to discover what you’re missing. Yah, I probably gave it away with the italicized word “query”. It’s a freaking XMLList.

You shall rue the day, XMLList.

So now we’ve got this funky XMLList object that acts exactly like XML when there’s only one result in the query (but you can’t convert it to XML), acts like a list when there are multiple results (I should mention it’s quite _unlike_ an AS3 array), and can act like primitives sometimes as well (I should say, acts like _other_ primitives, since XML is an AS3 primitive (which is, unlike other primitives, passed by reference)).

Screw you E4X. If that’s really who I should be blaming.

Anyway, there are several solutions to hacks around this ridiculous second problem of determining whether or not an attribute exists:

```
if (0 == xml.node.@id.length()) {
	...
}

if (xml.node.@id == new XMLList()) {
	...
}

if (xml.node.@id == xml.node.@nonexistantid) {
	...
}
```

They all seem a bit janky to me, but what do I know. I’m just a simpleton. In my next project I may use JavaScript to parse my XML and send it back to my Flash app.
---
title: "Pragmatically Parsing Plists without Pruning Your Persimmons (if you know what I mean)"
date: 2011-12-02T03:30:56.000Z
original_url: https://thegoldenmule.com/blog/2011/12/pragmatically-parsing-plists-without-pruning-your-persimmons-if-you-know-what-i-mean/
---

Enough euphemisms! I don’t even know what a plist is! Well you’re in the right place, cause I’m all out of euphemisms, and I’ve got plist pknowledge, paramount and plenty.

I was out programming an “HTML5, standards compliant web based tool” the other day, and I needed to be able to parse a .plist file (stands for [Pancake List](http://en.wikipedia.org/wiki/Property_list "No it doesn't") for those of you not sure what I’m talking about, it’s an XML based serialization format used by Apple). Unfortunately, JavaScript absolutely sucks at parsing XML (next to Flash + E4X), and I didn’t want to use a huge library. Next best thing? Rolling my own! It’s super easy, just call:

```
var jsonishObject = thegoldenmule.PlistParser.parse(xmlstring);
```

and it will return a beautiful json-ish object that’s much easier to deal with than XML.

I know what you’re thinking, “Enough chit-chat! Where can I download this wonderful parser?” Lucky for you I thought ahead and stuck it on [github](https://github.com/thegoldenmule/PlistParser "Pget it pnow!").
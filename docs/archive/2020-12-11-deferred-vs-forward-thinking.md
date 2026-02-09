---
title: "Deferred vs Forward Thinking"
date: 2020-12-11T22:51:20.000Z
original_url: https://thegoldenmule.com/blog/2020/12/deferred-vs-forward-thinking/
---

As anyone that has [checked a checkbox in a game engine](https://docs.unity3d.com/Manual/class-GraphicsSettings.html) can tell you (forgive the slurping sound– sarcasm is dripping from my chin), there are two main approaches to 3D lighting: forward and deferred. I’m a man of many, many (man, so many) useless metaphors and today’s **Metaphor of the Day** is no exception: let me introduce _forward vs deferred_ _thinking_.

_Forward lighting_ is brilliantly self-descriptive: you charge forward into every calculation and hope you have carried with you everything you may need. What color is this teensy little bit of chair? “Why it’s simply \[MASSIVE EQUATION INVOLVING ALL STATE IN THE UNIVERSE\], my dear.” Forward lighting is conceptually simple, following the mathematician’s nonsense extremely rational line of thinking: start by simply taking measurements from all light sources in the Universe simultaneously. Next, put those values in a giant matrix (hopefully there is room in the Universe to store it– not my problem), then push it through a single, complicated function to get the result. Mathematicians don’t generally worry about implementation details and neither should you!

![](images/12805448764_80d2029b1e_o-1024x-fee46c56.jpg)
_“Where is Everybody” by Timothy Takemoto_

_Deferred lighting_ is also brilliantly named, though for reasons we’ll get to later. Here we can ask the same color-based question of this little bit of chair and deferred lighting will eventually get to an answer after it goes off and consults some pictures it took awhile ago. You see, the teenage deferred lighting enthusiast had a photographic plate sitting out, collecting light from the aether for AGES now. “I’LL DO IT LATER!” yells the deferred teenager, stewing upstairs in their room, probably playing hacky sack. Rather than bother talking about all the stars at all, this dank teen just uses a photograph! Throw away that forward function needing [1,000,000,000,000,000,000,000 parameters](http://scienceline.ucsb.edu/getkey.php?key=3775)… we just need the one picture. This might be simpler to your puny minds, and maybe to a puny _finite computer_, unfortunately, it’s _imprecise_, which the mathematicians have a special word for: _wrong_.

Doubly unfortunately: in stupid finite-time scales (anything less than literally _any_ of the infinities (\_rolls eyes)) and due to freaking spacetime or whatever, both approaches have their uses.

![](images/48481707902_1bd9663c1a_c-ad152ab1.jpg)
_“Daisy has lost her Wilson in a sea of balls.” by Steve Baker_

A combination of several showers per day, sleeping, not thinking, and background bayesian analysis– these are the tools of deferred thinking. Forward thinkers need look no further than pen and paper: tools of the trade for aspiring forward thinkers. “Modern problems require modern solutions”, as they say– and nothing is more modern than a combination of thinking through problems and also not thinking through them.
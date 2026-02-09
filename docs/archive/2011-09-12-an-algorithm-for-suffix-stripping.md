---
title: "An algorithm for suffix stripping…"
date: 2011-09-12T21:49:44.000Z
original_url: https://thegoldenmule.com/blog/2011/09/an-algorithm-for-suffix-stripping/
---

Years ago when I programmed networking applications in Perl, I decided I had mastered regular expressions. I hadn’t, of course, but when your code [looks like you accidentally opened up a .dll in notepad](http://perl.plover.com/obfuscated/japh.pl "It really can be that ugly"), you have to believe in something.

Anyway, I wrote something called a [vector space search engine](http://la2600.org/talks/files/20040102/Vector_Space_Search_Engine_Theory.pdf "Mmm.... Vectors...") (a topic I will probably cover down the road) and because I thought I was cool, I also tried my hand at a stemming algorithm–[Porter’s Stemming Algorithm](http://tartarus.org/~martin/PorterStemmer/def.txt "Be prepared, this paper is almost indecipherable") to be precise. Basically, it takes words and strips suffixes, thus reducing a word to its stem. This way, when you search for _restorative_ it will come up with some of the same results as if you had searched for _restored_. Long story short, my algorithm sucked and now I’m back for round two–this time in JavaScript (so I can eventually use [Node.js](http://nodejs.org/ "It really is that cool") as my vector space search engine platform).

Here’s a basic demo I put together:

\[iframe width=”100%” height=”400″ src=”https://thegoldenmule.com/labs/PStem/”\]

There are a couple things to note. Firstly, the demo shows exactly which steps are changing the word. If you read the paper, you’ll know what I mean. Secondly, I’ve included a dictionary of about 25,000 words. It runs these words through the stemmer and compares them to already verified results, thereby assuring you that my algorithm really works :).

If you’re interested in the source, head over to [github](https://github.com/thegoldenmule/PStem "Creative title, eh?").
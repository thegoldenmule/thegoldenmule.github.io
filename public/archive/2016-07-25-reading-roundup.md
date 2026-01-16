---
title: "Reading Roundup"
date: 2016-07-25T06:51:05.000Z
original_url: https://thegoldenmule.com/blog/2016/07/reading-roundup-4/
---

This edition of _Reading Roundup_ involves ideas behind three different languages. What makes languages different? Lots of things of course, but going beyond syntax and memory management it’s interesting to read about the _thought process_ of each language. How does one actually think differently in X language? What types of problems might this be helpful for?

### _[Meditations on learning Haskell](http://bitemyapp.com/posts/2014-04-29-meditations-on-learning-haskell.html) by Christopher Allen_

One of the more feely reads I’ve posted– the takeaway is that more Haskell is in my immediate future.

### _[Type Erasure Is Good](http://stackoverflow.com/questions/20918650/are-there-benefits-to-javas-type-erasure) by Sukant Hajra_

The story goes that when Java added generics post-release in version 1.5, [type erasure](https://en.wikipedia.org/wiki/Type_erasure "The Erasure") was a hack to keep backward compatibility. C# decided to screw it and break all the old stuff (thankfully). However, apparently there is a horde of Javacademics that carry on the notion that type erasure was not only purposeful but desirable. Read this Stack Overflow answer to learn about _parametricity_, why it’s a good thing, and why reflection actually is dangerous.

And no, I don’t buy the argument in full.

### _[Why Not a Bytecode VM?](https://www.dartlang.org/articles/why-not-bytecode/) by Florian Loitsch and Bob Nystrom_

One of the more interesting choices for Google’s [Dart](https://www.dartlang.org/) is that the VM is not a bytecode VM. Yes, mighty Google, last bastion of Java did not give Dart a bytecode VM. The reasons may surprise you
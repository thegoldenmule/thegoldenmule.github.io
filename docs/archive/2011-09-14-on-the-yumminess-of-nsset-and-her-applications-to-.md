---
title: "On the yumminess of NSSet and her applications to javascript"
date: 2011-09-15T02:12:49.000Z
original_url: https://thegoldenmule.com/blog/2011/09/on-the-yumminess-of-nsset-and-her-applications-to-javascript/
---

[NSSet](http://developer.apple.com/library/mac/#documentation/Cocoa/Reference/Foundation/Classes/NSSet_Class/Reference/Reference.html "Oh yah...") and her sexy daughter, [NSMutableSet](http://developer.apple.com/library/IOS/#documentation/Cocoa/Reference/Foundation/Classes/NSMutableSet_Class/Reference/NSMutableSet.html) are officially my two favorite Cocoa classes. They have reached previously unmeasured levels of exquisitude. Sure, they have their faults, like being finite (I was hoping to prove the [continuum hypothesis](http://en.wikipedia.org/wiki/Continuum_hypothesis "Yes, there are different infinities.") with NSSet–that’s a math joke), but what they lack in nonsensical mathematical jargon, they make up for in usefulitude.

Enter Javascript.

After a few weeks of courtship, Javascript and I decided to move in together. It was a big step–especially as she had no physical manifestation, but we thought it would be good for our relationship. Mere \*days\* after she moved in, however, I was struck by the realization that she had no NSSet! So yesterday at lunch, just like you can do in any relationship, I fixed her.

I call it, JSSet! A finite, well ordered, mutable set! Here’s a quick rundown (you’ll notice I took the liberty of adding some functions even NSSet can’t match):

**add(element)** – Adds an element to the end of a set.
**remove(element)** – Removes an element from the set.
**union(set)** – Returns the union of two sets.
**intersection(set)** – Returns the intersection of two sets.
**unionSet(set)** – Unions this set with another.
**intersectSet(set)** – Intersects this set with another.
**subtract(set)** – Returns the relative complement.
**subtractSet(set)** – Removes the members of the set passed in.
**symmetricDifference(set)** – Returns the symmetric difference.
**cartesianProduct(set)** – Returns the cartesian product.
**isSubset(set)** – Determines if this set’s elements are contained in another.
**isSuperset(set)** – Determines if this set contains another. This is not the same as the negation of isSubset().
**isProperSubset(set)** – Returns true if this set is a subset and not equal to another.
**equals(set)** – Returns true if and only if both sets are subsets of the other.
**powerset(set)** – Returns the powerset, or set of all sets, of this set.
**walk(function)** – Executes a function on each element. This does not affect the set’s contents.
**map(function)** – Returns a new set by running each element through thr function passed in.
**filter(function)** – The elements for which the function evaluates to true are returned in a new set. The function should take the parameters item, index.
**member(element)** – Returns true for elements in the set.
**slice(start, amount)** – Returns a new set containing the elements from start through start + amount. If no amount is given, it will assume the largest possible amount.
**print()** – Prints all elements of the set using the console object.

Head over to [github](https://github.com/thegoldenmule/JSSet/ "NOW") to grab it before the [heat death of the Universe](http://en.wikipedia.org/wiki/Heat_death_of_the_universe "It's a real concern of mine.")!
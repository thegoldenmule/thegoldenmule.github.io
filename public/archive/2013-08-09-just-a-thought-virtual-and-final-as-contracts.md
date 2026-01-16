---
title: "Just a Thought: Virtual and Final as Contracts"
date: 2013-08-09T22:49:41.000Z
original_url: https://thegoldenmule.com/blog/2013/08/just-a-thought-virtual-and-final-as-contracts/
---

Virtual. It’s a language feature that I’ve decided I have understood incorrectly for awhile– but it’s not completely my fault…

See, a large part of my professional career has been in Java Land where the virtual mechanism is a quiet little assumption sitting off by itself in the corner. All methods are virtual by default and so you don’t have an opportunity to question the why or the how of it, you just use it: on purpose or, more likely, completely by accident. In reality, Java has switched its way of thinking on you, so where once you had virtual in C++, you now have an “antivirtual” keyword, final.

In C#, language designers took the “original” approach. C#, like C++, assumes final unless the virtual keyword is used explicitly. It’s actually a bit puzzling to me now, that Java takes the approach it does, because not only is this potentially a performance concern (there’s extra indirection with virtual method calls), I think there’s also a contractual one.

If you write any system in these languages, that system’s contract with the outside world is given in terms of members on implementations and interfaces (the capital ‘I’ Interfaces of Java + C#). There are other constructs here and there, like Java’s checked exceptions, or C#’s event delegates– and all of these form a compiler enforced, or _visible,_ contract. But there are also less visible portions of the contract. In AS3, for instance, the platform designers chose poorly in that AS3 events are not well supported by the language or the compiler, but they are used heavily in the core API. Thus, a large part of the API is actually invisible to compilation (but that’s a rant for another day).

What I haven’t given much thought to, however, is that _the virtual keyword is actually part of that contract too_, somewhere between visible and invisible.

There is a huge difference here in terms of what contract will naturally surface for a system of any size, where multiple engineers use their best judgement on how to engineer software that is “[open for extension but closed to modification](http://en.wikipedia.org/wiki/Open/closed_principle "One of the basics.")“. So which way should it be?

Well for whatever my opinion is worth, I think that virtual is the more powerful of the two, particularly when thinking about that visible contract.

Virtual makes you provide precise points of contact with code that _isn’t_ yours, i.e. it makes you think about where your class should be _extended_. Final, on the other hand, encourages you to restrict access to code that _is_ yours, i.e. it makes you think about how to restrict _modification_.

Just a thought.
---
title: "Dynamic Code Execution in Unity"
date: 2017-07-13T04:13:38.000Z
original_url: https://thegoldenmule.com/blog/2017/07/dynamic-code-execution-in-unity/
---

### Introduction

Awhile ago I made a thing that I didn’t talk about. In fact, lately I’ve been doing that a lot, so hopefully I’ll get better about boasting about myself like a good blogger.

I wanted a way to download scripts in a Unity executable and run them (particularly on mobile). A working [REPL](https://repl.it/) would also be nice. So I started inventing my own language looking for language runtimes that would be easy to shove into Unity. The easiest option is always to steal someone else’s work and claim it as your own. That led me to [Jint](https://github.com/sebastienros/jint), a Javascript interpreter written in C#.

What’s important about Jint is that it’s an _interpreter_ that does not require the [DLR](https://docs.microsoft.com/en-us/dotnet/framework/reflection-and-codedom/dynamic-language-runtime-overview) and does not [generate bytecode](https://msdn.microsoft.com/en-us/library/system.reflection.emit\(v=vs.110\).aspx). This is important if you want to be able to run on targets that require Unity to [AOT compile](http://www.mono-project.com/docs/advanced/aot/) everything (like iOS). Jint isn’t perfect though. It has actually recently dropped support for .NET 3.5 and does loads of other stuff Unity doesn’t support. But it’s pretty dang close.

### Rising Action

So I started a [fork](https://github.com/thegoldenmule/jint) with all these issues taken care of.

Here’s a screenshot of an example REPL:

### ![](images/example-1ccdf4fb.png)

It has some pretty cool features, like a builtin [require()](https://github.com/thegoldenmule/jint/blob/master/Documentation/require.md) function, much like node.js. Require will essentially load a script, execute it in a sandbox, then return the result for code sharing.

[inject()](https://github.com/thegoldenmule/jint/blob/master/Documentation/inject.md) is pretty cool too, because it lets you specify how to resolve objects from Unity land.

### DENOUEMENT

In conclusion, I’d like to thank the years of work that 40 contributors put into Jint just so I could make a poor-performing JS REPL in Unity.
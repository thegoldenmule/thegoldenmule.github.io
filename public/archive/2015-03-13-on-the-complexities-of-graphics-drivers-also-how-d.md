---
title: "On the Complexities of Graphics Drivers (also how does software even work)"
date: 2015-03-13T21:54:04.000Z
original_url: https://thegoldenmule.com/blog/2015/03/on-the-complexities-of-graphics-drivers-also-how-does-software-even-work/
---

**[This forum post](http://www.gamedev.net/topic/666419-what-are-your-opinions-on-dx12vulkanmantle/#entry5215019)** from an ex-NVIDIA driver engineer is **full** of goodies. Let me cherry pick some good ones for you:

> _“The driver is gigantic. Think 1-2 million lines of code dealing with the hardware abstraction layers, plus another million per API supported.”_
>
> _“…within the existing drivers and APIs it is impossible to get more than trivial gains out of any application side multithreading. If [Futuremark can only get 5%](http://www.hardware.fr/news/14117/gdc-test-d3d12-futuremark-demo-microsoft.html "External link") in a trivial test case, the rest of us have no chance.”_
>
> _“Why are games broken? Because the APIs are complex, and validation varies from decent (D3D 11) to poor (D3D 9) to catastrophic (OpenGL).”_
>
> _“Threading is just a catastrophe…”_
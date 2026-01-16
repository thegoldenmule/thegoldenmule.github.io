---
title: "Cursory Observations on Cursors"
date: 2012-01-08T03:12:50.000Z
original_url: https://thegoldenmule.com/blog/2012/01/cursory-observations-on-cursors/
---

I’ve been working in HTML5 a lot lately. No, I’m not a masochist, I’m simply curious (and now I can put buzzwords on my resume). You know what’s pretty sick? Editing javascript **while you’re profiling it**.

But enough about one cool thing concerning an otherwise fractured standard. What has really been bugging me is that everything in my HTML5 game is freaking selectable. Not just selectable. _Freaking selectable._ In fact, it bugs me so much, that I’ve written a one-act play staring Chromey (yah, that should avoid those pesky libel charges), the wondrous user agent:

\[ROLLING FIELDS FADE INTO VIEW. THE PIERCING COBALT SKY IS BROKEN UP BY BOLD STROKES OF WISPY WHITE CLOUDS. AN OLD WOMAN SITS ON A HILL, REVELING IN THE IMPRESSIVE SCENE BEFORE HER.\]

CHROMEY: _Hello User, I will be your agent for this evening. As you can see below my sleek omni-bar, I offer a visually and aurally stunning backdrop for an intellectually fulfilling story you will likely find nowhere else. Please begin, your input is welcome._

\[HERE THE WOMAN’S EYES WELL UP WITH TEARS–THE USER SHOULD FEEL OVERWHELMED WITH EMOTION.\]

CHROMEY: _Yes, I feel your gentle mousedown on my <canvas> element. I will act accordingly. Oooh, a mouseup too. I’m going to assume you’d like me to_ _HIGHLIGHT EVERYTHING IN A HIDEOUS, PIXELATED BLUE._

\[CURTAIN.\]

Where’s the denouement, you ask? The well developed characters never overcome their conflict! As it turns out, there actually is a brilliant way to prevent elements from being highlighted. I’ll throw in the overused modifiers: _standards compliant_ and _cross browser_ (heck, how about _lightweight_ too).

```
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-o-user-select: none;
user-select: none;
```

Slap that on an element and Chromey the wondrous user agent will stop acting like such a fop!
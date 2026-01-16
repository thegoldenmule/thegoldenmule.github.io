---
title: "git is for everyone"
date: 2020-03-13T00:37:29.000Z
original_url: https://thegoldenmule.com/blog/2020/03/git-is-for-everyone/
---

Linus Torvalds has changed the world twice now, dangit, which is 0 (±2 due to rounding errors) more times than I have changed it. His first world-changing contribution was of course, Linux, and his second was git. Linux is Torvalds’ _[My Antonia](https://en.wikipedia.org/wiki/My_%C3%81ntonia)_— widely regarded as his most significant contribution to the world. That means git must be his _[Death comes for the Archbishop](https://en.wikipedia.org/wiki/Death_Comes_for_the_Archbishop)._ See the parallel I’m drawing here? I could have sworn I’ve mentioned this in a previous post. The former is widely regarded as his masterpiece, but the latter is the **real** _magnum opus_— it’s the one I would tell friends to read.

Many years ago, my wife came home and found me sitting alone in the dark with tears in my eyes: I had just finished the last episode of Battlestar Galactica (and it was _lovely_). Have I mixed enough metaphors here? The final episode of BSG is Willa Cather’s _Death Comes for the Archbishop_ is Torvalds’ git.

However, while git may be incredible software, the underlying _ideas_ are the real [Edward James Olmos](https://en.wikipedia.org/wiki/Edward_James_Olmos) star.

## What git is actually about

Git is not brilliant because it’s written in C and was able to host merges of the Linux kernel in less than a few weeks. It is not brilliant because it led to GitHub and arguably the mass adoption of open-source software as a business strategy. Git is brilliant because it’s a **codified workflow for idea experimentation and reconciliation**.

> To \\t or not to \\t.
>
> thegoldenmule

I’m not going to argue about which workflow is best: OneFlow, GitFlow, GitHub Flow, Forking Workflow, GitLab Flow, etc. Line endings, tabs v spaces, trailing commas– I’ll die on a lot of hills but you will not find me on the summit that is git workflows. The fact is, the power of git is found in its ability to support many workflows, extremely quickly, with extraordinary consistency, in a decentralized way.

Here’s the real meaty center of this post: git has transformed collaborative software development but the core ideas have a chance to transform _so many_ other endeavors.

## Egs

![](images/Wordperfect-51-dos-2abdd3cd.png)
_WordPerfect 5.1 | https://en.wikipedia.org/wiki/WordPerfect#/media/File:Wordperfect-5.1-dos.png_

Consider a word processor, like Google Docs. You can create a document and multiple people can edit the document at once. Google Docs is amazing, but only if you’ve never used any programming tools. Google Docs is _slow_ and it’s _unsafe_. There is no quick method to start off on a new idea, a wild tangent, with the complete assurance that you can go back to an earlier state of the document. You can’t store side by side ideas and come back to them later– you can’t even look at ideas side by side. There is an awful linear history that is difficult to access, provides no good mechanisms for viewing differences, and doesn’t allow you to decide what constitutes a “revision”. There is no way to reconcile differences between drafts. There are only workarounds: creating copies, copy/pasting crap into other documents, making your own backups by hand. There is no way to work offline. There is no option but to trust Google with your data. What a terrible, horrible, no good, very bad workflow. Imagine what an impact decent tools could have for a writer.

I am related to two pastors (my father and one brother). They each write a twenty-five minute speech (long sermons are called “gravy-burners”) every week and the best tool they have at their disposal is the smoking, decomposing pile of refuse we call the modern word processor. They have no way to quickly _experiment_. No way to review progress or compare their own ideas.

![](images/pro-tools-12-6f5e4cc9.jpg)
_Man that beat looks fatty._

Consider Pro Tools. This tool allows musicians to record tracks, arrange music, make the fattiest of beats, and the illest of rhymes. Realtime audio plugins are a modern marvel. But what’s this? — The only thing between the musician and utter destruction is an _undo stack_, a complete mastery of _Save As_, and decent knowledge of external backups. What happens when a musician wants to collaborate? Many musicians stick their projects in Dropbox, which is in itself a terrible, awful service that could use some distributed-version-control love. How do you try something quickly, or head a different direction easily, or foster collaboration without hitting the friction of your tooling not supporting the differences in your ideas? Git doesn’t directly solve these problems (though I have a strong suspicion that it _could_)– remember, git isn’t the point here, the ideas behind git are. What does an audio diff look like? How do you resolve conflicts between the aforementioned fatty beats? The idea of safe, distributed branching, comparing, and reconciling could have an incredible impact here.

Finally, consider the digital artist, working in 3d sculpting tools or Photoshop. Game artists may know about “version control” but the vast majority don’t use it. Even among the VCS-aware, there are no tools for diffing and resolving PSDs. What would those tools even look like? Why has Adobe not spent any time on letting artists easily try TWO things out at once, safely? Or collaborate on and reconcile different ideas?

## I’ve run out of examples

I have **not** run out of examples like the pesky paragraph header indicates, in case you’re wondering. Ever done a thing and then wanted to try a new thing without compromising your ability to go back to that first thing? Ever wanted _multiple people_ to work on different pieces of a thing and then safely reconcile their thing work? HAVE YOU EVER WORKED ON A NON-TRIVIAL THING???

If you answered yes to any of these questions, then git’s core ideas could help what you’re doing. We should be thinking about how to let git’s model of thinking pervade other things we do.
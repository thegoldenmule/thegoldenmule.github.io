---
title: "No Faberge Eggs, Just Brass Balls"
date: 2014-09-04T21:45:06.000Z
original_url: https://thegoldenmule.com/blog/2014/09/no-faberge-eggs-just-brass-balls/
---

Aw snap!

An account in which Doug McIlroy displays his “old Unix hands” (you may need to refresh a few times to load):

[http://www.leancrew.com/all-this/2011/12/more-shell-less-egg/](http://www.leancrew.com/all-this/2011/12/more-shell-less-egg/ "Yes.")

It’s a story about Donald Knuth, a pioneer of many many things, who writes a beautiful, yet simple program in (something like) Pascal. The source code of this program is absolutely breathtaking. Seriously: it’s like reading bad Shakespeare (which is pretty dang good for Pascal). Anyway, McIlroy is asked to review Knuth’s code and, after giving a few nice remarks, he unloads on Knuth and presents a six line Unix shell script to replace all 10+ pages of Knuth’s Pascal. Brilliant.

The article ends in excellent style:

> I can’t help but include one more excerpt. It’s the last paragraph of \[McIlroy’s\] review:
>
> ‘_Knuth has shown us here how to program intelligibly, but not wisely. I buy the discipline. I do not buy the result. He has fashioned a sort of industrial-strength Fabergé egg—intricate, wonderfully worked, refined beyond all ordinary desires, a museum piece from the start.’_
>
> Just remember, he’s saying this about _Donald Knuth._
>
> No Fabergé eggs for McIlroy. Just brass balls.

That just good writing.

Now it occurs to me that McIlroy and Knuth were speaking two different languages here. Knuth was demonstrating [_literate programming_](http://en.wikipedia.org/wiki/Literate_programming), an ideology that never really caught on, whereas McIlroy was quoting the [Unix manifesto](http://en.wikipedia.org/wiki/Unix_philosophy), an ideology that caught like wildfire. I don’t think these two are necessarily at odds– McIlroy’s comments make that clear– and Knuth probably could have written a program that adhered to both ideologies. McIlroy was talking instead about an aspect of programming that’s a bit more difficult to nail down: _wise work_.

The discussion is very similar to the [Worse is Better](http://dreamsongs.com/RiseOfWorseIsBetter.html "Worse Is Better") philosophy, which, among other things, values simplicity over correctness. From McIlroy:

> The **_simple_** pipeline given above will suffice to get answers right now, not next week or next month. It could well be enough to finish the job. But even for a production project, say for the Library of Congress, it would make a handsome down payment, **_useful for testing the value of the answers_** and for smoking out follow-on questions.

Simple? Yes. Correct? Well, his code did actually prove to be correct, but it doesn’t appear as if McIlroy even cared.

That last remark of his is the meat of McIlroy’s comment: _useful for testing the value of the answers_.

This is what separates McIlroy’s philosophy from the standard Unix philosophy or Worse is Better or any other number of other things. This is the Wise Lesson of McIlroy: that the value of the answer is more important than the value of the implementation.

How often I fail in that aspect of problem solving! I am generally more interested in the intrigue of a solution than the actual value of the answer. Is what I have just delivered useful? In terms of game programming: is this feature fun? Does it look truly and epically sick? Yes, I see that your solution was completely modular, you’ve made a very fast and interesting data structure, and I can’t believe it’s all on the GPU (for some reason)– but what is the value of the result?

Thank you. McIlroy, for a helpful reminder that the brilliance of an implementation is multiplied by the value of the answer.

###### Image used under [license](https://creativecommons.org/licenses/by-sa/2.0/) from [Thomas Kohler](https://www.flickr.com/photos/mecklenburg/4447606722/in/photolist-bFvgkv-9pJuYB-9pMweA-51DHMm-9g88D5-bBWLZa-7M29ww-bp2ScY-bp2Sjo-bqLNT5-51zucv-4ua6M4-7Y2ufL-61MPU-bE1sea-3XY1G-byjbdD-51zu18-51zukp-51DHrm-ncqyPs-ncsXLA-neyHoK-neuVPA-nesTJB-new9GN-newjoa-ncrgWw-nexW1a-ncr4kj-nex9n7-nctm39-ncsUX3-ncqz5w-neu2z4-nevLMp-nctwR3-oqWjE3-ncrLam-nevpVf-nctZL9-newBbv-ncvKt3-ncuK2T-ncqYsJ-newXME-ncv7Hy-ncrA6Y-bkpfeo-bMip9B).
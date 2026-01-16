---
title: "The Hard Things About Simple Things"
date: 2019-02-06T18:32:04.000Z
original_url: https://thegoldenmule.com/blog/2019/02/the-hard-things-about-simple-things/
---

Simplicity is important.

All programmers know this, or at least we claim we do, and we try to let that flow down through our enlightened programmer minds to our fingertips and into our C-plus-pluses and sharps. Two weeks later we submit our PR, prepare room on our shelves for all the accolades we’re about to receive, and slip into our laurel-resting apparel only to find that the reviewers can’t seem to follow our train of thought.

Obviously there has been a mistake. Perhaps we’ve accidentally sent the PR to some poor sap in accounting. That happened once before to a guy, I’ve read about that happening. Drat, no the PR is all in order. It’s time to set the reviewer straight– “you just aren’t thinking correctly.” We start feeling a bit down. We’re a tube of toothpaste after its bright minty ribbons ooze into the sink. It turns out that this person isn’t stupid after all! In fact, they are confused because it turns out we wrote a system that wasn’t quite so simple after all. It was– GASP– difficult to understand.

Simplicity is really, really hard.

Don’t get me wrong, I can come up with interfaces all day that look simple on the outside, it’s just that they don’t solve any existing problems or are an awful mess on the inside. Does that still count as simple? Hmm, I’m afraid not, my friend. When you open the door to something truly simple, you don’t find a plate full of spaghetti awaiting you. Instead there’s a table set with a clean white plate and in the middle rests a single ravioli pointed due north: no red sauce, no alfredo, but daggum is it _al dente_. Cut inside that ravioli and you see a bit of sausage, a bit of cheese, and a leaf of basil.

I honestly don’t remember where I first read about this (I suspect it was Fowler or Knuth) but in a truly simple system, as you start diving down through each layer, you find only simpler and simpler pieces. Food metaphors are king here and perhaps it’s because I literally just cut an onion, but imagine a blade crunching through successive layers of your system. There are no surprises here, each layer inside the other, each the same color and consistency, each smaller and smaller until you’ve reached the middle and there’s no more onion to cut. These are simple systems.

Some systems have a very simple surface area: they look like a normal onion but you find that as your knife begins gliding through the layers your blade nicks something hard and then in an instant the world goes black: someone has sewn a grenade into this onion. Other onions have a most curious quality that as your blade gets deeper you find that each ring is getting larger and larger. How is this possible? How is the onion bigger inside than out? These systems are called simplex systems. They hide their complexity, and while it’s nice that they still fit in the crisper, how are you supposed to use them to make a halfway decent mirepoix?

It takes effort to make systems simpler.

[Pascal’s adage](https://quoteinvestigator.com/2012/04/28/shorter-letter/) is particularly applicable here:

> I have made this longer than usual because I have not had time to make it shorter.”

This was found in one of a series of nineteen letters Pascal wrote in defense of his friend over the course of eighteen months. Geeze, take a breath, Blaise, and whittle it down.

Don’t worry, I’m not a computer scientist (at least not a very good one)— I actually write code. I stand with you at the base of the ivory tower, beating my fists against the gate: “Ken Thompson, Ken Thompson, let down your neck beard!” I don’t just think about these things and dispense wisdom like a young, inept Fred Brooks. I understand that there are time pressures. There are business people in meetings that want you to do unspeakable acts. I get that your kids are sick this week and you’ve been up for the last 43 hours. However, I also know that most of the time we aren’t deciding that things should be simple, which means they become complex.

About a year into my first job out of college I discovered something called disposable income. This was an epiphany, because it meant that, at the advice of my dear sister, I could buy things like a package of pepperonis and just eat them all. After the pepperonis, I purchased my first and last flying lesson. We were in a two seater plane above San Diego Bay and the instructor had me grab the stick and fly the plane (we pilots call it “the stick”). Below us I watched the majestic Hotel del Coronado whizz by but I didn’t have the chance to count the towers because I was so distracted. I couldn’t possibly take it all in because I was working so hard fighting the dang stick. After just a few minutes my arms were sore and I recall saying something along the lines of, “man the plane won’t just fly straight.” There was a moment of silence and the instructor called back through the headset,  “yah, that’s why you have to fly the plane.”

This is programming simple systems. Believe me, I’m an expert at flying planes: pilotry I believe it’s called. The natural tendency is not just a bit of disorder and some poor naming conventions— the natural tendency is to drop out of the freaking sky and take out the [second largest wooden structure in the US](https://en.wikipedia.org/wiki/Hotel_del_Coronado).

Simplicity requires more than intuition.

In the first few chapters of Nobel-prize winning economist Daniel Kahneman’s book [Thinking, Fast and Slow](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow#Two_systems), Kahneman explains how useful our intuition is (which he refers to as “System 1”). Intuition is always working under the hood: a system so fast you can’t think ahead of it, a system so basic you can’t shut it off.

When we program using intuition, we are poets (and I don’t mean Tennyson level, I mean the post-romantic stuff that doesn’t even rhyme). We are leaves tossed in the wind. We feel free and expressive.

> [so much depends](https://www.poets.org/poetsorg/poem/red-wheelbarrow)
>
> [upon](https://www.poets.org/poetsorg/poem/red-wheelbarrow)
>
> [a missing](https://www.poets.org/poetsorg/poem/red-wheelbarrow)
>
> [semicolon](https://www.poets.org/poetsorg/poem/red-wheelbarrow)

Kahneman then spends the next few dozen chapters explaining the many specific ways in which intuition is provably wrong. Our intuition leads us astray when faced with information we need to think deeper about. We are subject to the many quirks of its heuristics. Our Bayesian minds suffer from Bayesian inconsistencies. They also suffer from undue attachment to the local context in which they are operating. Experienced radiologists, when asked to evaluate chest x-rays, _contradict themselves 20% of the time_ when shown the same picture on multiple occasions. Don’t underestimate the role of coffee and an open window in your “expert code-reviewer opinion”.

So much for my epic: Parenthesis Lost.

Luckily, our brains are equipped with a logical, conscious, calculating system (imaginatively named “System 2”) that can analyze and correct the poor judgement of our intuition. It’s fun to write poetry but poetry is rooted in our current context not to mention insufferably bad at business logic. The drawback is, of course, that using system 2 is hard work. According to Kahneman, researches can tell if someone has engaged in active thinking because our pupils dilate. Our heart rate increases. Our cells do extra whatever it is cells do. And— not only does System 2 take extra muscle to get going, it is orders of magnitude slower than System 1.

Making things simpler requires extra effort and you’re going to pay for it in terms of speed. Writing simple code is highly unnatural and unintuitive.  Don’t for a second believe that it comes easy to you, you’re just wrong.

Techniques to make things simpler: The Polya Methods.

A mathematician named George Polya (a [Martian](https://en.wikipedia.org/wiki/The_Martians_\(scientists\))) spent much of his considerable brain power thinking about how to teach. Instead of teaching people specific mathematical methods, Polya argued that people should be taught general problem solving skills. He wrote tomes on how to solve problems— the largest problem, of course, that no one really reads tomes anymore.

Here are some questions Polya liked to ask himself. You will think you’ve done all the thinking you can on these but I don’t believe you.

Can this problem be divided into simpler problems?

Problem decomposition is a valuable skill that everyone thinks they have but I’ve found precious few that actually do. What I like about this question is that it hints at a powerful algorithm: the binary search. Start with the end result. Now break it down to nothing— surely you can understand nothing, right? That’s basically what a real unit test is supposed to be: a nothing. And bit by bit we go back and fill in the middle details.

When I write a new system, I like to write out some detailed usage first. I don’t want to just write a few lines or a couple unit tests, I want to prototype a full use case to discover what the result should be before I even write it. This helps keep some of that poetry without sacrificing consistency. Then I go back to zero by writing my first test case.

Your test cases themselves can use this same technique. Gary Bernhardt has quite a few great videos on testing but something he glosses over in [this free one](https://www.youtube.com/watch?v=RAxiiRPHS9k) is the idea of writing a test case backwards: start with the completed test. Write your asserts before anything else, then back up and figure out how to get to that assert. If you find yourself writing the scaffolding for days, perhaps what you’re testing is not so simple.

Can I relate this to something I already understand?

There’s an eye opening book you should read called [Mindstorms](https://www.amazon.com/Mindstorms-Children-Computers-Powerful-Ideas/dp/0465046746/ref=sr_1_2?ie=UTF8&qid=1549336097&sr=8-2&keywords=mindstorms+book) that solves this problem through syntonics: relation to something personal. The book’s focus is teaching children but I found it enlightening for teaching myself. The idea here is to make problems into something that you have a deep personal relationship to. In the case of children, they used body syntonics to map a programming environment (LOGO) to a child’s body: something that children can understand. This also plays to our intuitive strengths. Our intuition is well formed around how to use our bodies.

In the case of LOGO, they based their API around giving instruction to a turtle that moved about a canvas. _Walk twenty units. Turn thirty degrees. Put your pen down on the paper. Walk 10 units._ The child can literally walk around to think through the problem. They can “become the turtle” to develop, moving and turning their bodies, taking physical steps to step through the program. This makes following the code 100x simpler than reading tests and debugging it about 1000x simpler.

What if your next system were designed in this way? Not with turtles (though what if…), but by mapping the problem to something you already understand and solving it there. Make the problem into something you can solve with your hands or with notecards. My favorite math professor in college would insist that if we could frame an abstract problem by drawing a picture of it, then we would be much more successful in fully understanding and ultimately solving it. Drop UML and flowcharts for a second, those are only tangentially related– _Can I draw a picture of this code?_

Techniques to make things simpler: Piaget Style.

Mindstorms, while blowing your mind, will also educate you on the teaching philosophies of [Jean Piaget](https://en.wikipedia.org/wiki/Jean_Piaget). When I worked in the games industry (_crosses self_), I found the vast majority of the game-making process invested in tools to make games. When working with artists and designers, these tools have to be highly iterative. Imagine yourself as an artist on the next Call of Duty. You own three cats, obviously. Sure, you’re bored stiff of the franchise but it looks great on a resume. You’re [tightening up the graphics on level 3](https://knowyourmeme.com/memes/tighten-up-the-graphics-on-level-3) but it takes 10 minutes to deploy your changes and get in game to play around with them. Something that is obvious in the games industry is not so obvious in software development: level 3 is going to suck.

The tighter the iteration loop, the more iteration you will _naturally_ do. This is where Piaget comes in. Piaget believed in teaching without curriculum. How do you teach students best? By letting them _experiment_ and come to the answers themselves. Students who find their own answers tend to internalize them and they better understand the material. This is at the heart of the iteration loop. When you can iterate quickly you will iterate more often. Code will be more liquid. You will experiment. Experimentation leads to solutions and understanding. When the goal is making a simple robust system, thinking about every contingency ahead of time is not the key: iteration is.

**Techniques to make things simpler: Bullet Points.**

These ideas get our minds going but step away from the clouds for a minute for some specific, actionable items to keep in mind that will help make things simpler.

-   Consume the entire system before you author it. This is at the heart of TDD but TDD isn’t a binary search: it doesn’t start with the full system, it builds up to it. This can lead to a tower of functional, yet unrelated or hard to use components. Take it a step further and consume the full end result before you use TDD. Oh also: master TDD.

-   **Break the problem down to zero**. Don’t flatter yourself, think about less at a time. Your dog should be able to master the elementary pieces of your systems.

-   **Imagine, produce, or draw a physical representation**. We are good at manipulating the physical: can I hold this object? Can I walk through it? Does it plug into this other thing correctly? Reasoning in a known domain can be extremely powerful for solving problems.

-   Spread the dangers of intuition. If your team programs intuitively, your PRs may be less than helpful. Get everyone on the same page.

-   **Experiment with design patterns**. There are enough of them for us to constantly be learning about a new one. What’s handy is that when we use established patterns, we can shift some trust away from our intuition and onto a predictable system.

-   **Learn refactoring tools**. If it’s difficult to name a variable something simpler, you aren’t going to rename it. If it’s hard to split a class in twain, you are going to avoid it. Master the tools at your disposal that can remove this friction and do much of the work for you.

-   **Tighten your iteration loop**. This goes hand in hand with the above. If it’s fast to experiment and change things a thousand times, you won’t hesitate to try new things.

-   **Think harder**. Actively engage system two. Dilate them pupils.


**Fin.**

There’s little chance you made it here. Studies show you lose 50% of your audience every time you non-sequit (_pushes up glasses and starts in on [Zeno’s paradox](https://en.wikipedia.org/wiki/Zeno%27s_paradoxes))_. The problem with this whole exposition is that I have drafted it mid-thought. I am still completing the sentence. Piaget and Polya have been gone for awhile and there are some impressive [contemporary](http://worrydream.com/) [thinkers](http://www.codersnotes.com/notes/) [taking](https://www.destroyallsoftware.com/screencasts) [up](https://idlewords.com/) [the](https://www.jwz.org/blog/) torch. Well here’s my thesis, right at the end where it should be: simplicity is enviable yet incredibly hard– so think harder.
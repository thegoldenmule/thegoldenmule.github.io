---
title: "bo-X Behind the Scenes: Part I – Overview"
date: 2014-03-11T11:48:51.000Z
original_url: https://thegoldenmule.com/blog/2014/03/bo-x-behind-the-scenes-part-i-overview/
---

## Introducing bo-X

Last year I dedicated quite a bit of time to writing a 2D rendering engine on top of WebGL. I call it: [bo-X](https://github.com/thegoldenmule/boX "bo-X"). I’ll admit, most of the time was spent internally applauding myself for the excellent name. It’s pronounced “bo-chi” (that last letter is a Greek Chi by the way), one-upping the incredibly arrogant name of the famous typesetting platform LateX.

But enough about how awesome the name is– how awesome is bo-X? Well, let me just preface with this: it won’t run on most browsers– no idea why. Does that answer the question for you?

## What have I learned?

bo-X is a modest little project, started to further my knowledge of OpenGL and 2D engines. There are some interesting problems and I think I have come up with some interesting solutions. But, perhaps most interestingly of all, is that I discovered just how much the right _tools_ matter. I could write volumes just on that one idea, but I’ll sum it up here in a single adage: ‘_a poor craftsman blames his tools’ is just plain wrong._

## Workflow

Workflow is so dang important. Streamlining every single piece of the process from your first keystroke to your last is essential. I have always known this, but many times I find myself working around the same workflow issues over and over again. Working on bo-X mostly on the bus to and from work has renewed my vigor for a flawless, streamlined workflow, because I literally have 30 minutes to get into the project, make a useful contribution, test it, and get out.

I’m not just waxing on, I swear!

## Ant

Obviously, the build process is a huge part of the workflow. Particularly in JavaScript, where you generally just throw spaghetti at a wall and hope things stick (in the right order too), the build process needs to be fast and helpful.

Ant is kindof a no brainer, but I made sure to have Ant up and running as soon as possible. I had several targets:

-   **Clean** – deletes the build target directory.
-   **Validate** – Runs JSHint on all my unminified JS.
-   **Concatenate** – Concatenated all my unminified JS files, in the correct order. This was broken out into separate concatenated files: dependencies, editor and core.
-   **Minify** – Minifies the concatenated JS.
-   **Generate Docs** – Generates all jsdocs from source.

There’s probably nothing here you haven’t seen before, but that’s because you’ve already learned that these steps are important. If you don’t have a process similar to this one, get it done! It will save you oodles of time down the road. In addition, I had targets to copy sources and concatenated files about. Being able to specify dev or prod is essential as it lets you skip some of the targets and speed up the build– iteration speed my friends!

## PHPStorm

A long time ago I used to use Aptana for any and all web development. Sometime last year, however, I tried out a trial of PHPStorm and holy crap– I will never use anything else for web development again. I could tell you about all sorts of nifty little things PHPStorm does for you, but I’ll only focus on two:

1.  **Automatic Upload**. I was able to configure PHPStorm’s automatic upload so that every time I saved a file, the sources were uploaded to the correct remote directories on thegoldenmule.com. Turns out, this is really amazing. I found myself testing mostly on a real environment simply because it was just as easy as running locally. In fact, due to cross origin policy crap, it was easier than running locally.
2.  **JS Test Driver**. PHPStorm’s builtin test driver blows away just about any unit testing tools I’ve ever used on any platform. For a large portion of the project, I really got into actual test driven development because it was a snap to run unit tests instantly in Firefox, Chrome, IE, and Opera simultaneously. This is a key missing piece when working in Unity or even Flash. I have used both ASUnit and NUnit, but there is not a fast, efficient way to run tests and collect results, especially across targets. I would love to be proven wrong about Unity, but in my experience, the amount of friction involved with unit testing Unity applications is great enough to reconsider using unit tests at all.

## Documentation

One thing I have never done well is document my projects. Because of this, one of my goals for bo-X has been excellent documentation. I decided upon a two-pronged approach: a combination of JSDoc and Markdown.

I wanted a marriage between code and comments, i.e. I wanted the source to contain as much of the documentation as possible. Otherwise, you’re going to spend a lot of time trying to keep the documentation in sync with the source code. By adding copious comments in source via JSDoc, it is much easier to change them both at the same time. Plus, with Ant, generating new docs is a snap.

As for Markdown– well there’s not that much to explain there. Markdown is awesome and it allows me to use GitHub to serve up documentation. The Markdown files are mostly for explanations of entire systems or examples of how to use different objects. They provide high level looks at bo-X.

## Fun and Worthless

The last thing I learned was that bo-X was fun to write but dang is it completely useless. I came up with some cool ideas and I learned a lot about OSS (I swear I’ll try to never write a douchy bug report for an OSS project again), and that may have to be enough this time. I think that’s just how things are: I’ve got to create for my own sanity.

Check it out on [GitHub](https://github.com/thegoldenmule/boX "bo-X"). Maybe someday I’ll get it working in more than one browser… 😉
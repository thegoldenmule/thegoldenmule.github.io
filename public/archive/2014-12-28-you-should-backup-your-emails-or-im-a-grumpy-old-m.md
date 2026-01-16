---
title: "You Should Backup Your Emails! or I’m a Grumpy Old Man!"
date: 2014-12-28T12:08:10.000Z
original_url: https://thegoldenmule.com/blog/2014/12/you-should-backup-your-emails-or-im-a-grumpy-old-man/
---

There are a host of email archival services. Some of them are run by evil companies, most of them probably aren’t. Unfortunately, all of them are too complicated and none of them are zero-knowledge.

That’s why I wrote [a few Python scripts](https://github.com/thegoldenmule/email-backup "Aptly named...") to download all 100,000+ of my emails over the past few years and store them on SpiderOak as well as a local external hard drive. They run periodically and update the archive every day or so. This lets me piggyback on SpiderOak’s huge zero-knowledge store– but that’s really only the second best part.

The best part is that it’s literally a couple hundred lines of Python. It works– and when it doesn’t, I can read the source in 5 minutes and be done with whatever bug is annoying me.

This small exercise has actually taught me a lot about myself. Turns out I’m actually a grumpy, 70 year old man.

Get off my lawn, your software sucks!

(Oh, and check it out on [Github](https://github.com/thegoldenmule/email-backup "Aptly named...").)
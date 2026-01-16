---
title: "Quick Post: Sum Table"
date: 2013-02-09T21:26:31.000Z
original_url: https://thegoldenmule.com/blog/2013/02/quick-post-sum-table/
---

If you have an array of values, how can you take the sum of any range of them in constant time? With a sum table!

Here’s a formal definition:

Given a list of values $$v\_0, …, v\_n$$, then a sum table is a corresponding list $$s\_0, …, s\_n$$ such that $$s\_i=\\sum\\limits\_{j=0}^i v\_j$$. That is, each value in the sum table is the sum of all the values up until that index. Then, the sum of values between any two can be easily found: $$s\_{ij} = s\_j – s\_i$$.
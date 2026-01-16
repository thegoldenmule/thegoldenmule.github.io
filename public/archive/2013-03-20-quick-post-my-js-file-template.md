---
title: "Quick Post: My JS File Template"
date: 2013-03-20T20:40:09.000Z
original_url: https://thegoldenmule.com/blog/2013/03/quick-post-my-js-file-template/
---

I use [PHPStorm](www.jetbrains.com/phpstorm/ "Easily the best IDE for the web") for all my JavaScript needs. Dang it’s good. Anyway, I’ve been working on a secret JS project I’ll hopefully share one day, and one thing I’ve been working on is my JS file template. There’s not a lot to it, but this is what mine looks like:

```
/**
 * Author: thegoldenmule
 * Date: ${DATE}
 */

(function(global) {
    "use strict";

    var ${NAME} = function() {
        var scope = this;

        return scope;
    };

    ${NAME}.prototype = {
        constructor : ${NAME}
    };

    // export
    global.${NAME} = ${NAME};
})(this);
```

Just a couple things: I like wrapping my whole definition in a closure. This is both a safeguard against my own accidental globals (yes, even thegoldenmule accidentally creates a global), and a safe space to stick “static” functions and objects, or even whole internal object definitions.

Inside the constructor function, I use the common pattern of defining a reference that points to this and returning that at the end.

The prototype is straightforward, as is the exports at the end. A cool caveat is that it’s really easy to then export for Node.
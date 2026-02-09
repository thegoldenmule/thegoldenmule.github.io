---
title: "On Limiting the Horrors of Objective-C++"
date: 2012-07-26T04:04:22.000Z
original_url: https://thegoldenmule.com/blog/2012/07/on-limiting-the-horrors-of-objective-c/
---

I’m not a C programmer by trade. Or C++, or Objective-C. However, I’ve been working with the whole dang family lately. Clearly there’s been some inbreeding.

Anyway, for my iPhone adventures, I’m using Box2D–the real C++ implementation, which means that I’ve got to use some ‘Objective-C++’ at some point. The problem with that is how quickly .mm files propagate. Objective-C++ is not pretty, and XCode is either lazy or smart, because it certainly doesn’t encourage its use. Anything that touches Box2D (and in some cases, everything that touches something that touches Box2D) needs to be a .mm file.

So what can be done? One solution I found on stackoverflow, was to use an [opaque pointer](http://en.wikipedia.org/wiki/Opaque_pointer "Who knew?"). Basically it hides the implementation, and since my implementation is in C++, I can hide it from my Objective-C objects.

**The Skinny**

The two basic things I need to wrap up are b2World and b2Body. First, I create Box2DObject:

```
#import

struct b2BodyWrapper;

@interface Box2DObject : NSObject {
    struct b2BodyWrapper *_bodyWrapper;
}

// various functions that act on b2Body

@end
```

Then Box2DWorld:

```
#import "Box2DWorld.h"
#import "Box2DObject.h"

struct b2WorldWrapper;

@interface Box2DWorld : NSObject {
    struct b2WorldWrapper *_worldWrapper;
}

// various functions that act on b2World

@end
```

Now there’s one more thing I have to do. b2Body instances are created via b2World, but my wrapper classes are opaque. So what I need is a way to have Box2DWorld spit out Box2DObject instances. Since Box2DObject disallows anything from touching the b2Body inside (on purpose), I created an extension to do this (note that I could **not** use a category because properties are prohibited in categories):

```
#import "Box2D.h"

// define the struct here
struct b2BodyWrapper {
    b2Body *body;
};

@interface Box2DObject () {

}

// an internal property
@property (nonatomic, readonly) b2BodyWrapper *wrapper;

@end
```

Now in the implementation of Box2DWorld, I can create instances of Box2DObject with a b2Body.

```
#import "Box2DWorld.h"
#import "Box2D.h"
#import "Box2DObject+Internal.h"

// define the struct here
struct b2WorldWrapper {
    b2World *world;
};

@implementation Box2DWorld

-(id)init {
    if ((self = [super init])) {
        _worldWrapper = new b2WorldWrapper();

        b2Vec2 gravity = b2Vec2(0.0f, -9.8f);
        _worldWrapper->world = new b2World(gravity);
    }

    return self;
}

-(Box2DObject *)objectFromParams:(NSDictionary *)data {
    Box2DObject *box2dObject = [[Box2DObject alloc] init];

    // create def + body
    b2BodyDef bodyDef;
    bodyDef.type = b2_dynamicBody;
    box2dObject.wrapper->body = _worldWrapper->world->CreateBody(&bodyDef);

    return box2dObject;
}

-(void)update {
    // call step
    _worldWrapper->world->Step(1.0f / 60.0f, 5, 10);
}

@end
```

I really have no idea if this is cool or a great hackish evil, but for my purposes, it seems to be working quite well!
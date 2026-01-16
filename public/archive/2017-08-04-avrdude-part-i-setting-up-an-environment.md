---
title: "Avrdude Part I: Setting up an Environment"
date: 2017-08-04T16:00:25.000Z
original_url: https://thegoldenmule.com/blog/2017/08/avrdude-part-i-setting-up-an-environment/
---

### On Breadth

I have a self-imposed rule: any technology I use at work, I am not allowed to use in my spare time. I [don’t](https://github.com/thegoldenmule/UnityInEnglish) [always](https://github.com/thegoldenmule/jint) [follow](https://github.com/thegoldenmule/GeometryProvider) [this](https://github.com/thegoldenmule/Pheromones) rule, but I _generally_ do. It’s part of my greater philosophy that people should go broad, not narrow. Specialization is a crippling strategy, especially for engineers, artists, writers, landscapers, dry cleaners– you know now that I think of it, specialization may be crippling for everyone.

### For Realsies

As my [last post](https://thegoldenmule.com/blog/2017/07/the-millers-tale/) alluded to, I’ve been working with Arduino. I’ve done [teensy stupid projects](https://thegoldenmule.com/blog/2013/09/of-wisdom-teeth-and-acceleration/) before, but I’ve been very curious to try– you know, a _real_ project. Like, for-realsies.

One of my biggest problems with the Arduino project (and maybe with C/C++?) is that it has a horrid mechanism for sharing code. With Arduino, you’re expected to copy source for common libraries into a specific directory. Then you have to add that library to the project in one of many weird ways that depend on the tool you’re using. Then you cross your fingers and half of the time it works. What’s more, the source for these libraries is pasted in forums or in their docs– be sure to scroll down or you might not see there’s a new version because the old version was rubbish and needed a rewrite. It’s an absolute garbage method of sharing code.

So I started what may be (and really– it pains me to say this) the most robust Arduino repository on GitHub. It’s a set of shared (or core) libraries for the Arduino projects I’ve been working on. Take a peek **[here](https://github.com/Open-farm/openfarm-core-avr)**.

### Developing development

The first step in making more-than-prototype code for Arduino is sorting out a good development environment. I think I have some real advice here because, to my knowledge, I’ve tried all of the options for developing Arduino projects. At least all of the major ones.

1.  **Arduino IDE** – Hard no on this one, friends: garbage text editor, difficult to use libraries, poor shortcuts, no way to run unit tests. Friends don’t let friends use the default Arduino IDE. [Friendship to me means that for two bucks I’d beat you with a pool cue until you got detached retinas](https://theinfosphere.org/File:That_Guy.png).
2.  **Visual Studio** – There’s actually [a lovely plugin for Arduino](http://www.visualmicro.com/). Heck I even bought a license. Visual Studio is a great editor with great C/C++ support, even better now that Resharper has a plugin. Visual Micro adds some nice dropdowns for configuring your device, and it adds some decent context menu options. With this plugin you can even kindof debug (it’s pretty flakey tee-be-aitch). Unfortunately it has its shortcomings. It’s not great when trying to use libraries. The serial monitor doesn’t work real well and it’s hard to use. I also just had a tough time figuring out a good [red-green-refactor](http://www.jamesshore.com/Blog/Red-Green-Refactor.html) workflow. I had to use my <shame>**mouse**</shame>.
3.  [**(Vim or Sublime) + Ino**](http://inotool.org/) – Ino is _d-Ino-mite._ That’s the best pun I could think of– problem is the sounds don’t really match (not sure if you noticed). Ino is a command line tool that basically wraps other, more difficult commands. It calls the avr versions of gcc and g++ (avr-gcc and avr-g++) that come bundled with the Ardunio IDE. Using Ino, you can integrate the Arduino build process with tons of other tools. I used Ino for quite awhile, paired with vim (which I am no good at). Ino is great, but it also has configuration problems. It’s hard to use libraries, it’s hard (impossible?) to configure for testing, it’s hard to do serial monitoring– _sigh_. That led me to my current strategy:
4.  **(Vim or Sublime) + Make** – This is what I’ve ended up using 100% of the time. This workflow is stupid fast. All I had to do was “reverse engineer” the calls that Ino was making. I can build or run tests or make commits to git without touching a silly mouse. I can link to libraries easily. I can make static libraries, build test executables, run those tests, etc. I can enable or disable exceptions and stack traces, or mark warnings as errors. Obviously, this is also the most “[bare-metal](https://twitter.com/shit_hn_says/status/234856345579446272?lang=en)” approach, so I feel like a real [neckbeard–](https://en.wikipedia.org/wiki/Stuart_Feldman) but seriously this is an amazing workflow. It’s like those [Unix guys and gals](https://www.youtube.com/watch?v=S7JB0mhrGCQ) knew what they were doing. If you don’t know vim or just don’t like it, Sublime is a good alternative.

I supplement make with [gradle](http://gradle.org) scripts that do all the other small bits and pieces, like generate documentation, create new project templates, run tests, upload to device, etc.

### Make

If you take a look at the root level [makefile](https://github.com/Open-farm/openfarm-core-avr/blob/master/makefile), you’ll see its calling into the subprojects. This way I can call make from any level– root or a specific project.

For the sub-projects, like the [makefile for the database library](https://github.com/Open-farm/openfarm-core-avr/blob/master/core-avr-logging/makefile), it’s really not that complicated.

```
include ../properties.mk

###############################################################################
# Library includes.
#
# Eg:
#
# -I$(BASECORE_DIR)/core-avr-ds/src
#
INC=-I$(BASECORE_DIR)/core-avr-ds/src \
	-I$(BASECORE_DIR)/core-avr-logging/src \
	-I$(BASECORE_DIR)/core-avr-io/src \
	-I$(BASECORE_DIR)/common
###############################################################################

###############################################################################
# Name of the library. This will automatically be prefixed by 'lib'.
#
# Eg:
#
# core-avr-data
#
LIBNAME=core-avr-database
###############################################################################

###############################################################################
# All source files.
#
# Eg:
#
# Foo.cpp Bar.cpp
#
SOURCES=\
	src/database.cpp\
	src/database_manager.cpp
###############################################################################

###############################################################################
# All test source files.
#
# Eg:
#
# Foo.cpp Bar.cpp
#
TEST_SOURCES=\
	test/database_tests.cpp\
	test/main_core-avr-database.cpp\
	test/database_manager_tests.cpp
###############################################################################

###############################################################################
# Archive dependencies to resolve.
#
# Eg:
#
# Foo.cpp Bar.cpp
#
ARCHIVE_INCLUDES=\
	-lcore-avr-logging\
	-lcore-avr-io
###############################################################################

# object file directories
AVR_OBJ_DIR=build/avr/obj
x86_OBJ_DIR=build/x86/obj

# Temporary build files.
AVR_OBJS=$(addprefix $(AVR_OBJ_DIR)/, $(notdir $(SOURCES:.cpp=.o)))
x86_OBJS=$(addprefix $(x86_OBJ_DIR)/, $(notdir $(SOURCES:.cpp=.o)))
TEST_OBJS=$(addprefix $(x86_OBJ_DIR)/, $(notdir $(TEST_SOURCES:.cpp=.o)))

build/Test.exe: $(x86_OBJS) $(TEST_OBJS)
	$(x86_CC) $(INC_ARCHIVES) -o build/Test.exe $(x86_OBJS) $(TEST_OBJS) -L$(LIB_DIR)/x86 $(ARCHIVE_INCLUDES)
	@mkdir -p $(LIB_DIR)/x86
	$(x86_ARCHIVER) rvs $(LIB_DIR)/x86/lib$(LIBNAME).a $(x86_OBJS)

$(AVR_OBJ_DIR)/%.o: src/%.cpp
	@mkdir -p $(AVR_OBJ_DIR)
	$(AVR_CC) $(AVR_CFLAGS) $(AVR_INCLUDES) $(INC) -c $< -o $(AVR_OBJ_DIR)/$(@F)

$(x86_OBJ_DIR)/%.o: src/%.cpp
	@mkdir -p $(x86_OBJ_DIR)
	$(x86_CC) $(x86_CFLAGS) $(x86_INCLUDES) $(INC) -c $< -o $(x86_OBJ_DIR)/$(@F)

$(x86_OBJ_DIR)/%.o: test/%.cpp
	@mkdir -p $(x86_OBJ_DIR)
	$(x86_CC) $(x86_CFLAGS) $(TEST_INCLUDES) $(INC) -Isrc -c $< -o $(x86_OBJ_DIR)/$(@F)
```

It’s pretty well documented in source, but the main idea is that it compiles:

-   AVR object files (.o).
-   An x86 static library (.a).
-   An x86 executable that runs unit tests (.exe). The unit tests can then link against the x86 static libraries. This is so that we don’t have to recompile dependencies– it can greatly speed up compile times in your testing loop.

I have to use two separate toolchains: x86 and AVR. The test executable and the static library are built using the x86 compiler. I could also build AVR static libraries, however, the compile flags change depending on your board– so I would need a static library for every configuration.

If you take a look at the `properties.mk` file, you can see the compiler flags and other setup:

```
# base directory for all core projects
BASECORE_DIR=..

# third part directory
THIRDPARTY_DIR=$(BASECORE_DIR)/thirdparty

# base arduino directory
ARDUINO_DIR=$(THIRDPARTY_DIR)/arduino

# include for Catch.hpp
TEST_INCLUDES=-I$(THIRDPARTY_DIR)/catch

# arduino variant
VARIANT=standard

# The microcontroler used.
CPUNAME=atmega328p

# Clock speed of the board.
CPUCLOCK=16000000L

# Compiler flags for all architectures
COMMON_CFLAGS=-g -Os -Wall -Werror -std=gnu++11

# Lib folder
LIB_DIR=$(BASECORE_DIR)/libs

# AVR properties
AVR_INCLUDES=-I$(ARDUINO_DIR)/hardware/arduino/avr/cores/arduino -I$(ARDUINO_DIR)/hardware/arduino/avr/variants/$(VARIANT) -I$(ARDUINO_DIR)/hardware/tools/avr/avr/include
AVR_CFLAGS=$(COMMON_CFLAGS) -fno-exceptions -ffunction-sections -fdata-sections -fno-threadsafe-statics -MMD -DARDUINO=100 -DARDUINO_AVR_NANO -DARDUINO_ARCH_AVR -mmcu=$(CPUNAME) -DF_CPU=$(CPUCLOCK)
AVR_ARCHIVER=$(ARDUINO_DIR)/hardware/tools/avr/bin/avr-ar.exe
AVR_CC=$(ARDUINO_DIR)/hardware/tools/avr/bin/avr-g++.exe

# Local architecture properties
x86_INCLUDES=$(AVR_INCLUDES)
x86_CFLAGS=$(COMMON_CFLAGS)
x86_ARCHIVER=ar
x86_CC=g++
```

**I am using C++11**, as you can see from the compiler flags. There doesn’t seem to be any problems, `gcc-avr` and `g++-avr` don’t seem to have any problems.

For unit tests, **I’m using [catch](https://github.com/philsquared/Catch)**. It’s a single include!

### Gradle

The last part of setting up a good environment is the other miscellaneous tasks that need performed. To fill in these cracks in a cross-platform way, I am using gradle. Read the [build doc](https://github.com/Open-farm/openfarm-core-avr/blob/master/docs/build-process.overview.md) to see what I’m talking about, but basically there are gradle tasks to build (this just calls make), generate documentation, run test executables, or generate a new project.

### NExt steps

This post is quite long. Kind kicking myself that I didn’t do it in verse– it would be the first true [Arduino Epic](https://en.wikipedia.org/wiki/Epic_poetry)! Next time, I guess. In my next post I’m going to dive in to some of these subprojects. It’s been a fun little experiment, so stay tuned.
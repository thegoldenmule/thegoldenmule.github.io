---
title: "Maven Just Needs Some Closure"
date: 2011-07-26T23:18:52.000Z
original_url: https://thegoldenmule.com/blog/2011/07/maven-just-needs-some-closure/
---

Maven is certainly a creature of \*inner\* beauty. You should not under any circumstances look directly at her. I am unsure how her creators can tinker under her voluminous skirt and come out alive. Unfortunately I looked into her eyes. I made a promise to Maven–but I broke my word. Now she need Closure.

Setting up your javascript project to use [Google’s Closure Compiler](http://code.google.com/closure/ "I need closure too...") is an excellent idea! Not only does it make downloads smaller and optimize code, it adds an extra measure of security too, as it can serve as a rudimentary obfuscator (not to mention, it makes you sound REALLY smart).

If you’re already using Maven for packaging or deployment, it’s very simple to include Closure. If you’re not using Maven, set up your project using the webapp [archetype](http://maven.apache.org/guides/introduction/introduction-to-archetypes.html "This link is so archetypal..."), then move on to the “Configuring Your POM” section (I should note, Maven may need additional setup to point at the correct repositories, but that’s beyond the scope of this article).

# Configuring Your POM

The first step is to include the correct basic plugin dependency:

```
<plugins>
  <plugin>
    <groupId>ro.isdc.wro4j</groupId>
    <artifactId>wro4j-maven-plugin</artifactId>
    <version>1.3.7</version>
  </plugin>
</plugins>
```

Now we can configure this to compile our code using Closure:

```
<plugins>
  <plugin>
    <groupId>ro.isdc.wro4j</groupId>
    <artifactId>wro4j-maven-plugin</artifactId>
    <version>1.3.7</version>
    <executions>
      <execution>
        <goals>
          <goal>run</goal>
        </goals>
      </execution>
    </executions>
    <configuration>
      <destinationFolder>${basedir}/target/min/</destinationFolder>
      <wroFile>${basedir}/src/assemble/wro.xml</wroFile>
      <wroManagerFactory>ro.isdc.wro.extensions.manager.standalone.GoogleStandaloneManagerFactory</wroManagerFactory>
      <ignoreMissingResources>false</ignoreMissingResources>
    </configuration>
  </plugin>
</plugins>
```

Here I’ve just added an execution and a configuration section. The configuration is very simple: just specify a destination, an assemble configuration file (wro.xml), and the wroManagerFactory class. This class can also refer to the YUI minimizer, or even a custom class if you want to get fancy.

# Writing Your wro.xml File

The hardest part of the setup is configuring the wro.xml file–and it’s still pretty easy! Basically, you want to separate your code into groups. Each group will be minimized into a single file, and each group can be made up of JS or CSS files, but not both. Here’s an example:

```
<groups xmlns="http://www.isdc.ro/wro"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.isdc.ro/wro wro.xsd">

	<!--
	Here we are combining all our third party libraries. A single asterisk
	grabs all the files in a folder. A double asterisk grabs all the files
	in a recursive manner.
	-->
	<group name="lib">
		<js>/js/lib/**.js</js>
	</group>

	<!--
	Now minimize our core javascript.
	-->
	<group name="core">
		<js>/js/core/**.js</js>
	</group>

	<!--
	These are examples of target specific items.
	-->
	<group name="ios">
		<js>/js/ios/**.js</js>
	</group>

	<group name="ie6">
		<js>/js/ie6/**.js</js>
	</group>
</groups>
```

The comments are pretty clear, but in case you missed it, the wro4j plugin will create four minimized files–lib.js, core.js, ios.js, and ie6.js. Cooler than monkeys in a barrel! Now you can feel professional, using Google’s own production toolz.

Feel free to point out my blunders in the comments.
---
title: "Why quaternions?"
date: 2012-10-02T02:13:27.000Z
original_url: https://thegoldenmule.com/blog/2012/10/why-quaternions/
---

We can represent 3D rotations in a variety of ways, arguably the most useful of which is the matrix. In three dimensional space, a 4×4 matrix usually defines the world transform of an object, because it can contain lots of information: translations, rotations, scale, and lots more. But when we’re talking simply about rotations, there’s another entity that is probably more useful: the quaternion.

## What is a quaternion?

It’s useful to first recall the definition of a complex number:

$$!\\mathbf{c} = a + b\\mathbf{i}\\ni \\mathbf{i} = \\sqrt{-1}$$

Hamiltonians (quaternions) are an extension to the complex number system. A Hamiltonian is described as:

$$!q = w + x\\mathbf{i} + y\\mathbf{j} + z\\mathbf{k} \\ni \\mathbf{i}^2 = \\mathbf{j}^2 = \\mathbf{k}^2 = \\mathbf{ijk} = -1$$

Whack right? Just whack enough to produce some incredibly useful results. Before I go any further, here is the formal definition from [wikipedia](http://en.wikipedia.org/wiki/Quaternions "An excellent read"):

$$!q = (w, \\overrightarrow{v}) \\ni q\\in\\mathbb{H},w\\in\\mathbb{R},\\overrightarrow{v}\\in\\mathbb{R}$$

I’m not going to go through all of the derivation of quaternions, as wikipedia has already done it much better than I could, but let me show you something amazing about the actual implementations of each of these mathematical entities.

In game programming, physics programming especially, we often need to take the inverse of a rotation. I recently wrote a Matrix3 class and a Quaternion class, so let me first show you how I implemented Matrix3::inverse:

```
public function invert():void {
	var i:int = 0;
	var scalar:Number = 0;
	var A:Matrix3 = clone();
	var I:Matrix3 = new Matrix3();

	// reduce first equation
	var a11:Number = A.a11;
	A.a11 = 1; I.a11 /= a11;
	A.a12 /= a11; I.a12 /= a11;
	A.a13 /= a11; I.a13 /= a11;

	// add to second + third
	scalar = -A.a21;
	A.a21 += scalar * A.a11; I.a21 += scalar * I.a11;
	A.a22 += scalar * A.a12; I.a22 += scalar * I.a12;
	A.a23 += scalar * A.a13; I.a23 += scalar * I.a13;

	scalar = -A.a31;
	A.a31 += scalar * A.a11; I.a31 += scalar * I.a11;
	A.a32 += scalar * A.a12; I.a32 += scalar * I.a12;
	A.a33 += scalar * A.a13; I.a33 += scalar * I.a13;

	///////////////////////////////////////////////////

	// reduce second equation
	var a22:Number = A.a22;
	A.a21 /= a22; I.a21 /= a22;
	A.a22 = 1; I.a22 /= a22;
	A.a23 /= a22; I.a23 /= a22;

	// add to first and third
	scalar = -A.a12;
	I.a11 += scalar * I.a21;
	A.a12 += scalar * A.a22; I.a12 += scalar * I.a22;
	A.a13 += scalar * A.a23; I.a13 += scalar * I.a23;

	scalar = -A.a32;
	I.a31 += scalar * I.a21;
	A.a32 += scalar * A.a22; I.a32 += scalar * I.a22;
	A.a33 += scalar * A.a23; I.a33 += scalar * I.a23;

	///////////////////////////////////////////////////

	// reduce third equation
	var a33:Number = A.a33;
	A.a31 /= a33; I.a31 /= a33;
	A.a32 /= a33; I.a32 /= a33;
	A.a33 = 1; I.a33 /= a33;

	// add to first and second
	scalar = -A.a13;
	I.a11 += scalar * I.a31;
	I.a12 += scalar * I.a32;
	A.a13 += scalar * A.a33; I.a13 += scalar * I.a33;

	scalar = -A.a23;
	I.a21 += scalar * I.a31;
	I.a22 += scalar * I.a32;
	A.a23 += scalar * A.a33; I.a23 += scalar * I.a33;

	// set our matrix
	this.a11 = I.a11; this.a12 = I.a12; this.a13 = I.a13;
	this.a21 = I.a21; this.a22 = I.a22; this.a23 = I.a23;
	this.a31 = I.a31; this.a32 = I.a32; this.a33 = I.a33;
}
```

This function is horribly slow. AS3’s built-in Matrix class does a little better, but it’s still not fast by any stretch of the imagination. Now, let me show you the equivalent function in Quaternion.as:

```
public function calculateInverse():Quaternion {
	var divisor:Number = 1 / (x * x + y * y + z * z + w * w);

	return new Quaternion(w / divisor, -x / divisor, -y / divisor, -z / divisor);
}
```

I’ll let you guess which one of those is more expensive (Hint: the obvious one). The deep math behind the quaternion is such that taking the inverse is extremely straightforward and incredibly fast in comparison to taking the inverse of a matrix.

And that, my friends, is a great reason to learn and embrace the quaternion.
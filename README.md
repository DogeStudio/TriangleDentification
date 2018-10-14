TriangleDentification
============
This is a analytic algorithm that judge a point whether in a triangle. If true, get the outline of the triangle. The algorithm face to simple picture. The following content will demonstrate the algorithm.  About this algorithm implementation, please refer to the `src` directory.

Explain
-----------
### preparatory work
At the beginning, we've got a picture of a after binarization. This image is expressed by 2D array. Marked points value is `1`. We want to test point is called the `origin`.

### step 0
Traverse the pictures and find all the marked points. Push these points into array `markPos`.

### step 1
In order to find all possible first edge after `origin` in the triangle. Find all the attachment that `origin` with all the elements in `markpos`. Maybe you will ask me, if we want to find first edge after `origin`, we only need to check the pointer that `origin` neighbors. The problem of the idea is you don't know which point is neighbor with origin. We discuss in two different conditions.
* Circumstance 1: The line we are looking for just the slope of 45°and 135. Now, the neighbors of `origin` also is its neighbors on the pixel space. The number of such points only 8.
* Others Circumstance: As we know, any two points can be together as a straight line. Consider the situation:
![Others Circumstance](Others Circumstance.png)

And push these lines into array `SLEP`.

#### Optimize
This operation will be repeated in the three stages of algorithm. Each process check point will be much more than the last one process. So there are two optimization method, to eliminate some point that needn’t to check. 

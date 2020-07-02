The Pressing Game
=================

The pressing game is tool for computational phylogenetics. One species' genetic code maps to another via a sequence of swaps of adjacent substrings of genetic material; the number of swaps it takes to go from one species' code to another is a measure of  evolutionary distance between those species.

The pressing game allows one to find the shortest sequence of swaps to perform such a mapping.

In the game, you start with a bicolored graph - a graph in which all the vertices are one of two colors. You press a vertex and it changes the colors of vertices in its "neighborhood" (adjacent vertices), and complements the induced graph, or produces a modification of the graph such that pairs of vertices in the neighborhood of the pressed vertex that previously were connected are now disconnected, and those that weren't now are. The goal is to make all vertices one color and remove all connections.

Collaboration
-------------

We were approached by Dr. Joshua Cooper, a professor of mathematics at the University of South Carolina, to write an application to graphically explore pressing game sequences. Dr. Cooper and his graduate students are working on a number of conjectures about the relationships between different sequences that produce the same desired results. A technical paper on the topic can be found here: [http://people.math.sc.edu/cooper/pressing.pdf](http://people.math.sc.edu/cooper/pressing.pdf).

Specifications
--------------

Initial conversations with Dr. Cooper produced the following specifications:

The application

* must run on common mobile devices (phones/tablets) as well as personal computers, and should therefore be responsive.
* must be browser-based, for ease of cross-platform maintenance.
* must have a GUI that allows the user to draw a bicolored graph.
* must allow the user to play the game by pressing or clicking vertices.
* gives the ability to reset or step backward through vertex selections.
* requires a server-side component for storing complete sequences arrived at through game play and for pre-computing demonstration sequences.
* will be coded primarily in Javascript/SVG on the client side and Python/Django/mySQL on the server side.

Timeframe for Delivery
----------------------

Students will begin work either in the fall of 2016 or in the summer of 2016, continuing into the fall semester. The project will be delivered by February 1st of 2017.

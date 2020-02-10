## The Pressing Game
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

## Course Outline: ENT-3320, Technical Production, Wilson, Fall 2017

New York City College of Technology  
Entertainment Technology Department  
186 Jay Street, Room V-203, Brooklyn, NY 11201  
(718) 260-5588  
  
ENT-3320 Technical Production  
90 lab hrs, 2 cr  
Prerequisites: ENT 2120\*; Pre- or corequisites: ENT 1110 or ENT 1190 or ENT 1250 or ENT 1260 or ENT 1270 or MTEC 1102 (\*ENT 2120 is not a prerequisite if MTEC 1102 has been taken.)  
  
__Year, Semester__: 2017, fall  
__Section__: D332  
__Professor__: Wilson/Viera  
__Office__: Voorhees room 203, x5898  
__Email__: awilson@citytech.cuny.edu  
__Office Hours__: Tu/Th 2:00 – 3:00 PM  

### Overview
This course provides an opportunity for students to apply the skills they've acquired in the course of pursuing their degree to a collaboratively implemented software project suitable for deployment in the real world. We will work together to fix bugs and code new features for an existing mobile game.

### Process
Every two weeks a new set of features and bug fixes will be assigned to teams and/or individuals by the professor. Assigned work must be completed within the two-week "sprint." All project participants will have tasks during the sprint. GitHub will be used to manage software and documentation for the project. Each team leader will push completed work to their own copy of the development branch and open a PR (pull request). The professor, and potentially or one of the more experienced coders in the class, will evaluate the pull request. Both evaluators will provide comments requesting changes, if needed, and the committer will be required to fix and push to his/her remote copy of the branch until the work is considered complete. Complete work is merged into the main development branch. Each day we will have a brief standup meeting to determine where we are, individually and as a group.

### Grading
Grading will be based on (1) submission of an initial pull request one week from the date of assignment, and (2) the number of pull request/evaluation cycles (minus the first) required to complete an assigned task within the two-week sprint. For example, if the first pull request following the initial is approved for merge immediately, an 'A+' is awarded. The grade will fall one letter grade (i.e. B -> B-) for each additional pull request required to fix it. If the work is not completed by the end of the sprint, an 'F' is assigned for that task. Grades will be posted on blackboard at the end of each sprint.

There are 8 pull request/evaluation cycles (sprints).

* Initial pull requests, due one week after sprint assignments, are worth 30% of the final grade (3.75% each); these are pass/fail, based on whether they are submitted or not.
* Final pull requests (including all updates required to complete them), are worth 70% of your grade (8.75% each).

### Requirements
* Attendance is required at every class. The majority of work is done collaboratively in a lab environment, and everyone's objectives are interdependent.
* Every student must bring a USB drive or his/her own laptop. USB drives must be formatted for the Mac OS Extended file system.

### Schedule
#### Friday, August 25: Orientation
* Introduction to the game and associated codebase.
* All students clone the repository onto their USB drives. 
* The majority of students will familiarize themselves with the code by adding a test feature on a local copy of the "develop" branch: make all edges turn blue and all vertices turn yellow when a particular button is clicked; other students with experience in the codebase will review stale PR's and branches.
#### Wednesday, August 30: Sprint 1
* Sprint 1 teams are formed and Sprint 1 assignments are given.
#### Wednesday, September 6: Sprint 1
* Initial pull requests due for all assignments.
#### Wednesday, September 13: Sprint 2
* Sprint 1 assignments must be completed by this date.
* Sprint 2 teams are formed and Sprint 2 assignments are given.
#### Wednesday, September 27: Sprint 2
* Initial pull requests due for all assignments.
#### Wednesday, October 4: Sprint 3
* Sprint 2 assignments must be completed by this date.
* Sprint 3 teams are formed and Sprint 3 assignments are given.
#### Wednesday, October 11: Sprint 3
* Initial pull requests due for all assignments.
#### Wednesday, October 18: Sprint 4
* Sprint 3 assignments must be completed by this date.
* Sprint 4 teams are formed and Sprint 4 assignments are given.
#### Wednesday, October 25: Sprint 4
* Initial pull requests due for all assignments.
#### Wednesday, November 1: Sprint 5
* Sprint 4 assignments must be completed by this date.
* Sprint 5 teams are formed and Sprint 5 assignments are given.
#### Wednesday, November 8: Sprint 5
* Initial pull requests due for all assignments.
#### Wednesday, November 15: Sprint 6
* Sprint 5 assignments must be completed by this date.
* Sprint 6 teams are formed and Sprint 6 assignments are given.
#### Tuesday, November 21: Sprint 6 (NOTE: this Tuesday follows a Friday schedule)
* Sprint 6 assignments must be completed by END OF CLASS on this date.
#### Wednesday, November 22: Sprint 7
* Sprint 7 teams are formed and Sprint 7 assignments are given.
#### Wednesday, November 29: Sprint 7
* Initial pull requests due for all assignments.
#### Wednesday, December 6: Sprint 7
* Sprint 7 assignments must be completed by this date.
* Class-wide testing assignments given for (short) Sprint 8.
#### Wednesday, December 13 
* Sprint 8 testing completed by END OF CLASS on this date.
#### Wednesday, December 15: Deployment and Discussion


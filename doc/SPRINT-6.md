# SPRINT 06

__Initial pull requests due Wednesday, November 22, end of class. Final PR's are due Wednesday, November 29__. PR's will be addressed in the order received.

## Working Directory

Note the "dev" directory in the repository. This is where all of our work will be done.

We have started writing the code, so you have a framework to attach your features to. Note that there is no code in the "global" space; everything is in Javascript pseudo-classes. The latest ECMA standard supports object-oriented syntax (actual classes, as opposed to functions defined on functions), but it is not fully supported across all of our target devices/browsers.

Before you examine the code or run it, you may want the check out doc/buildGraphDemo.mp4 to see what it does.

One thing that might be confusing is where to use "this" and where to use "self." For certain class functions that are passed to D3 functions, for example, the class goes out of scope, and "this" refers to the D3 object, not the class on which the function is defined. To refer to the class on which such a function is defined, we pass the class object as a variable "self."

Our objective for now is to work only with d3.js and SVG; we will not be using any other Javascript libraries (not even jQuery), and we will do our best to avoid CSS.

D3 links:

* [https://d3js.org](https://d3js.org)
* [https://github.com/d3/d3/wiki](https://github.com/d3/d3/wiki)
* [https://github.com/d3/d3-selection-multi](https://github.com/d3/d3-selection-multi)

## Testing

Before pushing code and requesting a merge to develop, verify that your code works on the __LATEST VERSIONS__ of the following:

### Windows desktop

* Chrome
* Firefox
* Edge

### Mac Desktop

* Chrome
* Firefox
* Safari

### iPhone/iPad

* Safari

### Android

* Chrome
* Firefox

You may need to work together, checking out each other's branches, to cover all of these device/browser combinations.
 
## Sprint Assignments (initial PR's due Wednesday, November 22, end of class. Final PR's are due Wednesday, November 29):

__FOR ALL ASSIGNMENTS: with each new feature or modification, a new blackbox test should be added, if necessary, to test/blackbox.md__
__EACH TIME YOU PUSH CHANGES TO AN OPEN PULL REQUEST PLEASE ADD "@ajwnycct & @CarlosXViera: please check."__

### Cheng Chin
Fix the ABOUT page to correct typos and include all contributors to the project.

### John Cruz-Makuku
Fix bounding box bug, likely introduced by Ian's most recent merge. Vertices no longer "jump" so that their center coordinates match mouse location, but the vertices can now be dragged off the playing area. Look at the commit history and examine the code for the vertex drag event handler in the commit in develop just prior to Ian's. Find the part of the code that establishes a bounding box and restore it with any necessary modicifications.

### Fanzhong Zeng
Implement "CHEAT" button to assign vertex labels, to be dynamically generated, indicating where presses will lead to a failed game.

### Jermaine (Jia Ming) Feng
Investigate 200+ vertices causing "crash" (when MATRIX button is clicked?). Find out where the performance hit is happening (use Chrome's debugging tools).

### Brian Kriczky
Make copy button revert from green back to gray after it is clicked. Test thoroughly: see what happens, for example, when the overla is destroyed prior to reversion, and then open the overlay again.

### Daniel Lux
Fix SEQUENCE button initial color (should be colored the same as other disabled buttons).

### Ian Pokorny
Fix bug whereby toggle drawaer handle color does not revert on play->undo->redo.

### Wilson
Look into strange interface resizing phenomenon on mouseover of buttons when the lower edge of the viewBox is nearly aligned with the bottom edge of the browser.

### TO DO IN FUTURE SPRINTS
Future features/bugs to address, in order of priority:
PHASE 1 - complete frontend  
1. General code optimization and naming conventions -- when to use camel case and when to use underscores?
PHASE 2 - begin backend
1. Store graph and associated pressing sequence in database.  
2. Recall a graph and associated pressing sequence.  
3. Playback a recalled sequence.  


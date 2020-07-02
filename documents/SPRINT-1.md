# SPRINT 01

__Initial pull requests due Wednesday, September 6, beginning of class__. PR's will be addressed in the order received.

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
 
## Sprint Assignments (initial PRs due beginning of class Wednesday, September 6):

__FOR ALL ASSIGNMENTS: with each new feature or modification, a new blackbox test should be added, if necessary, to test/blackbox.md__

### Cheng Chin
Take a look at Lindelle's (username maskill) most recent commits. We want to do the following:
1. Replace all matrix text with paths using Fanzhong's functions.
2. Add numbers at the top of the matrix, left-aligned with columns.
3. Do not use commas inside the matrix - just spaces.
4. All numbers, including horizontal and vertical vertex numbers, as well as matrix values, should be the same size.
5. Make sure all graphics are SVG (including the transparent overlay rectangle), and remove any unnecessary CSS from pressing-game.css. IDEALLY, WE DEPRECATE THE CSS FILE ALTOGETHER.

### John Cruz-Makuku
Use Fanzhong's functions for rendering text as SVG paths to reporoduce the text on the ABOUT and ? (HELP) overlays.

### Fanzhong Zeng
Complete functions for rendering any text as SVG paths.

### Jermaine (Jia Ming) Feng
The circular arrangment of vertices that appears when the MATRIX button is pressed is horizontally centered on the SVG viewBox, but not apparently vertically centered. Please fix. Also, experiment with a maximum random number of one or two fewer vertices, equally spaced around the circle; there are edges that intersect with 

### Brian Kriczky
Research project: find a cross-platform, cross-browser method for populating the clipboard with the click of a button in the browser. Take a look at the solution proposed by Greg Lowe on [https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript](https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript). Make a button that fires Greg's function, with some arbitrary text as argument, and test to see if the target text pastes on all patforms and browsers we support (see "Testing" above for all devices and browsers). Add you test code in a "clipboard-test" directory in your branch and report on the results in a PR.

### Daniel Lux
Make all edges appear wider; edges are currently difficult to select for deletion because they are too thin. Coordinate with Germaine, since wider edges may cause intersections between edges and vertices in his work.

### Ian Pokorny
Divide pressing-game.js into multiple files. There should be a separate file for each pseudo-class (Vertex, Edge, and Graph); these should be placed in a folder called pressing-game, and named vertex.js, edge.js, and graph.js. There should be a file called run.js with just the window.onload function. There should also be a utils.js in this folder, containing any functions or global variables not encapsulated by a pseudo-class (we will further organize these into separate files later; globals.js, util.js, font.js, etc.). Make sure you add each file to index.htm in the right order.

### TO DO IN FUTURE SPRINTS
Future features/bugs to address, in order of priority:
PHASE 1 - complete frontend  
1. Fix/alter scrolling behavior in overlay pages MATRIX, ABOUT, and ? (HELP).  
2. Prompt/overlay and button to display and add pressing sequence to clipboard.  
3. Fix awkward click with mouse on Vertex that causes Vertex to jump - this will be a tricky bug; likely has to do with the order of firing of event handlers.  
4. Button for adding matrix to clipboard.  
5. Move analysis: predict when a move has rendered winning impossible.  
6. Refactor/optimize code.  
PHASE 2 - begin backend  
1. Store graph and associated pressing sequence in database.  
2. Recall a graph and associated pressing sequence.  
3. Playback a recalled sequence.  


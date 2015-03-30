# position-markers
Angular directive to mark your position as your scroll.

demo: [plnkr](http://plnkr.co/edit/qXXPYS?p=preview)

This directive has buttons that mark the position of which active section you're at as you scroll. Alone, all this directive does is mark the position.  I typically use this in conjunction with my scroll ease
  directive which adds a scroll-to action onclick of a button.  [scroll-ease](https://github.com/belaqua84/scroll-ease).
  
The way this works is that there is a debounced on scroll event listener.  When you scroll down to the top of the first element that you've selected as a section you want to have a position marker, a class of 'fixed-markers' is added to the parent of the sections you're scrolling to.  Adding this class takes the position markers from a position of absolute to a position of fixed and then the button position-markers stay on the page as you scroll down.  Each marker will highlight (will get a class of 'active') as you scroll to the top of the section that they are linked to.

##Usage
First, bring the script into your index page:

`<script scr="PositionMarkersDirective.js"></script>`

There's a template for this directive, if you have it at the root level of your application you don't need to do anything, but if you place it inside another directory, you'll need to change the templateUrl inside the directive.

`templateUrl: 'positionMarkers.html',`

To employ the markers, insert an element with the position-markers attribute with a value that is the sections you want to mark as you scroll:

`<div data-position-markers="section1,section2,section3" class="position-markers"></div>`

'section1,section2,section3' are the IDs of the elements whose currently scrolled-to position you want to mark.  You can use as many IDs as you want, though the elements all need to be at the same hierarchical level in your html.

I've included some styles in the stylesheet you can use if you choose to do so.  When you scroll to the first section, the first position marker button will get a class of 'active'.  As you scroll to each section progressively, their button marker will get the active class and it will be removed from the other buttons.

####Apologies
If this description is hard to follow initially, you'll be better off looking at the example from the plnkr to see what this does.
  


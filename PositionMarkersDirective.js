myApp.directive('positionMarkers', ['$window', '$interval', function($window, $interval){
    return {
        restrict: 'A',
        templateUrl: 'positionMarkers.html',
        link: function(scope, element, attrs){
            scope.scrollToArray = (attrs.positionMarkers).split(',');
            var firstSectionTop = document.getElementById(scope.scrollToArray[0]).getBoundingClientRect().top;
            //array of position markers.  Wait till html is generated to perform - check with $interval
            var markersNodeList,
                markersArray = [];

            var getScroller = function(){
                if(document.body.scrollTop > 0){
                    return document.body;
                }
                else if(document.documentElement){
                    return document.documentElement;
                }
            };

            var addClass = function(elem, addClass){
                var classArray = (elem.className).split(' ');
                var classAlreadyExists = false;
                classArray.forEach(function(currentClass){
                    if(currentClass === addClass){
                        classAlreadyExists = true;
                    }
                });
                if(classAlreadyExists === false){
                    elem.className += ' ' + addClass;
                }
            };

            var removeClass = function(elem, removeClass){
                var classArray = (elem.className).split(' ');
                var removedClassList = '';
                classArray.forEach(function(currentClass){
                    if(currentClass !== removeClass){
                        removedClassList += ' ' + currentClass;
                    }
                });
                elem.className = removedClassList.replace(/^\s+|\s+$/g,''); //trim trailing and leading white space
            };

            var hasClass = function(elem, selector){
                var className = " " + selector + " ";
                var cleanClass = /[\n\t\r]/g;
                if ((" " + elem.className + " ").replace(cleanClass, " ").indexOf(className) > -1) {
                    return true;
                }

                return false;
            };

            var debounce = function(func, wait, immediate){
                var timeout;
                return function() {
                    var context = this, args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            };

            var forEachNode = function(array, callback, model){
                for (var i = 0; i < array.length; i++) {
                    callback.call(model, i, array[i]); // passes back stuff we need
                }
            };

            //After scrolling past big 1st image, add class fixed-markers to .get-started-container so that the marker buttons will be on the top left. 
            var fixOnScroll = function(){
                var container = element[0].parentElement;
                if(getScroller().scrollTop >= firstSectionTop) {
                    addClass(container, 'fixed-markers');
                }
                else {
                    removeClass(container, 'fixed-markers');
                }
            };

            //uses the debounce to wait until the user is DONE scrolling to run the fixOnScroll function so that it doesn't run a million times during scroll.
            var efficientFixOnScroll = debounce(function() {
                fixOnScroll();
            }, 50);  //make the change if no resize activity after 100 miliseconds.

            //On scroll add class to "active" position marker
            var setActiveMarker = function(){
                if(getScroller().scrollTop >= firstSectionTop){
                    var pxFromTop = getScroller().scrollTop; //get current scrolled amount
                    var lastId,
                        id = '';
                    //get ID of current scroll item
                    var current = (scope.scrollToArray).map(function(objId){
                        var elem = document.getElementById(objId);
                        if(elem.offsetTop <= pxFromTop){
                            return elem;
                        }
                    });

                    // Get the id of the current element
                    var activeSectionsArray = [];
                    current.forEach(function(item, index){
                        if(item !== undefined){
                            activeSectionsArray.push(item);
                        }
                    });
                    if(activeSectionsArray.length !== 0){
                        id = activeSectionsArray ? activeSectionsArray[activeSectionsArray.length-1].id : "";
                    }

                    if (lastId !== id) {
                        lastId = id;
                        // Set/remove active class
                        markersArray.forEach(function(button){
                            if(hasClass(button, 'active')){
                                removeClass(button, 'active');
                            }
                        });
                        var activeMarker = document.querySelector('.fixed-markers #' + id + '-btn');
                        addClass(activeMarker, 'active');
                    }  
                    
                }
                else { //de-active the position marker buttons
                    markersArray.forEach(function(button){
                        removeClass(button, 'active');
                    }); 
                }
            };

            //uses the debounce to wait until the user is DONE scrolling to run the fixOnScroll function so that it doesn't run a million times during scroll.
            var efficientSetActiveMarker = debounce(function() {
                setActiveMarker();
            }, 100);  //make the change if no resize activity after 100 miliseconds.

            //Wait until the html is loaded to run a couple of the functions initially before first scrolling - esp in firefox where if you reload the page it will reload you at your last scoll-point.
            var waitForHtml = $interval(function(){
                if(document.querySelector('[data-position-markers] button')){
                    markersNodeList = document.querySelectorAll('[data-position-markers] button');
                    forEachNode(markersNodeList, function(index, value){
                        markersArray.push(value);  
                    });
                    fixOnScroll(); 
                    setActiveMarker();
                    $interval.cancel(waitForHtml);
                }
            }, 100);

            var w = angular.element($window);
            w.bind('scroll', function () {
                efficientFixOnScroll();
                efficientSetActiveMarker();
            });
        }
    }
}]);
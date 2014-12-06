(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	var createSnakeCollection = require('./snake_collection');
	var singleton = require('./singleton');

	$(document).ready(function(){
		singleton.init();
		var snakeCollection = createSnakeCollection();
	});	

}())

},{"./singleton":3,"./snake_collection":5}],2:[function(require,module,exports){
(function(){

	/*
     * Document Elements
     */

    function createDocument() {
        var $body = $('body'),
            $window = $(window),
            $document = $(document),
            $canvasdiv = $('.canvas');

        return {
            getBody: function() {
                return $body;
            },
            getWindow: function() {
                return $window;
            },
            getDocument: function() {
                return $document;
            },
            getCanvasDiv: function() {
                return $canvasdiv;
            },
        }
    }

    module.exports = createDocument; 

}())
},{}],3:[function(require,module,exports){
(function(){
	var stupid = require('./stupid');
	
	var createDocument = require('./document');
	var createTick = require('./tick');
	
	var singleton = {
		init:function(){
			this.document = stupid.createSingleton(createDocument);
			this.tick = stupid.createSingleton(createTick);
		}
	}; 

	module.exports = singleton;
}())
},{"./document":2,"./stupid":7,"./tick":8}],4:[function(require,module,exports){
(function($){
		var singleton = require('./singleton');
		var stupid = require('./stupid');
		var createSnakePart = require('./snake_part');

	    /*
	    * Snake
	    */
		function createSnake(){
			var that = {};
			var snake = [];
			var snakePosition = [];
			var $el = $('<div />').addClass('snake').css({
				"background-color": '#'+Math.floor(Math.random()*16777215).toString(16)
			});

			var x = singleton.document.getInstance().getDocument().width() * Math.random();
			var y = singleton.document.getInstance().getDocument().height() * Math.random();
			var loop = stupid.createCollectionLoop(snake);
			var step = 5;
			var minDistance = Math.random() * 100 + 100;
			
			singleton.document.getInstance().getCanvasDiv().append($el);

			/*
			* Public
			*/

			that.$el = $el;
			that.getPosition = function(){
				return {
					x: x,
					y: y
				}
			};


			/*
			* Private
			*/

			_init();

			function _init(){
				_body();
				
				//tickSingleton.getInstance().add({callback:_render})
				
			}
			function _body(){
				var maxBodyLength = Math.random() * 20 + 20
				_buildBody(1);

				function buildBody(){
					_buildBody(1);
					if(snake.length > maxBodyLength) clearInterval(si);
				}

				var si = setInterval(buildBody,100);
			}

			function _buildBody(length){
				for (var i = 0; i < length; i++) {
					_addNewElementToSnake();
				};
			}

			function _addNewElementToSnake(){
				var el = createSnakePart(that);
				snake.push(el);
				var lastPosition = snakePosition[snakePosition.length - 1] || el;
				snakePosition.push({
					x: lastPosition.x,
					y: lastPosition.y
				});
				_styleBody();
			}

			function _getNewPosition(){
				var value = stupid.random.nullOr(step);
				return Math.random() < 0.5 ? value : value * -1;
			}

			function _update(){
				var pos = _potentialPosition();
				x = pos.x;
				y = pos.y;
			}

			function _potentialPosition(){
				var	potentialX;
				var potentialY;
				var safe = 0;

				setPotentialPosition();

				function setPotentialPosition(){
					potentialX = x + _getNewPosition();
					potentialY = y + _getNewPosition();
				}

				function steppedOnTale(){
					var taleStepping = false;

					function loopFunction(el,i){
						var pos = el.getPosition();
						if(potentialX === pos.x && potentialY === pos.y){
							taleStepping = true;
						}	
					}
					
					loop(loopFunction);

					return taleStepping;
				}
				
				while(steppedOnTale()){
					setPotentialPosition();

					if(safe > 8) break;
					safe += 1;
				}
				return {x: potentialX, y: potentialY};
			}

			function _udpatePositionHistory(){
				snakePosition.unshift({x:x,y:y});
				if(snakePosition.length > snake.length) snakePosition.pop();
			}

			function _displayPosition(){
				function loopFunction(el,i){
					el.setPosition(snakePosition[i].x,snakePosition[i].y);
				}
				loop(loopFunction);
			}

			function _positionBounderies(){
				var width = singleton.document.getInstance().getWindow().width();
				var height = singleton.document.getInstance().getWindow().height();

				if(x < 0){
					x = width;
				}else if(x > width){
					x = 0;
				}

				if(y < 0){
					y = height;
				}else if(y > height){
					y = 0;
				}
			}

			function _styleBody(){
				var snakeLength = snake.length;
				function loopFunction(el,i){
					var opacity = Math.pow(snakeLength / (i + 1), 2) / 10;
					if(i === 0) opacity = 1;
					el.setOpacity(opacity);
				}
				loop(loopFunction);
			}

			function _handlePosition(){
				_positionBounderies();
				_udpatePositionHistory();
				_displayPosition();
			}

			function _render(){
				_update();
				_handlePosition();
			}

			function _distanceTo(point){
				return stupid.util.lineDistance(point, that.getPosition());
			}

			function _goAwayFrom(point){
				var value = step;

				if(point.x > x) x -= stupid.random.nullOr(value);
				if(point.x < x) x += stupid.random.nullOr(value);
				if(point.y > y) y -= stupid.random.nullOr(value);
				if(point.y < y) y += stupid.random.nullOr(value);

				_handlePosition();
			}

			function _goTowards(point){
				var value = step;
				
				if(point.x > x) x += stupid.random.nullOr(value);
				if(point.x < x) x -= stupid.random.nullOr(value);
				if(point.y > y) y += stupid.random.nullOr(value);
				if(point.y < y) y -= stupid.random.nullOr(value);

				_handlePosition();
			}


			function _createAttraction(){
				var count = 0;
				var countMax = newRandom();
				var toggle = Math.random() < 0.5 ? false : true;

				function newRandom(){
					return Math.random() * 100 + 50;
				}
				return function(){
					count += 1;

					if(count >= countMax){
						toggle = !toggle;
						countMax = newRandom();
						count = 0;
					}

					return toggle ? _goAwayFrom : _goTowards;
				}
			}
			/*
			* Public
			*/

			that.render = _render;
			that.distanceTo = _distanceTo;
			that.attraction = _createAttraction();

			that.getMinDistance = function(){
				return minDistance;
			}

			return that;
		}

		module.exports = createSnake; 

}(jQuery))

},{"./singleton":3,"./snake_part":6,"./stupid":7}],5:[function(require,module,exports){
(function(){
	/*
	* Snake Collection
	*/


	var stupid = require('./stupid');  
	var createSnake = require('./snake');  
	var singleton = require('./singleton');  

	function createSnakeCollection(){
		var that = {};
		var snakes = [];
		var loop = stupid.createCollectionLoop(snakes);
		var numberOfSnakes = 20;
		var delayBetweenSnakes = 0;
		var identify = { callback:_render};
		_init();

		function _init(){
			_addSnakes();
			singleton.tick.getInstance().add(identify);	

			// setTimeout(function(){
			// 	tickSingleton.getInstance().remove(identify);	
			// },1000);			
		}
		
		function _addSnakes(){
			addSnakeToDisplay();

			function addSnakeToDisplay(){
				snakes.push(createSnake()); 
				if(snakes.length > numberOfSnakes - 1) clearInterval(si);
			}

			var si = setInterval(addSnakeToDisplay, delayBetweenSnakes);
		}
		function _draw(){
			loop(loopFunction);
			function loopFunction(el,i){
				el.render();
			}
		}

		function _checkSnakesDistance(){

			loop(loopFunctionOuter);

			function loopFunctionOuter(el,i){
				loop(loopFunctionInner,el);
			}

			function loopFunctionInner(el,i,args){
				var other = args[0];
				if(el === other) return;
				var otherPosition = other.getPosition();
				var dist = el.distanceTo(otherPosition);
				if(dist < el.getMinDistance()){
					el.attraction()(otherPosition);
				}
			}
		}

		function _render(){
			_draw();
			_checkSnakesDistance();
		}

	 	return that;
	}

	module.exports = createSnakeCollection; 
}())
},{"./singleton":3,"./snake":4,"./stupid":7}],6:[function(require,module,exports){
(function(){
	/*
	* Snake Part
	*/

	function createSnakePart(){
	 	var that = {};
	 	var parent = arguments[0];
	 	var $parent = arguments[0].$el;
	 	var $el = _createHtmlElement();
	 	var el = $el[0];
	 	
	 	_addToDisplay($el);

	 	function _createHtmlElement() {
	 		var pos = parent.getPosition();
			return $('<div />').addClass('snake-child').css({
				"position":"absolute",
				"background-color":'inherit',
				"width":"10px",
				"height":"10px",
				"opacity": "0",
				"transform":"translateX("+pos.x+"px) translateY("+pos.y+"px)"
			});
		};

		function _addToDisplay(el){
			$parent.append(el);
		}

		/*
		* Public
		*/

		that.getPosition = function() {
			var pos = el.getBoundingClientRect()

			// var st = window.getComputedStyle(el, null);
			// var tr = st.getPropertyValue("-webkit-transform") ||
			//          st.getPropertyValue("-moz-transform") ||
			//          st.getPropertyValue("-ms-transform") ||
			//          st.getPropertyValue("-o-transform") ||
			//          st.getPropertyValue("transform") ||
			//          "Either no transform set, or browser doesn't do getComputedStyle";

			// var values = tr.match(/\d+(\.\d+)?/ig);
			// var left = parseInt(values[4]);
			// var top = parseInt(values[5]);

			return {
				x: pos.left,
				y: pos.top
			}
		};

		that.setPosition = function(x,y) {
			el.style["transform"] = "translateX("+x+"px) translateY("+y+"px) translateZ(0px)"; 
		};

		that.setOpacity = function(value){
			el.style["opacity"] = value;
		}

	 	return that;
	}

	module.exports = createSnakePart; 
}())
},{}],7:[function(require,module,exports){
(function(){

    var stupid = {};


    /*
    * CREATE SINGLETON FUNCTION
    *
    * Creates a singleton out of a function
    * Get the function by using foo.getInstance();
    */

    function createSingleton(createObject){
        return (function () {
            var instance;
         
            function createInstance() {
                var object = createObject();
                return object;
            }
         
            return {
                getInstance: function () {
                    if (!instance) {
                        instance = createInstance();
                    }
                    return instance;
                }
            };
        })();
    }

    stupid.createSingleton = createSingleton;

    /*
    * Collection Loop
    */
    function createCollectionLoop(collection){
        return function(callback){
            var args = Array.prototype.slice.call(arguments);
            args.shift();

            for (var i = 0; i < collection.length; i++) {
                callback(collection[i], i, args);
            };
        }
    }

    stupid.createCollectionLoop = createCollectionLoop;

    /*
    * REQUEST ANIMATION FRAME
    *
    * Shim layer with setTimeout fallback
    */

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    window.cancelAnimFrame = (function(){
        return  window.cancelAnimationFrame ||
                function (id){
                    clearTimeout(id);
                }
    })();


    /*
    * Date now
    */

    if (!Date.now) {
      Date.now = function now() {
        return new Date().getTime();
      };
    }

    /*
    * Random
    */

    stupid.random = {};

    stupid.random.nullOr = function(value){
        return Math.random() < 0.5 ? value : 0;
    }

    /*
    * Util
    */

    stupid.util = {};

    stupid.util.lineDistance = function( point1, point2 ){
      var xs = 0;
      var ys = 0;
     
      xs = point2.x - point1.x;
      xs = xs * xs;
     
      ys = point2.y - point1.y;
      ys = ys * ys;
     
      return Math.sqrt( xs + ys );
    }
    
    module.exports = stupid;

}())
},{}],8:[function(require,module,exports){
(function(){

	/*
     * Tick
     */

    function createTick() {
        var collection = [],
            loop = _createAnimationLoop(),
            requestId,
            fps = 30,
            fr = 1000 / fps;

        /*
         * Private
         */

        function _createAnimationLoop() {
            var once = false;

            return function() {
                if (once) return;
                var ts = Date.now();

                (function _animloop() {
                    requestId = requestAnimFrame(_animloop);
                    // _render();
                    if( (Date.now() - ts) > fr){
                        ts = Date.now();
                        _render(); 
                    }
                    
                })();

                once = true; 
            }
        }

        function _render() {
            for (var i = 0; i < collection.length; i++) {
                collection[i].callback();
            };
        }

        function _checkCollection() {
            if (collection.length > 0 && collection.length < 2) {
                loop();
            } else if (collection.length === 0) {
                cancelAnimFrame(requestId);
                loop = _createAnimationLoop();
            }
        }

        /*
         * Public
         */
        return {
            add: function() {
                var index = collection.indexOf(arguments[0]);
                if (index === -1) collection.push(arguments[0]);
                _checkCollection();
            },
            remove: function() {
                var index = collection.indexOf(arguments[0]);
                if (index > -1) collection.splice(index, 1);
                _checkCollection();
            },
            getFrameRate: function(){
                return fps;
            }
        }
    }

    

    module.exports = createTick;

}())
},{}]},{},[1]);

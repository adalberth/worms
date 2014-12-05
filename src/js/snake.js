(function($){
	$(document).ready(function(){


		

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

	    var tickSingleton = stupid.createSingleton(createTick);

		/*
	     * Document Elements
	     */

	    function createDocument() {
	        var $body = $('body'),
	            $window = $(window),
	            $document = $(document);

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
	        }
	    }

	    var documentSingleton = stupid.createSingleton(createDocument);
	    




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



	    /*
	    * Snake
	    */
		function createSnake(){
			var that = {};
			var snake = [];
			var snakePosition = [];
			var x = documentSingleton.getInstance().getDocument().width() * Math.random();
			var y = documentSingleton.getInstance().getDocument().height() * Math.random();
			var loop = stupid.createCollectionLoop(snake);
			var step = 5;
			var minDistance = Math.random() * 50 + 50;
			
			/*
			* Public
			*/

			that.$el = $('<div />').addClass('snake').css({
				"background-color": '#'+Math.floor(Math.random()*16777215).toString(16)
			});
			documentSingleton.getInstance().getBody().append(that.$el);

			that.getPosition = function(){
				return {
					x: x,
					y: y
				}
			};

			/*
			* Init
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
				var value = step; //Math.random() < 0.5 ? 0 : 10;
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
				var width = documentSingleton.getInstance().getWindow().width();
				var height = documentSingleton.getInstance().getWindow().height();

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

			function _goTowards(point){
				var value = step;
				if(point.x > x) x -= value;
				if(point.x < x) x += value;
				if(point.y > y) y -= value;
				if(point.y < y) y += value;

				_handlePosition();
			}


			/*
			* Public
			*/

			that.render = _render;
			that.distanceTo = _distanceTo;
			that.goTowards = _goTowards;

			that.getMinDistance = function(){
				return minDistance;
			}

			return that;
		}


		/*
		* Snake Collection
		*/

		function createSnakeCollection(){
			var that = {};
			var snakes = [];
			var loop = stupid.createCollectionLoop(snakes);
			var numberOfSnakes = 10;
			var delayBetweenSnakes = 0;

			_init();

			function _init(){
				_addSnakes();
				tickSingleton.getInstance().add({
					callback:_render
				});				
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
						el.goTowards(otherPosition);
					}
				}
			}

			function _render(){
				_draw();
				_checkSnakesDistance();
			}

		 	return that;
		}


		var snakeNest = createSnakeCollection();

	});
}(jQuery))

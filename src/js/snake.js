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
	    * Snake
	    */
		function createSnake(){
			var that = {};
			var snake = [];
			var snakePosition = [];
			var x = documentSingleton.getInstance().getDocument().width() / 2;
			var y = documentSingleton.getInstance().getDocument().height() / 2;
			var loop = stupid.createCollectionLoop(snake);
			
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
				
				tickSingleton.getInstance().add({callback:_render})
				
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

				var value = 5; //Math.random() < 0.5 ? 0 : 10;
				return Math.random() < 0.5 ? value : value * -1;
			}

			function _updatePosition(){
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
					loop(function(el,i){
						var pos = el.getPosition();
						if(potentialX === pos.x && potentialY === pos.y){
							taleStepping = true;
						}	
					})	
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
				loop(function(el,i){
					el.setPosition(snakePosition[i].x,snakePosition[i].y);
				});
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
				loop(function(el,i){
					var opacity = Math.pow(snakeLength / (i + 1), 2) / 10;
					if(i === 0) opacity = 1;
					el.setOpacity(opacity);
				})
			}

			function _handlePosition(){
				_updatePosition();
				_positionBounderies();
				_udpatePositionHistory();
				_displayPosition();
			}

			function _render(){
				_handlePosition();
			}

			return that;
		}

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

			that.$el = $el;

			that.getPosition = function() {
				var pos = el.getBoundingClientRect()
				return {
					x: pos.left, //$el.position().left,
					y: pos.top //$el.position().top
				}
			};
gs
			that.setPosition = function(x,y) {
				// $el.css({
				// 	"transform":"translateX("+x+"px) translateY("+y+"px) translateZ(0px)"
				// });

				el.style["transform"] = "translateX("+x+"px) translateY("+y+"px) translateZ(0px)";
			};

			that.setOpacity = function(value){
				// $el.css({
				// 	"opacity": value
				// }); 
				el.style["opacity"] = value;
			}

		 	return that;
		}


		console.log("Ohh noo - snakes!!!");
		var snakes = [];
		addSnakeToDisplay();
		
		function addSnakeToDisplay(){
			snakes.push(createSnake()); 
			if(snakes.length > 10) clearInterval(si);
		}
		var si = setInterval(addSnakeToDisplay, 3000);

	});
}(jQuery))

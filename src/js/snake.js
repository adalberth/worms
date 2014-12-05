(function($){
	$(document).ready(function(){
		/*
	     * Document Elements
	     */

	    function createDocument() {
	        var $body = $('body'),
	            $window = $('window'),
	            $document = $('document');

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
			var x = 250;
			var y = 250;
			var loop = stupid.createCollectionLoop(snake);
			
			/*
			* Public
			*/

			that.$el = $('<div />').addClass('snake-child');
			documentSingleton.getInstance().getBody().append(that.$el);

			/*
			* Init
			*/
			_init();

			function _init(){
				_addNewElementToSnake();
				_addNewElementToSnake();
				_addNewElementToSnake();

				setInterval(function(){
					_addNewElementToSnake();
				},1000);

				setInterval(function(){
					_render();
				},500);
			}

			function _addNewElementToSnake(){
				var el = createSnakePart(that);
				snake.push(el);
				snakePosition.push(el.getPosition());
			}

			function _randomPosition(){
				var value = 5;
				return Math.random() < 0.5 ? value : value * -1;
			}

			function _updatePosition(){
				var pos = _potentialPosition();
				x = pos.x;
				y = pos.y;
			}

			function _potentialPosition(){
				var	potentialX = x + _randomPosition();
				var potentialY = y + _randomPosition();
				var safe = 0;

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
					potentialX = x + _randomPosition();
					potentialY = y + _randomPosition();

					if(safe > 4) break;
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

			function _handlePosition(){
				_updatePosition();
				_udpatePositionHistory();
				_displayPosition();
			}

			function _render(){
				_handlePosition();
			}

			/*
			* Public
			*/
			

			return that;
		}

		/*
		* Snake Part
		*/

		function createSnakePart(){
		 	var that = {};
		 	var $parent = arguments[0].$el;
		 	var $el = _createHtmlElement();
		 	
		 	_addToDisplay($el);

		 	function _createHtmlElement() {
				return $('<div />').addClass('snake-child').css({
					"position":"absolute",
					//"background-color":'#'+Math.floor(Math.random()*16777215).toString(16) ,
					"background-color":'black',
					"width":"10px",
					"height":"10px",
					"top":"-10px",
					"left":"-10px",
					"border-radius":"100%"
				});
			};

			function _addToDisplay(el){
				$parent.append(el);
			}

			/*
			* Public
			*/

			that.x;
			that.y;
			that.$el = $el;

			that.getPosition = function() {
				return {
					x: $el.position().left,
					y: $el.position().top
				}
			};

			that.setPosition = function(x,y) {
				$el.css({
					"top": y + "px",
					"left": x + "px"
				})
			};

		 	return that;
		}

		var snake = createSnake();

	});
}(jQuery))

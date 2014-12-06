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

			var x = window.innerWidth * Math.random();
			var y = window.innerHeight * Math.random();
			var loop = stupid.createCollectionLoop(snake);
			var step = 5;
			var minDistance = Math.random() * 100 + 100;

			/*
			* Public
			*/

			that.color = stupid.random.rgbColorObject();
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
				var width = window.innerWidth;
				var height = window.innerHeight;

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
					opacity = parseInt(opacity * 100) / 100;
					el.setOpacity( opacity );
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

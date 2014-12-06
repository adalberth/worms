(function(){
	/*
	* Snake Collection
	*/


	var stupid = require('./stupid');  
	var createSnake = require('./snake');  
	var singleton = require('./singleton');  

	function createSnakeCollection(opts){
		var opts = $.extend(true,{
			numberOfSnakes: 20,
			delayBetweenSnakes:0
		},opts);

		var that = {};
		var snakes = [];
		var loop = stupid.createCollectionLoop(snakes);
		var identify = { callback:_render };

		_init();

		function _init(){
			_addSnakes();
			singleton.tick.getInstance().add(identify);	
		}
		
		function _addSnakes(){
			addSnakeToDisplay();

			function addSnakeToDisplay(){
				snakes.push(createSnake()); 
				if(snakes.length > opts.numberOfSnakes - 2) clearInterval(si);
			}

			var si = setInterval(addSnakeToDisplay, opts.delayBetweenSnakes);
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
			singleton.canvas.getInstance().clear();
			_draw();
			_checkSnakesDistance();
		}

	 	return that;
	}

	module.exports = createSnakeCollection; 
}())
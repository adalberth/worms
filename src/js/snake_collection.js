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
(function(){

	var singleton = require('./singleton');
	/*
	* Snake Part
	*/

	function createSnakePart(){
	 	var that = {};
	 	var parent = arguments[0];
	 	var color = parent.color;
	 	var opacity = 1;
	 	var ctx = singleton.canvas.getInstance().getCtx();

	 	var x = parent.getPosition().x;
	 	var y = parent.getPosition().y; 
	 	var width = 10;
	 	var height = 10;

		function _draw(){
			ctx.fillStyle = 'rgba('+color.r+','+color.g+','+color.b+','+opacity+')';
			ctx.fillRect(x,y,width,height);
		} 
		/*
		* Public
		*/

		that.getPosition = function() {

			return {
				x: x, 
				y: y
			}
		};

		that.setPosition = function(_x,_y) {
			x = _x;
			y = _y;
			_draw();
		};

		that.setOpacity = function(value){
			opacity = value;
		}



	 	return that;
	}

	module.exports = createSnakePart; 
}())
(function(){
	
	var singleton = require('./singleton');

	function createCanvas(){
	 	that = {};

	 	var canvas = document.getElementById('canvas');
	 	var ctx = canvas.getContext('2d');

	 	_init();

	 	function _init(){
	 		_resize();
	 		window.addEventListener('resize', _resize, false);
	 	}

	 	function _resize(){
	 		canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
	 	}

	 	that.save = function(){
	 		ctx.save();
	 	}

	 	that.restore = function(){
	 		ctx.restore();
	 	}

	 	that.clear = function(){
	 		ctx.clearRect(0, 0, canvas.width, canvas.height);
	 	}

	 	that.getCanvas = function(){
	 		return canvas;
	 	}

	 	that.getCtx = function(){
	 		return ctx;
	 	}

	 	return that;
	}

	module.exports = createCanvas;

}())
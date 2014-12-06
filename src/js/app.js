(function(){
	var createSnakeCollection = require('./snake_collection');
	var singleton = require('./singleton');

	$(document).ready(function(){
		singleton.init();

		var numberOfSnakes = window.innerWidth / 40;

		var snakeCollection = createSnakeCollection({
			numberOfSnakes: numberOfSnakes,
			delayBetweenSnakes:0
		});
	});	

}())

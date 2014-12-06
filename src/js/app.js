(function(){
	var createSnakeCollection = require('./snake_collection');
	var singleton = require('./singleton');

	$(document).ready(function(){
		singleton.init();
		var snakeCollection = createSnakeCollection();
	});	

}())

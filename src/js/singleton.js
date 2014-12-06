(function(){
	var stupid = require('./stupid');
	
	var createDocument = require('./document');
	var createTick = require('./tick');
	
	var singleton = {
		init:function(){
			this.document = stupid.createSingleton(createDocument);
			this.tick = stupid.createSingleton(createTick);
		}
	}; 

	module.exports = singleton;
}())
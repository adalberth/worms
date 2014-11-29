(function(){

	/*
	* Tick
	*/

	function createTick(){
		var collection = [];

		/*
		* Private
		*/

		(function animloop(){
		  requestAnimFrame(animloop);
		  _render();
		})();


		function _render(){
			for (var i = 0; i < collection.length; i++) {
				collection[i].callback();
			};
		}

		/*
		* Public
		*/
		return {
			add:function(){
				var index = collection.indexOf(arguments[0]);
				if (index === -1) collection.push(arguments[0]);
			},
			remove:function(){
				var index = collection.indexOf(arguments[0]);
				if (index > -1) collection.splice(index, 1);
			}
		}
	}

	var tickSingleton = stupid.createSingleton(createTick);

	/*
	* Objects
	*/

	function createWithParent(){
		var _parent = arguments[0];

		return {
			parent:_parent
		}
	}


	function createAnimationObject(){
		var that = createWithParent(arguments[0]),
			tick = tickSingleton.getInstance(),
			frameRate = 60,
			x = Math.random() * window.innerWidth,
			y = Math.random() * window.innerHeight,
			animationX,
			animationY,
			identifier = {
				callback: _render
			};
		
		var $el = $('<div />').css({
			'background-color':'black',
			'width':'20px',
			'height':'20px',
			'position':'absolute',
			'border-radius':'100%',
			'transform':'translateX('+x+') translateY('+y+')'
		}) 

		$('body').append($el);

		/*
		* Private
		*/

		function _render(){
			_update();
		}

		function _startAnimation(){
			tick.add(identifier);
		}

		function _stopAnimation(){
			tick.remove(identifier);
		}

		function _update(){
			x = animationX();
			y = animationY();
			_setPosition(x,y);			
		}

		function _setPosition(x,y){
			$el.css({
				'transform':'translateX('+x+'px) translateY('+y+'px) translateZ(0px)'
			})
		}

		function _reset(){
			_stopAnimation();
			that.parent.touch();
		}

		function _animationConstructor(easeAnimation,start,end,duration,callback){
			var time = 0;

			return function(){
				if(time === duration) callback();
				time += 1;

				return easeAnimation(time,start,end,duration);
			}
		}

		function _goto(endX,endY,time){
			var ease = _randomEase();
			time = parseInt(time / frameRate) || 60;

			animationX = _animationConstructor(ease(), x, endX - x, time, _reset);
			animationY = _animationConstructor(ease(), y, endY - y, time, _reset);
			
			_startAnimation();
		}

		function _randomEase(){
			var toggle = Math.random() < 0.5 ? true : false;
			return function (){
				toggle = !toggle;
				if (toggle) return Ease.easeInOutQuart;
				return Ease.easeInOutSine;
			}
				
		}
		
		/*
		* Public
		*/

		that.goto = _goto;

		return that;
	}


	function createElementCollection() {
		var self,
			ifChildrenHasTouched,
			numberOfChildren = 20,
			callback = {},
			collection = [];

		/*
		* Private
		*/
		function _createElements(){
			for (var i = 0; i < numberOfChildren; i++) {
				collection.push(createAnimationObject(self));
			};
		}

		function _loopCollection(callback) {
            for (var i = 0; i < collection.length; i++) {
                callback(collection[i], i);
            };
        }

        function _spreadOut(){
        	ifChildrenHasTouched = _createCheckChildrenTouched();
        	
        	_loopCollection(function(el, i){
        		var time = 6000 + i * 500;

	    		el.goto(Math.random() * window.innerWidth, Math.random() * window.innerHeight, time);
	    		
	    	});
        }

        function _createCheckChildrenTouched(){
        	var count = 0;
        	return function(){
        		if(count === collection.length){
        			setTimeout(function(){
        				callback();
        			},1000)
        		}
        		count += 1;
        	}
        }

		/*
		* Public
		*/
		return {
			setSelf:function(){
				self = arguments[0];
			},
			init:function(){
				_createElements();
				_spreadOut();
			},
			getSiblings:function(){
				return collection;
			},
			touch:function(){
				ifChildrenHasTouched();
			},
			setCallback:function(func){
				callback = func;
			},
			spreadOut: _spreadOut,
		}
	}; 


	

	$(document).ready(function(){

		var elementCollection = createElementCollection();

		elementCollection.setSelf(elementCollection);

		elementCollection.setCallback(function(){
			elementCollection.spreadOut();
		});

		elementCollection.init();
		elementCollection.spreadOut();


	});
























}())	
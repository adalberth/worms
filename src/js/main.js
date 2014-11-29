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
				collection.push(arguments[0]);
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
			x = 0,
			y = 0,
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
			'transform':'translateX(0px) translateY(0px)'
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
			$el.css({
				'transform':'translateX('+x+'px) translateY('+y+'px) translateZ(0px)'
			})
		}

		function _animationConstructor(easeAnimation, start,end,duration,callback){
			var time = 0;

			return function(){

				if(time === duration) callback();
				time += 1;

				return easeAnimation(time,start,end,duration);
			}
		}

		function _goto(endX,endY,time){
			
			time = parseInt(time / frameRate) || 60;

			animationX = _animationConstructor(Ease.easeInOutCubic, x, endX - x, time, _stopAnimation);
			animationY = _animationConstructor(Ease.easeInOutCubic, y, endY - y, time, _stopAnimation);
			
			_startAnimation();
		}
		
		/*
		* Public
		*/

		that.goto = _goto;

		return that;
	}


	function createElementCollection() {
		var self,
			collection = [];

		/*
		* Private
		*/
		function _createElements(){
			for (var i = 0; i < 10; i++) {
				collection.push(createAnimationObject(self));
			};
		}

		function _loopCollection(callback) {
            for (var i = 0; i < collection.length; i++) {
                callback(collection[i]);
            };
        }

        setInterval(function(){
        	_loopCollection(function(el){
        		el.goto(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 3000);
        	});
        },1000);

		/*
		* Public
		*/
		return {
			setSelf:function(){
				self = arguments[0];
			},
			init:function(){
				_createElements();
			},
			getSiblings:function(){
				return collection;
			}
		}
	}; 


	var elementCollection = createElementCollection();
		elementCollection.setSelf(elementCollection);
		elementCollection.init();

























}())	
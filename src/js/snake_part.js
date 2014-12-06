(function(){
	/*
	* Snake Part
	*/

	function createSnakePart(){
	 	var that = {};
	 	var parent = arguments[0];
	 	var $parent = arguments[0].$el;
	 	var $el = _createHtmlElement();
	 	var el = $el[0];
	 	
	 	_addToDisplay($el);

	 	function _createHtmlElement() {
	 		var pos = parent.getPosition();
			return $('<div />').addClass('snake-child').css({
				"position":"absolute",
				"background-color":'inherit',
				"width":"10px",
				"height":"10px",
				"opacity": "0",
				"transform":"translateX("+pos.x+"px) translateY("+pos.y+"px)"
			});
		};

		function _addToDisplay(el){
			$parent.append(el);
		}

		/*
		* Public
		*/

		that.getPosition = function() {
			var pos = el.getBoundingClientRect()

			// var st = window.getComputedStyle(el, null);
			// var tr = st.getPropertyValue("-webkit-transform") ||
			//          st.getPropertyValue("-moz-transform") ||
			//          st.getPropertyValue("-ms-transform") ||
			//          st.getPropertyValue("-o-transform") ||
			//          st.getPropertyValue("transform") ||
			//          "Either no transform set, or browser doesn't do getComputedStyle";

			// var values = tr.match(/\d+(\.\d+)?/ig);
			// var left = parseInt(values[4]);
			// var top = parseInt(values[5]);

			return {
				x: pos.left,
				y: pos.top
			}
		};

		that.setPosition = function(x,y) {
			el.style["transform"] = "translateX("+x+"px) translateY("+y+"px) translateZ(0px)"; 
		};

		that.setOpacity = function(value){
			el.style["opacity"] = value;
		}

	 	return that;
	}

	module.exports = createSnakePart; 
}())
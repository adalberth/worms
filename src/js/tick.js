(function(){

	/*
     * Tick
     */

    function createTick() {
        var collection = [],
            loop = _createAnimationLoop(),
            requestId,
            fps = 30,
            fr = 1000 / fps;

        /*
         * Private
         */

        function _createAnimationLoop() {
            var once = false;

            return function() {
                if (once) return;
                var ts = Date.now();

                (function _animloop() {
                    requestId = requestAnimFrame(_animloop);
                    // _render();
                    if( (Date.now() - ts) > fr){
                        ts = Date.now();
                        _render(); 
                    }
                    
                })();

                once = true; 
            }
        }

        function _render() {
            for (var i = 0; i < collection.length; i++) {
                collection[i].callback();
            };
        }

        function _checkCollection() {
            if (collection.length > 0 && collection.length < 2) {
                loop();
            } else if (collection.length === 0) {
                cancelAnimFrame(requestId);
                loop = _createAnimationLoop();
            }
        }

        /*
         * Public
         */
        return {
            add: function() {
                var index = collection.indexOf(arguments[0]);
                if (index === -1) collection.push(arguments[0]);
                _checkCollection();
            },
            remove: function() {
                var index = collection.indexOf(arguments[0]);
                if (index > -1) collection.splice(index, 1);
                _checkCollection();
            },
            getFrameRate: function(){
                return fps;
            }
        }
    }

    

    module.exports = createTick;

}())
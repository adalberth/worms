(function() {
    'use strict';

    /*
     * Tick
     */

    function createTick() {
        var collection = [],
            loop = _createAnimationLoop(),
            requestId;

        /*
         * Private
         */

        function _createAnimationLoop() {
            var once = false;

            return function() {
                if (once) return;

                (function _animloop() {
                    requestId = requestAnimFrame(_animloop);
                    _render();
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
            }
        }
    }

    var tickSingleton = stupid.createSingleton(createTick);


    /*
     * Document Elements
     */

    function createDocument() {
        var $body = $('body'),
            $window = $('window'),
            $document = $('document');

        return {
            getBody: function() {
                return $body;
            },
            getWindow: function() {
                return $window;
            },
            getDocument: function() {
                return $document;
            },
        }
    }

    var documentSingleton = stupid.createSingleton(createDocument);

    /*
     * Objects
     */

    function createAnimationObject() {
        var that = {parent: arguments[0]},
            frameRate = 60,
            x = Math.random() * window.innerWidth,
            y = Math.random() * window.innerHeight,
            animationX,
            animationY,
            identifier = {
                callback: _render
            };

        // Create Display Element
        var $el = $('<div />').css({
            'background-color': 'black',
            'width': '20px',
            'height': '20px',
            'position': 'absolute',
            'border-radius': '100%',
            'transform': 'translateX(' + x + ') translateY(' + y + ')'
        })

        documentSingleton.getInstance().getBody().append($el);

        /*
         * Private
         */

        function _render() {
            _update();
        }

        function _startAnimation() {
            tickSingleton.getInstance().add(identifier);
        }

        function _stopAnimation() {
            tickSingleton.getInstance().remove(identifier);
        }

        function _update() {
            x = animationX();
            y = animationY();
            _displayPostion(x, y);
        }

        function _displayPostion(x, y) {
            $el.css({
                'transform': 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px)'
            })
        }

        function _reset() {
            _stopAnimation();
            that.parent.touch();
        }

        function _animationConstructor(easeAnimation, start, end, duration, callback) {
            var time = 0;

            return function() {
                if (time === duration) callback();
                time += 1;

                return easeAnimation(time, start, end, duration);
            }
        }

        function _randomEase() {
            var toggle = Math.random() < 0.5 ? true : false;
            return function() {
                toggle = !toggle;
                if (toggle) return Ease.easeInOutQuart;
                return Ease.easeInOutSine;
            }

        }

        function _goto(endX, endY, time) {
            var randomEase = _randomEase();
            time = parseInt(time / frameRate) || 60;

            animationX = _animationConstructor(randomEase(), x, endX - x, time, _reset);
            animationY = _animationConstructor(randomEase(), y, endY - y, time, _reset);

            _startAnimation();
        }

        /*
         * Public
         */

        that.goto = _goto;

        that.getX = function() {
            return x;
        };

        that.getY = function() {
            return y;
        };

        return that;
    }


    function createElementCollection() {
        var that = {},
            ifChildrenHasTouched,
            callback,
            numberOfChildren = 250,
            collection = [];

        /*
         * Private
         */
        function _createElements() {
            for (var i = 0; i < numberOfChildren; i++) {
                collection.push(createAnimationObject(that));
            };
        }

        function _loopCollection(callback) {
            for (var i = 0; i < collection.length; i++) {
                callback(collection[i], i);
            };
        }

        function _spreadOut() {
            ifChildrenHasTouched = _createCheckChildrenTouched(callback);

            _loopCollection(function(el, i) {
                var time = 6000 + i * 50;
                el.goto(Math.random() * window.innerWidth, Math.random() * window.innerHeight, time);
            });
        }

        function _createCheckChildrenTouched(func) {
            var count = 0;
            return function() {
                if (count === collection.length) {
                    func();
                }
                count += 1;
            }
        }

        /*
         * Public
         */

        that.init = function() {
            _createElements();
            _spreadOut();
        };

        that.getSiblings = function() {
            return collection;
        };

        that.touch = function() {
            ifChildrenHasTouched();
        };

        that.setCallback = function(func) {
            callback = func;
        };

        that.spreadOut = _spreadOut;

        return that;
    };




    // $(document).ready(function() {

    //     var elementCollection = createElementCollection();

    //     elementCollection.setCallback(function(){
    //     	setTimeout(function(){
    //     		elementCollection.spreadOut();
    //     	},2000)
    //     });

    //     elementCollection.init();
    //     elementCollection.spreadOut(); 

    // });









}())
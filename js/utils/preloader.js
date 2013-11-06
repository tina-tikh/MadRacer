/**
 * Author: Christina
 * Loads images and fires an event
 * when the progress is completed
 */
epam.madracer.preloader = (function () {
    var _images = [];
    var _listeners = [];
    var _cache = {};

    var _completed = 0;
    var _total = 0;

    var _load = function (src) {
        var img = new Image();
        img.addEventListener('load', function () {
            _cache[src] = img;
            _progress(img);
        });
        img.addEventListener('error', function () {
            _progress(img);
        });
        img.src = src;
    };
    var _progress = function (img) {
        if (++_completed === _total) {
            _end();
        }
        img.removeEventListener('load', arguments.callee, false);
    };
    var _end = function () {
        _fireCompletion();
        _clear();
    };
    var _fireCompletion = function () {
        for (var i = 0; i < _listeners.length; i++) {
            _listeners[i]();
        }
    };
    var _clear = function () {
        _images = _listeners = [];
        _completed = _total = 0;
    };

    return {
        addImage: function (imgSrc) {
            _images.push(imgSrc);
        },
        addCompletionListener: function (callback) {
            _listeners.push(callback);
        },
        start: function () {
            _total = _images.length;
            for (var i = 0; i < _total; i++) {
                _load(_images[i]);
            }
        },
        getLoadedImages: function () {
            return _cache;
        }
    }
})();
/**
 * Author: Christina
 *
 * Interface between controller
 * and specific renderer
 */
epam.madracer.view = (function () {
    var _root;
    var _ = epam.madracer.helpers;

    /**
     * concrete renderer,
     * (can be 2d top/side view, 3d)
     */
    var _renderer = null;

    return {
        init: function (node, renderer) {
            _root = node;
            _renderer = renderer;
        },
        follow: function (point) {
            _renderer.follow(point);
        },
        setCamera: function (point) {
            _renderer.setCamera(point);
        },
        renderScene: function (items) {
            this.clear();
            _.each(items, function (item) {
                _renderer.render(item);
            });
        },
        clear: function () {
            _renderer.clear();
        },
        render: function (items) {
            _.each(items, function (item) {
                _renderer.render(item);
            });
            _renderer.drawEffects();
            _renderer.drawMessage();
        },
        setScale: function (scale) {
            _renderer.clear();
            _renderer.setScale(scale);
        },
        setSize: function (width, height) {
            _renderer.setSize(width, height);
        },
        splash: function (obj) {
            _renderer.startSplash(obj.position);
        },
        gameWon: function () {
            _renderer.setMessage('Hooray!! No zombies left!');
        },
        gameLost: function () {
            _renderer.setMessage('Oops! You are dead :(');
        }
    }
})();
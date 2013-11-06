/**
 * Author: Christina
 *
 * Controller for driving a racing car
 * and updating frames
 */
epam.madracer.controller = (function () {
    var _ = epam.madracer.helpers;

    var _engine;
    var _viewport;

    var _step;

    var KEY = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        A: 65,
        D: 68,
        S: 83,
        W: 87
    };
    var keyLeft = false,
        keyRight = false,
        keyForward = false,
        keyReverse = false;

    var _keys = [
        { keys: [KEY.LEFT, KEY.A], mode: 'down', action: function () {
            keyLeft = true;
        } },
        { keys: [KEY.RIGHT, KEY.D], mode: 'down', action: function () {
            keyRight = true;
        } },
        { keys: [KEY.UP, KEY.W], mode: 'down', action: function () {
            keyForward = true;
        } },
        { keys: [KEY.DOWN, KEY.S], mode: 'down', action: function () {
            keyReverse = true;
        } },
        { keys: [KEY.LEFT, KEY.A], mode: 'up', action: function () {
            keyLeft = false;
        } },
        { keys: [KEY.RIGHT, KEY.D], mode: 'up', action: function () {
            keyRight = false;
        } },
        { keys: [KEY.UP, KEY.W], mode: 'up', action: function () {
            keyForward = false;
        } },
        { keys: [KEY.DOWN, KEY.S], mode: 'up', action: function () {
            keyReverse = false;
        } }
    ];

    /**
     * Managing frame updates
     */
    var _frame = function () {
    };

    var _animate = function () {
        _render();
        _frame(_animate);
    };
    var _render = function () {
        _simulate();
        _viewport.follow(_engine.getRacer().position);
        _viewport.renderScene(_engine.getSceneObjs());
        _viewport.render(_engine.getAll());
    };

    var _simulate = function () {
        var action;
        if (keyForward) {
            _engine.move.forward();
        }
        if (keyReverse) {
            _engine.move.backward();
        }
        if (keyLeft) {
            action = keyReverse ? 'right' : 'left';
            _engine.move[action]();
        }
        if (keyRight) {
            action = keyReverse ? 'left' : 'right';
            _engine.move[action]();
        }

        _engine.update();
    };
    var _setFrame = function (step) {
        _step = step;

        _frame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 * _step);
            };
    };

    /**
     * Managing the game progress
     */
    var _onGameWon = function () {
        _engine.setPause(true);
        _viewport.gameWon();
    };
    var _onGameLost = function () {
        _engine.setPause(true);
        _viewport.gameLost();
    };
    var _onTargetHit = function (e) {
        _viewport.splash(e.target);
    };

    /**
     * Managing the racer movements
     */
    var _setKeyListeners = function (keys) {
        var onkey = function (keyCode, mode) {
            _.each(keys, function (k) {
                k.mode = k.mode || 'up';
                if ((k.key == keyCode) || (k.keys && (k.keys.indexOf(keyCode) >= 0))) {
                    if (k.mode == mode) {
                        k.action.call();
                    }
                }
            });
        };
        document.addEventListener('keydown', function (ev) {
            onkey(ev.keyCode, 'down');
        });
        document.addEventListener('keyup', function (ev) {
            onkey(ev.keyCode, 'up');
        });
    };

    var _setListeners = function () {
        window.addEventListener('resize', function (event) {
            _viewport.setSize(window.innerWidth, window.innerHeight);
        }, false);
        _engine.subscribe('gamewon', _onGameWon);
        _engine.subscribe('gamelost', _onGameLost);
        _engine.subscribe('targethit', _onTargetHit);
    };

    return {
        init: function (engine, viewport, step) {
            _engine = engine;
            _viewport = viewport;
            _setFrame(step);

            _viewport.setSize(window.innerWidth, window.innerHeight);
            _setListeners();
        },
        start: function () {
            _setKeyListeners(_keys);
            _animate();
        },
        scale: function (scale) {
            _viewport.setScale(scale);
        }
    }
})();



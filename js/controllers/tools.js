/**
 * Author: Christina
 *
 * Controller for managing actions
 * not related to the game itself
 */
epam.madracer.toolsController = (function () {
    var _engine;
    var _node;

    var _regions = {};
    var _regionsSelectors = {
        'tools': '#toolbar',
        'info': '#info',
        'music': '#music',
        'progress': '#progress'
    };

    var _initRegions = function () {
        for (var name in _regionsSelectors) {
            var selector = _regionsSelectors[name];
            _regions[name] = _node.querySelector(selector);
        }
    };

    var _setListeners = function () {
        _setPopupListeners();
        _setInfoListeners();
        _setProgressListeners();
        _setMusicListeners();
    };

    /**
     * Menu popup actions
     */
    var _popup;

    var _setPopupListeners = function () {
        _regions.tools.querySelector('.menu').addEventListener('click', _openMenu);
        document.addEventListener('click', _hideMenu);
    };

    var _openMenu = function (e) {
        if (!_popup.isShown()) {
            _engine.setPause(true);
            _popup.show();
            if (e) e.stopPropagation();
        }
    };
    var _hideMenu = function (e) {
        _engine.setPause(false);
        _popup.hide();
    };
    var _changeModel = function (e) {
        var trg = e.target;
        var data = trg.parentNode.getAttribute('data-model');
        if (data) {
            _engine.storeRacerModel(data);
            _engine.getRacer().setModel(data);
        }
    };

    var _initPopup = function () {
        _popup = epam.madracer.dialog.create();
        _popup.setData('Choose a car', epam.madracer.metadata.cars);
        _popup.node.addEventListener('click', _changeModel);
    };

    /**
     * Info section
     */

    var _setInfoListeners = function () {
        _engine.subscribe('scorechange', _onScoreChange);
    };


    var _onScoreChange = function (e) {
        var scoreNode = _regions.info.querySelector('.score');
        scoreNode.querySelector('.val').innerHTML = e.currentScore;
        scoreNode.querySelector('.max').innerHTML = e.maxScore;
    };

    /**
     * Game progress section
     */

    var _setProgressListeners = function () {
        _engine.subscribe('healthloss', _onProgress);
    };

    var _onProgress = function (e) {
        _setProgress(e.healthLevel);
    };

    var _setProgress = function (level) {
        _regions.progress.style.width = Math.round(level) + "%";
    };


    /**
     * Sounds actions
     */

    var _playMusic = function () {
        var music = _regions.music.querySelector('audio');
        music.loop = true;
        music.volume = 0.05;
        music.muted = false;
        music.play();
    };

    var _setMusicListeners = function () {
        var soundsIcon = _regions.tools.querySelector('.sounds');
        var music = _regions.music.querySelector('audio');
        soundsIcon.addEventListener('click', function (e) {
            music.muted = !music.muted;
            soundsIcon.className = music.muted ? 'off' : 'on';
            e.stopPropagation();
        });
    };

    return {
        init: function (engine, node) {
            _engine = engine;
            _node = node;

            _initRegions();
            _initPopup();
            _setListeners();

            _playMusic();
            if (!(localStorage && localStorage['racerModel']))
                _openMenu();
        }
    }
})();



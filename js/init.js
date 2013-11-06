window.epam || ( epam = {} );
epam.madracer = {
    config: {
        fps: 60
    },
    init: function (canvas, game, step) {
        var view = this.view;
        var controller = this.controller;
        var toolsController = this.toolsController;
        var engine = this.engine;

        var surface = new this.CanvasSurface(canvas);
        var renderer = new this.TopViewRenderer(canvas, surface);
        renderer.storeImageCache(this.preloader.getLoadedImages());

        view.init(canvas, renderer);
        engine.init(step, this.metadata.world.initState);


        this.preload(function () {
            var processing = document.querySelector('#processing');
            processing.style.display = 'none';
            game.style.display = 'block';
            
            toolsController.init(engine, game);
            controller.init(engine, view, step);
            controller.scale(this.metadata.world.initState.scale);
            controller.start();
        });
    },
    preload: function (cb) {
        var meta = this.metadata;
        for (var car in meta.cars) {
            this.preloader.addImage(meta.cars[car].src);
        }
        for (var target in meta.targets) {
            this.preloader.addImage(meta.targets[target].src);
        }
        this.preloader.addImage(meta.world['bg-src']);
        this.preloader.addImage(meta.world.building.src);
        this.preloader.addCompletionListener(cb);
        this.preloader.start();
    }
};

window.onload = function () {
    epam.madracer.init(document.querySelector('#canvas'),
        document.querySelector('#game'),
        1 / epam.madracer.config.fps);
};

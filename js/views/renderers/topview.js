/**
 * Author: Christina
 *
 * Renderer for 2d top view
 */
(function (app) {
    var _ = app.helpers;

    function TopViewRenderer(node, surface, scale) {
        this.imageCache = {};
        this.container = node;
        this.viewport = new Bounds();

        // depends on the chosen technology,
        // for example, html or canvas
        this.surface = surface;
        this.scale = scale || 1;
        this.frames = -1;
        this.message = '';
    };
    TopViewRenderer.fn = TopViewRenderer.prototype = {
        /**
         * Caches preloaded images
         */
        storeImageCache: function (cache) {
            this.imageCache = cache;
        },
        /**
         * Renders object by its type,
         * if it is not defined in the module
         * it draws a rectangle
         */
        render: function (obj) {
            var type = obj.type;
            if (this[type]) {
                this[type](obj);
            } else {
                var b = this.getBounds(obj).toAbsolute(this.scale);
                this.preDraw(null, b, null, obj.angle);
            }
        },
        /**
         * Initiates the drawing after the preparations,
         * for instance, centering and rotating
         */
        preDraw: function (src, bounds, sbounds, angle) {
            var image = this.imageCache[src];
            var rad = _.deg2rad(angle);
            this.surface.saveContext();
            this.setCenter(bounds);
            this.surface.rotate(rad);
            this.shape(image,
                new Bounds(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height),
                sbounds);
            this.surface.restoreContext();
        },
        /**
         * Calls the actual image/rectangle drawing
         */
        shape: function (image, bounds, sbounds) {
            if (image) {
                this.surface.image(image,
                    sbounds.x, sbounds.y, sbounds.width, sbounds.height,
                    bounds.x, bounds.y, bounds.width, bounds.height);
            } else {
                this.surface.rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
            }
        },

        /**
         * Sets the camera position
         * defined by passed point
         */
        follow: function (point) {
            var fixed = this.isFixedPoint(point);
            if (fixed) {
                this.dist = this.dist || this.getCenter();
                this.setCamera(new Point(point.x - this.dist.x,
                    point.y - this.dist.y));
            }
        },
        /**
         * Specifies if the point should be followed
         */
        isFixedPoint: function (point) {
            return true;
        },
        /**
         * Returns center point of the viewport
         */
        getCenter: function () {
            return new Point(this.viewport.x + this.viewport.width / 2,
                this.viewport.y + this.viewport.height / 2);
        },
        /**
         * In other words moves viewport
         */
        setCamera: function (point) {
            this.moveViewport(point);
        },

        /**
         * Draws post effects objects,
         * such as scattering drops
         */
        drawEffects: function () {
            if (this.drops) {
                var drops = this.drops;
                this.clearDrops(drops);
                for (var i = 0; i < drops.length; i++) {
                    var d = drops[i];
                    this.surface.rectangle(d.x - 1, d.y - 1, 2, 2, '#000', '#000');
                    d.update();
                }
            }
        },
        startSplash: function (pos) {
            var amt = Math.random() * 20 + 50;
            var absPos = new Point(pos.x, pos.y).toAbsolute(this.scale);
            var drops = [];
            for (var i = 0; i < amt; i++) {
                var dir = Math.random() * 2 * Math.PI;
                var speed = Math.random() * 3 + 2;
                var life = Math.random() * 10 + 10;
                drops[drops.length] = new Drop(absPos.x, absPos.y, speed, dir, life);
            }
            this.drops = this.drops || [];
            this.drops = this.drops.concat(drops);
        },
        clearDrops: function (drops) {
            for (var l = drops.length - 1, i = l; i >= 0; i--) {
                if (drops[i].life < 0) {
                    drops[i] = drops[drops.length - 1];
                    drops.length--;
                }
            }
        },

        /**
         * Draws the message if it is specified
         */
        drawMessage: function () {
            var abs = this.viewport.toAbsolute(this.scale);
            this.surface.text(this.message,
                abs.x + abs.width / 3,
                abs.y + abs.height / 2,
                abs.width / 3,
                'bold 50px Verdana',
                '#fff',
                '#8B0000');
        },
        setMessage: function (msg) {
            this.message = msg;
        },

        /**
         * Clears viewport area
         */
        clear: function () {
            var abs = this.viewport.toAbsolute(this.scale);
            this.surface.clearRect(abs.x, abs.y, abs.width, abs.height);
            this.frames++;
        },
        /**
         * Manipulations with the viewport
         */
        moveViewport: function (point) {
            this.surface.translate((this.viewport.x - point.x) * this.scale,
                (this.viewport.y - point.y) * this.scale);
            this.viewport.x = point.x;
            this.viewport.y = point.y;
        },
        resetViewport: function () {
            var abs = this.viewport.toAbsolute(this.scale);
            this.container.width = abs.width;
            this.container.height = abs.height;
            this.surface.translate(-abs.x, -abs.y);
        },
        setSize: function (width, height) {
            this.viewport.width = width / this.scale;
            this.viewport.height = height / this.scale;
            this.resetViewport();
        },
        setScale: function (scale) {
            this.viewport = this.viewport.toAbsolute(this.scale / scale);
            this.scale = scale;
        },
        setCenter: function (bounds) {
            var centerX = bounds.x + bounds.width / 2;
            var centerY = bounds.y + bounds.height / 2;
            this.surface.translate(centerX, centerY);
        },
        /**
         * Utils for drawing
         */
        getBounds: function (obj) {
            //gets top/left coordinates
            var x = obj.position.x - obj.size.length / 2;
            var y = obj.position.y - obj.size.width / 2;
            return new Bounds(x, y, obj.size.length, obj.size.width);
        },
        scalePoints: function (pts) {
            var res = [];
            for (var i = 0; i < pts.length; i++) {
                var coord = pts[i];
                var point = new Point(coord.x, coord.y);
                res.push(point.toAbsolute(this.scale));
            }
            return res;
        }
    };

    /**
     * Inner structures classes
     */
    function Bounds(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    };
    Bounds.prototype.toAbsolute = function (scale) {
        return new Bounds(this.x * scale,
            this.y * scale,
            this.width * scale,
            this.height * scale);
    };

    function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Point.prototype.toAbsolute = function (scale) {
        return new Point(this.x * scale,
            this.y * scale);
    };

    function Drop(x, y, speed, dir, life) {
        this.x = x;
        this.y = y;

        var xInc = Math.cos(dir) * speed;
        var yInc = Math.sin(dir) * speed;

        this.life = life;

        this.update = function () {
            this.x += xInc;
            this.y += yInc;

            this.life--;
        }
    };

    app.TopViewRenderer = TopViewRenderer;
})(epam.madracer);
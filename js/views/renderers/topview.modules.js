/**
 * Modules for the renderer,
 * defines what types of objects can be rendered
 */
(function (app) {
    app.TopViewRenderer.fn.car = function (obj) {
        var meta = obj.meta;
        var src = meta.src;
        var b = this.getBounds(obj).toAbsolute(this.scale);
        this.preDraw(src, b, meta.correction.crop, obj.angle + meta.correction.angle);
    };
    app.TopViewRenderer.fn.target = function (obj) {
        var meta = obj.meta;
        var src = meta.src;
        var b = this.getBounds(obj).toAbsolute(this.scale);
        var crop = {
            x: (Math.floor(this.frames / meta.perFrame) % meta.count) * 98,
            y: 0,
            width: 98,
            height: 81
        };
        this.preDraw(src, b, crop, obj.angle + meta.correction.angle);
    };
    app.TopViewRenderer.fn.wall = function (obj) {
        var img = this.imageCache[obj.src];
        var pattern = this.surface.getPattern(img, 'repeat');
        var pts = this.scalePoints(obj.points);
        this.surface.polygon(pts, null, pattern);
    };
    app.TopViewRenderer.fn.building = function (obj) {
        var img = this.imageCache[obj.src];
        var pattern = this.surface.getPattern(img, 'repeat');
        var b = this.getBounds(obj).toAbsolute(this.scale);
        this.surface.rectangle(b.x, b.y, b.width, b.height, null, pattern);
    };
})(epam.madracer);
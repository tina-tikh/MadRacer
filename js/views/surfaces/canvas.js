/**
 * Author: Christina
 *
 * Actually renders the primitives on the canvas
 */
(function (app) {
	function CanvasSurface (node) {
		this.ctx = node.getContext('2d');
	};
	CanvasSurface.prototype = {
		defaultFillStyle: '#DCD7D4',
        defaultStrokeStyle: '#000',
		saveContext: function () {
			this.ctx.save();
		},
		restoreContext: function () {
			this.ctx.restore();
		},
		clearRect: function (x, y, width, height) {
			this.ctx.clearRect(x, y, width, height);
		},
		translate: function (x, y) {
			this.ctx.translate(x, y);
		},
		rotate: function (rad) {
			this.ctx.rotate(rad);
		},
		rectangle: function (x, y, width, height, strokecolor, fillcolor) {
            this.ctx.strokeStyle = strokecolor || this.defaultStrokeStyle;
            this.ctx.fillStyle = fillcolor || this.defaultFillStyle;
            this.ctx.fillRect(x, y, width, height);
			this.ctx.strokeRect(x, y, width, height);
		},
		image: function(image, sx, sy, swidth, sheight, x, y, width, height) {
			this.ctx.drawImage(image, sx, sy, swidth, sheight, x, y, width, height);
		},
		polygon: function(pts, strokecolor, fillcolor) {
            if (pts && pts.length) {
                this.ctx.strokeStyle = strokecolor || this.defaultStrokeStyle;
                this.ctx.fillStyle = fillcolor || this.defaultFillStyle;
                this.ctx.beginPath();
                var p1 = pts[0];
                this.ctx.moveTo(p1.x, p1.y);
                for(var i = 1; i < pts.length; i++) {
                    var p = pts[i];
                    this.ctx.lineTo(p.x, p.y);
                }
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            }
		},
		getPattern: function (img, repeat) {
			return this.ctx.createPattern(img, repeat);
		},
		text: function (txt, x, y, maxWidth, font, strokecolor, fillcolor) {
			this.ctx.font = font;
            this.ctx.strokeStyle = strokecolor || '#000';
            this.ctx.fillStyle = fillcolor || '#000 ';
			this.ctx.fillText(txt, x, y, maxWidth);
			this.ctx.strokeText(txt, x, y, maxWidth);
		}
	};

	app.CanvasSurface = CanvasSurface;
})(epam.madracer);
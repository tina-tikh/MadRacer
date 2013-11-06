// Class-module responsible for logic of behaviour of all objects 'driven by computer'
epam.madracer.engine.enemy = ( function() {
	var _ = epam.madracer.helpers,
		_pathGraph;
	
	// return path [points] array that will lead to Racer's position around static objects
	var _getPath = function () {
		var path = [];
		var isNotDirect = _segmentIntersects(_arena.racer.position, _arena.enemy.position, _arena.buildings);
		if (isNotDirect) {
			Math.astar.cleanUp(_pathGraph);
			var start = _closestPath(_arena.enemy.position);
			var end = _closestPath(_arena.racer.position);
			path = Math.astar.search(_pathGraph, start, end);
		}
		if (path.length) {
			path.splice(0, 0, start);
		} else {
			path.push(_arena.racer.position);
		}
		return path;
	};

	// return first point by way to Racer's position
	var _getNextWaypoint = function () {
		var path = _getPath();
		return path[0];
	};

	// turn unusual big angles to simple form
	// example: simplifyAngle(370) => 10
	var simplifyAngle = function ( bigAngle ) {
		return ((bigAngle % 360) + 360) % 360;
	}

	/*
	* return angle (clockwise) between two points
	* @param { xe, ye } - location of enemy's object that try to turn to Racer's { xr, yr } location
	*/
	var getAngleBetweenPoint = function( xe, xr, ye, yr) {
		var angle,
			dx = Math.abs(xe - xr),
			dy = Math.abs(ye - yr);

		if( xr > xe && yr <= ye ) {
			angle = 270 + _.rad2deg( Math.atan(dx / dy) );
		} else
		if( xr > xe && yr > ye ) {
			angle = _.rad2deg( Math.atan(dy / dx) );
		} else
		if( xr <= xe && yr > ye ) {
			angle = 90 + _.rad2deg( Math.atan(dx / dy) );
		} else
		if( xr <= xe && yr <= ye ) {
			angle = 180 + _.rad2deg( Math.atan(dy / dx) );
		}
		return angle;
	}

	/* 
	* move object 'driven by computer'
	* @param {Dynamyc} 'enemy' driven object
	* @param {Integer} step time of moving
	*/
	var _moveEnemy = function(enemy, step) {

		var angle = simplifyAngle(enemy.angle),
			xe = enemy.position.x,
			ye = enemy.position.y,
			// is target see alert
			escapeNeeded = ( enemy.type == 'target' ) && (Math.abs(_arena.racer.position.x - xe) < 100) && (Math.abs(_arena.racer.position.y - ye) < 100),
			wayPoint = escapeNeeded ? _arena.racer.position : _getNextWaypoint(),
			xr = wayPoint.x,
			yr = wayPoint.y,
			angleToRacer = getAngleBetweenPoint( xe, xr, ye, yr );
		
		if ( enemy.type == 'target' ) {
			if ( escapeNeeded ) {
				angleToRacer += 180;
			} else {
				angleToRacer += 360 * Math.random();
			}
		}
		
		var angleChangeNeeded = ( angleToRacer - angle ) % 360;

		if( Math.abs( angleChangeNeeded ) > 180 ) {
			angleChangeNeeded = ( 180 - angleChangeNeeded ) % 360;
		}
		var trashHoldChangeNeeded = 5;
		if ( (angleChangeNeeded > trashHoldChangeNeeded) || ( angleChangeNeeded == 0 && (enemy.position.x - _arena.racer.position.x) ) ) {
			enemy.right(step);
		} else if ( (angleChangeNeeded < -trashHoldChangeNeeded) ) {
			enemy.left(step);
		}
		enemy.forward(step);
	};

	var _closestPath = function (target) {
		var heap = new Math.BinaryHeap(function (node) {
			var a= Math.astar.manhattan(node.pos, target);
			return a;
		});
		var nodes = _pathGraph.nodes;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			heap.push(node);
		}
		return heap.pop();
	};

	var _rectangleIntersectsSegment = function (obj, p1, p2) {
		var top = obj.position.y;
		var left = obj.position.x;
		var bottom = top + obj.size.width;
		var right = left + obj.size.length;
			
		// Find min and max X for the segment
		var minX = p1.x;
		var maxX = p2.x;
		
		if (p1.x > p2.x) {
			minX = p2.x;
			maxX = p1.x;
		}
		
		// Find the intersection of the segment's and rectangle's x-projections
		if (maxX > right) maxX = right;
		if (minX < left) minX = left;

		// If their projections do not intersect return false
		if (minX > maxX) return false;
		
		// Find corresponding min and max Y for min and max X we found before
		var minY = p1.y;
		var maxY = p2.y;
		var dx = p2.x - p1.x;
		
		if (Math.abs(dx) > 0.0000001) {
			var a = (p2.y - p1.y) / dx;
			var b = p1.y - a * p1.x;
			minY = a * minX + b;
			maxY = a * maxX + b;
		}
		
		if (minY > maxY) {
			var tmp = maxY;
			maxY = minY;
			minY = tmp;
		}
		
		// Find the intersection of the segment's and rectangle's y-projections
		if (maxY > bottom) maxY = bottom;
		if (minY < top) minY = top;

		// If Y-projections do not intersect return false
		if (minY > maxY) return false;
		
		return true;
	};

	var _segmentIntersects = function (p1, p2, objs) {
		var intersects = false;
		for (var i = 0; i < objs.length; i++) {
			intersects = _rectangleIntersectsSegment(objs[i], p1, p2);
			if (intersects) break;
		}
		return intersects;
	};

	var _buildPathGraph = function () {
		var graph = new Math.astar.Graph();
		var xs = [];
		var ys = [];
		var dist = 50;

		// computes interesting points
		var i,j;
		for (i = 0; i < _arena.buildings.length; i++) {
			var obj = _arena.buildings[i];
			var pos = obj.position;
			var width = obj.size.length;
			var height = obj.size.width;

			xs.push(pos.x - width/2 - dist);
			xs.push(pos.x);
			xs.push(pos.x + width/2 + dist);

			ys.push(pos.y - height/2 - dist);
			ys.push(pos.y);
			ys.push(pos.y + height/2 + dist);
		}

		xs = _.uniq(xs);
		ys = _.uniq(ys);

		xs.sort(function (a, b) { return a - b; });
		ys.sort(function (a, b) { return a - b; });

		// generates horizontal edges
		for (i = 0; i < ys.length; i++) {
			for (j = 0; j < xs.length - 1; j++) {
				if (!_segmentIntersects(
					{x:xs[j], y:ys[i]},
					{x:xs[j + 1], y:ys[i]},
					_arena.buildings)) {
					graph.link(xs[j], ys[i], xs[j + 1], ys[i]);
				}
			}
		}
		// generates vertical edges
		for (i = 0; i < xs.length; i++) {
			for (j = 0; j < ys.length - 1; j++) {
				if (!_segmentIntersects(
					{x:xs[i], y:ys[j]},
					{x:xs[i], y:ys[j + 1]},
					_arena.buildings)) {
					graph.link(xs[i], ys[j], xs[i], ys[j + 1]);
				}
			}
		}

		return graph;
	};

	// public methods:
	return {
		/* 
		* Init method
		* @param {Object} arena that contais all objects of game
		*/
		init: function ( arena ) {
			_arena = arena;
			_pathGraph = _buildPathGraph();
			Math.astar.init(_pathGraph);
		},
		/* 
		* Update - move all objects 'driven by computer'
		* @param {Integer} step time of moving
		*/
		update: function ( step ) {
			_moveEnemy(_arena.enemy, step);
				
			_.each( _arena.targets, function( item ){
				item.update( step );
				_moveEnemy(item, step);
			} );
		}
	};
} )();
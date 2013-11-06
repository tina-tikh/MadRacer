(function (math) {
	// javascript-astar
	// http://github.com/bgrins/javascript-astar
	// Freely distributable under the MIT License.
	// Implements the astar search algorithm in javascript using a binary heap.
	// (modified for the particular case)
	var astar = {
		init: function (grid) {
			for (var x = 0; x < grid.nodes.length; x++) {
				var node = grid.nodes[x];
				node.f = 0;
				node.g = 0;
				node.h = 0;
				node.visited = node.visited === undefined ? false : node.visited;
				node.closed = node.closed === undefined ? false : node.closed;
				node.parent = null;
			}
		},
		cleanUp: function (grid) {
			for (var x = 0; x < grid.nodes.length; x++) {
				var node = grid.nodes[x];
				node.visited = false;
				node.closed = false;
			}
		},
		heap: function () {
			return new math.BinaryHeap(function (node) {
				return node.f;
			});
		},
		search: function (grid, start, end) {
			astar.init(grid);
			var heuristic = astar.manhattan;

			var openHeap = astar.heap();
			openHeap.push(start);

			while (openHeap.size() > 0) {

				// Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
				var currentNode = openHeap.pop();

				// End case -- result has been found, return the traced path.
				if (currentNode.pos === end.pos) {
					var curr = currentNode;
					var ret = [];
					while (curr.parent) {
						ret.push(curr);
						curr = curr.parent;
					}
					return ret.reverse();
				}

				// Normal case -- move currentNode from open to closed, process each of its neighbors.
				currentNode.closed = true;

				// Find all neighbors for the current node
				var neighbors = astar.neighbors(currentNode, end);

				for (var i = 0; i < neighbors.length; i++) {
					var neighbor = neighbors[i];

					if (neighbor.closed) {
						// Not a valid node to process, skip to next neighbor.
						continue;
					}

					// The g score is the shortest distance from start to current node.
					// We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
					var gScore = currentNode.g + neighbor.cost;
					var beenVisited = neighbor.visited;

					if (!beenVisited || gScore < neighbor.g) {

						// Found an optimal (so far) path to this node.  Take score for node to see how good it is.
						neighbor.visited = true;
						neighbor.parent = currentNode;
						neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
						neighbor.g = gScore;
						neighbor.f = neighbor.g + neighbor.h;

						if (!beenVisited) {
							// Pushing to heap will put it in proper place based on the 'f' value.
							openHeap.push(neighbor);
						}
						else {
							// Already seen the node, but since it has been rescored we need to reorder it in the heap
							openHeap.rescoreElement(neighbor);
						}
					}
				}
			}

			// No result was found - empty array signifies failure to find path.
			return [];
		},
		manhattan: function (p0, p1) {
			// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

			var d1 = math.abs(p1.x - p0.x);
			var d2 = math.abs(p1.y - p0.y);
			return d1 + d2;
		},
		// modified: according to the new graph structure
		neighbors: function (node, end) {
			var ret = [];

			for (var i = 0; i < node.neighbors.length; i++) {
				var neighbor = node.neighbors[i];
				neighbor.cost = astar.manhattan(node.pos, neighbor.pos);
				ret.push(neighbor);
			}

			return ret;
		}
	};
	
	// Creates a Graph class used in the astar search algorithm.
	// modified: according to new graph structure
	function Graph(nodes) {
		this.nodes = nodes || [];
	}

	Graph.prototype.addNode = function (x, y) {
		var node = new GraphNode(x, y);
		this.nodes.push(node);
		return node;
	};

	Graph.prototype.removeNode = function (x, y) {
		this.nodes.splice(this.search(x, y), 1);
	};

	Graph.prototype.getNode = function (x, y) {
		var indx = this.search(x, y);
		return indx == -1 ? this.addNode(x, y) : this.nodes[indx];
	};

	Graph.prototype.search = function (x, y) {
		var indx = -1;
		var nodes = this.nodes;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.x == x && node.y == y) {
				indx = i;
				break;
			}
		}
		return indx;
	};

	Graph.prototype.link = function (x1, y1, x2, y2) {
		if (x1 != x2 || y1 != y2) {
			var node1 = this.getNode(x1, y1);
			var node2 = this.getNode(x2, y2);
			node1.addNeighbor(node2);
			node2.addNeighbor(node1);
		}
	};

	Graph.prototype.toString = function () {
		var graphString = "\n";
		var nodes = this.nodes;
		var rowDebug, row, y, l;
		for (var x = 0, len = nodes.length; x < len; x++) {
			graphString = graphString + nodes[y].toString() + "\n";
		}
		return graphString;
	};

	Graph.prototype.clone = function () {
		var grid = new Graph();
		_.each(this.nodes, function (node) {
			_.each(node.neighbors, function (neighbor) {
				grid.link(node.x, node.y, neighbor.x, neighbor.y);
			}, this);
		}, this);
		return grid;
	};

	function GraphNode(x, y) {
		this.neighbors = [];
		this.x = x;
		this.y = y;
		this.pos = {
			x: x,
			y: y
		};
	}

	GraphNode.prototype.addNeighbor = function (node) {
		var indx = this.searchNeighbor(node.x, node.y);
		if (indx == -1) {
			this.neighbors.push(node);
		}
	};

	GraphNode.prototype.removeNeighbor = function (x, y) {
		this.neighbors.splice(this.searchNeighbor(x, y), 1);
	};

	GraphNode.prototype.searchNeighbor = function (x, y) {
		var indx = -1;
		var nodes = this.neighbors;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.x == x && node.y == y) {
				indx = i;
				break;
			}
		}
		return indx;
	};

	GraphNode.prototype.toString = function () {
		return "[" + this.x + " " + this.y + "]";
	};
	
	math.astar = astar;
	math.astar.Graph = Graph;
	math.astar.GraphNode = GraphNode;
})(Math);
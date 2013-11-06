// Class-module responsible for all game logic
// has submodules 'collider' and 'enemy'
epam.madracer.engine = ( function() {
	var _ = epam.madracer.helpers;
	var _step;
	var _pause = false;
	var _subscriptions = {};

	// Scores indecate count of catched targets
	var _scores = 0;
	var _scoresMax = 10;//todo configure it
	var _health = 10000;//todo configure it
	
	// Contains all ( dynamic and static objects of game )
	var _arena = {
		cars: [],
		targets: [],
		buildings: [],
		wall: null,
		racer: null,
		enemy: null
	};

	var _reduceHealth = function (delta) {
		_health -= delta;
		_fireEvent({eventName: 'healthloss', healthLevel: _health / 100});
	};

	var _fireEvent = function (event) {
		var subscribers = _subscriptions[event.eventName] || [];
		for (var i = 0; i < subscribers.length; i++) {
			subscribers[i](event);
		}
	};

	var _getRacerModel = function () {
		return localStorage && localStorage['racerModel'];
	};

	// set all participant and their position;
	var _setWorld = function (entities, meta) {
		_arena.racer = entities.newCar();
		_arena.racer.position = meta.racer.position;
		_arena.racer.setModel(_getRacerModel() || meta.racer.model);
		_arena.cars.push( _arena.racer );
		
		for (var i = 0; i < meta.enemies.length; i++) {
			var defaults = meta.enemies[i];
			_arena.enemy = entities.newCar();
			_arena.enemy.setModel(defaults.model);
			_arena.enemy.position = defaults.position;
			_arena.cars.push( _arena.enemy );
		}

		for (var i = 0; i < meta.targets.length; i++) {
			var defaults = meta.targets[i];
			_arena.targets.push( entities.newZombie(defaults.position, defaults.type) );
		}

		for (var i = 0; i < meta.buildings.length; i++) {
			var defaults = meta.buildings[i];
			_arena.buildings.push( entities.newBuilding(defaults.position, defaults.size) );
		}
		
		_arena.wall = entities.newWall(meta.points, meta.size);
	};

	// public methods:
	return {
		init: function(delta, meta) {
			_step = delta;

			_setWorld(epam.madracer.entities, meta);

			this.collider.init( _arena );
			this.enemy.init( _arena );
			
			this.collider.subscribe('damage', function( event ) {
				_reduceHealth( event.value );
			});
			this.collider.subscribe('targethit', function( event ) {
				_fireEvent({eventName: 'targethit', target: event.target });
				_scores++;
				_fireEvent({eventName: 'scorechange', currentScore: _scores, maxScore: _scoresMax});
			});
		},
		// Appling all changes during time period
		update: function () {
			if (!_pause) {
				if(_health < 0) {
					_fireEvent({eventName: 'gamelost'});
				}
				if(_scores >= _scoresMax) {
					_fireEvent({eventName: 'gamewon'});
				}
				this.collider.update();

				_.each( _arena.cars, function( item ){
					item.update( _step );
				} );

				this.enemy.update( _step );
			}
		},
		getSceneObjs: function () {
			return [_arena.wall].concat(_arena.buildings);
		},
		getAll: function(){
			return _arena.cars.concat(_arena.targets);
		},
		getRacer: function(){
			return _arena.racer;
		},
		setPause: function (val) {
			_pause = val;
		},
		storeRacerModel: function (model) {
			if (localStorage)
				localStorage['racerModel'] = model;
		},
		getRacerModel: _getRacerModel,
		// actions to move Racer's car
		move: {
			forward: function(){
				if (!_pause) _arena.racer.forward(_step);
			},
			backward: function () {
				if (!_pause) _arena.racer.backward(_step);
			},
			left: function() {
				if (!_pause) _arena.racer.left(_step);
			},
			right: function() {
				if (!_pause) _arena.racer.right(_step);
			}
		},
		// subscriptions to engine events
		subscribe: function (eventName, callback) {
			_subscriptions[eventName] = _subscriptions[eventName] || [];
			_subscriptions[eventName].push(callback);
		}
	};
} )();


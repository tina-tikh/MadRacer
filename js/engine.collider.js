// Class-module responsible for logic of all collisions of all objects of game
epam.madracer.engine.collider = (function () {
    var _ = epam.madracer.helpers,
        _arena = {},
        _subscriptions = {},
    // loss of speed after collision with static object
        LOSS_SPEED_IN_COLLISION = 0.5;

    var _fireEvent = function (event, params) {
        var subscribers = _subscriptions[event.eventName] || [];
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i](event, params);
        }
    };

    /*
     * collide two dynamic objects
     * @param {Dynamyc} obj1
     * @param {Dynamyc} obj2
     */
    var _encount = function (obj1, obj2) {
        var m1 = obj1.mass,
            m2 = obj2.mass;

        var encountAngle = function (obj, affecter) {
            var xAffect = ( affecter.speed['x']
                * (obj.position['y'] - affecter.position['y']) );
            var yAffect = ( affecter.speed['y']
                * (affecter.position['x'] - obj.position['x']) );
            var magicNumber = 0.01;
            obj.angle += magicNumber * ( xAffect + yAffect );
        };

        encountAngle(obj1, obj2);
        encountAngle(obj2, obj1);

        var encountSpeed = function (axis) {
            var v1 = obj1.speed[axis];
            var v2 = obj2.speed[axis];
            obj1.speed[axis] = (2 * m2 * v2 + (m1 - m2) * v1) / (m1 + m2);
            obj2.speed[axis] = (2 * m1 * v1 + (m2 - m1) * v2) / (m1 + m2);
            if (obj1.id == _arena.racer.id) {
                _fireEvent({ eventName: 'damage', value: Math.abs(v1 - obj1.speed[axis]) });
            }
        };
        encountSpeed('x');
        encountSpeed('y');
    };

    /*
     * collide dynamic object with static
     * @param {Static} objStatic
     * @param {Dynamyc} objDynamic
     * @param {String} direction of collision
     */
    var _encountWithStatic = function (objStatic, objDynamic, direction) {
        // objDynamic located left- or top- side related to objStatic
        var leftOrTop = (objStatic.position[direction] - objDynamic.position[direction]) > 0;
        var vector = leftOrTop ? -1 : 1;
        if (objStatic.type == 'wall') {
            vector = leftOrTop ? 1 : -1;
        }

        var affect = 0;
        if (direction == 'y') {
            affect = -vector * objDynamic.speed['x'] * (0 - ( objDynamic.position.y > 0 || 1));
        }
        if (direction == 'x') {
            affect = vector * objDynamic.speed['y'] * (0 - (objDynamic.position.x > 0 || 1));
        }
        var magicNumber = 0.1;
        objDynamic.angle += magicNumber * affect;

        // Prevent glue to the border fix
        if (Math.abs(objDynamic.speed[direction]) < 100) {
            objDynamic.speed[direction] = 100;
        }


        objDynamic.speed[direction] = vector * Math.abs((1 - LOSS_SPEED_IN_COLLISION ) * objDynamic.speed[direction]);
        if (objDynamic.id == _arena.racer.id) {
            _fireEvent({ eventName: 'damage', value: Math.abs(2 * objDynamic.speed[direction]) });
        }
    };

    var _findIntersectionWithStatic = function (staticItem, item, isObjectInside) {

        var isInsideSign = isObjectInside ? -1 : 1,
            top = staticItem.position.y - isInsideSign * staticItem.size.width / 2,
            bottom = staticItem.position.y + isInsideSign * staticItem.size.width / 2,
            right = staticItem.position.x + isInsideSign * staticItem.size.length / 2,
            left = staticItem.position.x - isInsideSign * staticItem.size.length / 2,
            xIntersection,
            yIntersection;

        var padding = item.size.length / 2;
        if (!isObjectInside) {
            xIntersection = (item.position.x + padding) > left && (item.position.x - padding) < right;
            yIntersection = (item.position.y + padding) > top && (item.position.y - padding) < bottom;
        }

        var xEncount = ( (item.position.x + padding ) > left && item.position.x < left ) ||
            ( (item.position.x - padding ) < right && item.position.x > right );

        var yEncount = ( (item.position.y + padding ) > top && item.position.y < top ) ||
            ( (item.position.y - padding ) < bottom && item.position.y > bottom );

        if (( isObjectInside || ( xIntersection && yIntersection ) ) && ( xEncount || yEncount )) {
            return { key: ('' + item.id), items: { staticItem: staticItem, dynamicItem: item }, hasStatic: true, direction: xEncount ? 'x' : 'y' };
        }
    }

    var _findIntersectionWithDynamic = function (item, anotherItem) {
        var radius = (item.size.length / 2) + (anotherItem.size.length / 2) - 7;
        if ((Math.abs(item.position.x - anotherItem.position.x) < radius) &&
            (Math.abs(item.position.y - anotherItem.position.y) < radius)) {
            return { items: [item, anotherItem] };
        }
    }

    var _findIntersectionForItem = function (item, intersections) {
        _.each(_arena.cars, function (anotherItem) {
            var pairKey = Math.min(item.id, anotherItem.id) + '#' + Math.max(item.id, anotherItem.id);
            if (!_.contains(intersections, 'key', pairKey)) {
                if (item.id != anotherItem.id) {

                    var intersection = _findIntersectionWithDynamic(item, anotherItem);
                    if (intersection) {
                        intersection.key = pairKey;
                        intersections.push(intersection);
                    }
                }
            }
        });
        // todo wall redesign to square or rectangle
        var intersection = _findIntersectionWithStatic(_arena.wall, item, true);
        if (intersection) {
            intersections.push(intersection);
        }

        _.each(_arena.buildings, function (building) {
            if (building.type == 'building') {
                var intersection = _findIntersectionWithStatic(building, item);
                if (intersection) {
                    intersections.push(intersection);
                }
            }
        });
    }

    var _findIntersection = function () {
        var intersections = [];

        _.each(_arena.targets, function (item) {
            _findIntersectionForItem(item, intersections);
        });

        _.each(_arena.cars, function (item) {

            _findIntersectionForItem(item, intersections);

            for (var i = 0; i < _arena.targets.length; i++) {
                // todo: redesign
                var cat = _arena.targets[ i ];
                var radius = (item.size.length / 2) + (cat.size.length / 2) - 7;
                if ((Math.abs(item.position.x - cat.position.x) < radius) &&
                    (Math.abs(item.position.y - cat.position.y) < radius)) {

                    _fireEvent({ eventName: 'targethit', target: _arena.targets[ i ] });
                    _arena.targets.splice(i, 1);
                    i--;
                }
            }
            ;

        });
        return intersections;
    };

    return {
        init: function (arena) {
            _arena = arena;
        },
        update: function () {
            var intersections = _findIntersection();
            if (intersections.length) {
                _.each(intersections, function (pair) {
                    if (pair.hasStatic) {
                        _encountWithStatic(pair.items.staticItem, pair.items.dynamicItem, pair.direction);
                    } else {
                        _encount(pair.items[0], pair.items[1]);
                    }
                });
            }
        },
        subscribe: function (eventName, callback) {
            _subscriptions[eventName] = _subscriptions[eventName] || [];
            _subscriptions[eventName].push(callback);
        }
    };
})();


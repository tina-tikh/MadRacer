/* class that create all  */
epam.madracer.entities = (function () {

    var _idCounter = 1;
    var _ = epam.madracer.helpers;
    var metadata = epam.madracer.metadata;

    /* Base object for all movable classes */
    var Dynamic = function (point, model) {
        this.id = _idCounter++;
        this.model = '';
        this.position = {
            x: 50,
            y: 100
        };
        this.size = {
            width: 18.5,
            length: 41.5
        };
        this.mass = 10;
        this.limits = {
            forceAngleIncrement: 3,
            forceAngleDiapason: 10
        };

        this.friction = 500;

        this.speed = {
            x: 0,
            y: 0,
            getAngle: function () {
                var x = this.x || 0.0001;//todo redesign
                var angle = Math.atan(this.y / x);
                return angle;
            },
            setValue: function (value) {
                var angle = this.getAngle();
                this.x = Math.floor(value * Math.cos(angle));
                this.y = Math.floor(value * Math.sin(angle));
            },
            accelerate: function (increment, angle, revert) {
                var incrementX = increment * Math.cos(angle);
                var incrementY = increment * Math.sin(angle);
                if (!revert) {
                    this.x += incrementX;
                    this.y += incrementY;
                }
                else {
                    var getRevertIncrementForDirection = function (speed, increase) {
                        var sign = (speed > 0) ? (-1) : (1);
                        return sign * Math.min(Math.abs(increase), Math.abs(speed));
                    };

                    this.x += getRevertIncrementForDirection(this.x, incrementX);
                    this.y += getRevertIncrementForDirection(this.y, incrementY);
                }
            },
            getValue: function () {
                return Math.sqrt((this.x * this.x) + ( this.y * this.y ));
            }
        };

        // direction of object in space
        this.angle = 0;

        this.force = {
            value: 1000,
            angle: 0
        };

        if (point) {
            this.position = point;
        }
        if (model) {
            this.setModel(model);
        }
    };

    Dynamic.prototype = {
        limits: {
            forceAngleIncrement: 3,
            forceAngleDiapason: 10
        },
        update: function (step) {
            if (this.speed.getValue() > 0) {
                this.speed.accelerate(this.friction * step, this.speed.getAngle(), true);
            }

            this.position.x += step * this.speed.x;
            this.position.y += step * this.speed.y;
        },
        forward: function (step) {
            this.speed.accelerate(this.force.value * step, _.deg2rad(this.angle));
        },
        backward: function (step) {
            this.speed.accelerate(-this.force.value * step, _.deg2rad(this.angle));
        },
        left: function (step) {
            if (this.speed.getValue() > 0) {
                this.angle -= this.limits.forceAngleIncrement;
            }
        },
        right: function (step) {
            if (this.speed.getValue() > 0) {
                this.angle += this.limits.forceAngleIncrement;
            }
        }
    };

    /* Car object */
    var Car = function () {
        Dynamic.apply(this, arguments);
    }

    Car.prototype = new Dynamic();
    Car.prototype.type = 'car';
    Car.prototype.limits.speedLimit = 500;
    Car.prototype.setModel = function (model) {
        this.model = model;
        var meta = metadata.cars[model];
        if (meta) {
            this.size = meta.size;
            this.meta = meta;
        }
    }
    Car.prototype.forward = function (step) {
        this.speed.accelerate(this.force.value * step, _.deg2rad(this.angle));
    };

    /* Zombie object */
    var Zombie = function () {
        Dynamic.apply(this, arguments);
    }

    Zombie.prototype = new Dynamic();
    Zombie.prototype.type = 'target';
    Zombie.prototype.limits.speedLimit = 100;
    Zombie.prototype.setModel = function (model) {
        this.model = model;
        var meta = metadata.targets[model];
        if (meta) {
            this.size = meta.size;
            this.meta = meta;
        }
    }
    Zombie.prototype.forward = function (step) {
        var SPEED_LIMIT = 50;
        if (this.speed.getValue() < SPEED_LIMIT) {
            this.speed.accelerate(this.force.value * step, _.deg2rad(this.angle));
        }
    };

    /* Building object */
    var Building = function (point, size) {
        this.id = _idCounter++;
        this.type = 'building';
        this.position = point;
        this.size = size || {
            width: 5,
            length: 5
        };
        this.src = metadata.world.building.src;
    };

    /* Wall object */
    var Wall = function (points, size) {
        this.type = 'wall';
        size = size || {
            width: 600,
            length: 600
        };
        this.position = {
            x: size.length / 2,
            y: size.width / 2
        };
        this.src = metadata.world['bg-src'];
        var pts;
        if (points && points.length) {
            pts = points;
        } else {
            pts = [
                {x: 0, y: 0},
                {x: size.length, y: 0},
                {x: size.length, y: size.width},
                {x: 0, y: size.width}
            ];
        }
        this.size = size;
        this.points = pts;
    }

    return {
        newCar: function () {
            return new Car();
        },
        newTarget: function (p, m) {
            return new Target(p, m);
        },
        newZombie: function (p, m) {
            return new Zombie(p, m);
        },
        newBuilding: function (p, s) {
            return new Building(p, s);
        },
        newWall: function (pts, s) {
            return new Wall(pts, s);
        }
    };

})();

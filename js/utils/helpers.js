/**
 * General utils used throughout
 * the entire app
 */
(function (app) {
    var helpers = {
        //arrays
        each: function (array, callback) {
            for (var i = 0; i < array.length; i++) {
                callback(array[ i ], i);
            }
        },
        contains: function (array, propertyName, propertyValue) {
            for (var i = 0; i < array.length; i++) {
                if (array[ i ][ propertyName ] == propertyValue) {
                    return true;
                }
            }
            return false;
        },
        uniq: function (arr) {
            var o = {}, i, l = arr.length, r = [];
            for (i = 0; i < l; i++) o[arr[i]] = arr[i];
            for (i in o) r.push(parseFloat(o[i]));
            return r;
        },
        //converters
        deg2rad: function (deg) {
            deg = deg || 0;
            return deg * Math.PI / 180;
        },
        rad2deg: function (rad) {
            rad = rad || 0;
            return rad * 180 / Math.PI;
        }
    };
    app.helpers = helpers;
})(epam.madracer);
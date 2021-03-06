'use strict';

(function() {

    function asyncMap(forEach, collection, iterator, that, callback) {
        var type = Ox.typeOf(collection),
            results = type == 'object' ? {} : [];
        callback = Ox.last(arguments);
        that = arguments.length == 5 ? that : null;
        forEach(collection, function(value, key, collection, callback) {
            iterator(value, key, collection, function(value) {
                results[key] = value;
                callback();
            });
        }, that, function() {
            callback(type == 'string' ? results.join('') : results);
        });
    };

    Ox.asyncMap = function(array, iterator, that, callback) {
        array = Ox.makeArray(array);
        callback = Ox.last(arguments);
        that = arguments.length == 4 ? that : null;
        if (array.some(Ox.isArray)) {
            Ox.serialMap(array, function(value, key, array, callback) {
                Ox.parallelMap(Ox.makeArray(value), iterator, callback);
            }, callback);
        } else {
            Ox.parallelMap(array, iterator, callback);
        }
    };

    /*@
    Ox.nonblockingForEach <f> Non-blocking `forEach` with synchronous iterator
        (col, iterator[, that], callback[, ms]) -> <u> undefined
        collection <a|o|s> Collection
        iterator <f> Iterator function
            value <*> Value
            key <n|s> Key
            collection <a|o|s> The collection
        that <o> The iterator's `this` binding
        callback <f> Callback function
        ms <n> Number of milliseconds after which to insert a `setTimeout` call
    @*/
    Ox.nonblockingForEach = function(collection, iterator, that, callback, ms) {
        var i = 0, keys, last = Ox.last(arguments),
            n, time, type = Ox.typeOf(collection);
        callback = Ox.isFunction(last) ? last : arguments[arguments.length - 2];
        collection = type == 'array' || type == 'object'
            ? collection : Ox.toArray(collection);
        keys = type == 'object'
            ? Object.keys(collection) : Ox.range(collection.length);
        ms = ms || 1000;
        n = Ox.len(collection);
        that = arguments.length == 5 || (
            arguments.length == 4 && Ox.isFunction(last)
        ) ? that : null;
        time = +new Date();
        iterate();
        function iterate() {
            Ox.forEach(keys.slice(i), function(key) {
                if (key in collection) {
                    if (iterator.call(
                        that, collection[key], key, collection
                    ) === false) {
                        i = n;
                        return false;
                    }
                }
                i++;
                if (+new Date() >= time + ms) {
                    return false; // break
                }
            });
            if (i < n) {
                setTimeout(function() {
                    time = +new Date();
                    iterate();
                }, 1);
            } else {
                callback();
            }
        }
    };

    /*@
    Ox.nonblockingMap <f> Non-blocking `map` with synchronous iterator
        (collection, iterator[, that], callback[, ms]) -> <u> undefined
        collection <a|o|s> Collection
        iterator <f> Iterator function
        that <o> The iterator's `this` binding
        callback <f> Callback function
        ms <n> Number of milliseconds after which to insert a `setTimeout` call
        <script>
            // var time = +new Date();
            // Ox.nonblockingMap(
            //     Ox.range(1000000),
            //     function (value, index, array) {
            //         return +new Date() - time;
            //     },
            //     function(results) {
            //         Ox.print(results.length);
            //     },
            //     1000
            // );
        </script>
        > Ox.nonblockingMap(Ox.range(100000), Ox.identity, function(r) { Ox.test(r.length, 100000); })
        undefined
    @*/
    Ox.nonblockingMap = function(collection, iterator, that, callback, ms) {
        var last = Ox.last(arguments),
            type = Ox.typeOf(collection),
            results = type == 'object' ? {} : [];
        callback = Ox.isFunction(last) ? last : arguments[arguments.length - 2];
        that = arguments.length == 5 || (
            arguments.length == 4 && Ox.isFunction(last)
        ) ? that : null;
        Ox.nonblockingForEach(collection, function(value, key, collection) {
            results[key] = iterator.call(that, value, key, collection);
        }, function() {
            callback(type == 'string' ? results.join('') : results);
        }, ms);
    };

    /*@
    Ox.parallelForEach <f> `forEach` with asynchronous iterator, running in parallel
        (collection, iterator[, that], callback) -> <u> undefined
        collection <a|o|s> Collection
        iterator <f> Iterator function
            value <*> Value
            key <n|s> Key
            collection <a|o|s> The collection
            callback <f> Callback function
        that <o> The iterator's this binding
        callback <f> Callback function
    @*/
    Ox.parallelForEach = function(collection, iterator, that, callback) {
        var i = 0, n, type = Ox.typeOf(collection);
        callback = Ox.last(arguments);
        collection = type == 'array' || type == 'object'
            ? collection : Ox.toArray(collection);
        n = Ox.len(collection);
        that = arguments.length == 4 ? that : null;
        Ox.forEach(collection, function(value, key, collection) {
            iterator.call(that, value, key, collection, function() {
                ++i == n && callback();
            });
        });
    };

    /*@
    Ox.parallelMap <f> Parallel `map` with asynchronous iterator
        (collection, iterator[, that], callback) -> <u> undefined
        collection <a|o|s> Collection
        iterator <f> Iterator function
            value <*> Value
            key <n|s> Key
            collection <a|o|s> The collection
            callback <f> Callback function
        that <o> The iterator's this binding
        callback <f> Callback function
            results <a|o|s> Results
        <script>
            // var time = +new Date();
            // Ox.parallelMap(
            //     Ox.range(10),
            //     function (value, index, array, callback) {
            //         setTimeout(function() {
            //             callback(+new Date() - time);
            //         }, Ox.random(1000));
            //     },
            //     function(results) {
            //         Ox.print(results);
            //     }
            // );
        </script>
        > Ox.parallelMap(Ox.range(100000), Ox.noop, function(r) { Ox.test(r.length, 100000); })
        undefined
    @*/
    Ox.parallelMap = function() {
        asyncMap.apply(null, [Ox.parallelForEach].concat(Ox.toArray(arguments)));
    };

    /*@
    Ox.serialForEach <f> `forEach` with asynchronous iterator, run serially
        (collection, iterator[, that], callback) -> <u> undefined
        collection <a|o|s> Collection
        iterator <f> Iterator function
            value <*> Value
            key <n|s> Key
            collection <a|o|s> The collection
            callback <f> Callback function
        that <o> The iterator's this binding
        callback <f> Callback function
    @*/
    Ox.serialForEach = function(collection, iterator, that, callback) {
        var i = 0, keys, n, type = Ox.typeOf(collection);
        callback = Ox.last(arguments);
        collection = type == 'array' || type == 'object'
            ? collection : Ox.toArray(collection);
        keys = type == 'object'
            ? Object.keys(collection) : Ox.range(collection.length);
        n = Ox.len(collection);
        that = arguments.length == 4 ? that : null;
        iterate();
        function iterate() {
            keys[i] in collection && iterator.call(
                that,
                collection[keys[i]],
                keys[i],
                collection,
                function() {
                    ++i < n ? iterate() : callback();
                }
            );
        }
    };

    /*@
    Ox.serialMap <f> Serial `map` with asynchronous iterator
        (collection, iterator[, that], callback) -> <u> undefined
        collection <a|o|s> Collection
        iterator <f> Iterator function
            value <*> Value
            key <n|s> Key
            collection <a|o|s> The collection
            callback <f> Callback function
        that <o> The iterator's this binding
        callback <f> Callback function
            results <a|o|s> Results
        <script>
            // var time = +new Date();
            // Ox.serialMap(
            //     Ox.range(10),
            //     function (value, index, array, callback) {
            //         setTimeout(function() {
            //             callback(+new Date() - time);
            //         }, Ox.random(1000));
            //     },
            //     function(results) {
            //         Ox.print(results);
            //     }
            // );
        </script>
        > Ox.serialMap(Ox.range(1000), Ox.noop, function(r) { Ox.test(r.length, 1000); })
        undefined
    @*/
    Ox.serialMap = function(collection, iterator, that, callback) {
        asyncMap.apply(null, [Ox.serialForEach].concat(Ox.toArray(arguments)));
    };
    // FIXME: The above test with 10000 iterations blows the stack

}());

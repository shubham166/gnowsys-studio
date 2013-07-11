'use strict';

/*@
Ox.Request <o> Basic request controller
# FIXME: options is not a property, just documenting defaults
# options <o> Options object
#     timeout <n|60000>   request timeout
#     type    <s|"POST">  request type, possible values POST, GET, PUT, DELETE
#     url     <s>         request url
@*/

Ox.Request = (function() {

    var cache = {},
        $element,
        pending = {},
        requests = {},
        self = {
            options: {
                timeout: 60000,
                type: 'POST',
                url: '/api/'
            }
        };

    return {
        /*@
        cancel <f> cancel pending requests
            ()  -> <u>  cancel all requests
            (fn)  -> <u>  cancel all requests where function returns true
            (id)  -> <u>  cancel request by id
        @*/
        cancel: function() {
            if (arguments.length == 0) {
                // cancel all requests
                requests = {};
            } else if (Ox.isFunction(arguments[0])) {
                // cancel with function
                Ox.forEach(requests, function(req, id) {
                    if (arguments[0](req)) {
                        delete requests[id];
                    }
                });
            } else {
                // cancel by id
                delete requests[arguments[0]];
            }
            $element && $element.triggerEvent('request', {
                requests: Ox.len(requests)
            });
        },
        /*@
        clearCache <f> clear cached results
            () -> <u> ...
        @*/
        clearCache: function(query) {
            if (!query) {
                cache = {};
            } else {
                cache = Ox.filter(cache, function(val, key) {
                    return key.indexOf(query) == -1;
                });
            }
        },

        /*@
        bindEvent <f> Unbind event
        @*/
        bindEvent: function() {
            if (!$element) {
                $element = Ox.Element();
            }
            $element.bindEvent.apply(this, arguments);
        },

        /*@
        options <f> get/set options
            ()        -> <o> get options
            (options) -> <o> set options
            options <o> Options Object
        @*/
        options: function() {
            return Ox.getset(self.options, arguments, function() {}, this);
        },

        /*@
        requests <f> pending requests
            () -> <n> returns number of requests
        @*/
        requests: function() {
            return Ox.len(requests);
        },

        /*@
        send <f> send request
            (options) -> <n> returns request id
            options <o> Options Object
                age <n|-1> cache age
                id <n|Ox.uid()> request id
                timeout <n|self.options.timeout> overwrite default timeout
                type <n|self.options.timeout> overwrite default type
                url <n|self.options.timeout> overwrite default url
        @*/
        send: function(options) {

            var options = Ox.extend({
                    age: -1,
                    callback: null,
                    id: Ox.uid(),
                    timeout: self.options.timeout,
                    type: self.options.type,
                    url: self.options.url
                }, options),
                req = JSON.stringify({
                    url: options.url,
                    data: options.data
                });

            if (pending[options.id]) {
                setTimeout(function() {
                    Ox.Request.send(options);
                }, 0);
            } else {
                requests[options.id] = {
                    url: options.url,
                    data: options.data
                };
                if (cache[req] && (
                    options.age == -1
                    || options.age > +new Date() - cache[req].time
                )) {
                    var data = cache[req].data;
                    setTimeout(function() {
                        callback && callback(data);
                    }, 0);
                } else {
                    pending[options.id] = true;
                    $.ajax({
                        beforeSend: function (request) {
                            var csrftoken = Ox.Cookies('csrftoken');
                            if (csrftoken) {
                                request.setRequestHeader("X-CSRFToken", csrftoken);
                            }
                        },
                        complete: complete,
                        data: options.data,
                        //dataType: 'json',
                        timeout: options.timeout,
                        type: options.type,
                        url: options.url
                    });
                }
                $element && $element.triggerEvent('request', {
                    requests: Ox.len(requests)
                });
            }

            function callback(data) {
                if (requests[options.id]) {
                    delete requests[options.id];
                    options.callback && options.callback(data);
                    $element && $element.triggerEvent('request', {
                        requests: Ox.len(requests)
                    });
                }
            }

            function complete(request) {
                var $dialog, data;
                try {
                    data = JSON.parse(request.responseText);
                } catch (error) {
                    try {
                        data = {
                            status: {
                                code: request.status,
                                text: request.statusText
                            }
                        };
                    } catch (error) {
                        data = {
                            status: {
                                code: '500',
                                text: 'Unknown Error'
                            }
                        };
                    }
                }
                if (Ox.contains([200, 404, 409], data.status.code)) {
                    // we have to include not found and conflict
                    // so that handlers can handle these cases
                    cache[req] = {
                        data: data,
                        time: Ox.getTime()
                    };
                    callback(data);
                } else {
                    $element && $element.triggerEvent('error', data);
                }
                pending[options.id] = false;
            }

            return options.id;

        },

        /*@
        unbindEvent <f> Unbind event
        @*/
        // FIXME: Can this be removed?
        unbindEvent: function() {
            $element && $element.unbindEvent.apply(this, arguments);
        }

    };

}());

'use strict';

/*@
Ox.VideoElement <f> VideoElement Object
    options <o> Options object
    self <o> Shared private variable
    ([options[, self]]) -> <o:Ox.Element> VideoElement Object
        loadedmetadata <!> loadedmetadata
        pointschange <!> pointschange
        seeked <!> seeked
        seeking <!> seeking
        sizechange <!> sizechange
        ended <!> ended
@*/

Ox.VideoElement = function(options, self) {

    self = self || {};
    var that = Ox.Element({}, self)
        .defaults({
            autoplay: false,
            preload: 'none',
            src: []
        })
        .options(options || {})
        .css({width: '100%', height: '100%'});

    Ox.Log('Video', 'VIDEO ELEMENT OPTIONS', self.options);

    self.currentPart = 0;
    self.items = [];
    self.loadedMetadata = false;
    self.paused = true;
    self.$video = $('<div>');

    if (Ox.isFunction(self.options.src)) {
        self.isPlaylist = true;
        self.currentItem = 0;
        self.currentPage = 0;
        self.loadedMetadata = false;
        self.pageLength = 2;
        self.options.src(function(items) {
            self.numberOfItems = items;
            self.numberOfPages = Math.ceil(self.numberOfItems / self.pageLength);
            loadPages(function() {
                Ox.Log('Video', 'VIDEO PAGES LOADED');
                setCurrentItem(0);
                if (!self.loadedMedatata) {
                    self.loadedMetadata = true;
                    that.triggerEvent('loadedmetadata');
                    that.triggerEvent('pointschange'); // fixme: needs to be triggered again, loadedmetadata messes with duration
                }
            });
        });
    } else {
        self.numberOfItems = 1;
        self.items.push(loadItem(self.options.src));
    }

    function getCurrentPage() {
        return Math.floor(self.currentItem / self.pageLength);
    }

    function getCurrentTime() {
        return self.items[self.currentItem].offsets[self.currentPart] + self.video.currentTime;
    }

    function getset(key, value) {
        var ret;
        if (Ox.isUndefined(value)) {
            ret = self.video[key];
        } else {
            self.video[key] = value;
            ret = that;
        }
        return ret;
    }

    function loadItem(src, points, callback) {
        src = Ox.isArray(src) ? src : [src];
        var item = {
            currentPart: 0,
            duration: 0,
            durations: src.map(function() {
                return 0;
            }),
            offsets: [],
            parts: src.length
        };
        if (points) {
            item.points = points;
        }
        item.$videos = src.map(function(src, i) {
            //fixme: get rid of this to make use of browser caching
            // but in all browsers except firefox,
            // loadedmetadata fires only once per src
            if (src.length > 0 && Ox.startsWith(Ox.parseURL(src).protocol, 'http')) {
                src += '?' + Ox.uid();
            }
            return $('<video>')
                .css({position: 'absolute'})
                .on({
                    ended: function() {
                        if (i < item.parts - 1) {
                            setCurrentPart(self.currentPart + 1);
                            self.video.play();
                        } /*else if (self.isPlaylist) {
                            setCurrentItem(self.currentItem + 1);
                            self.video.play();
                        }*/ else {
                            self.ended = true;
                            self.paused = true;
                            that.triggerEvent('ended');
                        }
                    },
                    loadedmetadata: function() {
                        item.durations[i] = item.videos[i].duration;
                        if (self.isPlaylist && i == 0) {
                            item.videos[0].currentTime = item.points[0];
                        }
                        if (Ox.every(item.durations)) {
                            item.duration = Ox.sum(item.durations);
                            item.offsets = Ox.range(item.parts).map(function(i) {
                                return Ox.sum(item.durations.slice(0, i));
                            });
                            //Ox.Log('Video', 'METADATA OF', src, 'LOADED', item)
                            if (self.isPlaylist) {
                                callback && callback();
                            } else {
                                setCurrentItem(0);
                                self.loadedMetadata = true;
                                that.triggerEvent('loadedmetadata');
                            }
                        }
                    },
                    progress: function() {
                        // not implemented
                    },
                    seeked: function() {
                        that.triggerEvent('seeked');
                    },
                    seeking: function() {
                        that.triggerEvent('seeking');
                    },
                    stop: function() {
                        // custom event to be triggered on removal from the DOM
                        if (self.video) {
                            self.video.pause();
                        }
                        that.triggerEvent('ended');
                    }
                })
                .attr(Ox.extend({
                    preload: 'metadata',
                    src: src
                }, i == 0 && self.options.autoplay ? {
                    autoplay: 'autoplay'
                } : {}))
                .hide()
                .appendTo(that);
        });
        item.videos = item.$videos.map(function($video) {
            return $video[0];
        });
        self.$brightness = $('<div>').css({
                width: '100%',
                height: '100%',
                background: 'rgb(0, 0, 0)',
                opacity: 0
            })
            .appendTo(that);
        return item;
    }

    function loadPage(page, callback) {
        Ox.Log('Video', 'VIDEO loadPage', page);
        //page = Ox.mod(page, self.numberOfPages);
        var loadedmetadata = 0,
            start = page * self.pageLength,
            stop = Math.min(start + self.pageLength, self.numberOfItems),
            pageLength = stop - start;
        if (!self.items[start]) {
            self.options.src([start, stop], function(data) {
                data.forEach(function(data, i) {
                    self.items[start + i] = loadItem(data.parts, data.points, function(item) {
                        if (++loadedmetadata == pageLength) {
                            Ox.Log('Video', 'VIDEO page', page, 'loaded');
                            callback && callback();
                        }
                    });
                });
            });
        } else {
            Ox.Log('Video', 'PAGE IN CACHE');
            callback && callback();
        }
    }

    function loadPages(callback) {
        var currentPage = self.currentPage,
            nextPage = Ox.mod(currentPage + 1, self.numberOfPages),
            previousPage = Ox.mod(currentPage - 1, self.numberOfPages);
        loadPage(currentPage, function() {
            if (nextPage != currentPage) {
                loadPage(nextPage, function() {
                    if (previousPage != currentPage && previousPage != nextPage) {
                        unloadPage(previousPage);
                    }
                });
            }
            callback && callback();
        });
    }

    function setCurrentItem(item) {
        Ox.Log('Video', 'scI', item);
        var interval;
        item = Ox.mod(item, self.numberOfItems);
        self.video && self.video.pause();
        if (self.items[item]) {
            set();
        } else {
            that.triggerEvent('seeking');
            interval = setInterval(function() {
                Ox.Log('Video', 'ITEM', item, 'NOT AVAILABLE');
                if (self.items[item]) {
                    clearInterval(interval);
                    that.triggerEvent('seeked');
                    set();
                }
            }, 250);
        }
        function set() {
            self.currentItem = item;
            setCurrentPart(self.currentPart);
            if (self.isPlaylist) {
                that.triggerEvent('pointschange');
                that.triggerEvent('sizechange');
                self.currentPage = getCurrentPage();
                loadPages();
            }
        }
    }

    function setCurrentPart(part) {
        Ox.Log('Video', 'sCP', part);
        var css = {},
            muted = false,
            volume = 1;
        ['left', 'top', 'width', 'height'].forEach(function(key) {
            css[key] = self.$video.css(key);
        });
        if (self.video) {
            self.$video.hide();
            self.video.pause();
            if(self.video.readyState >= self.video.HAVE_METADATA) {
                self.video.currentTime = 0;
            }
            volume = self.video.volume;
            muted = self.video.muted;
        }
        self.$video = self.items[self.currentItem].$videos[part].css(css).show();
        self.video = self.$video[0];
        self.video.volume = volume;
        self.video.muted = muted;
        !self.paused && self.video.play();
        self.currentPart = part;
        Ox.Log('Video', 'sCP', part, self.video.src);
    }

    function setCurrentTime(time) {
        Ox.Log('Video', 'sCT', time);
        var currentPart, currentTime,
            item = self.items[self.currentItem];
        Ox.loop(item.parts - 1, -1, -1, function(i) {
            if (item.offsets[i] <= time) {
                currentPart = i;
                currentTime = time - item.offsets[i];
                return false; // break
            }
        });
        Ox.Log('Video', 'sCT', time, currentPart, currentTime);
        if (currentPart != self.currentPart) {
            setCurrentPart(currentPart);
        }
        if (self.video && self.video.readyState) {
            self.video.currentTime = currentTime;
        }
    }

    function unloadPage(page) {
        //page = Ox.mod(page, self.numberOfPages);
        Ox.Log('Video', 'unloadPage', page);
        var start = page * self.pageLength,
            stop = Math.min(start + self.pageLength, self.numberOfItems);
        Ox.range(start, stop).forEach(function(i) {
            if (self.items[i]) {
                self.items[i].$videos.forEach(function($video) {
                    $video[0].src = '';
                    $video.remove();
                });
                delete self.items[i];
            }
        });
    }

    /*@
    animate <f> animate
    @*/
    that.animate = function() {
        self.$video.animate.apply(self.$video, arguments);
        return that;
    };

    /*@
    brightness <f> get/set brightness
    @*/
    that.brightness = function() {
        var ret;
        if (arguments.length == 0) {
            ret = 1 - parseFloat(self.$brightness.css('opacity'));
        } else {
            self.$brightness.css({opacity: 1 - arguments[0]});
            ret = that;
        }
        return ret;
    };

    /*@
    buffered <f> buffered
    @*/
    that.buffered = function() {
        return self.video.buffered;
    };

    /*@
    currentTime <f> get/set currentTime
    @*/
    that.currentTime = function() {
        var ret;
        self.ended = false;
        if (arguments.length == 0) {
            ret = getCurrentTime();
        } else {
            setCurrentTime(arguments[0]);
            ret = that;
        }
        return ret;
    };

    /*@
    css <f> css
    @*/
    that.css = function() {
        var interval;
        if (self.$video) {
            self.$video.css.apply(self.$video, arguments);
        } else {
            interval = setInterval(function() {
                Ox.Log('Video', 'VIDEO NOT YET AVAILABLE');
                if (self.$video) {
                    clearInterval(interval);
                    self.$video.css.apply(self.$video, arguments);
                }
            }, 250);
        }
        return that;
    };

    /*@
    duration <f> duration
    @*/
    that.duration = function() {
        // 86399
        return self.items[self.currentItem].duration;
    };

    /*@
    muted <f> get/set muted
    @*/
    that.muted = function() {
        return getset('muted', arguments[0]);
    };

    /*@
    points <f> get points
    @*/
    that.points = function() {
        return self.items[self.currentItem].points;
    };

    /*@
    pause <f> pause
    @*/
    that.pause = function() {
        self.paused = true;
        self.video.pause();
        return that;
    };

    /*@
    play <f> play
    @*/
    that.play = function() {
        if (self.ended) {
            that.currentTime(0);
            self.ended = false;
        }
        self.paused = false;
        self.video.play();
        return that;
    };

    /*@
    playNext <f> play next
    @*/
    that.playNext = function() {
        Ox.Log('Video', 'PLAY NEXT');
        setCurrentItem(self.currentItem + 1);
        self.video.play();
    };

    /*@
    playPrevious <f> play previous
    @*/
    that.playPrevious = function() {
        setCurrentItem(self.currentItem - 1);
    };

    /*@
    src <f> get/set source
    @*/
    that.src = function() {
        var ret, src;
        if (arguments.length == 0) {
            ret = self.video.src;
        } else {
            self.options.src = Ox.isArray(arguments[0]) ? arguments[0] : [arguments[0]];
            if (self.loadedMetadata) {
                //fixme: get rid of this to make use of browser caching
                // but in all browsers except firefox,
                // loadedmetadata fires only once per src
                src = self.options.src[self.currentPart];
                if (src.length > 0 && Ox.startsWith(Ox.parseURL(src).protocol, 'http')) {
                    src += '?' + Ox.uid();
                }
                self.$video[0].src = src;
                self.items[0].$videos.forEach(function($video, i) {
                    if (i != self.currentPart) {
                        var src = self.options.src[i];
                        //fixme: get rid of this to make use of browser caching
                        // but in all browsers except firefox,
                        // loadedmetadata fires only once per src
                        if (src.length > 0 && Ox.startsWith(Ox.parseURL(src).protocol, 'http')) {
                            src += '?' + Ox.uid();
                        }
                        $video[0].src = src;
                    }
                });
            } else {
                self.items[0].$videos.forEach(function($video, i) {
                    var src = self.options.src[i];
                    //fixme: get rid of this to make use of browser caching
                    // but in all browsers except firefox,
                    // loadedmetadata fires only once per src
                    if (src.length > 0 && Ox.startsWith(Ox.parseURL(src).protocol, 'http')) {
                        src += '?' + Ox.uid();
                    }
                    $video[0].src = src;
                });
            }
            ret = that;
        }
        return ret;
    };

    /*@
    videoHeight <f> get videoHeight
    @*/
    that.videoHeight = function() {
        return self.video.videoHeight;
    };

    /*@
    videoWidth <f> get videoWidth
    @*/
    that.videoWidth = function() {
        return self.video.videoWidth;
    };

    /*@
    volume <f> get/set volume
    @*/
    that.volume = function(value) {
        return getset('volume', arguments[0]);
    };

    return that;

};

'use strict';

/*@
Ox.VideoPanel <f> VideoPanel Object
    options <o> Options object
    self <o> Shared private variable
    ([options[, self]]) -> <o:Ox.SplitPanel> VideoPanel Object
        annotationsfont <!> annotationsfont
        annotationsrange <!> annotationsrange
        annotationssize <!> annotationssize
        annotationssort <!> annotationssort
        censored <!> censored
        downloadvideo <!> downloadvideo
        find <!> find
        info <!> info
        key_* <!> key_*
        muted <!> muted
        paused <!> paused
        position <!> position
        resizecalendar <!> resizecalendar
        resolution <!> resolution
        scale <!> scale
        select <!> select
        subtitles <!> subtitles
        toggleannotations <!> toggleannotations
        togglecalendar <!> togglecalendar
        togglelayer <!> togglelayer
        togglemap <!> togglemap
        toggletimeline <!> toggletimeline
        volume <!> volume
@*/

Ox.VideoPanel = function(options, self) {

    self = self || {};
    var that = Ox.Element({}, self)
            .defaults({
                annotationsCalendarSize: 256,
                annotationsFont: 'small',
                annotationsMapSize: 256,
                annotationsRange: 'all',
                annotationsSize: 256,
                annotationsSort: 'position',
                annotationsTooltip: 'annotations',
                censored: [],
                censoredIcon: '',
                censoredTooltip: '',
                clickLink: null,
                cuts: [],
                duration: 0,
                enableDownload: false,
                enableSubtitles: false,
                find: '',
                fullscreen: false,
                getLargeTimelineURL: null,
                height: 0,
                'in': 0,
                layers: [],
                loop: false, // fixme: used?
                muted: false,
                out: 0,
                paused: true,
                playInToOut: false,
                position: 0,
                poster: '',
                resolution: 0,
                scaleToFill: false,
                selected: '',
                showAnnotations: false,
                showAnnotationsCalendar: false,
                showAnnotationsMap: false,
                showLayers: {},
                showTimeline: true,
                showUsers: false,
                smallTimelineURL: '',
                subtitles: [],
                timeline: '',
                timelineTooltip: 'timeline',
                video: '',
                volume: 1,
                width: 0
            })
            .options(options || {})
            .update({
                fullscreen: function() {
                    self.$video.options({fullscreen: self.options.fullscreen});
                },
                height: function() {
                    self.$video.options({height: getPlayerHeight()});
                },
                'in': function() {
                    setPoint('in', self.options['in']);
                },
                out: function() {
                    setPoint('out', self.options.out);
                },
                paused: function() {
                    self.$video.options({paused: self.options.paused});
                },
                position: function() {
                    self.$video.options({position: self.options.position});
                    self.$timeline.options({position: self.options.position});
                    self.$annotationPanel.options({position: self.options.position});
                },
                selected: function() {
                    self.$annotationPanel.options({selected: self.options.selected});
                },
                showAnnotations: function() {
                    that.$element.toggle(1);
                },
                showTimeline: function() {
                    self.$videoPanel.toggle(1);
                },
                timeline: function() {
                    self.$timeline.options({type: self.options.timeline});
                },
                width: function() {
                    self.$video.options({width: getPlayerWidth()});
                    self.$timeline.options({width: getTimelineWidth()});
                }
            })
            .css({
                height: self.options.height + 'px',
                width: self.options.width + 'px'
            })
            .bindEvent({
                resize: resizeElement,
                key_0: toggleMuted,
                key_equal: function() {
                    self.$video.changeVolume(0.1);
                },
                key_minus: function() {
                    self.$video.changeVolume(-0.1);
                },
                key_space: togglePaused
            });

    self.fullscreen = false;

    self.$player = Ox.Element()
        .css({
            overflowX: 'hidden',
            overflowY: 'hidden'
        });

    self.$video = Ox.VideoPlayer({
            annotations: getAnnotations(),
            censored: self.options.censored,
            censoredIcon: self.options.censoredIcon,
            censoredTooltip: self.options.censoredTooltip,
            controlsTop: ['fullscreen', 'title', 'find'],
            controlsBottom: ['play', 'volume', 'scale', 'timeline', 'position', 'settings'],
            enableDownload: self.options.enableDownload,
            enableFind: true,
            enableKeyboard: true,
            enableMouse: true,
            enablePosition: true,
            enableSubtitles: self.options.enableSubtitles,
            enableTimeline: true,
            find: self.options.find,
            fullscreen: self.options.fullscreen,
            height: getPlayerHeight(),
            'in': self.options['in'],
            muted: self.options.muted,
            out: self.options.out,
            paused: self.options.paused,
            position: self.options.position,
            resolution: self.options.resolution,
            scaleToFill: self.options.scaleToFill,
            subtitles: self.options.subtitles,
            timeline: self.options.smallTimelineURL,
            video: self.options.video,
            volume: self.options.volume,
            width: getPlayerWidth()
        })
        .bindEvent({
            censored: function() {
                that.triggerEvent('censored');
            },
            download: function(data) {
                that.triggerEvent('downloadvideo', data);
            },
            find: function(data) {
                self.$timeline.options({find: data.find});
                self.$annotationPanel.options({highlight: data.find});
                that.triggerEvent('find', data);
            },
            fullscreen: function(data) {
                self.options.fullscreen = data.fullscreen;
            },
            muted: function(data) {
                that.triggerEvent('muted', data);
            },
            paused: function(data) {
                self.options.paused = data.paused;
                that.triggerEvent('paused', data);
            },
            playing: function(data) {
                setPosition(data.position, true);
            },
            position: function(data) {
                setPosition(data.position);
            },
            resolution: function(data) {
                that.triggerEvent('resolution', data);
            },
            scale: function(data) {
                that.triggerEvent('scale', data);
            },
            select: selectAnnotation,
            subtitles: function(data) {
                self.$timeline.options({
                    subtitles: data.subtitles ? self.options.subtitles : []
                });
                that.triggerEvent('subtitles', data);
            },
            volume: function(data) {
                that.triggerEvent('volume', data);
            }
        })
        .appendTo(self.$player);

    self.$controls = Ox.Element()
        .addClass('OxMedia')
        .bindEvent({
            toggle: toggleControls
        });

    self.$timeline = Ox.LargeVideoTimeline({
            duration: self.options.duration,
            find: self.options.find,
            getImageURL: self.options.getLargeTimelineURL,
            position: self.options.position,
            subtitles: self.options.enableSubtitles ? self.options.subtitles : [],
            videoId: self.options.videoId,
            type: self.options.timeline,
            width: getTimelineWidth()
        })
        .css({left: '4px', top: '4px'})
        .bindEvent({
            mousedown: that.gainFocus,
            position: changeTimeline
        })
        .appendTo(self.$controls);

    self.$videoPanel = Ox.SplitPanel({
            elements: [
                {
                    element: self.$player
                },
                {
                    collapsed: !self.options.showTimeline,
                    collapsible: true,
                    element: self.$controls,
                    size: 80,
                    tooltip: self.options.timelineTooltip
                }
            ],
            orientation: 'vertical'
        });

    self.$annotationPanel = Ox.AnnotationPanel({
            calendarSize: self.options.annotationsCalendarSize,
            clickLink: self.options.clickLink,
            editable: false,
            font: self.options.annotationsFont,
            highlight: self.options.find,
            'in': self.options['in'],
            layers: self.options.layers,
            mapSize: self.options.annotationsMapSize,
            out: self.options.out,
            position: self.options.position,
            range: self.options.annotationsRange,
            selected: self.options.selected,
            showCalendar: self.options.showAnnotationsCalendar,
            showFonts: true,
            showLayers: Ox.clone(self.options.showLayers),
            showMap: self.options.showAnnotationsMap,
            showUsers: self.options.showUsers,
            sort: self.options.annotationsSort,
            width: self.options.annotationsSize
        })
        .bindEvent({
            annotationsfont: function(data) {
                self.options.annotationsFont = data.font;
                that.triggerEvent('annotationsfont', data);
            },
            annotationsrange: function(data) {
                self.options.annotationsRange = data.range;
                that.triggerEvent('annotationsrange', data);
            },
            annotationssort: function(data) {
                self.options.annotationsSort = data.sort;
                that.triggerEvent('annotationssort', data);
            },
            info: function(data) {
                that.triggerEvent('info', data);
            },
            open: function() {
                setPosition(self.options['in']);
            },
            resize: resizeAnnotations,
            resizeend: resizeendAnnotations,
            resizecalendar: function(data) {
                that.triggerEvent('resizecalendar', data);
            },
            resizemap: function(data) {
                that.triggerEvent('resizemap', data);
            },
            select: selectAnnotation,
            toggle: toggleAnnotations,
            togglecalendar: function(data) {
                self.options.showAnnotationsCalendar = !data.collapsed;
                that.triggerEvent('togglecalendar', data);
            },
            togglelayer: function(data) {
                that.triggerEvent('togglelayer', {
                    collapsed: data.collapsed,
                    layer: data.layer
                });
            },
            togglemap: function(data) {
                self.options.showAnnotationsMap = !data.collapsed;
                that.triggerEvent('togglemap', data);
            }
        });

    [
        '0', 'b', 'backslash', 'closebracket', 'comma', 'dot', 'equal', 'f',
        'g', 'i', 'minus', 'n', 'o', 'openbracket', 'p', 'shift_0', 'shift_g',
        'shift_i', 'shift_o', 'slash', 'space'
    ].forEach(function(key) {
        key = 'key_' + key;
        self.$annotationPanel.bindEvent(key, function() {
            that.triggerEvent(key);
        });
    });    

    that.setElement(
        Ox.SplitPanel({
            elements: [
                {
                    element: self.$videoPanel
                },
                {
                    collapsed: !self.options.showAnnotations,
                    collapsible: true,
                    element: self.$annotationPanel,
                    resizable: true,
                    resize: [192, 256, 320, 384],
                    size: self.options.annotationsSize,
                    tooltip: self.options.annotationsTooltip
                }
            ],
            orientation: 'horizontal'
        })
    );

    function changeTimeline(data) {
        self.options.position = data.position;
        self.$video.options({position: self.options.position});
        self.$annotationPanel.options({position: self.options.position});
        that.triggerEvent('position', {position: self.options.position});
    }

    function getAnnotations() {
        return Ox.flatten(self.options.layers.map(function(layer) {
            return layer.items.map(function(item) {
                return {id: item.id, 'in': item['in'], out: item.out, text: item.value};
            });
        })).sort(sortAnnotations);
    }

    function getPlayerHeight() {
        return self.options.height -
            self.options.showTimeline * 80 - 1;
    }

    function getPlayerWidth() {
        return self.options.width -
            (self.options.showAnnotations && !self.fullscreen)
            * self.options.annotationsSize - 1;
    }

    function getTimelineWidth() {
        return self.options.width -
            (self.options.showAnnotations && !self.fullscreen)
            * self.options.annotationsSize - 16 - 1;
    }

    function resizeAnnotations(data) {
        // called on annotations resize
        self.options.annotationsSize = data.size;
        self.$video.options({
            width: getPlayerWidth()
        });
        self.$timeline.options({
            width: getTimelineWidth()
        });
        self.$annotationPanel.options({width: data.size});
    }

    function resizeendAnnotations(data) {
        that.triggerEvent('annotationssize', data.size);
    }

    function resizeElement(data) {
        // called on browser toggle
        self.options.height = data.size;
        self.$video.options({
            height: getPlayerHeight()
        });
    }

    /*
    function resizePanel(data) {
        // called on annotations toggle <-- FIXME: NOT TRUE
        self.$video.options({
            width: getPlayerWidth()
        });
        self.$timeline.options({
            width: getTimelineWidth()
        });
    }
    */

    function selectAnnotation(data) {
        self.options.selected = data.id;
        if (self.options.selected) {
            setPosition(data['in']);
            setPoint('in', data['in']);
            setPoint('out', data.out);
        }
        self.$annotationPanel.options({selected: self.options.selected});
        that.triggerEvent('select', {id: self.options.selected});
    }

    function setPoint(point, position) {
        self.options[point] = position;
        self.$video.options(point, position);
        self.$timeline.options(point, position);
        self.$annotationPanel.options(point, position);
    }

    function setPosition(position, playing) {
        var minute = Math.floor(position / 60),
            previousMinute = Math.floor(self.options.position / 60);
        self.options.position = position;
        !playing && self.$video.options({position: self.options.position});
        self.$timeline.options({position: self.options.position});
        self.$annotationPanel.options({position: self.options.position});
        if (!playing || minute != previousMinute) {
            that.triggerEvent('position', {
                position: !playing ? self.options.position : minute * 60
            });
        }
    }

    function sortAnnotations(a, b) {
        var ret = 0;
        if (a['in'] < b['in']) {
            ret = -1;
        } else if (a['in'] > b['in']) {
            ret = 1;
        } else if (a.out < b.out) {
            ret = -1;
        } else if (a.out > b.out) {
            ret = 1;
        } else if (a.value < b.value) {
            ret = -1;
        } else if (a.value > b.value) {
            ret = 1;
        }
        return ret;
    }

    function toggleAnnotations(data) {
        self.options.showAnnotations = !data.collapsed;
        self.$video.options({
            width: getPlayerWidth()
        });
        self.$timeline.options({
            width: getTimelineWidth()
        });
        that.triggerEvent('toggleannotations', {
            showAnnotations: self.options.showAnnotations
        });
    }

    function toggleControls(data) {
        self.options.showTimeline = !data.collapsed;
        self.$video.options({
            height: getPlayerHeight()
        });
        that.triggerEvent('toggletimeline', {
            showTimeline: self.options.showTimeline
        });
    }

    function toggleMuted() {
        self.$video.toggleMuted();
    }

    function togglePaused() {
        self.$video.togglePaused();
        self.$video.options('paused') && that.triggerEvent('position', {
            position: self.$video.options('position')
        });
    }

    // fixme: can these be removed?

    /*@
    toggleAnnotations <f> toggle annotations
        () -> <o> toggle visibility of annotations
    @*/
    that.toggleAnnotations = function() {
        that.$element.toggle(1);
    };

    /*@
    toggleTimeline <f> toggle timeline
        () -> <o> toggle visibility of timeline
    @*/
    that.toggleTimeline = function() {
        self.$videoPanel.toggle(1);
    };

    return that;

}

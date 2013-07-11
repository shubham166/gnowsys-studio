'use strict';

/*@
Ox.VideoEditorPlayer <f> VideoEditorPlayer Object
    options <o> Options object
    self <o> Shared private variable
    ([options[, self]]) -> <o:Ox.Element> VideoEditorPlayer Object
        change <!> change
        playing <!> playing
        set <!> set
        togglesize <!> togglesize
@*/

Ox.VideoEditorPlayer = function(options, self) {

    self = self || {};
    var that = Ox.Element({}, self)
            .defaults({
                duration: 0,
                find: '',
                height: 0,
                points: [0, 0],
                position: 0,
                posterFrame: 0,
                size: 'small',
                subtitles: [],
                type: 'play',
                url: '',
                width: 0
            })
            .options(options || {})
            .update({
                height: setHeight,
                points: setMarkers,
                position: setPosition,
                posterFrame: setMarkers,
                width: setWidth
            })
            .addClass('OxVideoPlayer')
            .css({
                height: (self.options.height + 16) + 'px',
                width: self.options.width + 'px'
            });

    self.controlsHeight = 16;

    if (self.options.type == 'play') {
        self.$video = Ox.VideoElement({
                height: self.options.height,
                paused: true,
                points: self.options.points,
                position: self.options.position,
                url: self.options.url,
                width: self.options.width
            })
            .bindEvent({
                paused: paused,
                playing: playing
            })
            .appendTo(that);
        self.video = self.$video[0];
    } else {
        self.$video = $('<img>')
            .css({
                height: self.options.height + 'px',
                width: self.options.width + 'px'
            })
            .appendTo(that);
    }

    self.$subtitle = $('<div>')
        .addClass('OxSubtitle')
        .appendTo(that);

    setSubtitleSize();

    self.$markerFrame = $('<div>')
        .addClass('OxMarkerFrame')
        .append(
            $('<div>')
                .addClass('OxFrame')
                .css({
                    width: Math.floor((self.options.width - self.options.height) / 2) + 'px',
                    height: self.options.height + 'px'
                })
        )
        .append(
            $('<div>')
                .addClass('OxPoster')
                .css({
                    width: (self.options.height - 2) + 'px',
                    height: (self.options.height - 2) + 'px'
                })
        )
        .append(
            $('<div>')
                .addClass('OxFrame')
                .css({
                    width: Math.ceil((self.options.width - self.options.height) / 2) + 'px',
                    height: self.options.height + 'px'
                })
        )
        .hide()
        .appendTo(that);

    self.$markerPoint = {};
    ['in', 'out'].forEach(function(point, i) {
        self.$markerPoint[point] = {};
        ['top', 'bottom'].forEach(function(edge) {
            var titleCase = Ox.toTitleCase(point) + Ox.toTitleCase(edge);
            self.$markerPoint[point][edge] = $('<img>')
                .addClass('OxMarkerPoint OxMarker' + titleCase)
                .attr({
                    src: Ox.UI.PATH + 'png/videoMarker' + titleCase + '.png'
                })
                .hide()
                .appendTo(that);
            if (self.options.points[i] == self.options.position) {
                self.$markerPoint[point][edge].show();
            }
        });
    });

    self.$controls = Ox.Bar({
            size: self.controlsHeight
        })
        .css({
            marginTop: '-2px'
        })
        .appendTo(that);

    if (self.options.type == 'play') {
        // fixme: $buttonPlay etc. ?
        self.$playButton = Ox.Button({
                id: self.options.id + 'Play',
                tooltip: ['Play', 'Pause'],
                type: 'image',
                values: ['play', 'pause']
            })
            .bindEvent('click', togglePlay)
            .appendTo(self.$controls);
        self.$playInToOutButton = Ox.Button({
                id: self.options.id + 'PlayInToOut',
                title: 'PlayInToOut',
                tooltip: Ox._('Play In to Out'),
                type: 'image'
            })
            .bindEvent('click', function() {
                that.playInToOut();
            })
            .appendTo(self.$controls);
        self.$muteButton = Ox.Button({
                id: self.options.id + 'Mute',
                tooltip: ['Mute', 'Unmute'],
                type: 'image',
                values: ['mute', 'unmute']
            })
            .bindEvent('click', toggleMute)
            .appendTo(self.$controls);
        self.$sizeButton = Ox.Button({
                id: self.options.id + 'Size',
                tooltip: ['Larger', 'Smaller'],
                type: 'image',
                value: self.options.size,
                values: [
                    {id: 'small', title: 'grow'},
                    {id: 'large', title: 'shrink'}
                ]
            })
            .bindEvent('click', toggleSize)
            .appendTo(self.$controls);
    } else {
        self.$goToPointButton = Ox.Button({
                id: self.options.id + 'GoTo' + Ox.toTitleCase(self.options.type),
                title: 'GoTo' + Ox.toTitleCase(self.options.type),
                tooltip: Ox._('Go to ' + Ox.toTitleCase(self.options.type) + ' Point'),
                type: 'image'
            })
            .bindEvent('click', goToPoint)
            .appendTo(self.$controls);
        self.$setPointButton = Ox.Button({
                id: self.options.id + 'Set' + Ox.toTitleCase(self.options.type),
                title: 'Set' + Ox.toTitleCase(self.options.type),
                tooltip: Ox._('Set ' + Ox.toTitleCase(self.options.type) + ' Point'),
                type: 'image'
            })
            .bindEvent('click', setPoint)
            .appendTo(self.$controls);
    }

    self.$positionInput = Ox.TimeInput({
            milliseconds: true,
            seconds: true,
            value: Ox.formatDuration(self.options.position, 3)
        })
        .css({
            float: 'right'
        })
        .appendTo(self.$controls)

    // fixme: strange positioning hack
    self.$positionInput.css({
        width: '98px'
    });
    $.browser.mozilla && self.$positionInput.css({
        marginTop: '-19px'
    });
    self.$positionInput.children('.OxLabel').each(function(i, element) {
        $(this).css({
            width: '22px',
            marginLeft: (i == 0 ? 8 : 0) + 'px',
            background: 'rgb(32, 32, 32)'
        });
    });
    self.$positionInput.children('div.OxInput').each(function(i) {
        var marginLeft = [-82, -58, -34, -10];
        $(this).css({
            marginLeft: marginLeft[i] + 'px'
        });
    });

    if (self.options.type == 'play') {
        self.$loadingIcon = Ox.LoadingIcon()
            .appendTo(that)
            .start();
        self.loadingInterval = setInterval(function() {
            if (self.video.readyState) {
                clearInterval(self.loadingInterval);
                self.$loadingIcon.stop();
                setPosition();
            }
        }, 50);
    } else {
        setPosition();
    }

    function getSubtitle() {
        var subtitle = '';
        Ox.forEach(self.options.subtitles, function(v) {
            if (v['in'] <= self.options.position && v['out'] > self.options.position) {
                subtitle = v.value;
                return false; // break
            }
        });
        return subtitle;
    }

    function goToPoint() {
        that.triggerEvent('change', {
            position: self.options.points[self.options.type == 'in' ? 0 : 1]
        });
    }

    function paused() {
        self.$playButton.toggle();
    }

    function playing(data) {
        self.options.position = data.position;
        setMarkers();
        setSubtitle();
        self.$positionInput.value(Ox.formatDuration(self.options.position, 3));
        that.triggerEvent('playing', {
            position: self.options.position
        });
    }

    function setHeight() {
        that.css({
            height: (self.options.height + 16) + 'px'
        });
        self.options.type == 'play' ? self.$video.options({
            height: self.options.height
        }) : self.$video.css({
            height: self.options.height + 'px'
        });
    }

    function setMarkers() {
        self.options.position == self.options.posterFrame ?
            self.$markerFrame.show() : self.$markerFrame.hide();
        Ox.forEach(self.$markerPoint, function(markers, point) {
            Ox.forEach(markers, function(marker) {
                self.options.position == self.options.points[point == 'in' ? 0 : 1]
                    ? marker.show() : marker.hide();
            });
        })
    }

    function setPoint() {
        var data = {};
        self.options.points[self.options.type == 'in' ? 0 : 1] = self.options.position;
        setMarkers();
        data[self.options.type] = self.options.position;
        that.triggerEvent('set', data);
    }

    function setPosition() {
        var position = Ox.limit(
                self.options.position - (self.options.type == 'out' ? 0.01 : 0),
                0, self.options.duration - 0.01
            ),
            url;
        if (self.options.type == 'play') {
            self.$video.position(self.options.position);
        } else {
			self.$loadingIcon && self.$loadingIcon.stop();
            url = self.options.url(position);
			if (self.$video.attr('src') != url) {
				self.$loadingIcon = Ox.LoadingIcon()
                    .appendTo(that)
                    .start();
                self.$video.attr({
                        src: url
                    })
                    .load(self.$loadingIcon.stop);
			}
        }
        setMarkers();
        setSubtitle();
        self.$positionInput.value(Ox.formatDuration(self.options.position, 3));
    }

    function setSubtitle() {
        var subtitle = getSubtitle();
        if (subtitle != self.subtitle) {
            self.subtitle = subtitle;
            self.$subtitle.html(
                Ox.highlight(self.subtitle, self.options.find, 'OxHighlight')
                    .replace(/\n/g, '<br/>')
            );
        }
    }

    function setSubtitleSize() {
        self.$subtitle.css({
            bottom: Math.floor(self.controlsHeight + self.options.height / 16) + 'px',
            width: self.options.width + 'px',
            fontSize: Math.floor(self.options.height / 20) + 'px',
            WebkitTextStroke: (self.options.height / 1000) + 'px rgb(0, 0, 0)'
        });
    }

    function setWidth() {
        that.css({
            width: self.options.width + 'px'
        });
        self.options.type == 'play' ? self.$video.options({
            width: self.options.width
        }) : self.$video.css({
            width: self.options.width + 'px'
        });
        setSubtitleSize();
    }

    function toggleMute() {
        self.$video.toggleMute();
    }

    function togglePlay() {
        self.video.paused ? that.play() : that.pause();
    }

    function toggleSize(data) {
        self.options.size = data.id
        that.triggerEvent('togglesize', {
            size: self.options.size
        });
    }

    /*@
    mute <f> mute
    @*/
    that.mute = function() {
        self.$video.mute();
        return that;
    };

    /*@
    pause <f> pause
    @*/
    that.pause = function() {
        self.$video.pause();
        return that;
    };

    /*@
    play <f> play
    @*/
    that.play = function() {
        self.$video.play();
        return that;
    };

    /*@
    playInToOut <f> playInToOut
    @*/
    that.playInToOut = function() {
        self.$video.paused() && self.$playButton.toggle();
        self.$video.playInToOut();
        return that;
    };

    /*@
    toggleMute <f> toggleMute
    @*/
    that.toggleMute = function() {
        self.$muteButton.trigger('click');
        return that;
    }

    /*@
    togglePlay <f> togglePlay
    @*/
    that.togglePlay = function() {
        self.$playButton.trigger('click');
        return that;
    }

    /*@
    unmute <f> unmute
    @*/
    that.unmute = function() {
        self.$video.unmute();
        return that;
    };

    return that;

};

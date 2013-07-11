'use strict';

/*@
Ox.LoadingIcon <f> Loading Icon Element
    options <o> Options object
        size     <n|s|16> size of icon
    self <o>    Shared private variable
    ([options[, self]]) -> <o:Ox.Element> Loading Icon Element
@*/

Ox.LoadingIcon = function(options, self) {

    self = self || {};
    var that = Ox.Element('<img>', self)
        .defaults({
            size: 16,
            video: false
        })
        .options(options || {})
        .addClass('OxLoadingIcon')
        .attr({
            src: Ox.UI.getImageURL(
                'symbolLoading',
                self.options.video ? [255, 255, 255] : null
            )
        });

    Ox.isNumber(self.options.size)
        ? that.css({width: self.options.size, height: self.options.size})
        : that.addClass('Ox' + Ox.toTitleCase(self.options.size));

    /*@
    start <f> Start loading animation
        ()  -> <f> Loading Icon Element
    @*/
    that.start = function() {
        var css, deg = 0, previousTime = +new Date();
        if (!self.loadingInterval) {
            self.loadingInterval = setInterval(function() {
                var currentTime = +new Date(),
                    delta = (currentTime - previousTime) / 1000;
                previousTime = currentTime;
                deg = Math.round((deg + delta * 360) % 360 / 30) * 30;
                css = 'rotate(' + deg + 'deg)';
                that.css({
                    MozTransform: css,
                    MsTransform: css,
                    OTransform: css,
                    WebkitTransform: css
                });
            }, 83);
            that.animate({opacity: 1}, 250);
        }
        return that;
    };

    /*@
    stop <f> Stop loading animation
        ()  -> <f> Loading Icon Element
    @*/
    that.stop = function() {
        var loadingInterval = self.loadingInterval;
        if (self.loadingInterval) {
            self.loadingInterval = void 0;
            that.animate({opacity: 0}, 250, function() {
                clearInterval(loadingInterval);
            });
        }
        return that;
    };

    return that;

};

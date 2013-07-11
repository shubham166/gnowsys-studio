'use strict';

/*@
Ox.Clipboard <o> Basic clipboard handler
    copy <f> Copy data to clipboard
        (data) -> <u> undefined
    paste <f> Paste data from clipboard
        () -> <*> Clipboard data
@*/
Ox.Clipboard = (function() {
    var clipboard = {};
    return {
        _print: function() {
            Ox.Log('Core', JSON.stringify(clipboard));
        },
        copy: function(data) {
            clipboard = data;
            Ox.Log('Core', 'copy', JSON.stringify(clipboard));
        },
        paste: function(type) {
            return type ? clipboard.type : clipboard;
        },
        type: function(type) {
            return type in clipboard;
        }
    };
}());

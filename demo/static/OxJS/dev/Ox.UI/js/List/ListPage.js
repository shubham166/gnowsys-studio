'use strict';

/*@
Ox.ListPage <f> ListPage Object
    options <o> Options object
    self <o> Shared private variable
    ([options[, self]]) -> <o:Ox.Element> ListPage Object
@*/
Ox.ListPage = function(options, self) {
    self = self || {};
    var that = Ox.Element({}, self)
            .addClass('OxPage');
    return that;
};

/*
This is probably the easiest way of displaying a complex data structure...
*/

Ox.load('UI', function() {

    Ox.getJSON(Ox.PATH + 'Ox.Geo/json/Ox.Geo.json', function(data) {

        Ox.TreeList({data: data}).appendTo(Ox.$body);

    });

});
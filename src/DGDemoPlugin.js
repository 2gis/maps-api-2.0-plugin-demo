L.DG.DemoPlugin = L.Handler.extend({

    statics: {
        PAGE_SIZE: 50,
        TYPE: 'filial',
        KEY: 'ruhcbx0197'
    },

    options: {
        what: 'кафе',
        radius: 500
    },

    _lastFirms: L.layerGroup(),

    initialize: function (map, options) { // (L.Map, Object)
        L.Handler.prototype.initialize.call(map);
        L.Util.setOptions(this, options);
    },

    addHooks: function() {
        this._map.on('click', this._searchFirms, this);
    },

    removeHooks: function() {
        this._map.off('click', this._searchFirms, this);
    },

    _searchFirms: function(e) { // (MouseEvent)
        var latlng = e.latlng.wrap();

        L.DG.ajax({
            url: 'http://catalog.api.2gis.ru/2.0/search',
            data: {
                point: latlng.lng + ',' + latlng.lat,
                what: this.options.what,
                radius: this.options.radius,
                page_size: L.DG.DemoPlugin.PAGE_SIZE,
                type: L.DG.DemoPlugin.TYPE,
                key: L.DG.DemoPlugin.KEY
            },
            success: L.bind(this._showFirms, this),
            error: L.bind(this._logError, this)
        });
    },

    _showFirms: function(data) { // (Object) -> Boolean
        var firms, marker;

        if (data.response.code > 200) {
            this._logError(data);
            return false;
        }

        this._lastFirms.clearLayers();

        firms = data.result.data;
        firms.forEach(function(firmInfo) {
            marker = L.marker([firmInfo.geo.lat, firmInfo.geo.lon]);
            marker.bindPopup(firmInfo.firm.name);
            marker.addTo(this._lastFirms);
        }, this);
        
        this._lastFirms.addTo(this._map);

        return true;
    },

    _logError: function(data) {
        console.log('Error: ', data);
    }
});

L.Map.addInitHook('addHandler', 'demoPlugin', L.DG.DemoPlugin);
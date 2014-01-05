if (typeof L.Handler !== 'undefined') {


L.DG.DemoPlugin = L.Handler.extend({

    _lastFirms: L.layerGroup(),

    addHooks: function() {
        this._map.on('click', this._searchFirms, this);
    },

    removeHooks: function() {
        this._map.off('click', this._searchFirms, this);
    },

    _searchFirms: function(e) { // (MouseEvent)
        L.DG.ajax({
            url: 'http://catalog.api.2gis.ru/2.0/search',
            data: {
                what: 'магазин',
                point: e.latlng.lng + ',' + e.latlng.lat,
                radius: 500,
                page_size: 50,
                type: 'filial',
                key: 1
            },
            success: L.bind(this._showFirms, this)
        })
    },

    _showFirms: function(data) { // (Object)
        var marker,
            firms = data.result.data;
        
        this._lastFirms.clearLayers();
        for (var i = 0; i < firms.length; i++) {
            marker = L.marker([firms[i].geo.lat, firms[i].geo.lon]);
            marker.bindPopup(firms[i].firm.name);
            marker.addTo(this._lastFirms);
        }
        this._lastFirms.addTo(this._map);
    }
});

L.Map.addInitHook('addHandler', 'demoPlugin', L.DG.DemoPlugin);


}
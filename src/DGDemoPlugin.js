L.DG.DemoPlugin = L.Handler.extend({
    addHooks: function() {
        this._map.on('click', this._searchFirms, this);
    },

    removeHooks: function() {
        this._map.off('click', this._searchFirms, this);
    }

    _searchFirms: function(e) {
        console.log(e);
    }
});
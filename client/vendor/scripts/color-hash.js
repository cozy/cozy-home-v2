var ColorHash = (function () {

    var schemes = {
        "base" : [
            "00bb3f", "238c47", "007929", "37dd6f", "63dd8d",
            "0f4fa8", "284c7e", "05316d", "4380d3", "6996d3",
            "ff9f00", "bf8930", "a66800", "ffb740", "ffca73",
            "ff2800", "bf4630", "a61a00", "ff5d40", "ff8973"
        ]
    };

    function hashCode(str) {
        var h, i, len, max;
        
        h = 0;
        max = Math.pow(2, 32);
        
        for (i = 0, len = str.length; i < len; i++) {
            h = (h * 31 + str.charCodeAt(i)) % max;
        }
        
        return h;
    }

    function getColor(str, name) {
        var scheme, hash;

        scheme = schemes[name] || schemes.base;
        hash = hashCode(str);
        
        return "#" + scheme[hash % scheme.length];
    }

    function addScheme(name, scheme) {
        schemes[name] = scheme;
    }

    function getScheme(name) {
        return scheme[name];
    }

    function deleteScheme(name) {
        if (name !== "base") {
            delete schemes[name];
        }
    }

    return {
        "addScheme" : addScheme,
        "getScheme" : getScheme,
        "deleteScheme" : deleteScheme,
        
        "getHash" : hashCode,
        "getColor" : getColor
    }    
    
}());

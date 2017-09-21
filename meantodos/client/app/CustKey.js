"use strict";
var CustKey = (function () {
    function CustKey() {
        this.sum = Math.floor(Math.random() * 1000) + 1;
    }
    Object.defineProperty(CustKey.prototype, "sumValue", {
        get: function () {
            return this.sum;
        },
        enumerable: true,
        configurable: true
    });
    return CustKey;
}());
exports.CustKey = CustKey;
//# sourceMappingURL=CustKey.js.map
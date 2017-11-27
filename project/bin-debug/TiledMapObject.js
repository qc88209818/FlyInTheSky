var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var TiledMapObject = (function () {
        function TiledMapObject() {
            this.params = {};
        }
        return TiledMapObject;
    }());
    fly.TiledMapObject = TiledMapObject;
    __reflect(TiledMapObject.prototype, "fly.TiledMapObject");
})(fly || (fly = {}));
//# sourceMappingURL=TiledMapObject.js.map
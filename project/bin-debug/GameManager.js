var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var GameManager = (function () {
        function GameManager() {
        }
        return GameManager;
    }());
    fly.GameManager = GameManager;
    __reflect(GameManager.prototype, "fly.GameManager");
})(fly || (fly = {}));
//# sourceMappingURL=GameManager.js.map
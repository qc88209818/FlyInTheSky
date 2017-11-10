var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var fly;
(function (fly) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(x, y, radious) {
            var _this = _super.call(this) || this;
            _this.x = x + radious;
            _this.y = y + radious;
            _this.radious = radious;
            _this.initBody(Player.player_id++, p2.Body.DYNAMIC, _this.x, _this.y, _this.radious);
            // this.setGroupAndMask(ObjectGroup.Player, ObjectMask.Player);
            _this.initRender(_this.radious);
            _this.initBitmap();
            _this.updatePosition();
            return _this;
        }
        Player.prototype.initBitmap = function () {
            var png = fly.FlyTools.createBitmapByName("player_down_png");
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            png.scaleX = 2;
            png.scaleY = 2;
            this.addChild(png);
        };
        Player.player_id = 0;
        return Player;
    }(fly.FlyCircle));
    fly.Player = Player;
    __reflect(Player.prototype, "fly.Player");
})(fly || (fly = {}));
//# sourceMappingURL=Player.js.map
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
        function Player(x, y, radius) {
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.radius = radius;
            _this.initBody({
                id: fly.FlyConfig.getPlayerId(),
                mass: 1,
                type: p2.Body.DYNAMIC,
                fixedRotation: true,
                position: [_this.x, _this.y]
            });
            _this.initShape(_this.radius);
            _this.setGroupAndMask(fly.ObjectGroup.Player, fly.ObjectMask.Player);
            _this.initBitmap();
            _this.updatePosition();
            return _this;
        }
        Player.prototype.changeSize = function (size) {
            this.circle.radius += 5;
            this.circle.updateArea();
            this.body.mass += 0.5;
            this.body.updateMassProperties();
            this.changeRenderSize(this.circle.radius);
        };
        Player.prototype.initBitmap = function () {
            var png = fly.FlyTools.createBitmapByName("player_down_png");
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            png.scaleX = 2 * this.radius / png.width;
            png.scaleY = 2 * this.radius / png.height;
            this.addChild(png);
        };
        return Player;
    }(fly.FlyCircle));
    fly.Player = Player;
    __reflect(Player.prototype, "fly.Player");
})(fly || (fly = {}));
//# sourceMappingURL=Player.js.map
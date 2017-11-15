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
    var Traps = (function (_super) {
        __extends(Traps, _super);
        function Traps(x, y, width, height) {
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.width = width;
            _this.height = height;
            _this.initBody({
                id: fly.FlyConfig.getPropertyId(),
                mass: 1,
                type: p2.Body.DYNAMIC,
                fixedRotation: true,
                position: [_this.x, _this.y]
            });
            _this.initShape(_this.width, _this.height);
            _this.setGroupAndMask(fly.ObjectGroup.Property, fly.ObjectMask.Property);
            _this.initBitmap();
            _this.updatePosition();
            return _this;
        }
        Traps.prototype.initBitmap = function () {
            var png = fly.FlyTools.createBitmapByName("mushroom_png");
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            png.scaleX = this.width / png.width;
            png.scaleY = this.height / png.height;
            this.addChild(png);
        };
        Traps.prototype.onTrigger = function () {
            this.isDestroy = true;
            this.objmgr.player.died(3);
        };
        return Traps;
    }(fly.FlyRect));
    fly.Traps = Traps;
    __reflect(Traps.prototype, "fly.Traps");
})(fly || (fly = {}));
//# sourceMappingURL=Traps.js.map
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
    var WeightTraps = (function (_super) {
        __extends(WeightTraps, _super);
        function WeightTraps(x, y, width, height, op) {
            var _this = _super.call(this) || this;
            _this.baseScale = 1.5;
            _this.x = x + width / 2;
            _this.y = y + height / 2;
            _this.width = width;
            _this.height = height;
            _this.min = op.min || 0;
            _this.max = op.max || 999;
            _this.initBody({
                id: fly.FlyConfig.getPropertyId(),
                mass: op.mass || 1,
                type: op.type || p2.Body.DYNAMIC,
                fixedRotation: true,
                position: [_this.x, _this.y],
                damping: op.damping || 0
            });
            _this.initShape(_this.width, _this.height);
            _this.setGroupAndMask(fly.ObjectGroup.Property, fly.ObjectMask.Property);
            _this.initBitmap(op.path);
            _this.updatePosition();
            _this.setRotation(op.rotation);
            return _this;
        }
        WeightTraps.prototype.initBitmap = function (path) {
            var png = fly.FlyTools.createBitmapByName(path);
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            png.scaleX = this.baseScale * this.width / png.width;
            png.scaleY = this.baseScale * this.height / png.height;
            this.addChild(png);
        };
        WeightTraps.prototype.onTrigger = function (pid) {
            var _this = this;
            this.objmgr.players.forEach(function (player) {
                if (player.body.id == pid) {
                    if (_this.min < player.body.mass && player.body.mass < _this.max) {
                        player.died(4);
                    }
                    return;
                }
            });
        };
        return WeightTraps;
    }(fly.FlyRect));
    fly.WeightTraps = WeightTraps;
    __reflect(WeightTraps.prototype, "fly.WeightTraps");
})(fly || (fly = {}));
//# sourceMappingURL=WeightTraps.js.map
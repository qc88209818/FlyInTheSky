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
    var Candy = (function (_super) {
        __extends(Candy, _super);
        function Candy(x, y, radius, op) {
            var _this = _super.call(this) || this;
            _this.x = x + radius;
            _this.y = y + radius;
            _this.radius = radius;
            _this.op = op;
            _this.initBody({
                id: fly.FlyConfig.getPropertyId(),
                mass: 1,
                type: p2.Body.DYNAMIC,
                fixedRotation: true,
                position: [_this.x, _this.y]
            });
            _this.initShape(_this.radius);
            _this.setGroupAndMask(fly.ObjectGroup.Property, fly.ObjectMask.Property);
            _this.initBitmap(op.path);
            _this.updatePosition();
            return _this;
        }
        Candy.prototype.initBitmap = function (path) {
            if (path == null)
                return;
            var png = fly.FlyTools.createBitmapByName(path);
            png.scaleX = 2 * this.radius / png.width;
            png.scaleY = 2 * this.radius / png.height;
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            this.addChild(png);
        };
        Candy.prototype.onTrigger = function (pid) {
            this.isDestroy = true;
            // delta后创建新的
            var delta = this.op.delta;
            if (delta > 0) {
                egret.setTimeout(function () {
                    var candy = new Candy(this.x, this.y, this.radius, this.op);
                    this.objmgr.scene.addToWorld(candy);
                }, this, delta * 1000);
            }
            // 减少能量
            var power = this.op.power;
            this.objmgr.players.forEach(function (value) {
                if (value.body.id == pid) {
                    value.addPower(power || fly.FlyParam.candy_power);
                    return;
                }
            });
        };
        return Candy;
    }(fly.FlyCircle));
    fly.Candy = Candy;
    __reflect(Candy.prototype, "fly.Candy");
})(fly || (fly = {}));
//# sourceMappingURL=Candy.js.map
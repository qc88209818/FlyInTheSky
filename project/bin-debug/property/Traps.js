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
        function Traps(x, y, width, height, op) {
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.width = width;
            _this.height = height;
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
        Traps.prototype.initBitmap = function (path) {
            var png = fly.FlyTools.createBitmapByName(path);
            png.scaleX = this.width / png.width;
            png.scaleY = this.height / png.height;
            this.addChild(png);
        };
        Traps.prototype.onTrigger = function (pid) {
            this.isDestroy = true;
            this.objmgr.players.forEach(function (player) {
                if (player.body.id == pid) {
                    player.died(3);
                    return;
                }
            });
        };
        return Traps;
    }(fly.FlyRect));
    fly.Traps = Traps;
    __reflect(Traps.prototype, "fly.Traps");
})(fly || (fly = {}));
//# sourceMappingURL=Traps.js.map
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
    var BlockCircle = (function (_super) {
        __extends(BlockCircle, _super);
        // 0:STATIC  1:DYNAMIC   2:KINEMATIC
        function BlockCircle(x, y, radius, type) {
            var _this = _super.call(this) || this;
            _this.x = x + radius;
            _this.y = y + radius;
            _this.radius = radius;
            _this.initBody({
                id: fly.FlyConfig.getBlockId(),
                mass: 1,
                type: type || p2.Body.STATIC,
                fixedRotation: true,
                position: [_this.x, _this.y]
            });
            _this.initShape(_this.radius);
            _this.setGroupAndMask(fly.ObjectGroup.Block, fly.ObjectMask.Block);
            _this.updatePosition();
            return _this;
        }
        BlockCircle.prototype.initBitmap = function (path) {
            var png = fly.FlyTools.createBitmapByName(path);
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            png.scaleX = 2 * this.radius / png.width;
            png.scaleY = 2 * this.radius / png.height;
            this.addChild(png);
        };
        return BlockCircle;
    }(fly.FlyCircle));
    fly.BlockCircle = BlockCircle;
    __reflect(BlockCircle.prototype, "fly.BlockCircle");
})(fly || (fly = {}));
//# sourceMappingURL=BlockCircle.js.map
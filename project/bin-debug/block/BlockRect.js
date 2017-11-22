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
    var BlockRect = (function (_super) {
        __extends(BlockRect, _super);
        // 0:STATIC  1:DYNAMIC   2:KINEMATIC
        function BlockRect(x, y, width, height, op) {
            var _this = _super.call(this) || this;
            _this.x = x + width / 2;
            _this.y = y + height / 2;
            _this.width = width;
            _this.height = height;
            _this.initBody({
                id: fly.FlyConfig.getBlockId(),
                mass: op.mass || 1,
                type: op.type || p2.Body.STATIC,
                fixedRotation: true,
                position: [_this.x, _this.y],
                damping: op.damping || 0
            });
            _this.initShape(_this.width, _this.height);
            _this.setGroupAndMask(fly.ObjectGroup.Block, fly.ObjectMask.Block);
            _this.initBitmap(op.path);
            _this.updatePosition();
            _this.setRotation(op.rotation);
            return _this;
        }
        BlockRect.prototype.initBitmap = function (path) {
            if (path == null)
                return;
            var png = fly.FlyTools.createBitmapByName(path);
            png.anchorOffsetX = png.width / 2;
            png.anchorOffsetY = png.height / 2;
            png.scaleX = this.width / png.width;
            png.scaleY = this.height / png.height;
            this.addChild(png);
        };
        return BlockRect;
    }(fly.FlyRect));
    fly.BlockRect = BlockRect;
    __reflect(BlockRect.prototype, "fly.BlockRect");
})(fly || (fly = {}));
//# sourceMappingURL=BlockRect.js.map
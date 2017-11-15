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
    var Wall = (function (_super) {
        __extends(Wall, _super);
        function Wall(x, y, width, height) {
            var _this = _super.call(this) || this;
            _this.x = x + width / 2;
            _this.y = y + height / 2;
            _this.width = width;
            _this.height = height;
            _this.initBody({
                id: fly.FlyConfig.getBlockId(),
                mass: 1,
                type: p2.Body.STATIC,
                fixedRotation: true,
                position: [_this.x, _this.y]
            });
            _this.initShape(_this.width, _this.height);
            _this.setGroupAndMask(fly.ObjectGroup.Block, fly.ObjectMask.Block);
            _this.initBitmap();
            _this.updatePosition();
            return _this;
        }
        Wall.prototype.initBitmap = function () {
            // let png = FlyTools.createBitmapByName("candy_png")
            // png.anchorOffsetX = png.width/2
            // png.anchorOffsetY = png.height/2
            // png.scaleX = 2 * this.radious/png.width
            // png.scaleY = 2 * this.radious/png.height
            // this.addChild(png)
        };
        return Wall;
    }(fly.FlyRect));
    fly.Wall = Wall;
    __reflect(Wall.prototype, "fly.Wall");
})(fly || (fly = {}));
//# sourceMappingURL=Wall.js.map
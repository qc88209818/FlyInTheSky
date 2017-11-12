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
    var FlyRect = (function (_super) {
        __extends(FlyRect, _super);
        function FlyRect() {
            return _super.call(this) || this;
        }
        FlyRect.prototype.initShape = function (width, height) {
            var shape = new p2.Box({
                width: width,
                height: height
            });
            this.shape = shape;
            this.body.addShape(shape);
            this.initRender(width, height);
        };
        FlyRect.prototype.initRender = function (width, height) {
            var color = fly.FlyTools.getBodyTypeColor(this.body.type);
            var shape = new egret.Shape();
            shape.graphics.beginFill(color, fly.FlyConfig.DebugMode ? 1 : 0);
            shape.graphics.drawRect(0, 0, width, height);
            shape.graphics.endFill();
            shape.anchorOffsetX = shape.width / 2;
            shape.anchorOffsetY = shape.height / 2;
            this.addChild(shape);
        };
        return FlyRect;
    }(fly.FlyObject));
    fly.FlyRect = FlyRect;
    __reflect(FlyRect.prototype, "fly.FlyRect");
})(fly || (fly = {}));
//# sourceMappingURL=FlyRect.js.map
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
    var FlyBlockRect = (function (_super) {
        __extends(FlyBlockRect, _super);
        function FlyBlockRect() {
            return _super.call(this) || this;
        }
        FlyBlockRect.prototype.initBlock = function (bodyType, x, y, width, height) {
            var obj = new p2.Body({
                type: bodyType,
                mass: 1,
                fixedRotation: true,
                position: [x, y]
            });
            this.body = obj;
            var obj2 = new p2.Box({
                width: width,
                height: height
            });
            this.shape = obj2;
            obj.addShape(obj2);
        };
        FlyBlockRect.prototype.initRender = function (width, height) {
            var shape = new egret.Shape();
            shape.graphics.beginFill(0xFF0000, fly.FlyConfig.DebugMode ? 1 : 0);
            shape.graphics.drawRect(0, 0, width, height);
            shape.graphics.endFill();
            shape.anchorOffsetX = shape.width / 2;
            shape.anchorOffsetY = shape.height / 2;
            this.body.displays = [shape];
            this.updatePosition();
        };
        return FlyBlockRect;
    }(fly.P2Object));
    fly.FlyBlockRect = FlyBlockRect;
    __reflect(FlyBlockRect.prototype, "fly.FlyBlockRect");
})(fly || (fly = {}));
//# sourceMappingURL=FlyBlockRect.js.map
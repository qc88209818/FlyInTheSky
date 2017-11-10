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
    var FlyCircle = (function (_super) {
        __extends(FlyCircle, _super);
        function FlyCircle() {
            return _super.call(this) || this;
        }
        FlyCircle.prototype.initBody = function (id, bodyType, x, y, radius) {
            this.bodyType = bodyType;
            var obj = new p2.Body({
                type: bodyType,
                id: id,
                mass: 1,
                fixedRotation: true,
                position: [x, y]
            });
            this.body = obj;
            var obj2 = new p2.Circle({
                radius: radius,
            });
            this.shape = obj2;
            obj.addShape(obj2);
        };
        FlyCircle.prototype.initRender = function (radious) {
            var color = fly.FlyTools.getBodyTypeColor(this.bodyType);
            var shape = new egret.Shape();
            shape.graphics.beginFill(color, fly.FlyConfig.DebugMode ? 1 : 0);
            shape.graphics.drawCircle(0, 0, radious);
            shape.graphics.endFill();
            _super.prototype.addChild.call(this, shape);
        };
        return FlyCircle;
    }(fly.FlyObject));
    fly.FlyCircle = FlyCircle;
    __reflect(FlyCircle.prototype, "fly.FlyCircle");
})(fly || (fly = {}));
//# sourceMappingURL=FlyCircle.js.map
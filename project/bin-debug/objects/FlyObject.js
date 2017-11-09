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
/**
* 物体基类
* @param x 左上角的 x 坐标。
* @param y 左上角的 y 坐标。
* @param type 物体的形状。
*/
var fly;
(function (fly) {
    var ObjectType;
    (function (ObjectType) {
        ObjectType[ObjectType["None"] = 0] = "None";
        ObjectType[ObjectType["Rect"] = 1] = "Rect";
        ObjectType[ObjectType["Circle"] = 2] = "Circle";
    })(ObjectType = fly.ObjectType || (fly.ObjectType = {}));
    ;
    var FlyConfig = (function () {
        function FlyConfig() {
        }
        return FlyConfig;
    }());
    fly.FlyConfig = FlyConfig;
    __reflect(FlyConfig.prototype, "fly.FlyConfig");
    var FlyObject = (function () {
        function FlyObject() {
            this.type = ObjectType.None;
        }
        return FlyObject;
    }());
    __reflect(FlyObject.prototype, "FlyObject");
    var P2Object = (function (_super) {
        __extends(P2Object, _super);
        function P2Object() {
            return _super.call(this) || this;
        }
        P2Object.prototype.updatePosition = function () {
            if (this.body) {
                for (var i = 0; i < this.body.displays.length; ++i) {
                    this.body.displays[i].x = this.body.position[0];
                    this.body.displays[i].y = this.body.position[1];
                }
                if (!fly.FlyConfig.DebugMode)
                    return;
                if (this.body.sleepState == p2.Body.SLEEPING) {
                    this.body.displays[0].alpha = 0.5;
                }
                else {
                    this.body.displays[0].alpha = 1;
                }
            }
        };
        return P2Object;
    }(FlyObject));
    fly.P2Object = P2Object;
    __reflect(P2Object.prototype, "fly.P2Object");
})(fly || (fly = {}));
//# sourceMappingURL=FlyObject.js.map
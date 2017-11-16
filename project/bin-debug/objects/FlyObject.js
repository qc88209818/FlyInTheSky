var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
* 物体基类
* @param x 左上角的 x 坐标。
* @param y 左上角的 y 坐标。
* @param type 物体的形状。
*/
var fly;
(function (fly) {
    var FlyObject = (function () {
        function FlyObject() {
            this.isDestroy = false;
            this.indexOf = -1;
            this.objmgr = fly.ObjectManager.inst();
        }
        FlyObject.prototype.initBody = function (bodyOp) {
            var body = new p2.Body(bodyOp);
            this.body = body;
        };
        FlyObject.prototype.updatePosition = function () {
            var _this = this;
            if (this.body) {
                this.body.displays.forEach(function (value) {
                    value.x = _this.body.position[0];
                    value.y = _this.body.position[1];
                });
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
        FlyObject.prototype.setGroupAndMask = function (group, mask) {
            if (this.shape) {
                this.shape.collisionGroup = group;
                this.shape.collisionMask = mask;
            }
        };
        FlyObject.prototype.addChild = function (child) {
            if (!this.body.displays) {
                this.body.displays = [];
            }
            this.body.displays.push(child);
        };
        FlyObject.prototype.onTrigger = function (pid) {
            console.log("FlyObject onTrigger: ", pid);
        };
        return FlyObject;
    }());
    fly.FlyObject = FlyObject;
    __reflect(FlyObject.prototype, "fly.FlyObject");
})(fly || (fly = {}));
//# sourceMappingURL=FlyObject.js.map
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var ObjectType;
    (function (ObjectType) {
        ObjectType[ObjectType["None"] = 0] = "None";
        ObjectType[ObjectType["Rect"] = 1] = "Rect";
        ObjectType[ObjectType["Circle"] = 2] = "Circle";
    })(ObjectType = fly.ObjectType || (fly.ObjectType = {}));
    ;
    var ObjectGroup;
    (function (ObjectGroup) {
        ObjectGroup[ObjectGroup["None"] = 0] = "None";
        ObjectGroup[ObjectGroup["Block"] = Math.pow(2, 0)] = "Block";
        ObjectGroup[ObjectGroup["Player"] = Math.pow(2, 1)] = "Player";
        ObjectGroup[ObjectGroup["Obstacle"] = Math.pow(2, 2)] = "Obstacle";
        ObjectGroup[ObjectGroup["Property"] = Math.pow(2, 3)] = "Property";
    })(ObjectGroup = fly.ObjectGroup || (fly.ObjectGroup = {}));
    ;
    var ObjectMask;
    (function (ObjectMask) {
        ObjectMask[ObjectMask["None"] = 0] = "None";
        ObjectMask[ObjectMask["Block"] = ObjectGroup.Block | ObjectGroup.Player] = "Block";
        ObjectMask[ObjectMask["Player"] = ObjectGroup.Player | ObjectGroup.Block] = "Player";
        ObjectMask[ObjectMask["Obstacle"] = 0] = "Obstacle";
        ObjectMask[ObjectMask["Property"] = 0] = "Property";
    })(ObjectMask = fly.ObjectMask || (fly.ObjectMask = {}));
    ;
    var FlyConfig = (function () {
        function FlyConfig() {
        }
        return FlyConfig;
    }());
    fly.FlyConfig = FlyConfig;
    __reflect(FlyConfig.prototype, "fly.FlyConfig");
})(fly || (fly = {}));
//# sourceMappingURL=FlyConfig.js.map
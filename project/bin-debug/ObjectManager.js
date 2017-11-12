var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var ObjectManager = (function () {
        function ObjectManager() {
            this.sprites = []; // 当前所有需要计算位置的精灵
        }
        ObjectManager.inst = function () {
            return this.obj;
        };
        ObjectManager.prototype.update = function (dt) {
            var length = this.sprites.length;
            for (var i = 0; i < length;) {
                if (!this.sprites[i].isDestroy) {
                    this.sprites[i].updatePosition();
                    ++i;
                }
                else {
                    console.log("Delete: ", this.sprites[i].body.id);
                    --length;
                    this.sprites[i].indexOf = -1;
                    this.sprites[i] = this.sprites[length];
                    this.sprites[i].indexOf = i;
                    this.sprites.pop();
                }
            }
        };
        ObjectManager.prototype.addSprite = function (obj) {
            obj.indexOf = this.sprites.length;
            this.sprites.push(obj);
        };
        ObjectManager.prototype.delSprite = function (obj) {
            obj.isDestroy = true;
        };
        ObjectManager.prototype.delSpriteImmediate = function (obj) {
            obj.isDestroy = true;
            var index = obj.indexOf;
            this.sprites[index] = this.sprites[this.sprites.length - 1];
            this.sprites[index].indexOf = index;
            this.sprites.pop();
            obj.indexOf = -1;
        };
        ObjectManager.obj = new ObjectManager();
        return ObjectManager;
    }());
    fly.ObjectManager = ObjectManager;
    __reflect(ObjectManager.prototype, "fly.ObjectManager");
})(fly || (fly = {}));
//# sourceMappingURL=ObjectManager.js.map
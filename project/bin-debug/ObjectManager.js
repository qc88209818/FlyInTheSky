var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var ObjectManager = (function () {
        function ObjectManager() {
            this.sprites = []; // 当前所有需要计算位置的精灵
            this.players = [];
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
                    --length;
                    this.sprites[i].indexOf = -1;
                    this.sprites[i] = this.sprites[length];
                    this.sprites[i].indexOf = i;
                    this.sprites.pop();
                }
            }
            var length2 = this.players.length;
            for (var i = 0; i < length2;) {
                if (!this.players[i].isDestroy) {
                    this.players[i].updatePosition();
                    ++i;
                }
                else {
                    --length2;
                    this.players[i].indexOf = -1;
                    this.players[i] = this.players[length2];
                    this.players[i].indexOf = i;
                    this.players.pop();
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
        ObjectManager.prototype.addPlayer = function (obj) {
            obj.indexOf = this.players.length;
            this.players.push(obj);
        };
        ObjectManager.prototype.delPlayer = function (obj) {
            obj.isDestroy = true;
        };
        ObjectManager.obj = new ObjectManager();
        return ObjectManager;
    }());
    fly.ObjectManager = ObjectManager;
    __reflect(ObjectManager.prototype, "fly.ObjectManager");
})(fly || (fly = {}));
//# sourceMappingURL=ObjectManager.js.map
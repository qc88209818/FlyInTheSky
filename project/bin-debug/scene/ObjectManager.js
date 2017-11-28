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
            if (!this.isInit) {
                this.obj.init();
                this.isInit = true;
            }
            return this.obj;
        };
        ObjectManager.prototype.init = function () {
            this.loadMoveClip();
        };
        ObjectManager.prototype.update = function (dt) {
            var length = this.sprites.length;
            for (var i = 0; i < length;) {
                if (!this.sprites[i].isDestroy) {
                    this.sprites[i].updatePosition(dt);
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
                    this.players[i].updatePosition(dt);
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
        ObjectManager.prototype.loadMoveClip = function () {
            var data = RES.getRes("playerNormalMode_json");
            var txtr = RES.getRes("playerNormalMode_png");
            var mcFactory = new egret.MovieClipDataFactory(data, txtr);
            this.mcFactory = mcFactory;
            var world = new p2.World();
            world.gravity = [0, 0];
            world.applyDamping = true;
            world.sleepMode = p2.World.BODY_SLEEPING;
            this.world = world;
        };
        ObjectManager.prototype.reset = function () {
            this.scene.reset();
            this.scene = null;
            this.sprites = [];
            this.players = [];
            this.world.clear();
            this.world.gravity = [0, 0];
            this.world.applyDamping = true;
            this.world.sleepMode = p2.World.BODY_SLEEPING;
        };
        ObjectManager.isInit = false;
        ObjectManager.obj = new ObjectManager();
        return ObjectManager;
    }());
    fly.ObjectManager = ObjectManager;
    __reflect(ObjectManager.prototype, "fly.ObjectManager");
})(fly || (fly = {}));
//# sourceMappingURL=ObjectManager.js.map
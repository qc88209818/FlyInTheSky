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
    var BattleScene = (function (_super) {
        __extends(BattleScene, _super);
        function BattleScene() {
            var _this = _super.call(this) || this;
            _this.objmgr = fly.ObjectManager.inst();
            _this.baseLayer = new egret.DisplayObjectContainer;
            _this.playerLayer = new egret.DisplayObjectContainer;
            _this.uiLayer = new egret.DisplayObjectContainer;
            _this.touchLayer = new egret.DisplayObjectContainer;
            _this.lastCreateCandy = 0;
            return _this;
        }
        BattleScene.prototype.update = function (dt) {
            if (this.touchNode.isTouchMove) {
                var direct = this.touchNode.direct;
                var forceScale = this.touchNode.forceScale;
                this.objmgr.player.body.applyForce([direct[0] * forceScale, direct[1] * forceScale], this.objmgr.player.body.position);
            }
            this.updateCreate(dt);
            this.objmgr.update(dt);
        };
        BattleScene.prototype.updateCreate = function (dt) {
            this.lastCreateCandy += dt;
            if (this.lastCreateCandy > 3) {
                var width = fly.FlyConfig.stageWidth * (Math.random() * 0.8 + 0.2);
                var height = fly.FlyConfig.stageHeight * (Math.random() * 0.8 + 0.2);
                var radious = 25 * (Math.random() + 1);
                var candy = new fly.Candy(width, height, radious);
                this.addToWorld(candy);
                this.lastCreateCandy = 0;
            }
        };
        BattleScene.prototype.initScene = function () {
            this.addChild(this.baseLayer);
            this.addChild(this.playerLayer);
            this.addChild(this.uiLayer);
            this.addChild(this.touchLayer);
            this.createWorld();
            this.createScene();
            this.createTouchLayer();
        };
        BattleScene.prototype.createWorld = function () {
            var world = new p2.World({
                gravity: [0, 0]
            });
            world.sleepMode = p2.World.BODY_SLEEPING;
            this.world = world;
            //添加帧事件侦听
            egret.Ticker.getInstance().register(function (dt) {
                //使世界时间向后运动
                world.step(dt / 1000);
                this.update(dt / 1000);
            }, this);
            world.on("postBroadphase", this.onPostBroadphase, this);
        };
        BattleScene.prototype.createScene = function () {
            var wall1 = new fly.Wall(0, 0, fly.FlyConfig.stageWidth, 10);
            var wall2 = new fly.Wall(0, 0, 10, fly.FlyConfig.stageHeight);
            var wall3 = new fly.Wall(fly.FlyConfig.stageWidth, fly.FlyConfig.stageHeight, fly.FlyConfig.stageWidth - 10, 0);
            var wall4 = new fly.Wall(fly.FlyConfig.stageWidth, fly.FlyConfig.stageHeight, 0, fly.FlyConfig.stageHeight - 10);
            this.addToWorld(wall1);
            this.addToWorld(wall2);
            this.addToWorld(wall3);
            this.addToWorld(wall4);
            var player = new fly.Player(fly.FlyConfig.stageWidth / 2, fly.FlyConfig.stageHeight / 2, 60);
            this.addPlayerToWorld(player);
            this.objmgr.player = player;
        };
        BattleScene.prototype.createTouchLayer = function () {
            var touchNode = new fly.BattleTouchNode(this, 150, 5);
            this.touchNode = touchNode;
            this.touchLayer.addChild(this.touchNode);
        };
        BattleScene.prototype.onPostBroadphase = function (event) {
            for (var i = 0; i < event.pairs.length; i += 2) {
                this.onContact(event.pairs[i], event.pairs[i + 1]);
            }
        };
        BattleScene.prototype.onContact = function (bodyA, bodyB) {
            if (fly.FlyConfig.isPlayer(bodyA.id) && fly.FlyConfig.isProperty(bodyB.id)) {
                this.triggerBody(bodyB.id);
            }
            else if (fly.FlyConfig.isPlayer(bodyB.id) && fly.FlyConfig.isProperty(bodyA.id)) {
                this.triggerBody(bodyA.id);
            }
        };
        BattleScene.prototype.triggerBody = function (id) {
            var _this = this;
            this.objmgr.sprites.forEach(function (value) {
                if (value.body.id == id) {
                    value.onTrigger();
                    if (value.isDestroy) {
                        _this.delFromWorld(value);
                    }
                    return;
                }
            });
        };
        BattleScene.prototype.addPlayerToWorld = function (obj) {
            var _this = this;
            this.world.addBody(obj.body);
            obj.body.displays.forEach(function (value) {
                _this.playerLayer.addChild(value);
            });
            this.objmgr.addSprite(obj);
        };
        BattleScene.prototype.addToWorld = function (obj) {
            var _this = this;
            this.world.addBody(obj.body);
            obj.body.displays.forEach(function (value) {
                _this.baseLayer.addChild(value);
            });
            this.objmgr.addSprite(obj);
        };
        BattleScene.prototype.delFromWorld = function (obj) {
            var _this = this;
            obj.body.displays.forEach(function (value) {
                _this.baseLayer.removeChild(value);
            });
            this.world.removeBody(obj.body);
        };
        return BattleScene;
    }(egret.DisplayObjectContainer));
    fly.BattleScene = BattleScene;
    __reflect(BattleScene.prototype, "fly.BattleScene");
})(fly || (fly = {}));
//# sourceMappingURL=BattleScene.js.map
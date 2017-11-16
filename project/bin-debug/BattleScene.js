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
            _this.uiLayer = new egret.DisplayObjectContainer;
            _this.touchLayer = new egret.DisplayObjectContainer;
            _this.lastPowerTime = 0;
            return _this;
        }
        BattleScene.prototype.update = function (dt) {
            if (this.touchNode.isTouchMove) {
                var direct = this.touchNode.direct;
                var forceScale = fly.FlyParam.forceScale;
                this.player.body.applyForce([direct[0] * forceScale, direct[1] * forceScale], this.player.body.position);
            }
            this.updatePower(dt);
            this.updateScene(dt);
            this.objmgr.update(dt);
        };
        BattleScene.prototype.getRandom = function () {
            var va = Math.random();
            if (va < 0.2) {
                va = -va * 4 - 0.2;
            }
            return va * 0.9;
        };
        BattleScene.prototype.updatePower = function (dt) {
            this.lastPowerTime += dt;
            if (this.lastPowerTime > 1) {
                this.objmgr.players.forEach(function (player) {
                    if (p2.vec2.length(player.body.velocity) > 10) {
                        player.changePower(player.power + fly.FlyParam.move_power);
                    }
                    else {
                        player.changePower(player.power + fly.FlyParam.move_power / 2);
                    }
                });
                this.lastPowerTime -= 1;
            }
        };
        BattleScene.prototype.updateScene = function (dt) {
            this.baseLayer.x = -this.player.body.position[0] * fly.FlyParam.LayerScale + fly.FlyConfig.stageWidth / 2;
            this.baseLayer.y = -this.player.body.position[1] * fly.FlyParam.LayerScale + fly.FlyConfig.stageHeight / 2;
        };
        BattleScene.prototype.initScene = function (tiledMapObjs) {
            this.tiledMapObjs = tiledMapObjs;
            this.addChild(this.baseLayer);
            this.addChild(this.uiLayer);
            this.addChild(this.touchLayer);
            this.baseLayer.scaleX = fly.FlyParam.LayerScale;
            this.baseLayer.scaleY = fly.FlyParam.LayerScale;
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
            var _this = this;
            this.objmgr.scene = this;
            this.tiledMapObjs.forEach(function (obj) {
                if (obj.type == "player") {
                    var player = new fly.Player(obj.x, obj.y, obj.width);
                    _this.addPlayerToWorld(player);
                    if (obj.name == "self") {
                        player.setVisible(true);
                        _this.player = player;
                    }
                }
                else if (obj.type == "wall") {
                    var wall = new fly.Wall(obj.x, obj.y, obj.width, obj.height);
                    _this.addToWorld(wall);
                }
                else if (obj.type == "candy") {
                    var candy = new fly.Candy(obj.x, obj.y, obj.width);
                    _this.addToWorld(candy);
                    candy.setDelta(Number(obj.params["delta"]));
                }
            });
        };
        BattleScene.prototype.createTouchLayer = function () {
            var touchNode = new fly.BattleTouchNode(this, 150);
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
                this.triggerBody(bodyB.id, bodyA.id);
            }
            else if (fly.FlyConfig.isPlayer(bodyB.id) && fly.FlyConfig.isProperty(bodyA.id)) {
                this.triggerBody(bodyA.id, bodyB.id);
            }
        };
        BattleScene.prototype.triggerBody = function (id, pid) {
            var _this = this;
            this.objmgr.sprites.forEach(function (value) {
                if (value.body.id == id) {
                    value.onTrigger(pid);
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
                _this.baseLayer.addChild(value);
            });
            this.objmgr.addPlayer(obj);
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
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var fly;
(function (fly) {
    var BattleSceneFactory = (function () {
        function BattleSceneFactory() {
        }
        BattleSceneFactory.createObject = function (scene, obj) {
            if (obj.type == "player") {
                var player = new fly.Player(obj.x, obj.y, obj.width / 2);
                scene.addPlayerToWorld(player);
                if (obj.name == "self") {
                    player.setVisible(true);
                    scene.player = player;
                }
            }
            else if (obj.type == "wall") {
                var wall = new fly.Wall(obj.x, obj.y, obj.width, obj.height);
                scene.addToWorld(wall);
            }
            else if (obj.type == "blockrect") {
                var block = new fly.BlockRect(obj.x, obj.y, obj.width, obj.height, {
                    path: obj.params["path"],
                    type: Number(obj.params["type"]),
                    mass: Number(obj.params["mass"]),
                    damping: Number(obj.params["damping"]),
                    rotation: Number(obj.params["rotation"])
                });
                scene.addToWorld(block);
            }
            else if (obj.type == "blockcircle") {
                var block = new fly.BlockCircle(obj.x, obj.y, obj.width / 2, {
                    path: obj.params["path"],
                    type: Number(obj.params["type"]),
                    mass: Number(obj.params["mass"]),
                    damping: Number(obj.params["damping"]),
                    rotation: Number(obj.params["rotation"])
                });
                scene.addToWorld(block);
            }
            else if (obj.type == "candy") {
                var candy = new fly.Candy(obj.x, obj.y, obj.width / 2, {
                    path: obj.params["path"],
                    type: Number(obj.params["type"]),
                    rotation: Number(obj.params["rotation"]),
                    delta: Number(obj.params["delta"]),
                    power: Number(obj.params["power"])
                });
                scene.addToWorld(candy);
            }
            else if (obj.type == "traps") {
                var traps = new fly.Traps(obj.x, obj.y, obj.width, obj.height, {
                    path: obj.params["path"],
                    type: Number(obj.params["type"]),
                    rotation: Number(obj.params["rotation"])
                });
                scene.addToWorld(traps);
            }
            else if (obj.type == "weighttraps") {
                var traps = new fly.WeightTraps(obj.x, obj.y, obj.width, obj.height, {
                    path: obj.params["path"],
                    type: Number(obj.params["type"]),
                    rotation: Number(obj.params["rotation"]),
                    min: Number(obj.params["min"]),
                    max: Number(obj.params["max"])
                });
                scene.addToWorld(traps);
            }
            else if (obj.type == "weightblock") {
                var block = new fly.WeightBlock(obj.x, obj.y, obj.width, obj.height, {
                    path: obj.params["path"],
                    type: Number(obj.params["type"]),
                    rotation: Number(obj.params["rotation"]),
                    min: Number(obj.params["min"]),
                    max: Number(obj.params["max"])
                });
                scene.addToWorld(block);
            }
        };
        return BattleSceneFactory;
    }());
    fly.BattleSceneFactory = BattleSceneFactory;
    __reflect(BattleSceneFactory.prototype, "fly.BattleSceneFactory");
})(fly || (fly = {}));
//# sourceMappingURL=BattleSceneFactory.js.map
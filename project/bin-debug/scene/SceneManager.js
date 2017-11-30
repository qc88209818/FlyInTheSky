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
    var SceneManager = (function (_super) {
        __extends(SceneManager, _super);
        function SceneManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._mapId = 0;
            _this._maxId = 5;
            _this._tiledMapObjs = [];
            _this.soundName = "";
            _this.health = 1;
            _this.reasons = ["恭喜过关！", "你饿死了！", "你胖死了！", "你被陷阱杀死了！", "你太胖，摔死了！", "你被AI抓到了！"];
            return _this;
        }
        SceneManager.inst = function () {
            return this.scenemgr;
        };
        SceneManager.prototype.init = function (parent, width, height) {
            this._parent = parent;
            this._width = width;
            this._height = height;
            this.createMusicAndSound();
        };
        SceneManager.prototype.getMapId = function () {
            return this._mapId;
        };
        SceneManager.prototype.load = function (mapId) {
            this.loadTiledMap(mapId);
        };
        SceneManager.prototype.loadNext = function () {
            this.reset();
            if (this._mapId + 1 <= this._maxId) {
                this.loadTiledMap(this._mapId + 1);
            }
            else {
                console.log("You Win!");
            }
        };
        SceneManager.prototype.loadAgain = function (reason) {
            this.health -= 1;
            this.reset();
            this.loadNow();
        };
        SceneManager.prototype.loadNow = function () {
            var battlescene = new fly.BattleScene();
            battlescene.initScene(this._tiledMapObjs);
            this._parent.addChild(battlescene);
            this.playMusic("bgm" + this._mapId + ".mp3");
        };
        SceneManager.prototype.loadTiledMap = function (mapId) {
            this._mapId = mapId;
            /*初始化资源加载路径*/
            this._url = "resource/map/battle" + mapId + ".tmx";
            /*初始化请求*/
            this._request = new egret.HttpRequest();
            /*监听资源加载完成事件*/
            this._request.addEventListener(egret.Event.COMPLETE, this.onMapComplete, this);
            this._request.addEventListener(egret.ProgressEvent.PROGRESS, this.onMapProgress, this);
            /*发送请求*/
            this._request.open(this._url, egret.HttpMethod.GET);
            this._request.send();
            if (this._loadingView == null) {
                this._loadingView = new UILoading();
            }
            this._loadingView.x = this._parent.stage.stageWidth / 2 - 200;
            this._loadingView.y = this._parent.stage.stageHeight / 2;
            this._loadingView.scaleX = 2;
            this._loadingView.scaleY = 2;
            this._parent.addChild(this._loadingView);
        };
        /**加载进度 */
        SceneManager.prototype.onMapProgress = function (event) {
            this._loadingView.setProgress(event.bytesLoaded, event.bytesTotal);
        };
        /*地图加载完成*/
        SceneManager.prototype.onMapComplete = function (event) {
            this._request.removeEventListener(egret.Event.COMPLETE, this.onMapComplete, this);
            this._request.removeEventListener(egret.ProgressEvent.PROGRESS, this.onMapProgress, this);
            /*获取到地图数据*/
            var data = egret.XML.parse(event.currentTarget.response);
            // 初始化一些有用参数
            fly.FlyConfig.width = data["$width"] * data["$tilewidth"];
            fly.FlyConfig.height = data["$height"] * data["$tileheight"];
            fly.FlyConfig.stageWidth = this._width;
            fly.FlyConfig.stageHeight = this._height;
            // 初始化TiledMap Object
            var tiledMapObjs = [];
            data.children.forEach(function (group) {
                var groups = new fly.TiledMapGroup();
                var groupxml = group;
                groupxml.children.forEach(function (object) {
                    var objectxml = object;
                    if (objectxml.localName == "object") {
                        var tmObj_1 = new fly.TiledMapObject();
                        tmObj_1.name = objectxml["$name"];
                        tmObj_1.type = objectxml["$type"];
                        tmObj_1.x = Number(objectxml["$x"]);
                        tmObj_1.y = Number(objectxml["$y"]);
                        tmObj_1.width = Number(objectxml["$width"]);
                        tmObj_1.height = Number(objectxml["$height"]);
                        // properties
                        objectxml.children.forEach(function (properties) {
                            var propertiesxml = properties;
                            propertiesxml.children.forEach(function (property) {
                                tmObj_1.params[property["$name"]] = property["$value"];
                            });
                        });
                        groups.push(tmObj_1);
                    }
                    else if (objectxml.localName == "properties") {
                        // properties
                        objectxml.children.forEach(function (properties) {
                            var propertiesxml = properties;
                            if (propertiesxml["$name"] == "type") {
                                groups.isArray = (propertiesxml["$value"] == "candy_array");
                            }
                            else if (propertiesxml["$name"] == "num") {
                                groups.num = Number(propertiesxml["$value"] || 0);
                            }
                        });
                    }
                });
                tiledMapObjs.push(groups);
            });
            this._parent.removeChild(this._loadingView);
            this._tiledMapObjs = tiledMapObjs;
            this.loadNow();
        };
        SceneManager.prototype.createMusicAndSound = function () {
            var music = new fly.FlyMusic();
            this.music = music;
            var sound = new fly.FlyMusic();
            this.sound = sound;
        };
        SceneManager.prototype.playSound = function (name, time) {
            if (time === void 0) { time = 0; }
            this.sound.playObject(name, time);
            if (time == 0) {
                this.soundName = name;
            }
        };
        SceneManager.prototype.stopSound = function (name) {
            if (this.soundName == name) {
                this.sound.stop();
                this.soundName = "";
            }
        };
        SceneManager.prototype.playMusic = function (name) {
            this.music.playObject(name);
        };
        SceneManager.prototype.isRunningSound = function (name) {
            return this.soundName == name;
        };
        SceneManager.prototype.reset = function () {
            this._parent.removeChildren();
            this.music.stop();
            this.sound.stop();
        };
        SceneManager.prototype.createMovie = function (reason) {
            // let objmgr = ObjectManager.inst()
            // // 死亡动画
            // let png = new egret.MovieClip(objmgr.dieFactory.generateMovieClipData("playerDie"));
            // png.gotoAndPlay("die"+reason, 1)
            // png.anchorOffsetX = png.width/2
            // png.anchorOffsetY = png.height/2
            // png.x = FlyConfig.stageWidth/2
            // png.y = FlyConfig.stageHeight/2
            // png.scaleX = 2
            // png.scaleY = 2
            // this._parent.addChild(png)
            // // 原因
            // var text:egret.TextField = new egret.TextField()
            // text.text = this.reasons[reason]
            // text.size = 48
            // text.textColor = 0x000000
            // text.anchorOffsetX = text.width/2
            // text.anchorOffsetY = text.height/2
            // text.x = FlyConfig.stageWidth/2
            // text.y = FlyConfig.stageHeight/2 - png.height*2
            // this._parent.addChild(text);
            // if (reason > 0)
            // {
            // 	egret.setTimeout(function () {
            // 		// 图标
            // 		let icon = new egret.MovieClip(objmgr.mcFactory.generateMovieClipData("playerState"));
            // 		icon.gotoAndPlay("front_move_normal", -1)
            // 		icon.anchorOffsetX = icon.width/2
            // 		icon.anchorOffsetY = icon.height/2
            // 		icon.x = FlyConfig.stageWidth/2 - png.width
            // 		icon.y = FlyConfig.stageHeight/2 + png.height*2 + 100
            // 		this._parent.addChild(icon)
            // 		// 生命
            // 		var text:egret.TextField = new egret.TextField()
            // 		text.text = "x " + this.health
            // 		text.size = 96
            // 		text.textColor = 0x000000
            // 		text.anchorOffsetX = text.width/2
            // 		text.anchorOffsetY = text.height/2
            // 		text.x = FlyConfig.stageWidth/2 + 50
            // 		text.y = FlyConfig.stageHeight/2 + png.height*2 + 120
            // 		this._parent.addChild(text);
            // 	}, this, 3000);
            // }
        };
        SceneManager.scenemgr = new SceneManager();
        return SceneManager;
    }(egret.DisplayObject));
    fly.SceneManager = SceneManager;
    __reflect(SceneManager.prototype, "fly.SceneManager");
})(fly || (fly = {}));
//# sourceMappingURL=SceneManager.js.map
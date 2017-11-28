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
            _this.loadingView = null;
            return _this;
        }
        SceneManager.inst = function () {
            return this.obj;
        };
        SceneManager.prototype.init = function (parent, width, height) {
            this._parent = parent;
            this._width = width;
            this._height = height;
            this.createMusic();
        };
        SceneManager.prototype.getMapId = function () {
            return this._mapId;
        };
        SceneManager.prototype.load = function (mapId) {
            this.loadTiledMap(mapId);
        };
        SceneManager.prototype.loadNext = function () {
            this.music.playVictory();
            // 延迟3秒后，切换场景
            egret.setTimeout(function () {
                this.reset();
                if (this._mapId + 1 <= this._maxId) {
                    this.loadTiledMap(this._mapId + 1);
                }
                else {
                    console.log("You Win!");
                }
            }, this, 3000);
        };
        SceneManager.prototype.loadAgain = function () {
            this.reset();
            this.loadTiledMap(this._mapId);
        };
        SceneManager.prototype.loadTiledMap = function (mapId) {
            this._mapId = mapId;
            /*初始化资源加载路径*/
            this.url = "resource/map/battle" + mapId + ".tmx";
            /*初始化请求*/
            this.request = new egret.HttpRequest();
            /*监听资源加载完成事件*/
            this.request.addEventListener(egret.Event.COMPLETE, this.onMapComplete, this);
            this.request.addEventListener(egret.ProgressEvent.PROGRESS, this.onMapProgress, this);
            /*发送请求*/
            this.request.open(this.url, egret.HttpMethod.GET);
            this.request.send();
            if (this.loadingView == null) {
                this.loadingView = new UILoading();
            }
            this.loadingView.x = this._parent.stage.stageWidth / 2 - 200;
            this.loadingView.y = this._parent.stage.stageHeight / 2;
            this.loadingView.scaleX = 2;
            this.loadingView.scaleY = 2;
            this._parent.addChild(this.loadingView);
        };
        /**加载进度 */
        SceneManager.prototype.onMapProgress = function (event) {
            this.loadingView.setProgress(event.bytesLoaded, event.bytesTotal);
        };
        /*地图加载完成*/
        SceneManager.prototype.onMapComplete = function (event) {
            this.request.removeEventListener(egret.Event.COMPLETE, this.onMapComplete, this);
            this.request.removeEventListener(egret.ProgressEvent.PROGRESS, this.onMapProgress, this);
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
            this._parent.removeChild(this.loadingView);
            var battlescene = new fly.BattleScene();
            battlescene.initScene(tiledMapObjs);
            this._parent.addChild(battlescene);
            this.music.playBgm(this._mapId);
        };
        SceneManager.prototype.createMusic = function () {
            var music = new fly.FlyMusic();
            this.music = music;
        };
        SceneManager.prototype.reset = function () {
            this._parent.removeChildren();
            this.music.stop();
            fly.FlyConfig.reset();
        };
        SceneManager.obj = new SceneManager();
        return SceneManager;
    }(egret.DisplayObject));
    fly.SceneManager = SceneManager;
    __reflect(SceneManager.prototype, "fly.SceneManager");
})(fly || (fly = {}));
//# sourceMappingURL=SceneManager.js.map
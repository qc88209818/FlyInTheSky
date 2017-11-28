module fly {
	export class SceneManager extends egret.DisplayObject {
		private url:string
		private request:egret.HttpRequest
		private icon:egret.Shape
		private music:FlyMusic

		private _width:number
		private _height:number
		private _mapId:number = 0
		private _maxId:number = 5

		private _parent:egret.DisplayObjectContainer
		
		static obj:SceneManager = new SceneManager()

		private loadingView:UILoading = null;

		public static inst(): SceneManager
		{
			return this.obj
		}

		public init(parent:egret.DisplayObjectContainer, width:number, height:number)
		{
			this._parent = parent
			this._width = width
			this._height = height

			this.createMusic()
		}

		public getMapId()
		{
			return this._mapId
		}

		public load(mapId:number)
		{
			this.loadTiledMap(mapId)
		}

		public loadNext()
		{
			this.music.playVictory()    
			// 延迟3秒后，切换场景
			egret.setTimeout(function () {    
				this.reset()
				if (this._mapId + 1 <= this._maxId)
				{
					this.loadTiledMap(this._mapId + 1)
				}
				else
				{
					console.log("You Win!")
				} 
			}, this, 3000); 
		}

		public loadAgain()
		{
			this.reset()
			this.loadTiledMap(this._mapId)
		}

		private loadTiledMap(mapId:number)
		{
			this._mapId = mapId
			
			/*初始化资源加载路径*/
			this.url = "resource/map/battle" + mapId + ".tmx"; 
			/*初始化请求*/
			this.request = new egret.HttpRequest();
			/*监听资源加载完成事件*/
			this.request.addEventListener(egret.Event.COMPLETE, this.onMapComplete,this);
			this.request.addEventListener(egret.ProgressEvent.PROGRESS,this.onMapProgress,this);
			/*发送请求*/
			this.request.open(this.url,egret.HttpMethod.GET);
			this.request.send();
			if(this.loadingView == null){
				this.loadingView = new UILoading();
			}
			this.loadingView.x = this._parent.stage.stageWidth/2-200;
        	this.loadingView.y = this._parent.stage.stageHeight/2;
        	this.loadingView.scaleX = 2;
        	this.loadingView.scaleY = 2;
        	this._parent.addChild(this.loadingView);
		}
		
		/**加载进度 */
		private onMapProgress(event:egret.ProgressEvent){
			this.loadingView.setProgress(event.bytesLoaded, event.bytesTotal);
		}
		/*地图加载完成*/
		private onMapComplete(event:egret.Event) {
			this.request.removeEventListener(egret.Event.COMPLETE, this.onMapComplete,this);
			this.request.removeEventListener(egret.ProgressEvent.PROGRESS,this.onMapProgress,this);
			/*获取到地图数据*/
			let data = egret.XML.parse(event.currentTarget.response);

			// 初始化一些有用参数
			fly.FlyConfig.width = data["$width"]*data["$tilewidth"]
			fly.FlyConfig.height = data["$height"]*data["$tileheight"]
			fly.FlyConfig.stageWidth = this._width
			fly.FlyConfig.stageHeight = this._height

			// 初始化TiledMap Object
			let tiledMapObjs = []
			data.children.forEach(group => {
				let groups = new TiledMapGroup()
				let groupxml = <egret.XML><any>group
				groupxml.children.forEach(object => {
					let objectxml = <egret.XML><any>object
					if (objectxml.localName == "object")
					{
						let tmObj = new TiledMapObject()
						tmObj.name = objectxml["$name"]
						tmObj.type = objectxml["$type"]
						tmObj.x = Number(objectxml["$x"])
						tmObj.y = Number(objectxml["$y"])
						tmObj.width = Number(objectxml["$width"])
						tmObj.height = Number(objectxml["$height"])

						// properties
						objectxml.children.forEach(properties => {
							let propertiesxml = <egret.XML><any>properties
							propertiesxml.children.forEach(property => {
								tmObj.params[property["$name"]] = property["$value"]
							})
						})

						groups.push(tmObj)
					}     
					else if (objectxml.localName == "properties")
					{
						// properties
						objectxml.children.forEach(properties => {
							let propertiesxml = <egret.XML><any>properties
							if (propertiesxml["$name"] == "type")
							{
								groups.isArray = (propertiesxml["$value"] == "candy_array")
							}
							else if (propertiesxml["$name"] == "num")
							{
								groups.num = Number(propertiesxml["$value"] || 0)
							}
						})
					} 
				})

				tiledMapObjs.push(groups)
			})
			this._parent.removeChild(this.loadingView);
			let battlescene = new BattleScene()
			battlescene.initScene(tiledMapObjs)
			this._parent.addChild(battlescene)

			this.music.playBgm(this._mapId)
		}

		private createMusic()
		{
			let music = new FlyMusic()
			this.music = music
		}

		public reset()
		{
			this._parent.removeChildren()
			
			this.music.stop()
			FlyConfig.reset()
		}
	}
}
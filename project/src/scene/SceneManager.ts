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
			this.request.once(egret.Event.COMPLETE, this.onMapComplete,this);
			/*发送请求*/
			this.request.open(this.url,egret.HttpMethod.GET);
			this.request.send();
		}

		/*地图加载完成*/
		private onMapComplete(event:egret.Event) {
			/*获取到地图数据*/
			let data = egret.XML.parse(event.currentTarget.response);

			// 初始化一些有用参数
			fly.FlyConfig.width = data["$width"]*data["$tilewidth"]
			fly.FlyConfig.height = data["$height"]*data["$tileheight"]
			fly.FlyConfig.stageWidth = this._width
			fly.FlyConfig.stageHeight = this._height

			let tiledMapObjs = []
			// 初始化TiledMap Object
			data.children.forEach(group => {
				let groupxml = <egret.XML><any>group
				groupxml.children.forEach(object => {
					let objectxml = <egret.XML><any>object
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

					tiledMapObjs.push(tmObj)         
				})
			})

			let battlescene = new BattleScene()
			battlescene.initScene(tiledMapObjs)
			this._parent.addChild(battlescene)

			this.music.playBgm(1)
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
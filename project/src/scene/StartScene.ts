module fly {
	export class StartScene {
		private url:string
		private request:egret.HttpRequest
		private icon:egret.Shape

		private width:number
		private height:number
		private parent:egret.DisplayObjectContainer
		
		public constructor() {
			
		}

		public initScene(parent:egret.DisplayObjectContainer, width:number, height:number)
		{
			this.parent = parent
			this.width = width
			this.height = height

			this.loadTiledMap()
		}

		private loadTiledMap()
		{
			/*初始化资源加载路径*/
			this.url = "resource/map/battle1.tmx"; 
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
			fly.FlyConfig.stageWidth = this.width
			fly.FlyConfig.stageHeight = this.height

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
					tmObj.width = Number(objectxml["$width"]*1.0)
					tmObj.height = Number(objectxml["$height"]*1.0)

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
			this.parent.addChild(battlescene)
		}
	}
}
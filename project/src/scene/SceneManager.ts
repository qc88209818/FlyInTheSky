module fly {
	export class SceneManager extends egret.DisplayObject {
		private _url:string
		private _request:egret.HttpRequest
		private _loadingView:UILoading;
		private _parent:egret.DisplayObjectContainer

		private _width:number
		private _height:number
		private _mapId:number = 0
		private _maxId:number = 5
		private _tiledMapObjs:TiledMapGroup[] = []

		music:FlyMusic		// 音乐
		sound:FlyMusic 		// 音效
		soundName:string = ""

		health:number = 1
		reasons:string[] = ["恭喜过关！", "你饿死了！", "你胖死了！", "你被陷阱杀死了！", "你太胖，摔死了！", "你被AI抓到了！"]

		static scenemgr:SceneManager = new SceneManager()
		public static inst(): SceneManager
		{
			return this.scenemgr
		}

		public init(parent:egret.DisplayObjectContainer, width:number, height:number)
		{
			this._parent = parent
			this._width = width
			this._height = height

			this.createMusicAndSound()
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
			this.reset()
			if (this._mapId + 1 <= this._maxId)
			{
				this.loadTiledMap(this._mapId + 1)
			}
			else
			{
				console.log("You Win!")
			}
		}

		public loadAgain(reason:number)
		{
			this.health -= 1

			this.reset()

			this.loadNow()
		}

		private loadNow()
		{
			let battlescene = new BattleScene()
			battlescene.initScene(this._tiledMapObjs)
			this._parent.addChild(battlescene)

			this.playMusic("bgm" + this._mapId + ".mp3")
		}

		private loadTiledMap(mapId:number)
		{
			this._mapId = mapId
			
			/*初始化资源加载路径*/
			this._url = "resource/map/battle" + mapId + ".tmx"; 
			/*初始化请求*/
			this._request = new egret.HttpRequest();
			/*监听资源加载完成事件*/
			this._request.addEventListener(egret.Event.COMPLETE, this.onMapComplete,this);
			this._request.addEventListener(egret.ProgressEvent.PROGRESS,this.onMapProgress,this);
			/*发送请求*/
			this._request.open(this._url,egret.HttpMethod.GET);
			this._request.send();

			if(this._loadingView == null){
				this._loadingView = new UILoading();
			}
			this._loadingView.x = this._parent.stage.stageWidth/2-200;
        	this._loadingView.y = this._parent.stage.stageHeight/2;
        	this._loadingView.scaleX = 2;
        	this._loadingView.scaleY = 2;
        	this._parent.addChild(this._loadingView);
		}
		
		/**加载进度 */
		private onMapProgress(event:egret.ProgressEvent){
			this._loadingView.setProgress(event.bytesLoaded, event.bytesTotal);
		}

		/*地图加载完成*/
		private onMapComplete(event:egret.Event) {
			this._request.removeEventListener(egret.Event.COMPLETE, this.onMapComplete,this);
			this._request.removeEventListener(egret.ProgressEvent.PROGRESS,this.onMapProgress,this);
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

			this._parent.removeChild(this._loadingView)
			this._tiledMapObjs = tiledMapObjs
			this.loadNow()
		}

		private createMusicAndSound()
		{
			let music = new FlyMusic()
			this.music = music

			let sound = new FlyMusic()
			this.sound = sound
		}

		public playSound(name:string, time:number = 0)
		{
			this.sound.playObject(name, time)
			if (time == 0)
			{
				this.soundName = name
			}
		}

		public stopSound(name:string)
		{
			if (this.soundName == name)
			{
				this.sound.stop()
				this.soundName = ""
			}
		}

		public playMusic(name:string)
		{
			this.music.playObject(name)
		}

		public isRunningSound(name:string)
		{
			return this.soundName == name
		}

		public reset()
		{
			this._parent.removeChildren()
			this.music.stop()
			this.sound.stop()
		}

		public createMovie(reason:number)
		{
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

		}
	}
}
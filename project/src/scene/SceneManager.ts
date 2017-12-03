module fly {
	export class SceneManager extends egret.DisplayObject {
		private _url:string
		private _request:egret.HttpRequest
		private _loadingView:UILoading;
		private _passScene:PassScene
		private _parent:egret.DisplayObjectContainer

		private _width:number
		private _height:number
		private _mapId:number = 0
		private _maxId:number = 5
		private _tiledMapObjs:TiledMapGroup[] = []

		music:FlyMusic		// 音乐
		sound:FlyMusic 		// 音效
		soundObj:any

		health:number

		times:number[] = []	// 最短时间	
		lastTime:number 	// 本次时间

		static scenemgr:SceneManager = new SceneManager()
		public static inst(): SceneManager
		{
			return this.scenemgr
		}

		public init(parent:egret.DisplayObjectContainer)
		{
			this._parent = parent
			this.health = 2

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
			if (this._mapId + 1 < this._maxId)
			{
				this.createPassScene(0)
			}
			else
			{
				this.createPassScene(-1)
			}
		}

		public loadAgain(reason:number)
		{
			this.health -= 1
			this.reset()
			this.createPassScene(reason)
		}

		private loadNow()
		{
			let battlescene = new BattleScene()
        	battlescene.y = fly.FlyConfig.deltaHeight
			battlescene.initScene(this._tiledMapObjs)
			this._parent.addChild(battlescene)

			this.playMusic("bgm" + this._mapId + ".mp3")
		}

		public onClickBtn(reason:number)
		{
			if (this._passScene)
			{
				this._parent.removeChild(this._passScene)
				this._passScene = null
			}

			if (reason > 0)
			{
				this.loadNow()
			}
			else if (reason == 0)
			{
				this.loadTiledMap(this._mapId + 1)
			}
			else
			{
				this.reset()

				let enterGameScene = new fly.EnterGameScene();
        		enterGameScene.y = fly.FlyConfig.deltaHeight
				this._parent.addChild(enterGameScene);
			}
		}

		public onClickShare()
		{
			this._passScene.erweima.visible = true
			this._passScene.enterGameBtn.visible = false
			this._passScene.shareGameBtn.visible = false

			let rt:egret.RenderTexture = new egret.RenderTexture;
			let rect = new egret.Rectangle(0, 0, FlyConfig.stageWidth, FlyConfig.stageHeight)
			rt.drawToTexture(this._passScene, rect);
			// rt.saveToFile("image/png", "share.png", rect);

			let divImage = document.getElementById("divImage");//获取DIV
			let shareImage: HTMLImageElement = document.getElementById("shareImage") as HTMLImageElement;//获取Image标签
			shareImage.src = rt.toDataURL('image/png');//把数据赋值给Image
			divImage.style.display = "block";//显示DIV

			this._passScene.erweima.visible = false
			this._passScene.enterGameBtn.visible = true
			this._passScene.shareGameBtn.visible = true
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

		public playSound(name:string, obj:any, time:number = 0)
		{
			if (this.soundObj == null)
			{
				this.sound.playObject(name, time)
				this.soundObj = obj
			}
		}

		public stopSound(name:string, obj:any)
		{
			if (this.soundObj == obj)
			{
				this.sound.stop()
				this.soundObj = null
			}
		}

		public stopAllSound()
		{
			this.music.stop()
			this.sound.stop()
			this.soundObj = null
		}

		public playMusic(name:string, time:number = 0)
		{
			this.music.playObject(name, time)
		}

		public reset()
		{
			this._parent.removeChildren()
			this.music.stop()
			this.sound.stop()
			this.soundObj = null
		}

		public createPassScene(reason:number)
		{
			let scene = new PassScene()
			scene.initScene(reason, this)
        	scene.y = fly.FlyConfig.deltaHeight
			this._parent.addChild(scene)
			this._passScene = scene
		}

		public setPassTime(time:number, reason:number)
		{
			this.lastTime = time
			if (reason <= 0 && this.times.length < this._mapId)
			{
				this.times.push(time)
			}
			else if(reason <= 0 && this.times[this._mapId-1] > time )
			{
				this.times[this._mapId-1] = time
			}
		}

		public getLastTime()
		{
			return this.lastTime
		}

		public getPassTime()
		{
			return this.times[this._mapId-1]
		}

		public getPassTimeAll()
		{
			let time = 0
			this.times.forEach(value => {
				time += value
			})
			return time
		}
	}
}
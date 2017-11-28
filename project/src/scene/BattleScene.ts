module fly {
	export class BattleScene extends egret.DisplayObjectContainer {
		world:p2.World
		touchNode:BattleTouchNode
		progress:UIProgress
		tiledMapObjs:TiledMapObject[]

		objmgr:ObjectManager = ObjectManager.inst()
		player:Player

		baseLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer
		playerLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer
		uiLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer
		touchLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer
		text:egret.TextField

		public constructor() {
			super()
		}

		public update(dt)
		{
			if (this.touchNode.isTouchMove)
			{
				let normal = this.touchNode.normal
				let forceScale = FlyParam.forceScale
				this.player.setVelocity(normal[0]*forceScale, normal[1]*forceScale)
			}
			else
			{
				this.player.setVelocity(0, 0)
			}

			this.updatePower(dt)
			this.updateScene(dt)
			this.objmgr.update(dt)
		}

		private getRandom(): number
		{
			let va = Math.random()
			if (va < 0.2)
			{
				va = - va*4 - 0.2;
			}
			return va*0.9
		}
		
		lastPowerTime:number = 0
		private updatePower(dt:number)
		{
			this.lastPowerTime += dt
			if (this.lastPowerTime > 1)
			{
				this.objmgr.players.forEach(player => {
					player.changePower(player.power + FlyParam.move_power)
				})
				this.lastPowerTime -= 1
			}
		}

		private updateScene(dt:number)
		{
			this.baseLayer.x = -this.player.body.position[0]*FlyParam.LayerScale + FlyConfig.stageWidth/2
			this.baseLayer.y = -this.player.body.position[1]*FlyParam.LayerScale + FlyConfig.stageHeight/2
			this.playerLayer.x = -this.player.body.position[0]*FlyParam.LayerScale + FlyConfig.stageWidth/2
			this.playerLayer.y = -this.player.body.position[1]*FlyParam.LayerScale + FlyConfig.stageHeight/2
		}

		public initScene(tiledMapObjs:TiledMapObject[])
		{
			this.tiledMapObjs = tiledMapObjs

			this.addChild(this.baseLayer)
			this.addChild(this.playerLayer)
			this.addChild(this.uiLayer)
			this.addChild(this.touchLayer)

			this.createBackgroud()
			this.createWorld()
			this.createScene()
			this.createTouchLayer()
			this.createUI()
		}

		private createBackgroud()
		{
			this.baseLayer.scaleX = FlyParam.LayerScale
			this.baseLayer.scaleY = FlyParam.LayerScale
			this.playerLayer.scaleX = FlyParam.LayerScale
			this.playerLayer.scaleY = FlyParam.LayerScale

			let png = FlyTools.createBitmapByName("background_jpg")
			png.scaleX = FlyConfig.width/png.width
			png.scaleY = FlyConfig.height/png.height
			this.baseLayer.addChild(png)
		}

		private createWorld()
		{
			let world = this.objmgr.world
			this.world = world

			//添加帧事件侦听
			egret.Ticker.getInstance().register(this.onTickWorld, this)
			world.on("postBroadphase", this.onBeginContact, this)
			world.on("endContact", this.onEndContact, this)
		}

		private onTickWorld(dt)
		{
			//使世界时间向后运动
			this.world.step(dt/1000)
			this.update(dt/1000)
		}
		
		private createScene() 
		{
			this.objmgr.scene = this
			
			// 根据TiledMap创建元素
			this.tiledMapObjs.forEach(obj => {
				BattleSceneFactory.createObject(this, obj)
			})
		}

		private createTouchLayer()
		{
			// 触摸层
			let touchNode = new BattleTouchNode(this, 150)
			this.touchNode = touchNode

			this.touchLayer.addChild(this.touchNode)
		}

		private createUI()
		{
			// 显示体重条
			let progress = new UIProgress()
			progress.create(FlyParam.PlayerMaxPower, FlyParam.PlayerMinPower, FlyParam.PlayerInitPower)
			progress.anchorOffsetX = progress.width/2
			progress.anchorOffsetY = progress.height/2
			progress.setPosition(progress.width/2, progress.height)
			this.addChild(progress);
			this.progress = progress

			// 监听能量变化事件
			this.addEventListener("ChangePower", this.onChangePower, this)

			// 显示关卡
			var text:egret.TextField = new egret.TextField()
			text.text = "当前关卡: " + SceneManager.inst().getMapId()
			text.size = 36;
			text.textColor = 0x000000;
			text.anchorOffsetX = 0;
			text.anchorOffsetY = 0.5
			text.x = 5
			text.y = progress.height + 25
			this.addChild(text);

			// 显示生命值
			var text2:egret.TextField = new egret.TextField()
			text2.text = "当前剩余生命: " + this.player.heath
			text2.size = 36;
			text2.textColor = 0x000000;
			text2.anchorOffsetX = 0;
			text2.anchorOffsetY = 0.5
			text2.x = 5
			text2.y = progress.height + text.height + 40
			this.addChild(text2);
			this.text = text2

			// 监听死亡事件
			this.addEventListener("PlayerDead", this.onPlayerDead, this)
		}

		private onChangePower(evt:egret.Event)
		{
			this.progress.changeValue(evt.data)
		}

		private onPlayerDead(evt:egret.Event)
		{
			this.text.text = "当前剩余生命: " + this.player.heath + " (" + evt.data+ ")"
		}

		private onBeginContact(event:any)
		{
			for (let i = 0; i < event.pairs.length; i += 2)
			{
				this.onContactBegin(event.pairs[i], event.pairs[i+1])
			}
		}
		
		private onContactBegin(bodyA:p2.Body, bodyB:p2.Body) 
		{
			if (FlyConfig.isPlayer(bodyA.id) && FlyConfig.isProperty(bodyB.id))
			{
				this.trigger(bodyB.id, bodyA.id)
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isProperty(bodyA.id))
			{
				this.trigger(bodyA.id, bodyB.id)
			}
			else if (FlyConfig.isPlayer(bodyA.id) && FlyConfig.isObstacle(bodyB.id))
			{
				// 先调用触发器，后触发碰撞逻辑
				if (!this.trigger(bodyB.id, bodyA.id))
				{
					this.contactObstacleBegin(bodyB.id, bodyA.id)
				}
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isObstacle(bodyA.id))
			{
				// 先调用触发器，后触发碰撞逻辑
				if(!this.trigger(bodyA.id, bodyB.id))
				{
					this.contactObstacleBegin(bodyA.id, bodyB.id)
				}
			}
			else if (FlyConfig.isPlayer(bodyA.id) &&FlyConfig.isPlayer(bodyB.id))
			{
				this.triggerPlayer(bodyA.id, bodyB.id)
			}
		}

		private onEndContact(event:any)
		{
			this.onContactEnd(event.bodyA, event.bodyB)
		}

		private onContactEnd(bodyA:p2.Body, bodyB:p2.Body)
		{
			if (FlyConfig.isObstacle(bodyA.id))
			{
				this.contactObstacleEnd(bodyA.id, bodyB.id)
			}
			else if (FlyConfig.isObstacle(bodyB.id))
			{
				this.contactObstacleEnd(bodyB.id, bodyA.id)
			}
		}

		private contactObstacleBegin(id:number, pid:number)
		{
			this.objmgr.sprites.forEach(value => {
				if (value.body.id == id)
				{
					value.onContactBegin(pid)
					return
				}
			})
		}

		private contactObstacleEnd(id:number, pid:number)
		{
			this.objmgr.sprites.forEach(value => {
				if (value.body.id == id)
				{
					value.onContactEnd(pid)
					return
				}
			})
		}

		private trigger(id:number, pid:number):boolean
		{
			this.objmgr.sprites.forEach(value => {
				if (value.body.id == id)
				{
					let bRet = value.onTrigger(pid)
					if (value.isDestroy)
					{
						this.delFromWorld(value)
					}
					return bRet
				}
			})
			return false
		}

		private triggerPlayer(id1:number, id2:number)
		{
			let pl1:Player = null
			let pl2:Player = null
			this.objmgr.players.forEach(value => {
				if (value.body.id == id1)
				{
					pl1 = value
				}
				else if (value.body.id == id2)
				{
					pl2 = value
				}
			})

			if (pl1 && pl2)
			{
				let pos1 = pl1.body.position
				let pos2 = pl2.body.position

				let normal = []
				p2.vec2.normalize(normal, [pos1[0] - pos2[0], pos1[1] - pos2[1]])

				let forceScale = FlyParam.forceScale
				pl1.setVelocity( normal[0]*forceScale,  normal[1]*forceScale)
				pl2.setVelocity(-normal[0]*forceScale, -normal[1]*forceScale)

				pl1.inoperable = 1
				pl2.inoperable = 1
			}
		}

		public addPlayerToWorld(obj:Player)
		{
			this.world.addBody(obj.body)
			obj.body.displays.forEach(value => { 
				this.playerLayer.addChild(value)
			})

			this.objmgr.addPlayer(obj)
		}

		public addToWorld(obj:FlyObject)
		{
			this.world.addBody(obj.body)
			obj.body.displays.forEach(value => { 
				this.baseLayer.addChild(value)
			})

			this.objmgr.addSprite(obj)
		}

		public delFromWorld(obj:FlyObject)
		{
			obj.body.displays.forEach(value => {
				this.baseLayer.removeChild(value)
			})
			this.world.removeBody(obj.body)
		}

		public reset()
		{
			egret.Ticker.getInstance().unregister(this.onTickWorld, this)
			this.removeEventListener("ChangePower", this.onChangePower, this)
			this.removeEventListener("PlayerDead", this.onPlayerDead, this)
			this.world.off("postBroadphase", this.onBeginContact)
			this.world.off("endContact", this.onEndContact)
		}
	}
}
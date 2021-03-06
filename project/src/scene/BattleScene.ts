module fly {
	export class BattleScene extends egret.DisplayObjectContainer {
		world:p2.World
		touchNode:BattleTouchNode
		tiledMapGroups:TiledMapGroup[]

		progress:UIProgress
		progressText:egret.TextField

		objmgr:ObjectManager = ObjectManager.inst()
		player:Player

		baseLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer
		uiLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer
		touchLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer

		layers:egret.DisplayObjectContainer[] = []

		text:egret.TextField
		time:egret.TextField

		isRunning:number = -1
		clickTime:number = 0

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
			this.updateTime(dt)
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

		perPower = Math.abs(1/FlyParam.move_power)
		lastPowerTime:number = 0
		private updatePower(dt:number)
		{
			if (this.player.body.velocity[0] != 0 || this.player.body.velocity[1] != 0)
			{
				this.lastPowerTime += dt
				if (this.lastPowerTime >= this.perPower)
				{
					this.objmgr.players.forEach(player => {
						player.changePower(player.power - 1)
					})
					this.lastPowerTime -= this.perPower
				}
			}
		}

		private updateScene(dt:number)
		{
			this.baseLayer.x = -this.player.body.position[0]*FlyParam.LayerScale + FlyConfig.stageWidth/2
			this.baseLayer.y = -this.player.body.position[1]*FlyParam.LayerScale + FlyConfig.stageHeight/2
		}

		private updateTime(dt:number)
		{
			this.clickTime += dt
			if (this.time)
			{
				this.time.text = "当前用时: " + parseInt(""+this.clickTime*10, 10)/10 + " 秒"
			}
		}

		public initScene(tiledMapGroups:TiledMapGroup[])
		{
			this.tiledMapGroups = tiledMapGroups

			this.addChild(this.baseLayer)
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

			let png = FlyTools.createBitmapByName("background_jpg")
			png.scaleX = FlyConfig.width/png.width
			png.scaleY = FlyConfig.height/png.height
			this.baseLayer.addChild(png)

			// object layers
			// 1 blocks
			// 2 candy || traps
			// 3 dynamic blocks
			// 4 aitraps || movetraps || windtraps
			// 5 player
			for(let i = 0; i < 6; ++i)
			{
				let layer = new egret.DisplayObjectContainer()
				this.layers.push(layer)
				this.baseLayer.addChild(layer)
			}
		}

		private createWorld()
		{
			let world = this.objmgr.world
			this.world = world

			//添加帧事件侦听
			egret.Ticker.getInstance().register(this.onTickWorld, this)
			world.on("postBroadphase", this.onBeginContact, this)
			world.on("endContact", this.onEndContact, this)
			world.on("postStep", this.onPostStep, this)
		}
		
		private createScene() 
		{
			this.objmgr.scene = this
			
			// 根据TiledMap创建元素
			this.tiledMapGroups.forEach(group => {
				if (!group.isArray)
				{
					group.group.forEach(obj => {
						BattleSceneFactory.createObject(this, obj)
					})
				}
				else
				{
					BattleSceneFactory.createArray(this, group)
				}
			})
		}

		private createTouchLayer()
		{
			// 触摸层
			let touchNode = new BattleTouchNode(this, 120)
			this.touchNode = touchNode

			this.touchLayer.addChild(this.touchNode)
		}

		private createUI()
		{
			// 显示体重条
			let progress = new UIProgress()
			progress.create(FlyParam.PlayerMaxPower, FlyParam.PlayerMinPower, FlyParam.PlayerInitPower)
			progress.setPosition(progress.width*0.5, FlyConfig.stageHeight*0.5)
			this.addChild(progress);
			this.progress = progress

			// 监听能量变化事件
			this.addEventListener("ChangePower", this.onChangePower, this)

			// 显示关卡
			var text:egret.TextField = new egret.TextField()
			text.text = "当前关卡: " + SceneManager.inst().getMapId()
			text.size = 36;
			text.stroke = 2;
        	text.strokeColor = 0x000000;
			text.textColor = 0xFFFFFF;
			text.x = 5
			text.y = FlyConfig.deltaHeight
			this.addChild(text);

			// 显示生命值
			var text2:egret.TextField = new egret.TextField()
			text2.text = "当前生命: " + SceneManager.inst().health
			text2.size = 36;
			text2.stroke = 2;
        	text2.strokeColor = 0x000000;
			text2.textColor = 0xFFFFFF;
			text2.x = 5
			text2.y = FlyConfig.deltaHeight + text.height + 10
			this.addChild(text2);
			this.text = text2

			// 显示时间
			var text3:egret.TextField = new egret.TextField()
			text3.text = "当前用时: " + this.clickTime + " 秒"
			text3.size = 36;
			text3.stroke = 2;
        	text3.strokeColor = 0x000000;
			text3.textColor = 0xFFFFFF;
			text3.x = 5
			text3.y = FlyConfig.deltaHeight + text.height + text2.height + 20
			this.addChild(text3);
			this.time = text3
		}

		private onChangePower(evt:egret.Event)
		{
			this.progress.changeValue(evt.data)
		}

		private onTickWorld(dt)
		{
			//使世界时间向后运动
			this.world.step(dt/1000)
			this.update(dt/1000)
		}

		private onPostStep()
		{
			if (this.isRunning < 0) return
			
			this.reset()
			this.objmgr.reset()

			SceneManager.inst().stopAllSound()
			if (this.isRunning == 0)
				SceneManager.inst().loadNext()
			else
				SceneManager.inst().loadAgain(this.isRunning)
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
			// 玩家触碰道具
			if (FlyConfig.isPlayer(bodyA.id) && FlyConfig.isProperty(bodyB.id))
			{
				this.trigger(bodyB.id, bodyA.id)
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isProperty(bodyA.id))
			{
				this.trigger(bodyA.id, bodyB.id)
			}
			// 玩家触碰陷阱
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
			// 玩家触碰障碍物
			else if (FlyConfig.isPlayer(bodyA.id) && FlyConfig.isBlock(bodyB.id))
			{
				// 先调用触发器，后触发碰撞逻辑
				if (!this.trigger(bodyB.id, bodyA.id))
				{
					this.contactObstacleBegin(bodyB.id, bodyA.id)
				}
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isBlock(bodyA.id))
			{
				// 先调用触发器，后触发碰撞逻辑
				if(!this.trigger(bodyA.id, bodyB.id))
				{
					this.contactObstacleBegin(bodyA.id, bodyB.id)
				}
			}
			// 玩家触碰Ai
			else if (FlyConfig.isPlayer(bodyA.id) && FlyConfig.isAiPlayer(bodyB.id))
			{
				this.trigger(bodyB.id, bodyA.id)
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isAiPlayer(bodyA.id))
			{
				this.trigger(bodyA.id, bodyB.id)
			}
			// AI触碰陷阱
			else if (FlyConfig.isAiPlayer(bodyA.id) && FlyConfig.isObstacle(bodyB.id))
			{
				this.triggerAi(bodyB.id, bodyA.id)
			}
			else if (FlyConfig.isAiPlayer(bodyB.id) && FlyConfig.isObstacle(bodyA.id))
			{
				this.triggerAi(bodyA.id, bodyB.id)
			}
			// 玩家触碰玩家
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
			// 玩家触碰陷阱
			if (FlyConfig.isPlayer(bodyA.id) && FlyConfig.isObstacle(bodyB.id))
			{
				this.contactObstacleEnd(bodyB.id, bodyA.id)
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isObstacle(bodyA.id))
			{
				this.contactObstacleEnd(bodyA.id, bodyB.id)
			}
			// 玩家触碰障碍物
			else if (FlyConfig.isPlayer(bodyA.id) && FlyConfig.isBlock(bodyB.id))
			{
				this.contactObstacleEnd(bodyB.id, bodyA.id)
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isBlock(bodyA.id))
			{
				this.contactObstacleEnd(bodyA.id, bodyB.id)
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

		private triggerAi(id:number, pid:number):boolean
		{
			this.objmgr.sprites.forEach(value => {
				if (value.body.id == id || value.body.id == pid)
				{
					value.destroy()
					this.delFromWorld(value)
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
				let normal = FlyTools.getDirect(pl1.body.position, pl2.body.position)
				let forceScale = FlyParam.forceScale
				pl1.hit([ normal[0]*forceScale,  normal[1]*forceScale], 0, 1)
				pl1.hit([-normal[0]*forceScale, -normal[1]*forceScale], 0, 1)
			}
		}

		public addPlayerToWorld(obj:Player)
		{
			let idx = obj.layerIndex || 0
			this.world.addBody(obj.body)
			obj.body.displays.forEach(value => { 
				this.layers[idx].addChild(value)
			})

			this.objmgr.addPlayer(obj)
		}

		public delPlayerFromWorld(obj:FlyObject)
		{
			let idx = obj.layerIndex || 0
			obj.body.displays.forEach(value => {
				this.layers[idx].removeChild(value)
			})
			this.world.removeBody(obj.body)
		}

		public addToWorld(obj:FlyObject)
		{
			let idx = obj.layerIndex || 0
			this.world.addBody(obj.body)
			obj.body.displays.forEach(value => { 
				this.layers[idx].addChild(value)
			})

			this.objmgr.addSprite(obj)
		}

		public delFromWorld(obj:FlyObject)
		{
			let idx = obj.layerIndex || 0
			obj.body.displays.forEach(value => {
				this.layers[idx].removeChild(value)
			})
			this.world.removeBody(obj.body)
		}

		public addImage(image:egret.Bitmap)
		{
			this.layers[0].addChild(image)
		}

		public reset()
		{
			egret.Ticker.getInstance().unregister(this.onTickWorld, this)
			this.removeEventListener("ChangePower", this.onChangePower, this)
			this.world.off("postBroadphase", this.onBeginContact)
			this.world.off("endContact", this.onEndContact)
			this.world.off("postStep", this.onPostStep)
		}

		public stop()
		{
			this.touchNode.setTouchEnable(false)
		}
	}
}
module fly {
	export class BattleScene extends egret.DisplayObjectContainer {
		world:p2.World
		touchNode:BattleTouchNode
		progress:UIProgress
		tiledMapObjs:TiledMapObject[]

		objmgr:ObjectManager = ObjectManager.inst()
		player:Player

		baseLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer
		uiLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer
		touchLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer

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
		}

		public initScene(tiledMapObjs:TiledMapObject[])
		{
			this.tiledMapObjs = tiledMapObjs

			this.addChild(this.baseLayer)
			this.addChild(this.uiLayer)
			this.addChild(this.touchLayer)

			this.baseLayer.scaleX = FlyParam.LayerScale
			this.baseLayer.scaleY = FlyParam.LayerScale

			let png = FlyTools.createBitmapByName("background_jpg")
			png.scaleX = FlyConfig.width/png.width
			png.scaleY = FlyConfig.height/png.height
			this.baseLayer.addChild(png)

			this.createWorld()
			this.createScene()
			this.createTouchLayer()
		}

		private createWorld()
		{
			let world = new p2.World({
				gravity:[0, 0]
			})
			world.applyDamping = true
			world.sleepMode = p2.World.BODY_SLEEPING
			this.world = world

			//添加帧事件侦听
			egret.Ticker.getInstance().register(function (dt) {
				//使世界时间向后运动
				world.step(dt/1000)
				this.update(dt/1000)
			}, this)

			world.on("postBroadphase", this.onPostBroadphase, this)
		}
		
		private createScene() 
		{
			this.objmgr.scene = this

			this.tiledMapObjs.forEach(obj => {
				if (obj.type == "player")
				{
					let player = new Player(obj.x, obj.y, obj.width/2)
					this.addPlayerToWorld(player)
					if (obj.name == "self")
					{
						player.setVisible(true)
						this.player = player
					}
				}
				else if (obj.type == "wall")
				{
					let wall = new Wall(obj.x, obj.y, obj.width, obj.height)
					this.addToWorld(wall)
				}
				else if (obj.type == "blockrect")
				{
					let block = new BlockRect(obj.x, obj.y, obj.width, obj.height, 
					{
						path:obj.params["path"]
						, type:Number(obj.params["type"])
						, damping:Number(obj.params["damping"])
					})
					this.addToWorld(block)
				}
				else if (obj.type == "blockcircle")
				{
					let block = new BlockCircle(obj.x, obj.y, obj.width/2, 
					{
						path:obj.params["path"]
						, type:Number(obj.params["type"])
						, damping:Number(obj.params["damping"])
					})
					this.addToWorld(block)
				}
				else if (obj.type == "candy")
				{
					let candy = new Candy(obj.x, obj.y, obj.width/2, 
					{
						path:obj.params["path"]
						, delta:Number(obj.params["delta"])
						, power:Number(obj.params["power"])
					})
					this.addToWorld(candy)
				}
			})
		}

		private createTouchLayer()
		{
			let touchNode = new BattleTouchNode(this, 150)
			this.touchNode = touchNode

			this.touchLayer.addChild(this.touchNode)
		}

		private onPostBroadphase(event:any)
		{
			for (let i = 0; i < event.pairs.length; i += 2)
			{
				this.onContact(event.pairs[i], event.pairs[i+1])
			}
		}

		private onContact(bodyA:p2.Body, bodyB:p2.Body) 
		{
			if (FlyConfig.isPlayer(bodyA.id) && FlyConfig.isProperty(bodyB.id))
			{
				this.triggerBody(bodyB.id, bodyA.id)
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isProperty(bodyA.id))
			{
				this.triggerBody(bodyA.id, bodyB.id)
			}
		}

		private triggerBody(id:number, pid:number)
		{
			this.objmgr.sprites.forEach(value => {
				if (value.body.id == id)
				{
					value.onTrigger(pid)
					if (value.isDestroy)
					{
						this.delFromWorld(value)
					}
					return
				}
			})
		}

		public addPlayerToWorld(obj:Player)
		{
			this.world.addBody(obj.body)
			obj.body.displays.forEach(value => { 
				this.baseLayer.addChild(value)
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
	}
}
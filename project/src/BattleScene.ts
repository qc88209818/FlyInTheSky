module fly {
	export class BattleScene extends egret.DisplayObjectContainer {
		world:p2.World
		touchNode:BattleTouchNode
		progress:UIProgress
		tiledMapObjs:TiledMapObject[]

		objmgr:ObjectManager = ObjectManager.inst()

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
				let direct = this.touchNode.direct
				let forceScale = this.touchNode.forceScale
				this.objmgr.player.body.applyForce([direct[0]*forceScale, direct[1]*forceScale], this.objmgr.player.body.position)
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
				if (p2.vec2.length(this.objmgr.player.body.velocity) > 3)
				{
					this.objmgr.player.changePower(this.objmgr.player.power + FlyParam.move_power)
				}
				else
				{
					this.objmgr.player.changePower(this.objmgr.player.power + FlyParam.move_power/2)
				}
				this.lastPowerTime -= 1
			}
		}

		private updateScene(dt:number)
		{
			this.baseLayer.x = -this.objmgr.player.body.position[0] + FlyConfig.stageWidth/2
			this.baseLayer.y = -this.objmgr.player.body.position[1] + FlyConfig.stageHeight/2
		}

		public initScene(tiledMapObjs:TiledMapObject[])
		{
			this.tiledMapObjs = tiledMapObjs

			this.addChild(this.baseLayer)
			this.addChild(this.uiLayer)
			this.addChild(this.touchLayer)

			this.createWorld()
			this.createScene()
			this.createTouchLayer()
		}

		private createWorld()
		{
			let world = new p2.World({
				gravity:[0, 0]
			})
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
					let player = new Player(obj.x, obj.y, obj.width)
					this.addToWorld(player)
					if (obj.name == "self")
					{
						this.objmgr.player = player
					}
				}
				else if (obj.type == "wall")
				{
					let wall = new Wall(obj.x, obj.y, obj.width, obj.height)
					this.addToWorld(wall)
				}
				else if (obj.type == "candy")
				{
					let candy = new Candy(obj.x, obj.y, obj.width)
					this.addToWorld(candy)

					for(let i = 0; i < obj.params.length; i += 2)
					{
						if (obj.params[i] == "delta")
						{
							candy.setDelta(Number(obj.params[i+1]))
						}
					}
				}
			})
		}

		private createTouchLayer()
		{
			let touchNode = new BattleTouchNode(this, 150, 5)
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
				this.triggerBody(bodyB.id)
			}
			else if (FlyConfig.isPlayer(bodyB.id) && FlyConfig.isProperty(bodyA.id))
			{
				this.triggerBody(bodyA.id)
			}
		}

		private triggerBody(id:number)
		{
			this.objmgr.sprites.forEach(value => {
				if (value.body.id == id)
				{
					value.onTrigger()
					if (value.isDestroy)
					{
						this.delFromWorld(value)
					}
					return
				}
			})
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
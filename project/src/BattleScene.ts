module fly {
	export class BattleScene extends egret.DisplayObjectContainer {
		world:p2.World;
		touchNode:BattleTouchNode;
		objmgr:ObjectManager = ObjectManager.inst();

		baseLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		playerLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		uiLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer;
		touchLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer;

		public constructor() {
			super();
		}

		public update(dt)
		{
			if (this.touchNode.isTouchMove)
			{
				let direct = this.touchNode.direct;
				let forceScale = this.touchNode.forceScale;
				this.objmgr.player.body.applyForce([direct[0]*forceScale, direct[1]*forceScale], this.objmgr.player.body.position);
			}

			this.updateCreate(dt);
			this.objmgr.update(dt);
		}
		
		lastCreateCandy:number = 0;
		private updateCreate(dt:number)
		{
			this.lastCreateCandy += dt;
			if (this.lastCreateCandy > 3)
			{
				let width = FlyConfig.stageWidth*(Math.random()*0.8 + 0.2);
				let height = FlyConfig.stageHeight*(Math.random()*0.8 + 0.2);
				let radious = 25*(Math.random() + 1)
				let candy = new Candy(width, height, radious);
				this.addToWorld(candy);

				this.lastCreateCandy = 0;
			}
		}

		public initScene()
		{
			this.addChild(this.baseLayer)
			this.addChild(this.playerLayer)
			this.addChild(this.uiLayer);
			this.addChild(this.touchLayer);

			this.createWorld();
			this.createScene();
			this.createTouchLayer();
		}

		private createWorld()
		{
			let world = new p2.World({
				gravity:[0, 0]
			});
			world.sleepMode = p2.World.BODY_SLEEPING;
			this.world = world

			//添加帧事件侦听
			egret.Ticker.getInstance().register(function (dt) {
				//使世界时间向后运动
				world.step(dt/1000);
				this.update(dt/1000);
			}, this);

			world.on("postBroadphase", this.onPostBroadphase, this);
		}
		
		private createScene() 
		{
			let wall1 = new Wall(0, 0, FlyConfig.stageWidth, 10);
			let wall2 = new Wall(0, 0, 10, FlyConfig.stageHeight);
			let wall3 = new Wall(FlyConfig.stageWidth, FlyConfig.stageHeight, FlyConfig.stageWidth - 10, 0);
			let wall4 = new Wall(FlyConfig.stageWidth, FlyConfig.stageHeight, 0, FlyConfig.stageHeight - 10);

			this.addToWorld(wall1);
			this.addToWorld(wall2);
			this.addToWorld(wall3);
			this.addToWorld(wall4);

			let player = new Player(FlyConfig.stageWidth/2, FlyConfig.stageHeight/2, 60);
			this.addPlayerToWorld(player);

			this.objmgr.player = player;
		}

		private createTouchLayer()
		{
			let touchNode = new BattleTouchNode(this, 150, 5);
			this.touchNode = touchNode;

			this.touchLayer.addChild(this.touchNode)
		}

		private onPostBroadphase(event:any)
		{
			for (let i = 0; i < event.pairs.length; i += 2)
			{
				this.onContact(event.pairs[i], event.pairs[i+1]);
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
					value.onTrigger();
					if (value.isDestroy)
					{
						this.delFromWorld(value);
					}
					return;
				}
			})
		}

		private addPlayerToWorld(obj:FlyObject)
		{
			this.world.addBody(obj.body);
			obj.body.displays.forEach(value => { 
				this.playerLayer.addChild(value);
			})

			this.objmgr.addSprite(obj);
		}

		private addToWorld(obj:FlyObject)
		{
			this.world.addBody(obj.body);
			obj.body.displays.forEach(value => { 
				this.baseLayer.addChild(value);
			})

			this.objmgr.addSprite(obj);
		}

		private delFromWorld(obj:FlyObject)
		{
			obj.body.displays.forEach(value => {
				this.baseLayer.removeChild(value);
			})
			this.world.removeBody(obj.body);
		}
	}
}
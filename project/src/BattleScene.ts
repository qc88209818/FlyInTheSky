module fly {
	export class BattleScene extends egret.DisplayObjectContainer {
		world:p2.World;
		touchLayer:BattleTouchLayer;
		objmgr:ObjectManager = ObjectManager.inst();

		public constructor() {
			super();
		}

		public update(dt)
		{
			if (this.touchLayer.isTouchMove)
			{
				let direct = this.touchLayer.direct;
				let forceScale = this.touchLayer.forceScale;
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
				console.log("Add One Candy!");
			}
		}

		public initScene()
		{
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
			this.addToWorld(player);
			this.objmgr.player = player;
		}

		private createTouchLayer()
		{
			let touchLayer = new BattleTouchLayer(this, 200, 1);
			this.touchLayer = touchLayer;
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
			console.log("Contact: " + bodyA.id + " and " + bodyB.id);
			if (bodyA.id < 1000 && 2000 <= bodyB.id)
			{
				this.triggerBody(bodyB.id)
			}
			else if (bodyB.id < 1000 && 2000 <= bodyA.id)
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
					this.delFromWorld(value);
					return;
				}
			})
		}

		private addToWorld(obj:FlyObject)
		{
			this.world.addBody(obj.body);
			obj.body.displays.forEach(value => { 
				this.addChild(value);
			})

			this.objmgr.addSprite(obj);
		}

		private delFromWorld(obj:FlyObject)
		{
			obj.isDestroy = true;
			obj.body.displays.forEach(value => {
				this.removeChild(value);
			})
			this.world.removeBody(obj.body);
		}
	}
}
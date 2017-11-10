module fly {
	export class BattleScene extends egret.DisplayObjectContainer {
		world:p2.World;

		touchLayer:BattleTouchLayer;

		player:Player;
		sprites:FlyObject[] = [];		// 当前所有需要计算位置的精灵	

		public constructor() {
			super();
		}

		public update(dt)
		{
			if (this.touchLayer.isTouchMove)
			{
				let direct = this.touchLayer.direct;
				let forceScale = this.touchLayer.forceScale;
				this.player.body.applyForce([direct[0]*forceScale, direct[1]*forceScale], this.player.body.position);
			}

			this.sprites.forEach(value => {
				if (!value.isDestroy)
				{
					value.updatePosition();
				}
			})

			this.createCandy(dt);
		}
		
		lastCreateCandy:number = 0;
		private createCandy(dt)
		{
			this.lastCreateCandy += dt;
			if (this.lastCreateCandy > 3)
			{
				let width = FlyConfig.stageWidth*Math.random();
				let height = FlyConfig.stageHeight*Math.random();
				let radious = 30*(Math.random() + 1)
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

			world.on("beginContact", this.onBeginContact, this);
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

			let player = new Player(FlyConfig.stageWidth/2, FlyConfig.stageHeight/2, 50);
			this.addToWorld(player);
			this.player = player;
		}

		private createTouchLayer()
		{
			let touchLayer = new BattleTouchLayer(this, 200, 1);
			this.touchLayer = touchLayer;
		}

		private onBeginContact(event:any) 
		{
			console.log("Contact: " + event.bodyA.id + " and " + event.bodyB.id);
			if (2000 <= event.bodyA.id && event.bodyA.id < 3000)
			{
				this.delFromWorldById(event.bodyA.id);
			}
			if (2000 <= event.bodyB.id && event.bodyB.id < 3000)
			{
				this.delFromWorldById(event.bodyB.id);
			}
		}

		private addToWorld(obj:FlyObject)
		{
			this.world.addBody(obj.body);
			obj.body.displays.forEach(value => { 
				this.addChild(value);
			})

			if (obj.body.type != p2.Body.STATIC)
			{
				this.sprites.push(obj);
			}
		}

		private delFromWorldById(id:number)
		{
			this.sprites.forEach(value => {
				if (value.body.id == id)
				{
					this.delFromWorldByObj(value);
					return;
				}
			})
		}

		private delFromWorldByObj(obj:FlyObject)
		{
			obj.isDestroy = true;
			obj.body.displays.forEach(value => {
				this.removeChild(value);
			})
			this.world.removeBody(obj.body);
		}
	}
}
module fly {
	export class ObjectManager {
		static isInit:boolean = false
		static obj:ObjectManager = new ObjectManager()

		private delayKeys:number[] = []

		public static inst(): ObjectManager
		{
			if (!this.isInit)
			{
				this.obj.init()
				this.isInit = true
			}
			return this.obj
		}

		scene:BattleScene
		sprites:FlyObject[] = []		// 当前所有需要计算位置的精灵
		players:Player[] = []

		world:p2.World
		mcFactory:egret.MovieClipDataFactory
		dieFactory:egret.MovieClipDataFactory
		windFactory:egret.MovieClipDataFactory
		dogFactory:egret.MovieClipDataFactory

		public init()
		{
			this.loadMovieClip()
		}

		public update(dt:number)
		{
			let length = this.sprites.length
			for(let i = 0; i < length;)
			{
				if (!this.sprites[i].isDestroy)
				{
					this.sprites[i].updatePosition(dt)
					++i
				}
				else
				{
					--length
					this.sprites[i].indexOf = -1
					this.sprites[i] = this.sprites[length]
					this.sprites[i].indexOf = i
					this.sprites.pop()
				}
			}

			let length2 = this.players.length
			for(let i = 0; i < length2;)
			{
				if (!this.players[i].isDestroy)
				{
					this.players[i].updatePosition(dt)
					++i
				}
				else
				{
					--length2
					this.players[i].indexOf = -1
					this.players[i] = this.players[length2]
					this.players[i].indexOf = i
					this.players.pop()
				}
			}
		}

		public addSprite(obj:FlyObject)
		{
			obj.indexOf = this.sprites.length
			this.sprites.push(obj)
		}

		public delSprite(obj:FlyObject)
		{
			obj.isDestroy = true
		}

		public addPlayer(obj:Player)
		{
			obj.indexOf = this.players.length
			this.players.push(obj)
		}

		public delPlayer(obj:Player)
		{
			obj.isDestroy = true
		}

		private loadMovieClip()
		{
			var data = RES.getRes("playerNormalMode_json");
			var txtr = RES.getRes("playerNormalMode_png");
			let mcFactory = new egret.MovieClipDataFactory(data, txtr);
			this.mcFactory = mcFactory

			var data = RES.getRes("playerDie_json");
			var txtr = RES.getRes("playerDie_png");
			let dieFactory = new egret.MovieClipDataFactory(data, txtr);
			this.dieFactory = dieFactory

			var data = RES.getRes("wind_json");
			var txtr = RES.getRes("wind_png");
			let windFactory = new egret.MovieClipDataFactory(data, txtr);
			this.windFactory = windFactory

			var data = RES.getRes("dog_json");
			var txtr = RES.getRes("dog_png");
			let dogFactory = new egret.MovieClipDataFactory(data, txtr);
			this.dogFactory = dogFactory

			let world = new p2.World()
			world.gravity = [0, 0]
			world.applyDamping = true
			world.sleepMode = p2.World.BODY_SLEEPING
			this.world = world
		}

		public reset()
		{
			this.scene = null
			this.sprites = []
			this.players = []

			this.world.clear()
			this.world.gravity = [0, 0]
			this.world.applyDamping = true
			this.world.sleepMode = p2.World.BODY_SLEEPING
			FlyConfig.reset()
		}
	}
}
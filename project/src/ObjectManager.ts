module fly {
	export class ObjectManager {
		static isInit:boolean = false
		static obj:ObjectManager = new ObjectManager()

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
		mcFactory:egret.MovieClipDataFactory

		public init()
		{
			this.loadMoveClip()
		}

		public update(dt:number)
		{
			let length = this.sprites.length
			for(let i = 0; i < length;)
			{
				if (!this.sprites[i].isDestroy)
				{
					this.sprites[i].updatePosition()
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
					this.players[i].updatePosition()
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

		private loadMoveClip()
		{
			let data = RES.getRes("playerNormalMode_json");
			let txtr = RES.getRes("playerNormalMode_png");
			let mcFactory = new egret.MovieClipDataFactory(data, txtr);
			this.mcFactory = mcFactory
		}
	}
}
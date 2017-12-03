module fly {
	export class WindTraps extends FlyCircle {
		x:number
		y:number
		radius:number
		dir:number
		op:any

		max:number
		min:number

		baseScale:number = FlyParam.WindBaseScale

		private _soundName:string = ""
		private _movieClip:egret.MovieClip

		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.layerIndex = 4
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.op  = op
			this.min = op.min || 0
			this.max = op.max || 999
			this.dir = op.dir || 1
			this._soundName = op.sound || "wind.mp3"

			this.initBody({
				id:FlyConfig.getPropertyId()
				, mass:1
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Property, ObjectMask.Property)
			
			this.initBitmap()
			this.updatePosition()
		}

		private initBitmap()
		{
			var png = new egret.MovieClip(this.objmgr.windFactory.generateMovieClipData("wind"));
			png.gotoAndPlay("play", -1)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = this.baseScale * this.dir
			png.scaleY = this.baseScale
			this.addChild(png)
			this._movieClip = png
		}

		public onTrigger(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					if (this.min < player.body.mass && player.body.mass < this.max)
					{
						let dir = [player.body.position[0] - this.x, player.body.position[1] - this.y]
						let normal = []
						p2.vec2.normalize(normal, dir)

						let forceScale = FlyParam.forceScale
						player.setVelocity(normal[0]*forceScale,  normal[1]*forceScale)
						player.inoperable = 1
					}
					return true
				}
			})
			return true
		}

		public updatePosition(dt:number = 0)
		{
			super.updatePosition(dt)
	
			let player = this.objmgr.scene.player
			let dist = p2.vec2.dist(player.body.position, this.body.position)

			if (dist < this.radius * 2)
			{
				SceneManager.inst().playSound(this._soundName, this)
			}
			else
			{
				SceneManager.inst().stopSound(this._soundName, this)
			}
		}
	}
}
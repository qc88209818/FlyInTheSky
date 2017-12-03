module fly {
	export class WeightTraps  extends FlyCircle {
		x:number
		y:number
		radius:number

		baseScale:number = FlyParam.WeightTrapsBaseScale

		max:number
		min:number

		private _movieClip:egret.MovieClip
		
		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.layerIndex = 3
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.min = op.min || 0
			this.max = op.max || 999

			this.initBody({
				id:FlyConfig.getPropertyId()
				, mass:op.mass || 1
				, type:op.type || p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0.7
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Property, ObjectMask.Property)

			this.initBitmap(op.path)
			this.updatePosition()

			this.setRotation(op.rotation)
		}

		private initBitmap(path:string)
		{
			var png = new egret.MovieClip(this.objmgr.iceFactory.generateMovieClipData("ice"));
			png.gotoAndPlay("normal", -1)
			png.anchorOffsetX = png.width*0.5
			png.anchorOffsetY = png.height*0.5		
			png.scaleX = this.baseScale * this.radius/png.width
			png.scaleY = this.baseScale * this.radius/png.height
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
						this._movieClip.gotoAndPlay("drop", 1)
						player.died(4)
						player.movieClip.visible = false
						player.dieMovieClip.visible = false
					}
					return true
				}
			})
			return true
		}
	}
}
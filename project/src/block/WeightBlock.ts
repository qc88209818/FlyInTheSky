module fly {
	export class WeightBlock extends FlyRect {
		x:number
		y:number
		width:number
		height:number

		baseScale:number = FlyParam.WeightBlockBaseScale

		max:number
		min:number
		
		public constructor(x:number, y:number, width:number, height:number, op?) {
			super()
			this.x = x + width/2
			this.y = y + height/2
			this.width = width
			this.height = height
			this.min = op.min || 0
			this.max = op.max || 999

			this.initBody({
				id:FlyConfig.getObstacleId()
				, mass:op.mass || 1
				, type:p2.Body.STATIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0.8
			})
			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Obstacle, ObjectMask.Obstacle)

			this.initBitmap(op.path)
			this.updatePosition()

			this.setRotation(op.rotation)
		}

		private initBitmap(path:string)
		{
			let png = FlyTools.createBitmapByName(path)
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = this.baseScale * this.width/png.width
			png.scaleY = this.baseScale * this.height/png.height
			this.addChild(png)
		}

		public onContactBegin(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					if (this.min < player.force && player.force < this.max)
					{
						let normal = [0, 0]
						p2.vec2.normalize(normal, player.body.velocity)
						this.body.velocity = [normal[0]*player.force, normal[1]*player.force]
					}
					return
				}
			})
		}

		public onContactEnd(pid:number)
		{
			this.body.velocity = [0, 0]
		}
	}
}


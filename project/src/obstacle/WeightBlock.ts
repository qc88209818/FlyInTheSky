module fly {
	export class WeightBlock extends FlyRect {
		x:number
		y:number
		width:number
		height:number

		baseScale:number = 1.5

		max:number
		min:number
		
		public constructor(x:number, y:number, width:number, height:number, op?) {
			super()
			this.x = x
			this.y = y
			this.width = width
			this.height = height
			this.min = op.min || 0
			this.max = op.max || 999

			this.initBody({
				id:FlyConfig.getObstacleId()
				, mass:op.mass || 1
				, type:op.type || p2.Body.KINEMATIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0
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
			png.scaleX = this.baseScale * this.width/png.width
			png.scaleY = this.baseScale * this.height/png.height
			this.addChild(png)
		}

		public onContactBegin(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					if (this.min < player.body.mass && player.body.mass < this.max)
					{
						let normal = []
						p2.vec2.normalize(normal, player.body.velocity)
						this.body.velocity = [normal[0]*100, normal[1]*100]
					}

					console.log(this.min, player.body.mass, this.max)
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


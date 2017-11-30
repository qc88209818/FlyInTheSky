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
				id:FlyConfig.getBlockId()
				, mass:9999
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0.8
			})
			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block)

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
					let mass = 9999
					if (this.min < player.force && player.force < this.max)
						mass = 1

					if (this.body.mass != mass)
					{
						this.body.mass = mass
						this.body.updateMassProperties()
					}
					return
				}
			})
		}

		public onContactEnd(pid:number)
		{
			this.body.mass = 9999
			this.body.updateMassProperties()
		}
	}
}


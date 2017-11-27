module fly {
	export class WeightTraps  extends FlyRect {
		x:number
		y:number
		width:number
		height:number

<<<<<<< HEAD
		baseScale:number = FlyParam.WeightTrapsBaseScale
=======
		baseScale:number = 1.5
>>>>>>> dbfa2095c53fc846c671658765a0d1cad27ce167

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
				id:FlyConfig.getPropertyId()
				, mass:op.mass || 1
				, type:op.type || p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0
			})
			this.initShape(this.width, this.height)
			this.setGroupAndMask(ObjectGroup.Property, ObjectMask.Property)

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

		public onTrigger(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					if (this.min < player.body.mass && player.body.mass < this.max)
					{
						player.died(4)
					}
					return
				}
			})
		}
	}
}
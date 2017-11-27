module fly {
	export class Traps  extends FlyRect {
		x:number
		y:number
		width:number
		height:number

		baseScale:number = FlyParam.TrapsBaseScale
		
		public constructor(x:number, y:number, width:number, height:number, op?) {
			super()
			this.x = x
			this.y = y
			this.width = width
			this.height = height

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
<<<<<<< HEAD
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			png.scaleX = this.baseScale * this.width/png.width
			png.scaleY = this.baseScale * this.height/png.height
=======
			png.scaleX = this.width/png.width
			png.scaleY = this.height/png.height
>>>>>>> dbfa2095c53fc846c671658765a0d1cad27ce167
			this.addChild(png)
		}

		public onTrigger(pid:number)
		{
			this.isDestroy = true

			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					player.died(3)
					return
				}
			})
		}
	}
}
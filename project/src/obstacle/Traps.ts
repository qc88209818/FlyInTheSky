module fly {
	export class Traps  extends FlyRect {
		x:number
		y:number
		width:number
		height:number
		dir:number
		op:any

		baseScale:number = FlyParam.TrapsBaseScale
		
		public constructor(x:number, y:number, width:number, height:number, op?) {
			super()
			this.layerIndex = 2
			this.x = x + width/2
			this.y = y + height/2
			this.width = width
			this.height = height
			this.op  = op
			this.dir = op.dir || 1

			this.initBody({
				id:FlyConfig.getObstacleId()
				, mass:op.mass || 1
				, type:op.type || p2.Body.DYNAMIC
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
			png.scaleX = this.baseScale * this.width/png.width * this.dir
			png.scaleY = this.baseScale * this.height/png.height
			this.addChild(png)
		}

		public onTrigger(pid:number)
		{
			this.objmgr.players.forEach(player => {
				if (player.body.id == pid)
				{
					player.died(3)
					return true
				}
			})
			return true
		}
	}
}
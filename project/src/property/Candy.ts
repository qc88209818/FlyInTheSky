module fly {
	export class Candy extends FlyCircle {
		x:number
		y:number
		radius:number
		op:any
		candyArray:CandyArray = null

		baseScale:number = FlyParam.CandyBaseScale
		
		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.op  = op

			this.initBody({
				id:FlyConfig.getPropertyId()
				, mass:op.mass || 1
				, type:op.type || p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
				, damping:op.damping || 0
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Property, ObjectMask.Property)
			
			this.initBitmap(op.path)
			this.updatePosition()
			
			this.setRotation(op.rotation)
		}

		private initBitmap(path:string)
		{
			if (path == null) return;
			
			let png = FlyTools.createBitmapByName(path)
			png.scaleX = this.baseScale * this.radius/png.width
			png.scaleY = this.baseScale * this.radius/png.height
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			this.addChild(png)
		}

		public onTrigger(pid:number)
		{
			this.isDestroy = true

			// 减少能量
			let power = this.op.power
			this.objmgr.players.forEach(value => {
				if (value.body.id == pid)
				{
					value.changePower(value.power + (power||FlyParam.candy_power))
				}
			})

			// 如果是有组控制，则不自动生成
			if (this.candyArray != null)
			{
				this.candyArray.onTrigger(this.x, this.y)
				return true
			}

			// delta后创建新的
			let delta = this.op.delta
			if (delta > 0)
			{
				egret.setTimeout(function () {
					if (this.objmgr.scene)
					{
						let candy = new Candy(this.x-this.radius, this.y-this.radius, this.radius, this.op)
						this.objmgr.scene.addToWorld(candy)
					}              
				}, this, delta*1000); 
			}
			return true
		}
	}
}
module fly {
	export class Candy extends FlyCircle {
		x:number
		y:number
		radius:number
		op:any
		
		public constructor(x:number, y:number, radius:number, op?) {
			super()
			this.x = x + radius
			this.y = y + radius
			this.radius = radius
			this.op  = op

			this.initBody({
				id:FlyConfig.getPropertyId()
				, mass:1
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
			})
			this.initShape(this.radius)
			this.setGroupAndMask(ObjectGroup.Property, ObjectMask.Property)
			
			this.initBitmap(op.path)
			this.updatePosition()
		}

		private initBitmap(path:string)
		{
			if (path == null) return;
			
			let png = FlyTools.createBitmapByName(path)
			png.scaleX = 2 * this.radius/png.width
			png.scaleY = 2 * this.radius/png.height
			png.anchorOffsetX = png.width/2
			png.anchorOffsetY = png.height/2
			this.addChild(png)
		}

		public onTrigger(pid:number)
		{
			this.isDestroy = true

			// delta后创建新的
			let delta = this.op.delta
			if (delta > 0)
			{
				egret.setTimeout(function () {              
					let candy = new Candy(this.x-this.radius, this.y-this.radius, this.radius, this.op)
					this.objmgr.scene.addToWorld(candy)
				}, this, delta*1000); 
			}
			
			// 减少能量
			let power = this.op.power
			this.objmgr.players.forEach(value => {
				if (value.body.id == pid)
				{
					value.addPower(power || FlyParam.candy_power)
					return
				}
			})
		}
	}
}
module fly {
	export class FlyCircle extends FlyObject {
		circle:p2.Circle
		rander:egret.Shape

		public constructor() {
            super()
        }

		public initShape(radius: number)
		{
			let shape = new p2.Circle({
				radius:radius
			})
			this.shape = shape
			this.circle = shape
			this.body.addShape(shape)

			this.initRender(radius)
		}

		private initRender(radius: number) 
		{
			let color = FlyTools.getBodyTypeColor(this.body.type)

			let shape = new egret.Shape()
			shape.graphics.beginFill(color, fly.FlyConfig.DebugMode?1:0)
			shape.graphics.drawCircle(0, 0, radius)
			shape.graphics.endFill()
			this.rander = shape

			this.addChild(shape)
		}

		protected changeRenderSize(radius: number)
		{
			let color = FlyTools.getBodyTypeColor(this.body.type)
			
			let shape = this.rander
			shape.graphics.clear()
			shape.graphics.beginFill(color, fly.FlyConfig.DebugMode?1:0)
			shape.graphics.drawCircle(0, 0, radius)
			shape.graphics.endFill()
		}

		protected setRotation(rotation:number)
		{
			this.shape.angle = rotation
			this.rander.rotation = rotation
		}
	}
}
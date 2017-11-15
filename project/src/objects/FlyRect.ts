module fly {
	export class FlyRect extends FlyObject {
		rect:p2.Box
		rander:egret.Shape

		public constructor() {
            super()
        }

		public initShape(width: number, height: number)
		{
			let shape = new p2.Box({
				width:width,
				height:height
			})
			this.shape = shape
			this.rect = shape
			this.body.addShape(shape)

			this.initRender(width, height)
		}

		private initRender(width: number, height: number) 
		{
			let color = FlyTools.getBodyTypeColor(this.body.type)

			let shape = new egret.Shape()
			shape.graphics.beginFill(color, fly.FlyConfig.DebugMode?1:0)
			shape.graphics.drawRect(0, 0, width, height)
			shape.graphics.endFill()
			this.rander = shape

			shape.anchorOffsetX = shape.width/2
			shape.anchorOffsetY = shape.height/2

			this.addChild(shape)
		}

		protected changeRenderSize(width: number, height: number)
		{
			let color = FlyTools.getBodyTypeColor(this.body.type)
			
			let shape = this.rander
			shape.graphics.clear()
			shape.graphics.beginFill(color, fly.FlyConfig.DebugMode?1:0)
			shape.graphics.drawRect(0, 0, width, height)
			shape.graphics.endFill()
		}
	}
}
module fly {
	export class FlyCircle extends FlyObject {
		public constructor() {
            super();
        }

		public initShape(radius: number)
		{
			let shape = new p2.Circle({
				radius:radius
			});
			this.shape = shape;
			this.body.addShape(shape);

			this.initRender(radius);
		}

		private initRender(radius: number) 
		{
			let color = FlyTools.getBodyTypeColor(this.body.type);

			let shape = new egret.Shape();
			shape.graphics.beginFill(color, fly.FlyConfig.DebugMode?1:0);
			shape.graphics.drawCircle(0, 0, radius);
			shape.graphics.endFill();

			this.addChild(shape);
		}
	}
}
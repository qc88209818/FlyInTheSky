module fly {
	export class FlyRect extends FlyObject {
		public constructor() {
            super();
        }

		public initBody(id:number, bodyType: number, x:number, y:number, width: number, height: number)
		{
			this.bodyType = bodyType;

			let obj = new p2.Body({
				type:bodyType
				, id:id
				, mass:1
				, fixedRotation: true
				, position:[x, y]
			});
			this.body = obj;

            let obj2 = new p2.Box({
				width:width,
				height:height
			});
			this.shape = obj2;

			obj.addShape(obj2);
		}

		public initRender(width: number, height: number) 
		{
			let color = FlyTools.getBodyTypeColor(this.bodyType);

			let shape = new egret.Shape();
			shape.graphics.beginFill(color, fly.FlyConfig.DebugMode?1:0);
			shape.graphics.drawRect(0, 0, width, height);
			shape.graphics.endFill();

			shape.anchorOffsetX = shape.width/2;
			shape.anchorOffsetY = shape.height/2;

			super.addChild(shape);
		}
	}
}
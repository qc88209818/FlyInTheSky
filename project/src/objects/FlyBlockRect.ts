module fly {
	export class FlyBlockRect extends P2Object {
		public constructor() {
            super();
        }

		public initBlock(bodyType: number, x:number, y:number, width: number, height: number)
		{
			let obj = new p2.Body({
				type:bodyType
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

		public initRender(width: number, height: number) {
			let shape = new egret.Shape();
			shape.graphics.beginFill(0xFF0000, fly.FlyConfig.DebugMode?1:0);
			shape.graphics.drawRect(0, 0, width, height);
			shape.graphics.endFill();

			shape.anchorOffsetX = shape.width/2;
			shape.anchorOffsetY = shape.height/2;

			this.body.displays = [shape];
			this.updatePosition();
		}
	}
}
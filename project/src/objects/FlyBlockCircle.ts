module fly {
	export class FlyBlockCircle extends P2Object {
		public constructor() {
            super();
        }

        public initBlock(bodyType: number, x:number, y:number, radius: number) 
		{
			let obj = new p2.Body({
				type:bodyType
				, mass:1
				, fixedRotation: true
				, position:[x, y]
			});
			this.body = obj;

            let obj2 = new p2.Circle({
				radius:radius,
			});
			this.shape = obj2;

			obj.addShape(obj2);
        }

		public initRender(radious: number) {
			let shape = new egret.Shape();
			shape.graphics.beginFill(0x00FF00, fly.FlyConfig.DebugMode?1:0);
			shape.graphics.drawCircle(0, 0, radious);
			shape.graphics.endFill();

			this.body.displays = [shape];
			this.updatePosition();
		}
	}
}
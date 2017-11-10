module fly {
	export class FlyCircle extends FlyObject {
		public constructor() {
            super();
        }

        public initBody(id:number, bodyType: number, x:number, y:number, radius: number) 
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
			
            let obj2 = new p2.Circle({
				radius:radius,
			});
			this.shape = obj2;

			obj.addShape(obj2);
        }

		public initRender(radious: number) 
		{
			let color = FlyTools.getBodyTypeColor(this.bodyType);

			let shape = new egret.Shape();
			shape.graphics.beginFill(color, fly.FlyConfig.DebugMode?1:0);
			shape.graphics.drawCircle(0, 0, radious);
			shape.graphics.endFill();

			super.addChild(shape);
		}
	}
}
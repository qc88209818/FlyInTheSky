module fly {
	export class Candy extends FlyBlockCircle {
		radious:number;
		x:number;
		y:number;
		
		public constructor(x:number, y:number, radious:number) {
			super();
			this.x = x + radious;
			this.y = y + radious;
			this.radious = radious;

			super.initBlock(p2.Body.DYNAMIC, this.x, this.y, this.radious);
			super.initRender(this.radious);
		}
	}
}
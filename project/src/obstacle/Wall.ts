module fly {
	export class Wall extends FlyBlockRect {
		width:number;
		height:number;
		x:number;
		y:number;
		
		public constructor(x1:number, y1:number, x2:number, y2:number) {
			super();

			let px = Math.min(x1, x2);
			if (px == x1)
			{
				this.width = x2 - x1;
				this.x = x1 + this.width/2;
			}
			if (px == x2)
			{
				this.width = x1 - x2;
				this.x = x2 + this.width/2;
			}

			let py = Math.min(y1, y2);
			if (py == y1)
			{
				this.height = y2 - y1;
				this.y = y1 + this.height/2;
			}
			if (py == y2)
			{
				this.height = y1 - y2;
				this.y = y2 + this.height/2;
			}

			super.initBlock(p2.Body.STATIC, this.x, this.y, this.width, this.height);
			super.initRender(this.width, this.height);
		}
	}
}
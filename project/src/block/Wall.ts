module fly {
	export class Wall extends FlyRect {
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

			this.initBody({
				id:FlyConfig.getBlockId()
				, mass:1
				, type:p2.Body.STATIC
				, fixedRotation:true
				, position:[this.x, this.y]
			});
			this.initShape(this.width, this.height);
			this.setGroupAndMask(ObjectGroup.Block, ObjectMask.Block);

			this.initBitmap();
			this.updatePosition();
		}

		private initBitmap()
		{
			// let png = FlyTools.createBitmapByName("candy_png");
			// png.anchorOffsetX = png.width/2;
			// png.anchorOffsetY = png.height/2;
			// png.scaleX = 2 * this.radious/png.width;
			// png.scaleY = 2 * this.radious/png.height;
			// this.addChild(png);
		}
	}
}
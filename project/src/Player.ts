module fly {
	export class Player extends FlyCircle {
		radius:number;
		x:number;
		y:number;
		
		public constructor(x:number, y:number, radius:number) {
			super();
			this.x = x;
			this.y = y;
			this.radius = radius;

			this.initBody({
				id:FlyConfig.getPlayerId()
				, mass:1
				, type:p2.Body.DYNAMIC
				, fixedRotation:true
				, position:[this.x, this.y]
			});
			this.initShape(this.radius);
			this.setGroupAndMask(ObjectGroup.Player, ObjectMask.Player);

			this.initBitmap();
			this.updatePosition();
		}

		private initBitmap()
		{
			let png = FlyTools.createBitmapByName("player_down_png");
			png.anchorOffsetX = png.width/2;
			png.anchorOffsetY = png.height/2;
			png.scaleX = 2 * this.radius/png.width;
			png.scaleY = 2 * this.radius/png.height;
			this.addChild(png);
		}
	}
}
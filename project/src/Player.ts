module fly {
	export class Player extends FlyCircle {
		radious:number;
		x:number;
		y:number;
		
		static player_id:number = 0;
		public constructor(x:number, y:number, radious:number) {
			super();
			this.x = x + radious;
			this.y = y + radious;
			this.radious = radious;

			this.initBody(Player.player_id++, p2.Body.DYNAMIC, this.x, this.y, this.radious);
			this.setGroupAndMask(ObjectGroup.Player, ObjectMask.Player);

			this.initRender(this.radious);
			this.initBitmap();

			this.updatePosition();
		}

		private initBitmap()
		{
			let png = FlyTools.createBitmapByName("player_down_png");
			png.anchorOffsetX = png.width/2;
			png.anchorOffsetY = png.height/2;
			png.scaleX = 2 * this.radious/png.width;
			png.scaleY = 2 * this.radious/png.height;
			this.addChild(png);
		}
	}
}
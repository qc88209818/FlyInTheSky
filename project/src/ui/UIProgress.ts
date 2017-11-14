module fly {
	export class UIProgress {
		bg:egret.Shape;
		fr:egret.Shape;

		public constructor() {
		}

		private create(parentNode:egret.DisplayObjectContainer, x:number, y:number, width:number, height:number)
		{
			let bg = new egret.Shape();
			bg.graphics.beginFill(0x000000, fly.FlyConfig.DebugMode?1:0);
			bg.graphics.drawRect(0, 0, width, height);
			bg.graphics.endFill();
			this.bg = bg;

			bg.x = x;
			bg.y = y;
			bg.anchorOffsetX = 0;
			bg.anchorOffsetY = 0.5;
			parentNode.addChild(bg);

			let fr = new egret.Shape();
			fr.graphics.beginFill(0x000000, fly.FlyConfig.DebugMode?1:0);
			fr.graphics.drawRect(0, 0, width, height);
			fr.graphics.endFill();
			this.fr = fr;

			fr.x = x;
			fr.y = y;
			fr.anchorOffsetX = 0;
			fr.anchorOffsetY = 0.5;
			parentNode.addChild(fr);
		}
	}
}
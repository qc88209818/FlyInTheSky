module fly {
	export class FlyTools {
		public static createBitmapByName(name: string): egret.Bitmap {
			let result = new egret.Bitmap();
			let texture: egret.Texture = RES.getRes(name);
			result.texture = texture;
			return result;
		}

		public static getBodyTypeColor(bodyType:number)
		{
			if(bodyType == p2.Body.STATIC)
				return 0xFF0000;
			else if(bodyType == p2.Body.DYNAMIC)
				return 0x00FF00;
			else if(bodyType == p2.Body.KINEMATIC)
				return 0x0000FF;
			else
				return 0xFFFFFF;
		}
	}
}
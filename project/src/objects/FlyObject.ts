 /**
* 物体基类
* @param x 左上角的 x 坐标。
* @param y 左上角的 y 坐标。
* @param type 物体的形状。
*/
module fly {
	export enum ObjectType { 
		None = 0, 
		Rect = 1, 
		Circle = 2 
	};

	export class FlyConfig {
		static DebugMode:boolean;
	}

    class FlyObject {
		type:ObjectType;

		public constructor() {
			this.type = ObjectType.None;
		}
	}

	export class P2Object extends FlyObject {
		body:p2.Body;
		shape:p2.Shape;
		
		public constructor() {
            super();
        }

		public updatePosition()
		{
			if (this.body)
			{
				for(let i = 0; i < this.body.displays.length; ++i)
				{
					this.body.displays[i].x = this.body.position[0];
					this.body.displays[i].y = this.body.position[1];
				}
				
				if (!fly.FlyConfig.DebugMode)
					return;

				if (this.body.sleepState == p2.Body.SLEEPING)
				{
					this.body.displays[0].alpha = 0.5;
				}
				else
				{
					this.body.displays[0].alpha = 1;
				}
			}
		}
	}
}
module fly {
	export enum ObjectType { 
		None = 0, 
		Rect = 1, 
		Circle = 2 
	};

	export enum ObjectGroup {
		None     = 0,
		Block    = Math.pow(2,0),
		Player   = Math.pow(2,1),
		Obstacle = Math.pow(2,2),
		Property = Math.pow(2,3)
	};

	export enum ObjectMask {
		None     = 0,
		Block    = ObjectGroup.Block|ObjectGroup.Player,
		Player   = ObjectGroup.Player|ObjectGroup.Block,
		Obstacle = 0,
		Property = 0
	};

	export class FlyConfig {
		static DebugMode:boolean;		// debug模式
		static stageWidth:number;		// 画布宽度
		static stageHeight:number;		// 画布高度
	}
}
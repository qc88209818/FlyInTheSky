module fly {
	export enum ObjectType { 
		None = 0, 
		Rect = 1, 
		Circle = 2 
	}

	export enum ObjectGroup {
		None     = 0,
		Block    = Math.pow(2,0),
		Player   = Math.pow(2,1),
		Obstacle = Math.pow(2,2),
		Property = Math.pow(2,3),
		AiPlayer = Math.pow(2,4),
	}

	export enum ObjectMask {
		None     = 0,
		Block    = ObjectGroup.Block|ObjectGroup.Player|ObjectGroup.Obstacle|ObjectGroup.AiPlayer,
		Player   = ObjectGroup.Player|ObjectGroup.Block|ObjectGroup.Obstacle|ObjectGroup.AiPlayer,
		Obstacle = ObjectGroup.Obstacle|ObjectGroup.Block|ObjectGroup.Player|ObjectGroup.AiPlayer,
		Property = 0,
		AiPlayer = ObjectGroup.AiPlayer|ObjectGroup.Block|ObjectGroup.Player|ObjectGroup.Obstacle
	}

	export class FlyConfig {
		static DebugMode:boolean	= false		// debug模式
		static width:number				// 画布宽度
		static height:number 			// 画布高度
		static stageWidth:number		// 画布宽度
		static stageHeight:number		// 画布高度

		private static PlayerMinId:number 		= 0
		private static BlockMinId:number 		= 1000
		private static PropertyMinId:number 	= 2000
		private static ObstacleMinId:number 	= 3000
		private static AiPlayerMinId:number 	= 4000

		private static PlayerMaxId:number 		= 1000
		private static BlockMaxId:number 		= 2000
		private static PropertyMaxId:number 	= 3000
		private static ObstacleMaxId:number 	= 4000
		private static AiPlayerMaxId:number 	= 5000

		private static PlayerId:number 		= FlyConfig.PlayerMinId
		private static BlockId:number 		= FlyConfig.BlockMinId
		private static PropertyId:number 	= FlyConfig.PropertyMinId
		private static ObstacleId:number 	= FlyConfig.ObstacleMinId
		private static AiPlayerId:number 	= FlyConfig.AiPlayerMinId

		public static getPlayerId():number
		{
			FlyConfig.PlayerId++
			if (FlyConfig.PlayerId >= FlyConfig.PlayerMaxId)
			{
				FlyConfig.PlayerId = FlyConfig.PlayerMinId
			}
			return FlyConfig.PlayerId
		}

		public static getBlockId():number
		{
			FlyConfig.BlockId++
			if (FlyConfig.BlockId >= FlyConfig.BlockMaxId)
			{
				FlyConfig.BlockId = FlyConfig.BlockMinId
			}
			return FlyConfig.BlockId
		}

		public static getPropertyId():number
		{
			FlyConfig.PropertyId++
			if (FlyConfig.PropertyId >= FlyConfig.PropertyMaxId)
			{
				FlyConfig.PropertyId = FlyConfig.PropertyMinId
			}
			return FlyConfig.PropertyId
		}

		public static getObstacleId():number
		{
			FlyConfig.ObstacleId++
			if (FlyConfig.ObstacleId >= FlyConfig.ObstacleMaxId)
			{
				FlyConfig.ObstacleId = FlyConfig.ObstacleMinId
			}
			return FlyConfig.ObstacleId
		}

		public static getAiPlayerId():number
		{
			FlyConfig.AiPlayerId++
			if (FlyConfig.AiPlayerId >= FlyConfig.AiPlayerMaxId)
			{
				FlyConfig.AiPlayerId = FlyConfig.AiPlayerMinId
			}
			return FlyConfig.AiPlayerId
		}

		public static isPlayer(id:number): boolean
		{
			return FlyConfig.PlayerMinId <= id && id < FlyConfig.PlayerMaxId
		}

		public static isBlock(id:number): boolean
		{
			return FlyConfig.BlockMinId <= id && id < FlyConfig.BlockMaxId
		}

		public static isProperty(id:number): boolean
		{
			return FlyConfig.PropertyMinId <= id && id < FlyConfig.PropertyMaxId
		}

		public static isObstacle(id:number): boolean
		{
			return FlyConfig.ObstacleMinId <= id && id < FlyConfig.ObstacleMaxId
		}

		public static isAiPlayer(id:number): boolean
		{
			return FlyConfig.AiPlayerMinId <= id && id < FlyConfig.AiPlayerMaxId
		}

		public static reset()
		{
			FlyConfig.PlayerId 	 = FlyConfig.PlayerMinId
			FlyConfig.BlockId 	 = FlyConfig.BlockMinId
			FlyConfig.PropertyId = FlyConfig.PropertyMinId
			FlyConfig.ObstacleId = FlyConfig.ObstacleMinId
			FlyConfig.AiPlayerId = FlyConfig.AiPlayerMinId
		}
	}

	export class FlyParam
	{
		static LayerScale:number 		= 1		// 屏幕缩放比例
		static forceScale:number        = 1000		// 力量因子
		static PlayerMaxPower:number 	= 100		// 人物最大能量
		static PlayerMinPower:number 	= 0			// 人物最小能量
		static PlayerInitPower:number 	= 50		// 人物初始能量
		static PlayerInitMass:number    = 1			// 人物初始重量
		static PlayerInitForce:number   = 100		// 人物初始力量
    
		static PlayerStep:number[]       = [25, 75, 100]	// 能量阶段
		static PlayerVelScale:number[]   = [0.5, 0.4, 0.3]	// 速度倍数
		static PlayerTijiScale:number[]  = [0.9, 1, 1.1]	// 体积倍数-图片
		static PlayerRadiusScale:number[]= [0.7, 1, 1.5]	// 体积倍数-刚体
		static PlayerMassScale:number[]  = [10, 25, 50]		// 重量倍数
		static PlayerForceScale:number[] = [0.5, 1, 2]		// 力量倍数
		static PlayerMoviePostfix:string[] = ["_lean", "_normal", "_fat"]	// 力量倍数

		static candy_power:number 		= 10		// 糖果能量
		static move_power:number 		= -3		// 移动消耗能量

		static PlayerBaseScale:number   		= 1		// 基本缩放
		static CandyBaseScale:number			= 2		
		static TrapsBaseScale:number			= 1		
		static WeightTrapsBaseScale:number		= 2		
		static PlaneBaseScale:number			= 2
		static AiBaseScale:number				= 3
		static WeightBlockBaseScale:number		= 1
	}
}
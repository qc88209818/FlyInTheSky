module fly {
	class candyModel
	{
		x:number
		y:number
		radius:number
		op:any
		use:boolean
	}

	export class CandyArray {
		num:number = 0
		nowNum:number = 0;
		models:candyModel[] = []
		objmgr = ObjectManager.inst()

		public constructor() {

		}

		public add(candy:Candy)
		{
			candy.candyArray = this

			let model = new candyModel()
			model.x = candy.x
			model.y = candy.y
			model.radius = candy.radius
			model.op = candy.op
			model.use = true
			this.models.push(model)

			this.nowNum += 1
		}

		public onTrigger(x:number, y:number)
		{
			this.models.forEach(value =>{
				if (value.x == x && value.y == y)
				{
					value.use = false
					this.nowNum -= 1
				}
			})

			// 数量少于num时，自动生成candy
			if (this.nowNum < this.num && this.nowNum < this.models.length)
			{
				let num = 0
				do
				{
					num = parseInt("" + Math.random()*this.models.length, 10)
				}
				while(this.models[num].use)

				let model = this.models[num]
				model.use = true
				this.nowNum += 1

				egret.setTimeout(function () {
					if (this.objmgr.scene)
					{
						let candy = new Candy(model.x-model.radius, model.y-model.radius, model.radius, model.op)
						candy.candyArray = this
						this.objmgr.scene.addToWorld(candy)
					}              
				}, this, model.op.delta*1000); 
			}
		}
	}
}
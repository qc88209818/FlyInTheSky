
class Main extends egret.DisplayObjectContainer {
    ball:fly.Candy;
    world:p2.World;

    public constructor() {
        super();

        fly.FlyConfig.DebugMode = true;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.createGameScene();

        egret.lifecycle.addLifecycleListener((conttext) => {
            conttext.onUpdate = () => {
                console.log('Start Game2!');
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
            console.log('Game2 onPause!');
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
            console.log('Game2 onResume!');
        }

        //添加帧事件侦听
        egret.Ticker.getInstance().register(function (dt) {
            //使世界时间向后运动
            this.world.step(dt/1000);
            this.ball.updatePosition();
        }, this);
    }

    private createGameScene() {
        this.world = new p2.World({
            gravity:[0, 100]
        });
        this.world.sleepMode = p2.World.BODY_SLEEPING;

        let wall1 = new fly.Wall(0, 0, this.stage.stageWidth, 10);
        let wall2 = new fly.Wall(0, 0, 10, this.stage.stageHeight);
        let wall3 = new fly.Wall(this.stage.stageWidth, this.stage.stageHeight, this.stage.stageWidth - 10, 0);
        let wall4 = new fly.Wall(this.stage.stageWidth, this.stage.stageHeight, 0, this.stage.stageHeight - 10);

        this.addToWorld(wall1);
        this.addToWorld(wall2);
        this.addToWorld(wall3);
        this.addToWorld(wall4);

        this.ball = new fly.Candy(300, 300, 100);
        this.addToWorld(this.ball);
    }

    private addToWorld(obj:fly.P2Object)
    {
        this.stage.addChild(obj.body.displays[0]);
        this.world.addBody(obj.body);
    }
}
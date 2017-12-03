//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class UILoading extends egret.Sprite {

    public constructor() {
        super();
        this.createView();
    }

    private textField:egret.TextField;
    private bar:egret.Bitmap ;
    private bar_bg:egret.Bitmap ;
    private bar_mask:egret.Bitmap;
    private loadAmin:egret.MovieClip;
    private bar_width:number;
    private createView():void {
     
		let bg = fly.FlyTools.createBitmapByName("background_jpg")
		bg.scaleX = fly.FlyConfig.width/bg.width
		bg.scaleY = fly.FlyConfig.height/bg.height
		this.addChild(bg)

        this.bar_bg = new  egret.Bitmap();
        this.bar_bg.texture = RES.getRes("bar_bg_png");
        this.addChild(this.bar_bg);

        this.bar = new  egret.Bitmap();
        this.bar.texture = RES.getRes("load_bar_png");
        this.addChild(this.bar);

        this.bar_mask = new  egret.Bitmap();
        this.bar_mask.texture = RES.getRes("load_mask_png");
        this.bar_width =  this.bar_mask.width;
        this.bar_mask.width = 1;
        this.addChild(this.bar_mask);
        this.bar.mask = this.bar_mask;

        this.textField = new egret.TextField();
        this.textField.anchorOffsetX = this.textField.width/2
        this.textField.anchorOffsetY = this.textField.height/2
        this.textField.textAlign = "center";
        this.textField.scaleX = 0.68;
        this.textField.scaleY = 0.68;
        this.textField.x = 110;
        this.textField.y = 6;
        this.addChild(this.textField);

        let data = RES.getRes("loading_amin_json");
        let txtr = RES.getRes("loading_amin_png");
        let mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this.loadAmin = new egret.MovieClip( mcFactory.generateMovieClipData( "loading" ) );
        this.loadAmin.gotoAndPlay("start",-1);
        this.addChild(this.loadAmin);
        this.loadAmin.y = -60;
        this.loadAmin.x = 180;


    }

    public setProgress(current:number, total:number):void {
        this.textField.text = `${current}/${total}`;
        this.bar_mask.width = current/total * this.bar_width;
    }
}
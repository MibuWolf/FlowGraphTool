/**
* name 程序入口类
*/
import LoginView = ui.LoginView;
import WebGL = Laya.WebGL;
import Handler = Laya.Handler;
import ByteArray = Laya.Byte;
import Dictionary = Laya.Dictionary;
import Stage = Laya.Stage;

import IData = core.IData;
import DataManager = core.DataManager;
import Editor = ui.Editor;
import Socket = Laya.Socket;
import Byte = Laya.Byte;

import Sprite = Laya.Sprite;

const RED_FILTER = new Laya.ColorFilter([
		1, 0, 0, 0, 0, //R
		0, 0, 0, 0, 0, //G
		0, 0, 0, 0, 0, //B
		0, 0, 0, 1, 0, //A
	]);

//程序入口
Laya.init(1900, 1000, WebGL);
//激活资源版本控制
Laya.ResourceVersion.enable("version.json", Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);

function beginLoad():void{
	Laya.loader.load("res/atlas/editor.atlas", Handler.create(null, onLoaded));
}

function onLoaded(): void {
	let loginView:LoginView = new LoginView();
	Laya.stage.addChild(loginView);
	//EventManager.getInstance().Test();
	// let container:Laya.Sprite = new Laya.Sprite();
	// let sp:Laya.Sprite = new Laya.Sprite();
	// sp.x = 100;
	// sp.y = 100;
	// sp.width = 100;
	// sp.height = 200;
	// sp.graphics.drawRect(50, 50, sp.width, sp.height, "#ff0000");
	// sp.on(Laya.Event.CLICK, null, onClick);
	// container.addChild(sp);
	// Laya.stage.addChild(container);

	// drawInteractiveLine(container, 300, 800, 600, 800, "#00ff00", 3);

	//Laya.stage.on(Laya.Event.KEY_DOWN, null, onTraceShape);
}

function onTraceShape(evt:Laya.Event):void
{
	if(evt.keyCode == 192)
	{
		for(let i:number = 0; i < Laya.stage.numChildren; ++i)
		{
			// let child:Laya.Node = Laya.stage.getChildAt(i);
			// if(typeof(child) == "Laya.Sprite")
			// {

			// }
			
			//if(child.numChildren)
		}
	}
}

function createFilters():any
{
	let colorMatrix = [
							1, 0, 0, 0, 0, //R
							0, 0, 0, 0, 0, //G
							0, 0, 0, 0, 0, //B
							0, 0, 0, 1, 0, //A
						];
	let red_filter = new Laya.ColorFilter(colorMatrix);
	return [red_filter];
}

function drawInteractiveLine(container:Sprite, fromX: number, fromY: number, toX: number, toY: number, lineColor: string, lineWidth?: number):void
{
	    // container.graphics.drawLine(fromX, fromY, toX, toY, lineColor, lineWidth);
		// let sp:Sprite = new Sprite();

		// let length:number = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
		// let angle:number = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
		// sp.width = length;
		// sp.height = lineWidth * 2.2;
		// sp.graphics.drawRect(0, 0, sp.width, sp.height, "#ff0000");
		// sp.x = fromX;
		// sp.y = fromY - 5;
		// //sp.pivot(0, 0);
		// sp.rotation = angle;
		// sp.on(Laya.Event.CLICK, null, onClick);
		// container.addChild(sp);

		// container.on(Laya.Event.KEY_DOWN, null, onTestKeyDown);
}
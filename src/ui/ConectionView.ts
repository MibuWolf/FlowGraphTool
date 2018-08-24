/**
* @desc 连接视图
* @author confiner
*/
module ui{
	import Sprite = Laya.Sprite;
	import Point = Laya.Point;
	import IData = core.IData;
	import Relation = core.Relation;
	import Event = Laya.Event;
	import Rectangle = Laya.Rectangle;
	import EventTyp = core.EventType;

	const LINE_SPACE:number = 20;
	const LINE_COLOR:string = "#00ff00";
	const LINE_SIZE:number = 3;
	export class ConectionView extends Sprite implements IData
 	{
		data:Relation;
		private _containers:Array<Sprite>;

		setData(data:Relation):void
		{
			this.data = data;
		}

		constructor()
		{
			super();
			this.mouseEnabled = true;
			this._containers = new Array<Sprite>();
			this.on(Event.CLICK, this, this.onClickHandler);
		}

		private onClickHandler(evt:Event):void
		{
			let sp:Sprite = evt.target as Sprite;
			this.drawLine(this.data.left.getOffset(), this.data.right.getOffset(), true, "#ff0000");
			Laya.stage.on(Event.KEY_DOWN, this, this.onDeleteHandler);
		}

		private onDeleteHandler(evt:Event):void
		{
			Laya.stage.off(Event.KEY_DOWN, this, this.onDeleteHandler);
			if(evt.keyCode == 46)
			{
				Laya.stage.event(EventTyp.REMOVE_CONNECTION, this);
				this.destroy(true);
			}
		}

		private drawInteractiveLine(fromX: number, fromY: number, toX: number, toY: number, color?:any):void
		{
			this.graphics.drawLine(fromX, fromY, toX, toY, color ? color : LINE_COLOR, LINE_SIZE);
			let sp:Sprite = new Sprite();
			let length:number = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
			let angle:number = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
			sp.width = length;
			sp.height = LINE_SIZE * 2.2;
			sp.x = fromX;
			sp.y = fromY - 0.6 * LINE_SIZE;
			sp.rotation = angle;
			sp.pivot(0, sp.height / 2);
			this.addChild(sp);
			sp.on(Event.CLICK, this, this.onClickHandler);
			this._containers.push(sp);
			//sp.graphics.drawRect(0, 0, sp.width, sp.height, "#000000");
		}

		// 画线
		public drawLine(startPoint:Point, endPoint:Point, isIn:boolean, color?:any):void
		{
			this.clearLine();
			if(Math.abs(startPoint.y - endPoint.y) < LINE_SIZE)
			{
				this.drawInteractiveLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y, color);
			}	
			else
			{
				let startX:number = isIn ? startPoint.x - LINE_SPACE : startPoint.x + LINE_SPACE;
				let endX:number = isIn ? endPoint.x + LINE_SPACE : endPoint.x - LINE_SPACE;
				this.drawInteractiveLine(startPoint.x, startPoint.y, startX, startPoint.y, color);

				this.drawInteractiveLine(startX, startPoint.y, endX, endPoint.y, color);
				
				this.drawInteractiveLine(endX, endPoint.y, endPoint.x, endPoint.y, color);
			}
		}

		public update():void
		{
			this.drawLine(this.data.left.getOffset(), this.data.right.getOffset(), true);
		}

		public drawDottedLine():void
		{
			this.clearLine();
		}

		public clearLine():void
		{
			this.graphics.clear();
			while(this._containers.length > 0)
			{
				let container:Sprite = this._containers.pop();
				container.off(Event.CLICK, this, this.onClickHandler);
				container.graphics.clear();
				container.destroy();
			}
		}

	}
}
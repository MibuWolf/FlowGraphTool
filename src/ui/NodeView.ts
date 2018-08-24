/**
* @author confiner
* @desc 节点视图 
*/
module ui{

	import Elements = ui.Editor.Elements;
	import Event = Laya.Event;
	import Rectangle = Laya.Rectangle;
	import EventType = core.EventType;
	import IItem = core.IItem;

	export class NodeView extends Elements.NodeViewUI implements IData
	{
		private _dragRegion:Rectangle = null; 	// 拖拽区域
		private _box_slots:SlotsView = null; // 插槽界面
		data:Object;	// 节点数据

		constructor(dragRegion:Rectangle)
		{
			super();
			this._dragRegion = dragRegion;
			this.addEvents();
		}

		// 销毁对象
		destroy(destroyChild?: boolean):void
		{
			this.removeEvents();
			super.destroy(destroyChild);
		}

		// 添加事件
		private addEvents():void
		{
			this.on(Event.MOUSE_DOWN, this, this.onStartDrag);
			this.on(Event.MOUSE_UP, this, this.onEndDrag);
			this.on(Event.CLICK, this, this.onClickHandler);
			this.checkCall.clickHandler = new Handler(this, this.clickHandler, [this.checkCall]);
			this.checkReturn.clickHandler = new Handler(this, this.clickHandler, [this.checkReturn]);
		}

		private clickHandler(check:Laya.CheckBox):void
		{
			if(check == this.checkCall)
				this.data["children_flow_graph_call"] = this.data["id"];
			else if(check == this.checkReturn)
				this.data["children_flow_graph_return"] = this.data["id"];
		}

		private onClickHandler(evt:Event):void
		{
			Laya.stage.event(EventType.REMOVE_NODE, this.data["id"]);
			evt.stopPropagation();
		}

		// 移除事件
		private removeEvents():void
		{
			this.off(Event.MOUSE_DOWN, this, this.onStartDrag);
			this.off(Event.MOUSE_UP, this, this.onEndDrag);
			this.off(Event.CLICK, this, this.onClickHandler);
		}

		 private onStartDrag(e: Event): void 
		 {
            //鼠标按下开始拖拽
            this.startDrag(this._dragRegion);
			this.stage.event(EventType.NODE_DRAG_START, [this.data["id"]]);
        }

		private onEndDrag(e: Event): void 
		{
            this.stopDrag();
			this.stage.event(EventType.NODE_DRAG_END, [this.data["id"]]);
        }

		// 更新
		private update():void
		{
			this.box_title.txt_nodeName.text = this.data["name"];
			this.box_title.txt_nodeType.text = this.data["type"];
			this.checkCall.selected = this.data["children_flow_graph_call"] == this.data["id"];
			this.checkReturn.selected = this.data["children_flow_graph_return"] == this.data["id"];
	
			if(!this._box_slots)
			{
				this._box_slots = new SlotsView();
				this._box_slots.y = this.box_title.y + this.box_title.height + 5;
				this.addChild(this._box_slots);
			}

			this._box_slots.setData(this.data);

			if(this.box_title.bg.width < this.width)
			{
				this.box_title.bg.width = this.width;
				this.bg.width = this.width;
			}
			
			if(this.width > this._box_slots.width)
			{
				this._box_slots.setWidth(this.width);
			}

			this.bg.height = this._box_slots.y + this._box_slots.height + 10;
		}

		public getSlotIns():Array<Object>
		{
			return this._box_slots.list_slotsIn.array;
		}

		public getSlotsOuts():Array<Object>
		{
			return this._box_slots.list_slotsOut.array;
		}

		public getItem(slotName:string):IItem
		{
			for(let i:number = 0; i < this._box_slots.list_slotsOut.array.length; ++i)
			{
				if(this._box_slots.list_slotsOut.array[i]["name"] == slotName)
					return this._box_slots.list_slotsOut.cells[i];
			}

			for(let i:number = 0; i < this._box_slots.list_slotsIn.array.length; ++i)
			{
				if(this._box_slots.list_slotsIn.array[i]["name"] == slotName)
					return this._box_slots.list_slotsIn.cells[i];
			}
			
			return null;
		}

		// 设置数据
		setData(data:Object):void
		{
			this.data = data;
			this.data["id"] = this.data["id"] ? this.data["id"] : DataManager.getInstance().guid();
			this.update();
			this.graphics.drawLine(0, 0, this.width, 0, "#ff0000", 1);
			this.graphics.drawLine(this.width, 0, this.width, this.height, "#ff0000", 1);
			this.graphics.drawLine(this.width, this.height, 0, this.height, "#ff0000", 1);
			this.graphics.drawLine(0, this.height, 0, 0, "#ff0000", 1);
		}
	}
}
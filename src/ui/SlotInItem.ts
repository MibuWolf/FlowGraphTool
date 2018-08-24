/**
* @author confiner
* @desc  输入插槽Item
*/
module ui{
	import Elements = ui.Editor.Elements;
	import Event = Laya.Event;
	import EventType = core.EventType;
	import Point = Laya.Point;
	import IItem = core.IItem;
	import Sprite = Laya.Sprite;

	export class SlotInItem extends Elements.SlotInItemUI implements IItem
	{
		anchor:Sprite;

		setAnchor(anchor:Sprite):void
		{
			this.anchor = anchor;
		}

		getOffset():Point
		{
			let gloabalPos:Point = this.getGlobalPos();
			let anchorPos:Point = this.anchor.localToGlobal(new Point(0, 0));
			let offset =new Point(gloabalPos.x - anchorPos.x, gloabalPos.y - anchorPos.y);
			return new Point(this.anchor.x + offset.x, this.anchor.y + offset.y);
		}

		private getGlobalPos():Point
		{
			let pos:Point = new Point(this.clip_slotIcon.x, this.clip_slotIcon.y + (this.clip_slotIcon.height >> 1));
			let globalPos:Point = this.localToGlobal(pos);
			return globalPos;
		}

		constructor()
		{
			super();
			this.addEvents();
		}

		destroy(destroyChild?: boolean):void
		{
			this.removeEvents();
			super.destroy(destroyChild);
		}

		private addEvents():void
		{
			this.clip_slotIcon.on(Event.CLICK, this, this.onEventHander);
			this.clip_slotIcon.on(Event.MOUSE_DOWN, this, this.onEventHander);
			this.clip_slotIcon.on(Event.MOUSE_UP, this, this.onEventHander);
			this.clip_slotIcon.on(Event.MOUSE_OVER, this, this.onEventHander);
			this.clip_slotIcon.on(Event.MOUSE_OUT, this, this.onEventHander);
			this.input_slotValue.on(Event.INPUT, this, this.onInputHandler);
		}

		public setValue(value:string):void
		{
			this.input_slotValue.text = value;
		}

		private onInputHandler(evt:Event):void
		{
			this.dataSource["value"] = this.input_slotValue.text;
		}

		private onEventHander(evt:Event):void
		{
			switch(evt.type)
			{
				case Event.MOUSE_OVER:
					if(DataManager.drawing)
					{
						Laya.stage.event(EventType.LINE_END, [this.getGlobalPos(), this]);
					}
					this.clip_slotIcon.filters = createFilters();
					evt.stopPropagation();
					break;
				case Event.MOUSE_OUT:
					this.clip_slotIcon.filters = null;
					break;
				case Event.MOUSE_DOWN:
					Laya.stage.event(EventType.LINE_START, [this.getGlobalPos(), this]);
					evt.stopPropagation();
				break;
				case Event.MOUSE_UP:
					evt.stopPropagation();
				break;
			}	
		}

		private removeEvents():void
		{
			this.clip_slotIcon.off(Event.CLICK, this, this.onEventHander);
			this.clip_slotIcon.off(Event.MOUSE_DOWN, this, this.onEventHander);
			this.clip_slotIcon.off(Event.MOUSE_OVER, this, this.onEventHander);
			this.clip_slotIcon.off(Event.MOUSE_OUT, this, this.onEventHander);
			this.input_slotValue.off(Event.INPUT, this, this.onInputHandler);
		}
	}
}
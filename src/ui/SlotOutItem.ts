/**
* @author confiner
* @desc  输出插槽Item
*/
module ui{
	import Elements = ui.Editor.Elements;
	import IItem = core.IItem;
	import Point = Laya.Point;
	import Sprite = Laya.Sprite;
	import Event = Laya.Event;
	import EventType = core.EventType;

	export class SlotOutItem extends Elements.SlotOutItemUI implements IItem
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
			let pos:Point = new Point(this.clip_slotIcon.x + this.clip_slotIcon.width, this.clip_slotIcon.y + (this.clip_slotIcon.height >> 1));
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

					// let colorMatrix = [
					// 		1, 0, 0, 0, 0, //R
					// 		0, 0, 0, 0, 0, //G
					// 		0, 0, 0, 0, 0, //B
					// 		0, 0, 0, 1, 0, //A
					// 	];
					// let RED_FILTER = new Laya.ColorFilter(colorMatrix);
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
		}
	}
}
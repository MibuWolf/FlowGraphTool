/**
* @desc 所有流图界面
* @author confiner
*/
module ui{
	import DataManager = core.DataManager;
	import EventType = core.EventType;

	export class GraphsView extends Editor.GraphsViewUI{
		constructor(){
			super();
			this.initialize();
		}

		protected initialize(): void
		{
			super.initialize();
			
			let names:Array<string> = DataManager.getInstance().getAllGraphNames();
			this.list_graphs.array = names;
			this.list_graphs.repeatY = names.length;
			this.list_graphs.renderHandler = new Laya.Handler(this, this.onListRender);
		}

		private onListRender(cell:Laya.Box, index: number):void
		{
			let labl:Laya.Label = cell.getChildByName("graphName") as Laya.Label;
			labl.text = this.list_graphs.array[index];
			labl.on(Laya.Event.CLICK, this, this.onClickHandler, [this.list_graphs.array[index]]);
		}

		private onClickHandler(graphName:string, evt:Laya.Event):void
		{
			Laya.stage.event(EventType.RELOAD_GRAPH, [graphName]);
			evt.target.off(Laya.Event.CLICK, this, this.onClickHandler);
			this.destroy();
		}
	}
}
/**
* @desc 服務管理器
* @author confiner
*/
module core{
	export class ServerManager
	{
		private _server:client;	// 服務器連接
		private _address:string;

		static CONNECT_SUCCESS:string = "connect_success"; 	// 連接成功

		private init():void
		{
			this._server = new client("qweqweqwewqeqw");
			this._address = "ws://172.16.1.162:1788?t=test";
			Laya.timer.frameLoop(1, this, this.poll);
		}

		private poll():void
		{
			this._server.poll();
		}

		// 連接服務器
		public connect(address?:string):void
		{
			if(address)
				this._address = address;
			ServerManager._inst._server.add_event_listen("client_node", this.onGetNodesDescriptor);
			ServerManager._inst._server.add_event_listen("client_node_debug_info", this.onGetNodesDebugInfo);
			ServerManager._inst._server.add_event_listen("client_graph", this.onGetGraphs);
			ServerManager._inst._server.add_event_listen("on_connect_server", this.onConnectSuccess);
			ServerManager._inst._server.connect_server(this._address);
		}


		public sendGraph(jsonStr:string):void
		{
			ServerManager._inst._server.call_hub("flowGraphData", "flowGraphInfo", jsonStr);
		}

		public sendDebugInfo(nodeId:number):void
		{
			ServerManager._inst._server.call_hub("flowGraphData", "", nodeId);
		}

		private onConnectSuccess():void
		{
			console.log("serverManager connect success!");
			
			Laya.stage.event(ServerManager.CONNECT_SUCCESS);
		}

		private onGetGraphs(jsonStr:string):void
		{
			DataManager.getInstance().parseGrahps(jsonStr);
			Laya.stage.event(EventType.SYNC_GRAPH);
		}

		private onGetNodesDescriptor(jsonStr:string):void
		{
			DataManager.getInstance().parseNodesDescriptor(jsonStr);
			Laya.stage.event(EventType.NODES_READY);
		}

		private onGetNodesDebugInfo(jsonStr:string):void
		{
		}

		private static _inst:ServerManager; //单例对象

		private constructor()
		{
			this.init();
		}

		// 获取单例接口
		public static getInstance():ServerManager
		{
			if(!ServerManager._inst)
			{
				ServerManager._inst = new ServerManager();
			}

			return ServerManager._inst;
		}
	}
}
/**
* @desc 登陸界面
* @author confiner
*/
module ui{
	import ServerManager = core.ServerManager;
	import Event = Laya.Event;

	export class LoginView extends Editor.LoginViewUI
	{
		constructor()
		{
			super();
		}

		protected initialize(): void
		{
			this.x = (Laya.stage.width - this.width) >> 1;
			this.y = (Laya.stage.height - this.height) >> 1;
			this.btn_login.on(Event.CLICK, this, this.onLoginHandler);
			this.stage.on(ServerManager.CONNECT_SUCCESS, this, this.onConnectSuccess);
			super.initialize();
		}

		private onConnectSuccess():void
		{
			let mainWindow:MainWindow = new MainWindow();
			Laya.stage.addChild(mainWindow);
			this.destroy();
		}

		private onLoginHandler():void
		{
			// let ws:WebSocket = new WebSocket("ws://172.16.1.100:1788/Nodes");
			// ws.onopen = function (){
            // 	console.log("Openened connection to websocket");
			// 	//ws.send("layabox");
        	// };
        	// ws.onclose = function () {
            // 	console.log("Close connection to websocket");
        	// }

			// ws.onmessage = function (e) {
			// 	let ob:Object = JSON.parse(e.data);
			// 	alert(ob["age"] + "  " + ob["data"] + ob["type"]);
			// }
			//ServerManager.getInstance().connect();
			let url:string = this.inputIP.text.trim();
			ServerManager.getInstance().connect("ws://" + url + ":1788/Nodes");
		}

		public destroy():void
		{
			this.btn_login.off(Event.CLICK, this, this.onLoginHandler);
			super.destroy();
		}
	}
}
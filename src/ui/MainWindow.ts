/**
* name 主窗口界面
*/
module ui{
	import Rectangle = Laya.Rectangle;
	import EventType = core.EventType;
	import Point = Laya.Point;
	import Event = Laya.Event;
	import SlotType = core.SlotType;
	import Relation = core.Relation;
	import IItem = core.IItem;
	import ServerManager = core.ServerManager;
	import IData = core.IData;

	export class MainWindow extends Editor.MainWindowUI implements IData
	{
		private _dragRegion:Rectangle;	// 拖拽区域
		private _conections:Array<ConectionView>;
		private _curConnection:ConectionView;
		private _startPos:Point;
		private _endPos:Point;
		private _nodes:Dictionary;	// list of node
		private _dragingNode:boolean = false;
		private _activeNodeView:NodeView = null;

		data:Object = null;	// 存在的流图数据

		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this._conections = new Array<ConectionView>();
			this._nodes = new Dictionary();
			this._dragRegion = new Rectangle(0, 0, this.width, this.height);
			Laya.stage.graphics.drawRect(this._dragRegion.x, this._dragRegion.y, this._dragRegion.width, this._dragRegion.height, "#c0c0c0");

			this.file.on(Laya.Event.CLICK, this, this.onClick);
			this.view.on(Laya.Event.CLICK, this, this.onClick);
			this.btn_save.on(Event.CLICK, this, this.onClick);
			Laya.stage.on(EventType.LINE_START, this, this.onLineStartHandler);
			Laya.stage.on(EventType.LINE_END, this, this.onLineEndHandler);
			Laya.stage.on(EventType.NODE_DRAG_START, this, this.onNodeTragStartHandler);
			Laya.stage.on(EventType.NODE_DRAG_END, this, this.onNodeTragEndHandler);
			Laya.stage.on(EventType.ADD_NODE, this, this.onAddNodeHandler);
			Laya.stage.on(Event.KEY_DOWN, this, this.onKeyDownHandler);
			Laya.stage.on(EventType.NODES_READY, this, this.onNodesReadyHandler);
			Laya.stage.on(EventType.REMOVE_NODE, this, this.onRemoveNodeHandler);
			Laya.stage.on(EventType.REMOVE_CONNECTION, this, this.onRemoveConnectionHandler);
			Laya.stage.on(EventType.RELOAD_GRAPH, this, this.onReloadGraphHandler);
			this.on(Event.MOUSE_UP, this, this.onMouseUpHandler);
			this.on(Event.MOUSE_DOWN, this, this.onPressHandler);
			this.on(Event.CLICK, this, this.onClickHandler);
			Laya.timer.frameLoop(1, this, this.postUpdate);
		}

		private onKeyDownHandler(evt:Event):void
		{
			if(evt.keyCode == 46)
			{
				if(this._activeNodeView)
					this.removeNodeView(this._activeNodeView.data["id"]);
			}
		}

		private onNodesReadyHandler():void
		{
			let nodePalette:NodePalette = new NodePalette(this._dragRegion);
			nodePalette.y = 64;
			this.addChild(nodePalette);
		}
		
		// create node view
		private createNodeView(node:Object, anchor:Point):void
		{
			let nodeView:NodeView = new NodeView(this._dragRegion);
			nodeView.setData(node);
			nodeView.x = anchor.x;
			nodeView.y = anchor.y;
			this.addChild(nodeView);
			if(this._nodes.get(nodeView.data["id"]))
			{
				console.log("！！@@@@@@id 重复");
			}
			else
			{
				this._nodes.set(nodeView.data["id"], nodeView);
			}
		}

		private removeNodeView(nodeId:string):void
		{
			let badArray:Array<ConectionView> = new Array<ConectionView>();
			// 删除node关联的relation
			for(let index = 0; index < this._conections.length; ++index)
			{
				let relation:Relation = this._conections[index].data;
				if(relation.inputNodeId.toString() == nodeId || relation.outputNodeId.toString() == nodeId)
				{
					badArray.push(this._conections[index]);
				}
			}

			for(let index = 0; index < badArray.length; ++index)
			{
				for(let idx = 0; idx < this._conections.length; ++idx)
				{
					if(this._conections[idx].data.equals(badArray[index].data))
					{
						this._conections[idx].destroy();
						this._conections.splice(idx, 1);
					}
				}
			}

			// 删除node界面
			let nodeView:NodeView = this._nodes.get(nodeId);
			this.removeChild(nodeView);
			this._nodes.remove(nodeId);
			DataManager.getInstance().removeSlotData(Number(nodeId));
		}

		private onPressHandler(evt:Event):void
		{
			
		}

		private onClickHandler(evt:Event):void
		{
			this._activeNodeView = null;
		}

		private postUpdate():void
		{
			if(DataManager.drawing)
			{
				let sX:number = this._startPos.x;
				let sY:number = this._startPos.y;
				let eX:number = this.mouseX;
				let eY:number = this.mouseY;
				let startPoint:Point = new Point(sX, sY);
				startPoint = this.globalToLocal(startPoint);
				let endPoint:Point = new Point(eX, eY);
				endPoint = this.globalToLocal(endPoint);
				this._curConnection.drawLine(startPoint, endPoint, this._curConnection.data.left == null);
			}

			if(this._dragingNode)
			{
				let connection:ConectionView = null;
				for(let i in this._conections)
				{
					connection = this._conections[i];
					connection.update();
				}
			}		
		}

		private onMouseUpHandler(evt:Event):void
		{
			Laya.stage.event(EventType.LINE_END, [null]);
		}

		private onLineEndHandler(pos:Point, item:Object):void
		{
			DataManager.drawing = false;
			let clear:boolean = true;
			if(item)
			{
				let data:Object = item["dataSource"];
				let cur:Relation = this._curConnection.data;
				let other:Relation = DataManager.getInstance().createRelation(data);
				if(DataManager.getInstance().checkAndMegreRelation(cur, other))
				{
					if(other.inputNodeId > 0)
						cur.left = item as IItem;
					else 
						cur.right = item as IItem;
					this._conections.push(this._curConnection);
					let startPoint:Point = this._startPos;
					startPoint = this.globalToLocal(startPoint);
					let endPoint:Point = pos;
					endPoint = this.globalToLocal(pos);
					this._curConnection.drawLine(startPoint, endPoint, true);
					this._curConnection = null;
					clear = false;
				}
			}

			if(this._curConnection && clear)
			{
				this._curConnection.clearLine();
				this.removeChild(this._curConnection);
				this._curConnection.destroy();
				this._curConnection = null;
			}
		}
		
		private onLineStartHandler(startPos:Point, item:Object):void
		{
			this._startPos = startPos;
			DataManager.drawing = true;
			let connection:ConectionView = new ConectionView();
			this.addChild(connection);
			let relation:Relation = DataManager.getInstance().createRelation(item["dataSource"]);
			if(relation.inputNodeId > 0)
				relation.left = item as IItem;
			else 
				relation.right = item as IItem;
			connection.setData(relation);
			this._curConnection = connection;
		}

		// 開始拖動節點
		private onNodeTragStartHandler(nodeId:number):void
		{
			this._dragingNode = true;
			this._activeNodeView = this._nodes.get(nodeId);
		}

		// 結束拖動節點
		private onNodeTragEndHandler(nodeId:number):void
		{
			this._dragingNode = false;
		}

		// 清理
		private clear():void
		{
			for(let nodeView of this._nodes.values)
			{
				nodeView.destroy();
			}
			this._nodes.clear();

			while(this._conections.length > 0)
			{
				let connectionView = this._conections.pop();
				connectionView.destroy();
			}
		}

		// 更新界面
		private update():void
		{
			this.clear();

			// 获取流图名称
			this.input_graphName.text = this.data["name"];	

			// 获取event节点
			let eventsObj:Object = this.data["event"];
			
			// 缓存关系插槽
			let nextEndPoint:Array<Object> = new Array<Object>();
			let inputEndPoint:Array<Object> = new Array<Object>();
			let valueEndPint:Array<Object> = new Array<Object>();

			// 获取节点数据创建节点视图
			for(let nodeId in this.data)
			{
				let nodeObj:Object = this.data[nodeId];
				let nodeName:string = nodeObj["name"];
				if(nodeName && nodeName != "")
				{
					let pos:Array<number> = nodeObj["ui_position"];
					if(nodeName == "flow_graph_node")
					{
						nodeName = nodeObj["children_flow_graph_name"];
					}
					let node = DataManager.getInstance().getNode(nodeName);
					node["id"] = nodeId;
					this.createNodeView(node, new Point(pos[0], pos[1]));

					// 该节点执行输出关系
					let nextRelationObj = nodeObj["next"];
					if(nextRelationObj)
					{
						for(let slotName in nextRelationObj)
						{
							let nodeIds:Array<number> = nextRelationObj[slotName];
							for(let nId of nodeIds)
							{
								nextEndPoint.push({"nodeId":nId, "slotName":slotName, "curId":nodeId});
							}
						}
					}

					// 该节点数据输入关系
					let inputRelationObj = nodeObj["input"];
					if(inputRelationObj)
					{
						for(let slotName in inputRelationObj)
						{
							let endPointObj = inputRelationObj[slotName];
							if(!endPointObj["defaultValue"])
							{
								inputEndPoint.push({"nodeId":endPointObj["node_id"], "slotName":slotName, "curId":nodeId, "pin":endPointObj["pin"]});
							}
							else
							{
								valueEndPint.push({"slotName":slotName, "curId":nodeId, "defaultValue":endPointObj["defaultValue"]});
							}
						}
					}
				}
			}

			for(let nodeView of this._nodes.values)
			{
				// 当前节点id
				let nodeId:number = Number(nodeView.data["id"]);

				// 处理输入插槽
				let ins:Array<Object> = nodeView.getSlotIns();
				for(let slotData of ins)
				{
					if(!slotData)
						continue;

					let type:string = slotData["type"].toString();
					let isDataIn:boolean = type == SlotType.DataIn.toString();
					let isExecutionIn:boolean = type == SlotType.ExecutionIn.toString();
					let connection:ConectionView = null;
					let cur:Relation = null;
					if(isExecutionIn)
					{
						for(let endPoint of nextEndPoint)
						{
							// 具有执行输出与之对应
							if(endPoint["nodeId"] == nodeId)
							{
								if(connection == null)
								{
									connection = new ConectionView();
									this.addChild(connection);
									cur = DataManager.getInstance().createRelation(slotData);
									let item:IItem = nodeView.getItem(slotData["name"]);
									if(cur.inputNodeId > 0)
										cur.left = item as IItem;
									else 
										cur.right = item as IItem;
									connection.setData(cur);
								}
								let endPointObj = DataManager.getInstance().getSlotData(Number(endPoint["curId"]), endPoint["slotName"]);
								let other:Relation = DataManager.getInstance().createRelation(endPointObj);
								if(DataManager.getInstance().checkAndMegreRelation(cur, other))
								{
									let nodeView:NodeView = this._nodes.get(endPoint["curId"]);
									let it:IItem = nodeView.getItem(endPoint["slotName"]);
									if(other.inputNodeId > 0)
										cur.left = it as IItem;
									else 
										cur.right = it as IItem;
									this._conections.push(connection);
									connection.update();
								}
							}
						}
					}
					else if(isDataIn)// 处理数据输入
					{
						// 设置数据优先
						for(let endPoint of valueEndPint)
						{
							let str:string = "";
							// 存在值设置
							if(slotData["dataType"] == "vector3")
							{
								str = slotData["value"].toString();
							}
							else
							{
								str = slotData["value"].toString();
							}
							let inItem:SlotInItem = nodeView.getItem(endPoint["slotName"]) as SlotInItem;
							if(inItem)
								inItem.setValue(str);
						}
						
						// 输入连线
						for(let endPoint of inputEndPoint)
						{
							if(endPoint["curId"] == nodeId.toString() && slotData["name"] == endPoint["slotName"] && endPoint["nodeId"] && endPoint["pin"])
							{
								// 存在数据输出与之对应
								if(connection == null)
								{
									connection = new ConectionView();
									this.addChild(connection);
									cur = DataManager.getInstance().createRelation(slotData);
									let item:IItem = nodeView.getItem(slotData["name"]);
									if(cur.inputNodeId > 0)
										cur.left = item as IItem;
									else 
										cur.right = item as IItem;
									connection.setData(cur);
								}
								let endPointObj = DataManager.getInstance().getSlotData(Number(endPoint["nodeId"]), endPoint["pin"]);
								let other:Relation = DataManager.getInstance().createRelation(endPointObj);
								if(DataManager.getInstance().checkAndMegreRelation(cur, other))
								{
									let nodeView:NodeView = this._nodes.get(endPoint["nodeId"]);
									let it:IItem = nodeView.getItem(endPoint["pin"]);
									if(other.inputNodeId > 0)
										cur.left = it as IItem;
									else 
										cur.right = it as IItem;
									this._conections.push(connection);
									connection.update();
								}
							}
						}
					}
				}
			}
		}

		// 创建关系图
		private createRelationGraph():Object
		{
			let graphName:string = this.input_graphName.text.trim();
			let index:number = graphName.indexOf(".");
			if(index > 0)
			{
				graphName = graphName.substring(0, index);
			}
			let graph:Object = {"name":graphName};
			let eventObj:Object = {};
			for(let index in this._nodes.keys)
			{
				let nodeId:string = this._nodes.keys[index];
				let nodeView:NodeView = this._nodes.get(nodeId);
				let nodeObj:Object = {"name":nodeView.data["name"], "category":nodeView.data["category"]};
				if(nodeView.data["children_flow_graph_name"])
				{
					nodeObj["name"] = "flow_graph_node"; // 转一次节点名字因为服务器要求如此
					console.log(nodeObj["name"]);
					nodeObj["children_flow_graph_name"] = nodeView.data["children_flow_graph_name"];
				}

				if(nodeView.data["children_flow_graph_call"])
				{
					graph["children_flow_graph_call"] = nodeView.data["children_flow_graph_call"];
				}

				if(nodeView.data["children_flow_graph_return"])
				{
					graph["children_flow_graph_return"] = nodeView.data["children_flow_graph_return"];
				}

				let nextObj:Object = null;
				let inputObj:Object = null;
				// 处理输出插槽
				let outs:Array<Object> = nodeView.getSlotsOuts(); //let obj:Object = {"type":SlotType.DataOut, "name":"", "dataType":"", "id":this.data["id"], "nodeName":this.data["name"]};
				for(let idx in outs)
				{
					let slotData:Object = outs[idx];
					if(slotData["type"] == SlotType.ExecutionOut.toString())
					{
						// 处理执行输出
						for(let i in this._conections)
						{
							let relation:Relation = this._conections[i].data;
							if(relation.outputNodeId.toString() == nodeId && relation.outputType == SlotType.ExecutionOut.toString())
							{
								if(!nextObj)
									nextObj = {};

								if(!nextObj[relation.outputName])
									nextObj[relation.outputName] = [relation.inputNodeId.toString()];
								else
								{
									// 防止重复添加
									if((nextObj[relation.outputName] as Array<number>).indexOf(relation.inputNodeId) == -1)
									{
										nextObj[relation.outputName].push(relation.inputNodeId.toString());
									}
								}	
							}
						}
					}
				}

				// 处理输入插槽
				let ins:Array<Object> = nodeView.getSlotIns();
				for(let i in ins)
				{
					let slotData:Object = ins[i];
					if(slotData["type"] == SlotType.ExecutionIn.toString())
					{
						// 处理执行输入
					}
					else
					{
						// 处理数据输入
						for(let i in this._conections)
						{
							let relation:Relation = this._conections[i].data;
							if(relation.inputNodeId.toString() == nodeId && relation.inputType == SlotType.DataIn.toString())
							{
								// 处理数据输入插槽
								if(!inputObj)
									inputObj = {};

								inputObj[relation.inputName] = {"node_id":relation.outputNodeId, "pin":relation.outputName};
							}
						}

						// 设置默认值
						if(!inputObj || !inputObj[slotData["name"]])
						{
							if(!inputObj)
								inputObj = {};
							if(slotData["dataType"] == "vector3")
							{
								let str:string = slotData["value"];
								let valueObj:Object = str.split(",");
								inputObj[slotData["name"]] = {"defaultValue":valueObj};
							}
							else
							{
								inputObj[slotData["name"]] = {"defaultValue":slotData["value"]};
							}
						}		
					}
				}

				if(nodeView.data["type"] == "event")
				{
					eventObj[nodeView.data["name"]] = nodeId;
				}

				if(nextObj)
					nodeObj["next"] = nextObj;
				if(inputObj)
					nodeObj["input"] = inputObj;
				nodeObj["ui_position"] = [nodeView.x, nodeView.y];
				graph[nodeId] = nodeObj;
			}
			graph["seed"] = DataManager.getInstance().guid;
			graph["event"] = eventObj;

			return graph;
		}

		private onAddNodeHandler(node:Object, x:number, y:number):void
		{
			this.createNodeView(node, this.globalToLocal(new Point(x, y)));
		}

		private onRemoveNodeHandler(nodeId:string):void
		{
			this._activeNodeView = this._nodes.get(nodeId);
		}

		private onRemoveConnectionHandler(connection:ConectionView):void
		{
			for(let index:number = 0; index < this._conections.length; ++index)
			{
				if(this._conections[index].data.equals(connection.data))
				{
					this._conections.splice(index, 1);
				}
			}
		}

		private onReloadGraphHandler(graphName:string):void
		{
			this.setData(DataManager.getInstance().getGraph(graphName));
		}

		private _graphView:GraphsView;
		private onClick(evt:Laya.Event):void
		{
			switch(evt.currentTarget)
			{
				case this.file:
					if(this._graphView)
					{
						this._graphView.destroy();
						this._graphView = null;
					}
					else
					{
						this._graphView = new GraphsView();
						this._graphView.x = evt.stageX;
						this._graphView.y = evt.stageY;
						this.addChild(this._graphView);
					}
				break;
				case this.view:
					this.clear();
					DataManager.getInstance().resetGUID(0);
					this.input_graphName.text = "";
				break;
				case this.btn_save:
					let graph:Object = this.createRelationGraph();
					let str:string = JSON.stringify(graph);
					ServerManager.getInstance().sendGraph(str);
			}
		}

		public setData(data:Object):void
		{
			this.data = data;
			DataManager.getInstance().resetGUID(this.data["seed"]);
			this.update();
		}
	}
}
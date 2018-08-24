/**
* @desc 数据管理器
* @author confiner
*/
module core{
	export class DataManager{
		private _nodesDescriptor:Array<Object>;	// 所有节点描述对象
		private _graphNodesDescriptor:Array<Object> = []; // 流图节点描述对象
		private _seed:number = 0;	// 节点自增id种子
		public static drawing:boolean = false;
		private _graphs:Dictionary = null;	// 所有流图
		private _slots:Dictionary;	// 所有插槽数据

		// 解析节点数据
		public parseNodesDescriptor(descriptor:string):void
		{
			this._nodesDescriptor = JSON.parse(descriptor);
		}

		// 获取所有节点
		public getNodes():Array<Object>
		{
			let nodes:Object[] = this._graphNodesDescriptor.concat(this._nodesDescriptor);
			return nodes;
		}

		// 通过name查询node数据
		public getNode(name:string):Object
		{
			let nodes:Object[] = this.getNodes();
			for(let i = 0; i < nodes.length; ++i)
			{
				if(nodes[i]["name"] == name && name != null)
					return nodes[i];
			}

			return null;
		}

		// 判断对象是否有对应的属性
		public hasProperty(src:Object, propName:string):boolean
		{
			return src.hasOwnProperty(propName);
		}

		// 获取对应对象的属性
		public getProperty(src:Object, propName:string):any
		{
			return src[propName];
		}

		// 获取guid
		public guid():number
		{
			return ++this._seed;
		}

		// 重置guid
		public resetGUID(seed:number):void
		{
			this._seed = seed;
		}

		// 創建關係數據
 		public createRelation(data:Object):Relation
		{
			let relation:Relation = new Relation();
			if(data["type"] == SlotType.DataIn.toString() || data["type"] == SlotType.ExecutionIn.toString())
			{
				relation.inputType = data["type"];
				relation.inputNodeId = data["id"];
				relation.inputName = data["name"];
				relation.inputDataType = data["dataType"];
			}	
			else
			{
				relation.outputType = data["type"];
				relation.outputNodeId = data["id"];
				relation.outputName = data["name"];
				relation.outputDataType = data["dataType"];
			}	
			return relation;
		}


		// 添加slot数据
		public addSlotData(slotData:Object):void
		{
			let slots:Array<Object> = this._slots.get(slotData["id"]);
			if(slots)
			{
				for(let i:number = 0; i < slots.length; ++i)
				{
					if(slots[i]["name"] == slotData["name"])
						return;
				}

				slots.push(slotData);
			}
			else
			{
				slots = new Array<Object>();
				slots.push(slotData);
				this._slots.set(slotData["id"], slots);
			}
		}

		// 获取对应节点的插槽
		public getSlotData(nodeId:number, slotName:string):Object
		{
			let slots:Array<Object> = this._slots.get(nodeId);
			if(slots)
			{
				for(let i:number = 0; i < slots.length; ++i)
				{
					if(slots[i]["name"] == slotName)
						return slots[i];
				}
			}

			return null;
		}

		// 删除插槽数据
		public removeSlotData(nodeId:number):void
		{
			this._slots.remove(nodeId);
		}

		// 檢測關係兩端是否滿足
		public checkAndMegreRelation(left:Relation, right:Relation):Relation
		{
			// 不能是同一個節點
			if(left.inputNodeId != null && left.inputNodeId == right.outputNodeId || left.outputNodeId != null && left.outputNodeId == right.inputNodeId)
				return null;

			if(left.inputType == SlotType.DataIn.toString() && right.outputType == SlotType.DataOut.toString() 
					&& (left.inputDataType != null && left.inputDataType == right.outputDataType || left.outputDataType != null && left.outputDataType == right.inputDataType)
					|| left.inputType == SlotType.ExecutionIn.toString() && right.outputType == SlotType.ExecutionOut.toString())
				{
					left.outputNodeId = right.outputNodeId;
					left.outputName = right.outputName;
					left.outputType = right.outputType;
					return left;
				}
				else if(left.outputType == SlotType.DataOut.toString() && right.inputType == SlotType.DataIn.toString()
					&& (left.inputDataType != null && left.inputDataType == right.outputDataType || left.outputDataType != null && left.outputDataType == right.inputDataType)
					|| left.outputType == SlotType.ExecutionOut.toString() && right.inputType == SlotType.ExecutionIn.toString())
				{
					left.inputNodeId = right.inputNodeId;
					left.inputName = right.inputName;
					left.inputType = right.inputType;
					return left;
				}
			return null;
		}

		private static _inst:DataManager; //单例对象

		private constructor()
		{
			this._graphs = new Dictionary();
			this._slots = new Dictionary();
		}

		// 解析所有流图
		public parseGrahps(jsonStr:string):void
		{
			this._graphNodesDescriptor = [];
			let grahps:Array<Object> = JSON.parse(jsonStr);
			for(let graph of grahps)
			{
				let graphObj:Object = JSON.parse(graph as string);
				this._graphs.set(graphObj["name"], graphObj);

				let startNodeId = graphObj["children_flow_graph_call"];	// 子流图的首节点
				let endNodeId = graphObj["children_flow_graph_return"];	// 子流图的尾节点
				if(!startNodeId || !endNodeId)
					continue;

				let startNode = null;
				let endNode = null;
				for(let nodeId in graphObj)
				{
					let nodeObj:Object = graphObj[nodeId];
					let nodeName:string = nodeObj["name"];
					if(nodeName && nodeName != "")
					{
						if(!startNode && nodeId == startNodeId.toString())
						{
							startNode = this.getNode(nodeName);
						}
						else if(nodeId == endNodeId.toString())
						{
							endNode = this.getNode(nodeName);
						}

						if(startNode && endNode)
						{
							let nodeObj = {};
							nodeObj["type"] = NodeType.CTRL;
							
							nodeObj["next"] = endNode["next"];
							nodeObj["input"] = startNode["input"];
							nodeObj["output"] = endNode["output"];
							nodeObj["name"] = graphObj["name"];
							nodeObj["children_flow_graph_name"] = graphObj["name"];
							nodeObj["category"] = "GraphNodes";
							this._graphNodesDescriptor.push(nodeObj);
							break;
						}
					}
				}
			}
		}


		// 获取流图名列表
		public getAllGraphNames():Array<string>
		{
			let names:Array<string> = new Array<string>();
			for(let name of this._graphs.keys)
			{
				names.push(name);
			}

			return names;
		}

		// 获取流图
		public getGraph(name:string):Object
		{
			return this._graphs.get(name);
		}

		// 获取单例接口
		public static getInstance():DataManager
		{
			if(!DataManager._inst)
			{
				DataManager._inst = new DataManager();
			}

			return DataManager._inst;
		}
	}
}
/**
* @desc 节点树
* @author confiner
*/
module ui{
	import Utils = Laya.Utils;
	import Event = Laya.Event;
	import Tree = Laya.Tree;
	import Dictionary = Laya.Dictionary;
	import Rectangle = Laya.Rectangle;
	import Label = Laya.Label;
	import EventType = core.EventType;

	export class NodePalette extends Editor.NodPaletteUI
	{
		private _dragRegion:Rectangle = null; 	// 拖拽区域

		constructor(dragRegion:Rectangle)
		{
			super();
			Laya.stage.on(EventType.SYNC_GRAPH, this, this.updateNodes);
			this._dragRegion = dragRegion;
		}

		private parseToTreeData():any
		{
			let data:Array<Object> = DataManager.getInstance().getNodes();
			let nodes = new Dictionary();
			// 提取所有节点数据
			for(let i = 0; i < data.length; ++i)
			{
				let node:Object = data[i];
				if(node["category"])
				{
					// 处理目录
					let categoryObj:Object = nodes.get(node["category"]);
					if(!categoryObj)
					{
						categoryObj = {};
						nodes.set(node["category"], categoryObj);
					}

					if(node["subCategory"])
					{
						// 处理子目录
						let subCategoryObj:Dictionary = categoryObj["subs"];
						if(!subCategoryObj)
						{
							subCategoryObj = new Dictionary();
							categoryObj["subs"] = subCategoryObj;	
						}

						let leafs:Array<string> = subCategoryObj[node["subCategory"]]; 
						if(!leafs)
						{
							leafs = new Array<string>();
							subCategoryObj.set(node["subCategory"], leafs);
						}
						leafs.push(node["name"]);
					}
					else
					{
						// 处理叶子节点
						let leafsArray:Array<string> = categoryObj["leafs"];
						if(!leafsArray)
						{
							leafsArray = new Array<string>();
							categoryObj["leafs"] = leafsArray;
						}
						leafsArray.push(node["name"]);
					}
				}
			}

			// 组合tree数据xml
			let treeData:String = "<data>";
			for(let index in nodes.keys)
			{
				let dirName:string = nodes.keys[index];
				treeData += "<dir label='" + dirName + "' isOpen='false'>";

				// 处理子节点
				let categoryObj:Object = nodes.get(dirName);
				let subCategoryObj:Dictionary = categoryObj["subs"];
				if(subCategoryObj)
				{
					for(let idx in subCategoryObj.keys)
					{
						let subName = subCategoryObj.keys[idx];
						treeData += "<dir label='" + subName + "' isOpen='false'>";
						// 子节点中的叶子节点
						let leafs:Array<string> = subCategoryObj.get(subName);
						if(leafs)
						{
							for(let i = 0; i < leafs.length; ++i)
							{
								treeData += "<file label='" + leafs[i] + "'/>";
							}
						}
						treeData += "</dir>";
					}
				}

				// 处理当前节点的叶子节点
				let leafs:Array<string> = categoryObj["leafs"];
				if(leafs)
				{
					for(let i = 0; i < leafs.length; ++i)
					{
						treeData += "<file label='" + leafs[i] + "'/>";
					}
				}

				treeData += "</dir>";
			}
			treeData += "</data>"

			return Utils.parseXMLFromString(treeData);
		}

		protected initialize():void
		{
			super.initialize();
			this.tree_nodes.scrollBar.autoHide = true;	
			this.tree_nodes.xml = this.parseToTreeData();
			this.tree_nodes.mouseHandler = new Handler(this, this.onMouseClick);
		}

		private updateNodes():void
		{
			this.tree_nodes.xml = this.parseToTreeData();
		}

		private onMouseClick(evt:Event, index:number):void
		{
			let target:Object = evt.target;
			if(evt.type == Event.MOUSE_DOWN)
			{
				if(target["dataSource"])
				{
					let hasChild:boolean = (target as Laya.Box).dataSource["hasChild"];	
					if(!hasChild)
					{
						// 叶子节点
						let item:Label = new Label();
						let nodeName:string = target["dataSource"]["label"];
						item.text = nodeName;
						item.width = target["width"];
						item.height = target["height"];
						item.x = evt.stageX;
						item.y = evt.stageY;
						Laya.stage.addChild(item);
						item.startDrag(this._dragRegion);
						Laya.stage.on(Event.MOUSE_UP, this, this.onStageMouseUp, [nodeName, item]);
					}
				}
			}
		}

		private onStageMouseUp(nodeName:string, item:Label, evt:Event):void
		{
			Laya.stage.off(Event.MOUSE_UP, this, this.onStageMouseUp);
			let node:Object = DataManager.getInstance().getNode(nodeName);
			Laya.stage.event(EventType.ADD_NODE, [node, item.x, item.y]);
			item.destroy();
			item = null;
		}
	}
}
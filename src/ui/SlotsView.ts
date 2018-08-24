/**
* @author confiner
* @desc	插槽列表界面
*/
module ui{
	import SlotType = core.SlotType;
	import Elements = ui.Editor.Elements;

	export class SlotsView extends Elements.SlotsViewUI implements IData
	{
		data:Object; // 插槽数据

		constructor()
		{
			super();
		}

		private update():void
		{
			let slotsIn:Array<Object> = new Array<Object>();
			let slotsOut:Array<Object> = new Array<Object>();

			// 默认有个执行输入插槽
			if(this.data["type"] == "event" || this.data["type"] == "data")
			{
				// event 和 data类型节点不需要执行输入
			}
			else
			{
				let obj = {"type":SlotType.ExecutionIn, "name":"In", "id":this.data["id"], "nodeName":this.data["name"]};
				slotsIn.push(obj);
				DataManager.getInstance().addSlotData(obj);
			}

			// 解析数据输入插槽
			let inputs:Array<Object> = DataManager.getInstance().getProperty(this.data, "input");
			if(inputs)
			{
				for(let i:number = 0; i < inputs.length; ++i)
				{
					let obj:Object = {"type":SlotType.DataIn, "name":"", "dataType":"", "value":"", "id":this.data["id"], "nodeName":this.data["name"]};
					for(let prop in inputs[i])
					{
						obj["name"] = prop;
						let valueObj:Object = inputs[i][prop];
						if(valueObj)
						{
							for(let pro in valueObj)
							{
								obj["dataType"] = pro;
								if(valueObj[pro] == "lock")
								{
									obj["value"] = "lock";
									break;
								}

								switch(pro)
								{
									case "boolean":
										obj["value"] = valueObj[pro];
									break;
									case "int":
										obj["value"] = valueObj[pro];
									break;
									case "number":
										obj["value"] = valueObj[pro];
									break;
									case "vector3":
										obj["value"] = valueObj[pro][0] + "," + valueObj[pro][1] + "," + valueObj[pro][2];
									break;
									case "string":
										obj["value"] = valueObj[pro];
									break;
								}
							}
						}
					}
					slotsIn.push(obj);
					DataManager.getInstance().addSlotData(obj);
				}
			}
			

			// 解析执行输出插槽
			let nexts:Array<Object> = DataManager.getInstance().getProperty(this.data, "next");
			if(nexts)
			{
				for(let i:number = 0; i < nexts.length; ++i)
				{
					let obj:Object = {"type":SlotType.ExecutionOut, "name":nexts[i], "id":this.data["id"], "nodeName":this.data["name"]};
					slotsOut.push(obj);	
					DataManager.getInstance().addSlotData(obj);
				}
			}

			// 解析数据输出插槽
			let outputs:Array<Object> = DataManager.getInstance().getProperty(this.data, "output");
			if(outputs)
			{
				for(let i:number = 0; i < outputs.length; ++i)
				{
					let obj:Object = {"type":SlotType.DataOut, "name":"", "dataType":"", "id":this.data["id"], "nodeName":this.data["name"]};
					let outputObj:Object = outputs[i];
					for(let prop in outputObj)
					{
						obj["name"] = prop;
						let valueObj:Object = outputObj[prop];
						if(valueObj)
						{
							for(let pro in valueObj)
							{
								obj["dataType"] = pro;
							}
						}
					}
					slotsOut.push(obj);	
					DataManager.getInstance().addSlotData(obj);
				}
			}

			this.list_slotsIn.array = slotsIn;
			this.list_slotsIn.repeatY = slotsIn.length;
			this.list_slotsIn.renderHandler = new Handler(this, this.onSlotsInRender);

			this.list_slotsOut.array = slotsOut;
			this.list_slotsOut.repeatY = slotsOut.length;
			this.list_slotsOut.renderHandler = new Handler(this, this.onSlotsOutRender);

			this.list_slotsOut.x = this.list_slotsIn.x + this.list_slotsIn.width + 10;

			this.height = Math.max(this.list_slotsIn.height, this.list_slotsOut.height);
			this.width = this.list_slotsOut.x + this.list_slotsOut.width + 5;
		}

		// 设置宽度
		public setWidth(width:number):void
		{
			if(width > this.width)
			{
				this.list_slotsOut.x = width - this.list_slotsOut.width - 5;
				this.width = this.list_slotsOut.x + this.list_slotsOut.width + 5;
			}
		}

		private onSlotsInRender(item:SlotInItem, index: number): void 
		{
			//自定义list的渲染方式
			let itemData:Object = item.dataSource;
			item.clip_slotIcon.index = itemData["type"] - 1;
			item.txt_slotName.text = itemData["name"];
			let isDataSlotIn:boolean = itemData["type"] == SlotType.DataIn.toString();
			item.input_slotValue.visible = isDataSlotIn && itemData["value"] != "lock";
			if(item.input_slotValue.visible)
			{
				item.input_slotValue.x = item.txt_slotName.x + item.txt_slotName.textField.textWidth + 5;
				item.input_slotValue.text = itemData["value"];
			}
			item.setAnchor(this.parent as Laya.Sprite);
			item.width = item.input_slotValue.x + item.input_slotValue.width;
		}

		private onSlotsOutRender(item:SlotOutItem, index: number): void 
		{
			//自定义list的渲染方式
			let itemData:Object = item.dataSource;
			item.clip_slotIcon.index = itemData["type"] - 1;
			item.txt_slotName.text = itemData["name"];
			item.setAnchor(this.parent as Laya.Sprite);
		}

		setData(data:Object):void
		{
			this.data = data;
			this.update();
		}
	}
}
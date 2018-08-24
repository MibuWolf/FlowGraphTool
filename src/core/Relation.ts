/**
* @desc 關係數據
* @author confiner 
*/
module core{
	
	export class Relation
	{
		public inputNodeId:number;
		public inputType:string;
		public inputName:string;
		public inputDataType:string = null;
		public outputNodeId:number;
		public outputType:string;
		public outputName:string;
		public outputDataType:string = null;

		public right:IItem;
		public left:IItem;

		public equals(other:Relation):boolean
		{
			if(this.inputName == other.inputName &&
				this.inputNodeId == other.inputNodeId &&
				this.inputType == other.inputType &&
				this.inputDataType == other.inputDataType &&
				this.outputDataType == other.outputDataType &&
				this.outputName == other.outputName &&
				this.outputNodeId == other.outputNodeId &&
				this.outputType == other.outputType)
				{
					return true;
				}

			return false;
		}
	}
}
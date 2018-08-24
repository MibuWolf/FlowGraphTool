/**
* @author confiner
* @desc 事件类型
*/
module core{
	export class EventType
	{
		static LINE_START:string = "line_start";	// 开始画线
		static LINE_END:string = "line_end";	// 结束画线
		static NODE_DRAG_START:string = "node_drag_start";	// 拖拽節點開始
		static NODE_DRAG_END:string = "node_drag_end";		// 拖拽節點結束	
		static ADD_NODE:string = "add_node";	// 添加节点
		static REMOVE_NODE:string = "remove_node";	// 移除节点
		static NODES_READY:string = "nodes_ready"; // 节点描述准备完毕
		static REMOVE_CONNECTION:string = "remove_connection"; // 删除连接
		static RELOAD_GRAPH:string = "reload_graph";	// 重新加载流图
		static SYNC_GRAPH:string = "sync_grahp";	// 同步流图
	}
}
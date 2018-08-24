using System;
using System.Net;
using WebSocketSharp;
using WebSocketSharp.Server;
using Service;

public class FlowGraphSDK
{
    // 节点描述
    public static string NodesDescriptor
    {
        get;
        private set;
    }

    // 流图描述
    public static string GraphsDirectory
    {
        get;
        private set;
    }
    // websocketserver
    private static WebSocketServer _SERVER = null;

    /// <summary>
    /// 注册节点描述
    /// </summary>
    /// <param name="nodesDescriptor">所有节点的描述json字符串</param>
    public static void RegisterNodes(string nodesDescriptor)
    {
        NodesDescriptor = nodesDescriptor;
    }

    /// <summary>
    /// 设置流图目录
    /// </summary>
    /// <param name="graphsDirectory">流图目录</param>
    public static void SetGraphsDirectory(string graphsDirectory)
    {
        GraphsDirectory = graphsDirectory;
    }

    /// <summary>
    /// 启动sdk
    /// </summary>
    public static void Startup()
    {
        string ip = GetLocalIP();
        _SERVER = new WebSocketServer("ws://" + ip + ":1788");

        // 添加服务
        _SERVER.AddWebSocketService<NodesService>("/Nodes");

        // 开启
        _SERVER.Start();
    }

    private static string GetLocalIP()
    {
        string hostname = Dns.GetHostName();//得到本机名   
        IPHostEntry localhost = Dns.GetHostEntry(hostname);
        IPAddress localaddr = localhost.AddressList[1];
        return localaddr.ToString();
    }

    /// <summary>
    /// 关闭sdk
    /// </summary>
    public static void Shutdown()
    {
        if (_SERVER != null)
        {
            _SERVER.Stop();
            _SERVER = null;
        }
    }
}

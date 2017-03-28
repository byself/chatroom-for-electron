const { ipcRenderer } = require('electron');
const $ = require("jquery");
const config = require("./config.json");
const io = require("socket.io-client");

let clientName;

//服务器地址
const serverUrl = "http://" + config.server.address + ":"+ config.server.port +"/";

//与服务器建立链接
const socket = io(serverUrl);

/**
 *  获取客户端ip作为用户名
 */
socket.on("login", function(data){
    isLogin(data);
});

ipcRenderer.on("user:info", function(e, arg){
    console.log("login arg:", arg);
});

$("#btnLogin").click(function () {
    const name = $("#userName").val();
    const pwd = $("#userPwd").val()
    if (!name) {
        alert("用户名不能为空");
        return;
    };
    if (!pwd) {
        alert("密码不能为空");
        return;
    };

    setName(name, pwd);
});

function setName(name, pwd){
    socket.emit("login", {
        "name": name,
        "pwd": pwd
    });
};

function isLogin(status){
    if(!status){
        console.log("用户已登录");
    }else{
        console.log("new user:", status.name);
        ipcRenderer.send("chat", status);
    }
}

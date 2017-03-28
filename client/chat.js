const { ipcRenderer } = require('electron');
const $ = require("jquery");
const config = require("./config.json");
const io = require("socket.io-client");

let clientName;

//服务器地址
const serverUrl = "http://" + config.server.address + ":"+ config.server.port +"/";

//与服务器建立链接
const socket = io(serverUrl);

function addZreo(num) {
    return (num < 10) ? ("0" + num) : num
}

function getDate() {
    var dateStr = new Date();
    var year = dateStr.getFullYear();
    var month = addZreo(dateStr.getMonth() + 1);
    var day = addZreo(dateStr.getDate());
    var hour = addZreo(dateStr.getHours());
    var minute = addZreo(dateStr.getMinutes());
    var second = addZreo(dateStr.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function getName() {
    var name = clientName;
    return name;
}

function getContent() {
    var text = $("#edit-box").text();
    return text;
}

function getMsg() {
    var date = getDate();
    var name = getName();
    var content = getContent();
    return {
        "date": date,
        "name": name,
        "content": content
    }
}

function renderMsg(data) {
    var msg = data;
    var html = '<div class="item"><p>' + msg.date + ' ' + msg.name + '说：</p><p>' + msg.content + '</p></div>';
    var $content = $("#content");
    $content.append(html);
    setScrollToBottom();
}

function clearEdit() {
    $("#edit-box").text("");
}

ipcRenderer.send("get_user_info", "");
ipcRenderer.on("get_user_info_reply", function(e, arg){
    console.log("chat arg:", arg);
    clientName = arg.name;
});

/**
 * 获取发送的信息进行渲染
 */
socket.on("send message", function (data) {
    renderMsg(data);
});

$("#btn-send").click(function () {
    console.log("click send button");
    if (!$("#edit-box").text()) return;
    socket.emit("send message", getMsg());
    clearEdit();
});

$(document).on("keypress", function (e) {
    if (e.keyCode === 13) {
        console.log("click enter button");
        if (!$("#edit-box").text()) return false;
        socket.emit("send message", getMsg());
        clearEdit();
        return false;
    }
});

function setScrollToBottom(){
    $("#top").scrollTop($("#content").outerHeight(true));
}
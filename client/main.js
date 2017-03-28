const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");

let chatWindow;
let loginWindow;

console.log("========== main begin =========");
let userInfo = {};

function createChatWindow() {
    chatWindow = new BrowserWindow({ width: 800, height: 600 });
    chatWindow.loadURL("file://" + path.join(__dirname, "chat.html"));

    chatWindow.webContents.openDevTools();

    chatWindow.on("closed", function () {
        chatWindow = null;
    });


    chatWindow.webContents.send("dom-ready", {
        "name": "wangzili"
    });
}

function createLoginWindow() {
    loginWindow = new BrowserWindow({ width: 400, height: 600 });
    loginWindow.loadURL("file://" + path.join(__dirname, "login.html"));

    loginWindow.webContents.openDevTools();

    loginWindow.on("closed", function () {
        loginWindow = null;
    })
}

app.on("ready", function () {
    createLoginWindow();
});

ipcMain.on("chat", function(e, arg){
    loginWindow.close();
    loginWindow = null;
    createChatWindow();
    userInfo = arg;

    console.log("============= chat ================")
    console.log(arg);
});

console.log("============= get_user_info 1 ================")
console.log(userInfo);
ipcMain.on("get_user_info", function(e, arg){
    console.log("============= get_user_info ================")
    console.log(userInfo);
    e.sender.send("get_user_info_reply", userInfo)
})




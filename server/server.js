const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const clientNames = {};
let clientTotal = 0;

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
//     clientName = parseName(getClientIp(req));
//     setClientNames(clientName);
// });

io.on('connection', function(socket){
    socket.on("login", function(data){
        if(saveClient(data.name)){
            io.emit("login", {
                "name": data.name,
                "count": clientTotal
            });
        }else{
            socket.emit("login", false);
        };
        
    })
    
    socket.on("send message", function(data){
        io.emit("send message", data);
    });

    socket.on("disconnect", function(data){
        delete clientNames[data.name];
        clientTotal --;
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function saveClient(name){
    // console.log("login name status:", clientNames[name] === undefined);
    if( clientNames[name] === undefined ){
        clientNames[name] = true;
        clientTotal ++;
        return true;
    }

    return false;
}


function getClientIp(req){
    let ipAddress;
    const headers = req.headers;
    const forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

function parseName(ip){
    let name = ip.split(":");
    return name[name.length-1];
}

function setClientNames(name){
    if( clientNames.indexOf(name) < 0 ){
        clientNames.push(name);
    }
}
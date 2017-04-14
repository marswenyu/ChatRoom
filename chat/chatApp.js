var chatApp = angular.module("chatApp",[]);

chatApp.factory('socket', function($rootScope) {  
    var socket = io();  
    return {  
        on: function(eventName, callback) {  
            socket.on(eventName, function() {  
                var args = arguments;  
                $rootScope.$apply(function() {  
                    callback.apply(socket, args);  
                });  
            });  
        },  
        emit: function(eventName, data, callback) {  
            socket.emit(eventName, data, function() {  
                var args = arguments;  
                $rootScope.$apply(function() {  
                    if(callback) {  
                        callback.apply(socket, args);  
                    }  
                });  
            })  
        }  
    };  
});  

chatApp.controller('chatController', function($scope,socket) {
    $scope.is_login = false;
    $scope.username_is_used = false;
    $scope.users = [];
    $scope.messages = [];

    //登入
    $scope.login=function(){
        console.log('login button')
        socket.emit("addUser",{nickname:$scope.nickname});
    }

    //傳送訊息
    $scope.sendMessage=function(){
        console.log('sendMessage button')
        var msg={message:$scope.messageIn,nickname:$scope.nickname};
        $scope.messages.push(msg);
        $scope.messageIn="";
        socket.emit("addMessage",msg);
    }
    
    //登入結果 result:true成功登入  result:false暱稱使用中
    socket.on('userAddingResult',function(data){
        if(data.result){
            $scope.username_is_used=false;
            $scope.is_login=true;
        }else{
            $scope.username_is_used=true;
        }
    });

    //成功登入
    socket.on('userAdded', function(data) {
        if(!$scope.is_login) 
            return;
        // $scope.publicMessages.push({text:data.nickname,type:"welcome"});
        $scope.users.push(data);
        console.log('users'+$scope.users)
    });

    //推播給所有用戶
    socket.on('allUser', function(data) {
        if(!$scope.is_login) 
            return;

        $scope.users=data;
    });

    //用戶退出
    socket.on('userRemoved', function(data) {
        if(!$scope.is_login)
            return;

        console.log('userRemoved')

        for(var i=0;i<$scope.users.length;i++){
            if(data.nickname == $scope.users[i].nickname){
                $scope.users.splice(i,1);
            }
        }
    });

        //接收到新消息
    socket.on('messageAdded', function(data) {
        if(!$scope.is_login)
            return;

        $scope.messages.push(data);
    });
});

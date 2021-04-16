/**
 * Created by siqing on 2017/3/14.
 */
var Myapp =angular.module('treehole',['ui.router']);

console.log("注入模块成功");

/*关联路由*/
Myapp.config(function($stateProvider,$urlRouterProvider){
    
    console.log("执行内部路由");

    $urlRouterProvider.when("",'/content1');

    $stateProvider
        .state('content_1',{
            url:'/content1',
            templateUrl:'content1.html'
        })
        .state('content',{
            url:'/content',
            templateUrl:'content.html'
            }
        )
})

/*表单控制器*/
Myapp.controller('textForm',function($scope,$http, $filter)
{
    console.log("执行了表单控制器");

    /* 空对象*/
    $scope.formdata={};

    /*时间*/
   $scope.formdata.time = new Date();
    console.log($scope.formdata.time);
    $scope.formdata.time = $filter('date')($scope.formdata.time,'yyyy/MM/dd__EEE__HH:mm:ss');
    console.log($scope.formdata.time);

    /*提交表单*/
    $scope.save=function(){
        console.log("可以执行提交表单功能了");
        console.log($scope.formdata);
        if ($scope.FormSubmit.$invalid) {
            alert("请检查你的信息");
        }
        $http({
            method: 'POST',
            url:'http://6.wilsonjz1.applinzi.com/back/messageGet.php',
            data:$scope.formdata,
            header:{
                'Content-Type': 'application/json'
            }
        }).success(function(data,status,headers,config){
            console.log($scope.formdata);
            console.log(status);
            console.log("提交成功");
            alert("你的小心事已录进树洞，但是小北还是不知道你是谁..");
            $scope.formdata={};
        }).error(function(data,status,headers,config){
            console.log(data);
            console.log(status);
            alert('咦，出现问题了，还不能录进小北数据库')
        })
        console.log("执行了http");
    }
})

/*评论控制器*/
Myapp.controller("showWord",function($scope,$http,$rootScope){

    sessionStorage.setItem("ID","id");
    console.log( sessionStorage.getItem("ID"));
    console.log("执行了评论控制器");
   /*刷新*/
    function page_cont(reset) {
        var num = 1;
        return function(reset) {
            if (reset) {
                return num = 1;
            } else
                return num++;
        }
    }

    var pcont = page_cont();
    /*滚动视窗*/
    window.onscroll = function(e) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollHeight = document.body.scrollHeight;
        var screenHeight = window.screen.height;
        var limit = (scrollTop + screenHeight) / scrollHeight
        if (limit >= 1) {
            var page = pcont();

            $http({
                url:'http://6.wilsonjz1.applinzi.com/back/messageShow.php',
                method:'post',
                data: {
                    page: page,
                    ID: sessionStorage.getItem("id")
                },
                param:$scope.item,  //将json转为字符串
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .success(function(data, status, headers, config)
                {
                    console.log(data[0].data.message);
                    if(data[0].data.content=='NULL')
                    {
                        $scope.loading=false;
                    }
                   else{
                        console.log("连接成功");
                        $scope.item = data[0].data.message;
                        console.log($scope.item);

                    }
                })
                .error(function(data, status, config, headers)
                {
                    console.log(data);
                    console.log(headers);
                    console.log(status);
                    console.log("连接失败");
                })
        }
    }



    /*树洞留言遍历循环*/
    $scope.item = getInfo();
    /*从服务器获取树洞留言*/
    function getInfo()
    {
        $http({
            url:'http://6.wilsonjz1.applinzi.com/back/messageShow.php',
            method:'post',
            param:$scope.item,  //将json转为字符串
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .success(function(data, status, headers, config)
            {
                console.log(data[0].data.message);
                console.log("连接成功");
                $scope.item = data[0].data.message;
                console.log("item的数据："+$scope.item);
                $scope.loading=false;
            })
            .error(function(data, status, config, headers)
            {
                console.log(data);
                console.log(headers);
                console.log(status);
                console.log("连接失败");
            })
    }

    /*隐藏和显示*/
    $scope.wordShow = function(index){
        $scope.item[index].success=!$scope.item[index].success;
        console.log("index::::"+index);
        $scope.Senddata[index] = $scope.item[index];
        console.log("Senddata:::"+$scope.Senddata[index].id);
    }

    /* 空对象*/
    $scope.Senddata={};
    /*提交评论*/
    $scope.sent = function(){

        console.log("可以执行提交  评论 功能了");

        console.log($scope.Senddata);

        $http({
            method: 'POST',
            url:'http://6.wilsonjz1.applinzi.com/back/commentGet.php',
            data:$scope.Senddata,
            header:{
                'Content-Type': 'application/json'
            }
        }).success(function(data,status,headers,config){
            console.log($scope.Senddata);
            console.log(status);
            console.log("提交成功");
            /*$scope.Senddata={};*/
        }).error(function(data,status,headers,config){
            console.log(data);
            console.log(status);
            alert('咦，出现问题了，还不能录进小北数据库')
        })

    }
})



define(['app'], function(app) {
    app.controller('passwordChangeCtrl',['$scope', '$http','dialogWindow',function($scope, $http,dialogWindow) {
        $scope.data = {};
        $scope.passwordType = {
            level:1,
            hasOldPass:false,
            confirmPassword:false
        };
        $scope.$watch("data.oldPassword",function(newValue,oldValue,scope){
            $scope.passwordType.hasOldPass = (newValue && newValue!='');
        });
        $scope.$watch("data.newPassword",function(newValue,oldValue,scope){
            if(newValue){
                $scope.passwordType.confirmPassword = newValue == $scope.data.newPasswordConfirm;
                var num = checkStrong(newValue);
                switch (num) {
                    case 0:
                        $scope.passwordType.level = 1;
                        break;
                    case 1:
                        $scope.passwordType.level = 1;
                        break;
                    case 2:
                        $scope.passwordType.level = 2;
                        break;
                    case 3:
                        $scope.passwordType.level = 3;
                        break;
                    case 4:
                        $scope.passwordType.level = 3;
                        break;
                    default:
                        break;
                }
            }
        });
        $scope.$watch("data.newPasswordConfirm",function(newValue,oldValue,scope){
            if(newValue){
                $scope.passwordType.confirmPassword = newValue == $scope.data.newPassword;
            }
        });

        $scope.saveChange = function () {
            dialogWindow.confirm('提示','确认修改?',function () {
                $http.post("/rest/authox/user/changePassword",{
                    oldPwd:$scope.data.oldPassword,
                    newPwd:$scope.data.newPassword
                }).then(function (result) {
                    console.log(result.data);
                    dialogWindow.confirm('提示',result.data?'修改失败':'修改成功');
                }, function (){
                    dialogWindow.confirm('提示', '原密码输入错误！');
                })
            })
        };

        function checkStrong(val) {
            var modes = 0;
            if (val.length < 6) return 0;
            if (/\d/.test(val)) modes++; //数字
            if (/[a-z]/.test(val)) modes++; //小写
            if (/[A-Z]/.test(val)) modes++; //大写
            if (/\W/.test(val)) modes++; //特殊字符
            if (val.length > 12) return 4;
            return modes;
        }
    }]);
});
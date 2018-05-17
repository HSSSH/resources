define(['app'], function (app) {
    app.controller("userCtrl", function ($scope, $http, $rootScope, $uibModal, sucHelpers, $state) {
        $scope.user = {};
        $scope.user.table = {
            headList: ['账号', '用户名', '角色', '备注', '创建时间'],
            searchList: [{
                key: 'account',
                name: '账号'
            }, {
                key: 'displayName',
                name: '用户名'
            }]
        };
        $scope.user.pages = {
            totalCount: 0,
            currentPageNo: 1,
            pageSize: 8,
        }
        $scope.user.refresh = function () {
/*            $http.get("rest/authox/users").then(function (data) {
            	var data = data.data;
                $scope.user.table.allContent = data;
                $scope.user.pages.totalCount = data.length;
                $scope.user.pages.currentPageNo = 1;
                $scope.user.table.content = data.slice(0, $scope.user.pages.pageSize);
            });*/
            $http.get('rest/authox/usersByPage?pageNum='+0+'&pageSize='+$scope.user.pages.pageSize).then(function (data) {
            	$scope.user.pages.currentPageNo=1;
            	$scope.user.pages.totalCount =data.data.rowCount;
            	var data = data.data.pageItems;
                $scope.user.table.content = data;
                $scope.user.table.searchName='account';
                $scope.user.searchValue='';
            });
        }
        $scope.user.refresh();
        $scope.user.table.searchName = 'account';
        $scope.user.search = function (currentPageNo) {
//            $http.get('rest/authox/users/like?key=' + $scope.user.table.searchName + '&value=' + ($scope.user.searchValue || '')).then(function (data) {
//            	var data = data.data;
//                $scope.user.table.allContent = data;
//                $scope.user.pages.totalCount = data.length;
//                $scope.user.pages.currentPageNo = 1;
//                $scope.user.table.content = data.slice(0, $scope.user.pages.pageSize);
//            })
        	currentPageNo=currentPageNo?(currentPageNo-1):0;
            $http.get('rest/authox/usersByPage/like?key=' + $scope.user.table.searchName + '&value=' + ($scope.user.searchValue || '')+'&pageNum='+currentPageNo+'&pageSize='+$scope.user.pages.pageSize).then(function (data) {
            	$scope.user.pages.totalCount =data.data.rowCount;
            	var data = data.data.pageItems;
            	$scope.user.table.content = data;
            })
        }
        $scope.user.pageChanged = function (currentPageNo) {
//            $scope.user.table.content = $scope.user.table.allContent.slice((currentPageNo - 1) * $scope.user.pages.pageSize, currentPageNo * $scope.user.pages.pageSize);
        	$scope.user.search(currentPageNo)
        }
        $scope.user.delUser = function (item) {
        	if(confirm("确认删除？")){
                $http({
                    method: "delete",
                    url: "rest/authox/users/" + item.authoxuser_Id
                }).then(function (data) {
                	alert("删除成功")
                    $scope.user.search($scope.user.pages.currentPageNo);
                }).catch(function(){
                	alert("删除失败")
                })
        	}
        }
        $scope.user.addUser = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/user/addUser.html",
                controller: "addUserCtrl",
                backdrop: 'static',
                size: 'role',
                resolve: {
                    op: function () {
                        return angular.copy(op);
                    },
                    select: function () {
                        return angular.copy(select)
                    }
                }
            });
            modalInstance.result.then(function (i) {
                if (i === 1) {
                    $scope.user.search();
                } else {
                    $http({
                        method: "get",
                        url: "rest/authox/users/" + $scope.user.select.info.authoxuser_Id
                    }).then(function (data) {
                        $scope.user.select.info = data.data;
                    })
                }
            }, function () {});
        };
        
        if($scope.suc&&$scope.suc.user){
        	sucHelpers.extend($scope.user, $scope.suc.user);
        }
    }).controller('userSelectCtrl', function ($scope, $stateParams, $http, sucHelpers, $uibModal) {
    	$scope.user={};
    	$scope.isCollapsed=false;
    	$scope.isCollapsedF=false;
    	$scope.isCollapsedS=false;
    	$scope.isCollapsedT=false;
        $scope.user.select = {};
        $http({
            method: "get",
            url: "rest/authox/users/" + $stateParams.key
        }).then(function (data) {
            $scope.user.select.info = data.data;
        })
        $http({
            method: "get",
            url: "rest/authox/users/" + $stateParams.key + "/roles"
        }).then(function (data) {
            $scope.user.select.roles = data.data;
        })
        $http({
            method: "get",
            url: "rest/authox/users/" + $stateParams.key + "/groups"
        }).then(function (data) {
            $scope.user.select.groups = data.data;
        })
                
        $scope.user.resetKey = function () {
            if (confirm("确认重置该用户密码为123456？")) {
                $http.post('rest/authox/users/' + $scope.user.select.info.authoxuser_Id + '/resetPassword ').then(function (data) {
                    alert('重置成功');
                })
            }
        };
        $scope.user.addUser = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/user/addUser.html",
                controller: "addUserCtrl",
                backdrop: 'static',
                size: 'role',
                resolve: {
                    op: function () {
                        return angular.copy(op);
                    },
                    select: function () {
                        return angular.copy(select)
                    }
                }
            });
            modalInstance.result.then(function (i) {
                if (i === 1) {
                    $scope.user.search();
                } else {
                    $http({
                        method: "get",
                        url: "rest/authox/users/" + $scope.user.select.info.authoxuser_Id
                    }).then(function (data) {
                        $scope.user.select.info = data.data;
                    })
                }
            }, function () {});
        };

        $scope.user.editUserRole = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/user/editUserRole.html",
                controller: "editUserRoleCtrl",
                backdrop: 'static',
                resolve: {
                    op: function () {
                        return angular.copy(op)
                    },
                    select: function () {
                        return angular.copy(select)
                    }
                }
            });
            modalInstance.result.then(function (i) {
                $http({
                    method: "get",
                    url: "rest/authox/users/" + i + "/roles"
                }).then(function (data) {
                    $scope.user.select.roles = data.data;
                })
            }, function () {});
        }

    }).controller("addUserCtrl", ['$scope', '$http', '$uibModalInstance', 'op', 'select', function ($scope, $http, $uibModalInstance, op, select) {
        $scope.op = op;
        $scope.showSel = !!select;
        $scope.select = angular.copy(select) || {};
        $scope.checkModel = $scope.showSel ? select.account : '';
        $scope.commit = function () {
            var data = angular.copy($scope.select);
            if ($scope.showSel) {
                data.uid = data.authoxuser_Id;
                delete data.password;
                $http({
                    method: "POST",
                    url: "rest/authox/users/" + select.authoxuser_Id,
                    data: data
                }).then(function (data) {
                    $uibModalInstance.close(2);
                }).catch(function (data) {})
            } else {
                $http({
                    method: "POST",
                    url: "rest/authox/users",
                    data: data
                }).then(function (data) {
                    $uibModalInstance.close(1);
                }).catch(function (data) {})
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
	    }]).controller("editUserRoleCtrl", ['$scope', '$http', '$uibModalInstance', 'op', 'select', function ($scope, $http, $uibModalInstance, op, select) {
        $scope.op = op;
        $scope.select = angular.copy(select);
        $http.get("rest/authox/roles").then(function (data) {
        	var data = data.data;
            $scope.multiSel = []
            data.forEach(function (i) {
                var list = {};
                list.role = i.role;
                list.name = i.name;
                list.des = i.des;
                list.ticked = false;
                $scope.select.roles.forEach(function (j) {
                    if (j.role === i.role) {
                        list.ticked = true;
                    }
                })
                $scope.multiSel.push(list);
            })
        })
        $scope.commit = function () {
            var data = [];
            $scope.select.checkUsers.forEach(function (i) {
                data.push(i.role);
            })
            $http({
                method: 'post',
                url: 'rest/authox/users/' + select.info.authoxuser_Id + '/roles',
                data: data
            }).then(function (data) {
                $uibModalInstance.close(select.info.authoxuser_Id);
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
});

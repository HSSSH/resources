define(['app', 'sucHelpers'], function (app) {
    app.controller("groupCtrl", function ($scope, $http, $rootScope, $uibModal, sucHelpers, $state,$filter) {
        $scope.group = {};
        $scope.group.table = {
            isActive: true,
            headList: ['组名称','角色', '备注', '创建时间'],
            searchList:[{key:'displayname',name:'组名称'}]
        };
        $scope.group.pages={
        		totalCount:0,
        		currentPageNo:1,
        		pageSize:8,
        }
        $scope.group.refresh = function () {
            $http.get('rest/authox/groups').then(function (data) {
            	var data = data.data;
                $scope.group.table.allContent = data;
                $scope.group.pages.totalCount=data.length;
                $scope.group.pages.currentPageNo=1;
                $scope.group.table.content=data.slice(0,$scope.group.pages.pageSize); 
            })
        }
        $scope.group.refresh();
        $scope.group.table.searchName='displayname';
        $scope.group.search=function(){
        	$http.get('rest/authox/groups/like?key='+$scope.group.table.searchName+'&value='+($scope.group.searchValue||'')).then(function(data){
        		$scope.group.table.content=data.data;
        	})
        }
        $scope.group.pageChanged=function(currentPageNo){
        	$scope.group.table.content=$scope.group.table.allContent.slice((currentPageNo-1)*$scope.group.pages.pageSize,currentPageNo*$scope.group.pages.pageSize);
        }
        $scope.group.delgroup = function (item) {
        	if(confirm("确认删除？")){
	            $http({
	                method: "delete",
	                url: "rest/authox/groups/" + item.groupTag
	            }).then(function (data) {
	                $scope.group.refresh();
	            })
        	}
        }
        $scope.group.addGroup = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/group/addGroup.html",
                controller: "addGroupCtrl",
                backdrop: 'static',
                size:'group',
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
                    $scope.group.refresh();
                } else {
                    $http.get('rest/authox/groups/' + $scope.group.select.info.groupTag).then(function (data) {
                        $scope.group.select.info = data.data;
                    })
                }
            }, function () {});
        };

        if($scope.suc&&$scope.suc.group){
        	sucHelpers.extend($scope.group, $scope.suc.group);
        }
    }).controller('groupSelectCtrl',function($scope,$stateParams,$http,$uibModal){
    	$scope.group={};
    	$scope.isCollapsed=false;
    	$scope.isCollapsedF=false;
    	$scope.isCollapsedS=false;
    	$scope.group.select = {};
        $http.get('rest/authox/groups/'+$stateParams.key).then(function(data){
        	$scope.group.select.info=data.data;
        })
        $http({
            method: "get",
            url: "rest/authox/groups/" + $stateParams.key + "/users"
        }).then(function (data) {
            $scope.group.select.users = data.data||[];
        })
        $http({
            method: "get",
            url: "rest/authox/groups/" + $stateParams.key + "/roles"
        }).then(function (data) {
            $scope.group.select.roles = data.data;
        });
        $scope.group.addGroup = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/group/addGroup.html",
                controller: "addGroupCtrl",
                backdrop: 'static',
                size:'group',
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
                    $scope.group.refresh();
                } else {
                    $http.get('rest/authox/groups/' + $scope.group.select.info.groupTag).then(function (data) {
                        $scope.group.select.info = data.data;
                    })
                }
            }, function () {});
        };
        $scope.group.editGroupRoles = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/group/editGroupRole.html",
                controller: "editGroupRoleCtrl",
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
                    url: "rest/authox/groups/" + i + "/roles"
                }).then(function (data) {
                    $scope.group.select.roles = data.data;
                })
            }, function () {});
        }
        $scope.group.editGroupUsers = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/group/editGroupUser.html",
                controller: "editGroupUsersCtrl",
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
                    url: "rest/authox/groups/" + i + "/users"
                }).then(function (data) {
                    $scope.group.select.users = data.data;
                })
            }, function () {});
        }
    }).controller("addGroupCtrl", ['$scope', '$http', '$uibModalInstance', 'op', 'select', function ($scope, $http, $uibModalInstance, op, select) {
        $scope.op = op;
        $scope.showSel = !!select;
        $scope.select = angular.copy(select) || {};
        $scope.checkModel=$scope.showSel ? select.displayName:'';
        $scope.commit = function () {
            var data = {};
            data.groupTag = $scope.select.groupTag || null;
            data.displayName = $scope.select.displayName;
            data.des = $scope.select.des;
            if ($scope.showSel) {
                $http({
                    method: "POST",
                    url: "rest/authox/groups/" + select.groupTag,
                    data: data
                }).then(function (data) {
                    $uibModalInstance.close(2);
                }).catch(function (data) {})
            } else {
                $http({
                    method: "POST",
                    url: "rest/authox/groups",
                    data: data
                }).then(function (data) {
                    $uibModalInstance.close(1);
                }).catch(function (data) {})
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]).controller("editGroupRoleCtrl", ['$scope', '$http', '$uibModalInstance', 'op', 'select', function ($scope, $http, $uibModalInstance, op, select) {
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
                url: 'rest/authox/groups/' + select.info.groupTag + '/roles',
                data: data
            }).then(function (data) {
                $uibModalInstance.close(select.info.groupTag);
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]).controller("editGroupUsersCtrl", ['$scope', '$http', '$uibModalInstance', 'op', 'select', function ($scope, $http, $uibModalInstance, op, select) {
        $scope.op = op;
        $scope.select = angular.copy(select);

        $http.get("rest/authox/users").then(function (data) {
            var data = data.data;
            $scope.multiSel = []
            data.forEach(function (i) {
                var list = {};
                list.authoxuser_Id = i.authoxuser_Id;
                list.account = i.account;
                list.description = i.description;
                list.displayName = i.displayName;
                list.ticked = false;
                $scope.select.users.forEach(function (j) {
                    if (j.authoxuser_Id === i.authoxuser_Id) {
                        list.ticked = true;
                    }
                })
                $scope.multiSel.push(list);
            })
        })
        $scope.commit = function () {
            var data = [];
            $scope.select.checkUsers.forEach(function (i) {
                data.push(i.account);
            })
            $http({
                method: 'post',
                url: 'rest/authox/groups/' + select.info.groupTag + '/users',
                data: data
            }).then(function (data) {
                $uibModalInstance.close(select.info.groupTag);
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }])
});

define(['app'], function (app) {
	app.controller('role2SelectCtrl', function ($scope, $stateParams, $http,$q, sucHelpers, $uibModal) {
	    $scope.role={};
    	$scope.isCollapsed=false;
    	$scope.isCollapsedF=false;
    	$scope.isCollapsedS=false;
    	$scope.role.addRole = function (op, select) {
            var modalInstance = $uibModal.open({
                templateUrl: "partials/authority/system/role/addRole.html",
                controller: "addRoleCtrl",
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
                    $scope.role.refresh();
                } else {
                    $http.get('rest/authox/roles/' + $scope.role.select.info.role).then(function (data) {
                        $scope.role.select.info = data.data;
                    })
                }
            }, function () {});
        };
	    //-----table-------
	    $scope.role.isEditing = false;
	    $scope.role.select = {};
	    $http.get('rest/authox/roles/' + $stateParams.key).then(function (data) {
            $scope.role.select.info = data.data;
        })
        var deferred = $q.defer();  
        //定义两个获取的源路径  
        var p1 = $http.get('rest/authox/objects');  
        var p2 = $http.get('rest/authox/operations');  
        var p3 = $http.get('rest/authox/objectOps')
        $q.all([p1, p2, p3])  
        .then(function (results) {  
            var aggregatedData = [];  
            angular.forEach(results, function (result) {  
            	aggregatedData.push(result);
            });  
            $scope.objs=aggregatedData[0].data;
            $scope.opes=aggregatedData[1].data;
            $scope.role.rules=aggregatedData[2].data;
            
            var list=[];
    	    $scope.role.rules.forEach(function (i) {
    	        var n = false;
    	        list.forEach(function (j) {
                    if (j.objectTag === i.objectcode) {
                        n = true;
                        j.ops.push({
                            'op': i.opcode,
                            checked: false
                        })
                    }
                })
    	        if (!n) {
    	        	var tagObj = {};
                    tagObj.objectTag = i.objectcode;
                    tagObj.isEdited = false;
                    tagObj.ops = [];
                    tagObj.ops.push({
                        'op': i.opcode,
                        checked: false
                    });
                    list.push(tagObj)
    	        }
    	    })
    	    $scope.role.allRules=angular.copy(list);
    	    $http.get('rest/authox/roles/' + $stateParams.key + '/rules').then(function (data) {
    	    	var data = data.data;
    	    	data.forEach(function(i){
    		    	$scope.role.allRules.forEach(function(j){
    		    		if(i.objectTag===j.objectTag){
    		    			j.ops.forEach(function(m){
    		    				if(m.op===i.op){
    		    					m.checked=true;
    		    				}
    		    			})
    		    		}
    		    	})
    		    })
    	    })
    	    
        });  
        var baseList=[];
        $scope.goEdit=function(){
        	$scope.isCollapsedF=false;
        	$scope.isEditing=true;
	    	baseList=angular.copy($scope.role.allRules);
        }
	    $scope.saveEdit=function(){
	    	var data=[];
	    	$scope.role.allRules.forEach(function(i){
	    		i.ops.forEach(function(j){
	    			if(j.checked){
	    				var a={
	    						objectTag:i.objectTag,
	    						op:j.op
	    				}
	    				data.push(angular.copy(a));
	    			}
	    		})
	    	})
	    	$http({
                    method: 'post',
                    url: 'rest/authox/roles/' + $stateParams.key + '/rules',
                    data: data
                }).then(function (data) {
                	baseList=angular.copy($scope.role.allRules);
                	$scope.isEditing=false;
                    alert("修改成功")
            })
	    }
	    $scope.quitEdit=function(){
	    	$scope.role.allRules=angular.copy(baseList);
	    	$scope.isEditing=false;
	    }

	})
})
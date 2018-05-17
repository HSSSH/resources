angular.module('suc-table', [])
.directive('sucTable', ['$http', '$interval', function($http, $interval){
	return {

      restrict: 'AE',
	  scope:{
	          tableSet: '=tableSet'
            //pageSet: '=pageSet'
	   },

	  template: '<div class="table_container">'+ 
                     '<table class="table table_content">'+
                        '<thead>'+
                          '<tr>'+
                            '<th ng-repeat="a in table.head">{{a}}</th>'+                        
                          '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr ng-repeat="b in table.content" id="auto_tr">'+
                              '<td ng-repeat="c in b track by $index">{{c}}</td>'+
                            '</tr>'+
                        '</tbody>'+
                      '</table>'+
           
                      '<div class="table_bottom">'+
                          '<uib-pagination ng-change="updateData()" total-items="page.total"'+
                            'ng-model="page.currentPage" items-per-page="page.itemsPerPage"'+
                            'class="pagination" boundary-links="true" direction-links="false"'+
                          'rotate="true" max-size="8" first-text="首页" last-text="末页">'+
                          '</uib-pagination>'+
                      '</div>'+
                '</div>',
	                   
	    controller:function($scope){
	    var tableSets = {
	    		head: [],
	    		key: [],
	    		url: '',
	    		method: '',
	    		params: {
            
	    		},
	    		dataSourceKey: [],
	    		totalKey: "",
	    		setTotal: function(){},
	    		before: function(){},
	    		after: function(){},
	    		data: {}
	    };
	    
        
        for(var i in $scope.tableSet){
          for(var j in tableSets){
            if(i===j){
              tableSets[j] = $scope.tableSet[i];
              break;
            }
          }
        }
        
        $scope.page = $scope.tableSet.page;
        $scope.events = $scope.tableSet.event?$scope.tableSet.event:[];
        $scope.innerTd = $scope.tableSet.innerTd?$scope.tableSet.innerTd:[];

        $scope.table = {
        	head: [],
            key: [],
            content: [],
            source: []
        };
        
        $scope.getData = function(){
        	 $http({
                 method: tableSets.method,
                 url: tableSets.url,
                 params: tableSets.params,
                 data: tableSets.data
             }).success(function(res){
            	 
            	 if(tableSets.dataSourceKey.length>0){
            		 var res;
            		 for(i in tableSets.dataSourceKey){
            			 res=res[tableSets.dataSourceKey[i]];
            		 }       		
            	 }
            	 
            	 if(tableSets.totalKey){
            		 $scope.page.total = res[tableSets.totalKey];
            	 }
            	 
            	 $scope.table.source=angular.copy(res);            	   
                 $scope.table.head = tableSets.head;
                 $scope.table.key = tableSets.key;
                 
                 if(typeof tableSets.before==='function'){
                	 tableSets.before(res);
                 }
                 $scope.table.content = [];
                 for(var j in res){
                 	$scope.table.content[j] = [];
                 	//if(res[j][$scope.table.key[i]])
                 	for(var i=0, len=$scope.table.key.length; i<len; i++){ 
                 		if($scope.table.key[i]==="$$index"){
                 			var index = ($scope.page.currentPage-1)*$scope.page.itemsPerPage+parseInt(j);
                 			$scope.table.content[j].push(index);
                 		}else if($scope.table.key[i]==="$$specialEle"){
                 			$scope.table.content[j].push(""); 
                 		}else{
                 			$scope.table.content[j].push(res[j][$scope.table.key[i]]); 
                 		}        		
                 	}
                }
                 if(typeof tableSets.after==='function'){
                	 tableSets.after();
                 }
             }).error(function(){
               console.log("fail to get data");
             })
        };
        //$scope.getData();
       
        
        $scope.updateData = function(){
        	if($scope.page.calculate&&typeof $scope.page.calculate ==='function'){
        		var temp = $scope.page.calculate($scope.page.currentPage,$scope.page.itemsPerPage);
        		if(temp&&typeof temp ==='object'){
        			for(var i in temp){
        				for(var j in tableSets.params){
        					if(i===j){
        						tableSets.params[j] = temp[i];
        						break;
        					}
        				}
        			}
        			
        		}
        	}
        	$scope.getData();
        };
        
        var dataWatchwer=$scope.$watch('tableSet.data',function(data){
        	tableSets.data = data;
        	$scope.page.currentPage = 1;
        	$scope.updateData();
        	if(tableSets.setTotal){
        		tableSets.setTotal();
        	}
		 },true);    
        
        var totalWatcher = $scope.$watch('tableSet.page.total',function(data){
        	$scope.page.total = data;
		 },true);    
        
        $scope.$on("$destory",function(){
        	dataWatchwer = null;
        	totalWatcher = null;
		});
        
	    },

	    //controllerAs:'tableCtrl',
		link:function(scope, element, attrs){
			console.log("begin link");
			
			var watcher = scope.$watch('table.source',function(data){
				if(scope.table.source.length===0){
					return;
				}
				var eles = element[0].querySelectorAll("#auto_tr");	
				
				var timer = $interval(function(){				
					if(eles.length>0&&eles[0].childNodes.length>1){
						$interval.cancel(timer);
						
						var createTd = function(){
							if(scope.innerTd.length>0){
								for(var i in scope.innerTd){
									var td = scope.innerTd[i].td;
									var innerHtml = scope.innerTd[i].html
									for(var j=0, len=eles.length; j<len; j++){	        					
			        					var ele = eles[j].childNodes[td*2+1];		       
			        					ele.innerHTML = innerHtml;	        										        				
			        				}
								}
							}
						};
						
						var bindEvent = function(i){
							if(i==='$$TR'){        		
				        		for(var k=0, len=eles.length; k<len; k++){
				        			var type = scope.events[i].type;
									var callback = scope.events[i].method;
				        			angular.forEach(scope.table.source, function(data){
		        						if(data===scope.table.source[k]){
		        							eles[k].addEventListener(type, function(event){
				        						return callback(event, data);
				        					});	
		        						}			        						
		        					});		
				        		}
				        	}else{
				        		for(var j in scope.table.key){
				        			if(i===scope.table.key[j]){
				        				//var eles = document.querySelectorAll("#auto_tr");
				        				for(var k=0, len1=eles.length; k<len1; k++){	        					
				        					var type = scope.events[i].type;
				        					var callback = scope.events[i].method; 
				        					var childEle = eles[k].childNodes[j*2+1];		       
				        					angular.forEach(scope.table.source, function(data){
				        						if(data===scope.table.source[k]){
				        							childEle.addEventListener(type, function(event){
						        						return callback(event, data);
						        					});	
				        						}			        						
				        					});			        										        				
				        				}
				        				
				        				break;
				        			}
				        		}
				        	}
						};
						createTd();
						for(var i in scope.events){
							bindEvent(i);
						}						
					}
				},500)	        	
			 },true);
			
			scope.$on("$destory",function(){
				watcher = null;
			});
		 		 
		}
	}
}]);

//示例配置
/*$scope.tableSet = {
			url: '/rest/dc/query/humanResources_page',
			method: 'POST',
			page: {
				currentPage: 1,
				itemsPerPage: Math.ceil(($(window).height()-260)/45)-1,
				total: 0,
				calculate: function(p1,p2){ //p1 当前页 p2 每页数目
					return {first: (p1-1)*p2};  //插件分页参数映射到url分页参数
				}
			},
			params: {
				limit: Math.ceil(($(window).height()-260)/45)-1,
				first: 0,
			},
			dataSourceKey:[],         //指定数据源key，如返回数据为data={dataList:[]},则dataSourceKey=[dataList],
			                                  //如data={dataList:{list:[]}},则dataSourceKey=['dataList','list'],以此类推
			totalKey: "",                //指定总数据数量key，如返回数据data={list:[],total:111},则totalKey="total"
			setTotal: function(){    //如果无法直接获取total，需单独调用接口获取total，可设置此方法
				$http.post('/rest/dc/query/humanResources_page/?first='+$scope.page.first+'&limit='+$scope.page.limit+'&countOnly=true',$scope.condition)
				.success(function(data){
					$scope.tableSet.page.total = data.count;
				});
			},
			data: angular.copy($scope.condition), //如不使用angular.copy方法复制则会自动触发刷新数据
			head: ['序号', '人员姓名', '人员类型', '所属机构', '所属部门', '职位', '在职时间', '操作'],
			key: ['$$index', 'NAME', 'JOBTYPE', 'ORGANIZATION_ID', 'DEPARTMENT', 'JOB', 'ENTRYDATE', '$$specialEle'],//$$index,$$specialEle为预定义字符
			innerTd: [                                             //自定义单元格元素,不支持angular指令，暂不能关联表格数据
			            {
			            	td: 7,
			            	html: '<i class="fa fa-history replay_btn" aria-hidden="true"></i>'+
                                    '<i class="fa fa-level-up track_btn" aria-hidden="true"></i><span></span>'
			            }
			],
			event: {                                                  //绑定事件，注意：'$$TR'表示给某一行绑定事件；参数event为事件对象，data为该条数据对象
				'$$TR': {type: 'click', method: function(event, data){
					$scope.edit(data);
				}
			},   
				'NAME': {type: 'click', method: function(event, data){
					 console.log(data);
					}
				}
			},
			before: function(data){                    //url成功获取数据后，数据可经过before()方法过滤
				for(var i in data){
					if(data[i].JOBTYPE==="1"){
						data[i].JOBTYPE = "监控员";
					}else{
						data[i].JOBTYPE = "巡逻员";
					}
				}
			},    
			after: function(){}       //渲染数据后，回调方法
		};

$scope.searchData = function(){   //更新查询条件后，手动触发表格数据刷新
	$scope.tableSet.data = angular.copy($scope.condition);
};*/
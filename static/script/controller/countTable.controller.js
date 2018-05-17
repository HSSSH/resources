define(['app', 'printw'], function(app) {
	app.controller('monthTableCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){
		//获取城区列表
		$scope.getCQ = function () {
			$http.get("/common/cq").then(function (data) {
				$scope.cqItems = data.data;
			})
		};
		//打印
		$scope.print = function () {
            var str = document.getElementById('monthTab').innerHTML;
            var content = "<div class='monthTable'><div class='detail'>"
            content = content + str + "</div></div>"
            window.document.body.innerHTML = content;
            window.print();
            window.location.reload();
        };
		//生成报表按钮
		$scope.monthTabSearch = function () {
			var month = $filter('date')($scope.monthTab.month, "MM"),
			    year = $filter('date')($scope.monthTab.year, "yyyy");
			$http.get("/report/month?"
					  + "year=" + year
					  + "&month=" + month
					  + "&cq=" + $scope.monthTab.cq).then(function (data) {
				$scope.monthStatic = data.data[0];
				$scope.monthSum = data.data[1];
			});
		};
		//绑定select中选定的值
		$scope.csq = function (n) {
			if (n == 1) {
				$scope.cq = "上城区";
			} else if (n == 2) {
				$scope.cq = "下城区";
			} else if (n == 3) {
				$scope.cq = "江干区";
			} else if (n == 4) {
				$scope.cq = "拱墅区";
			} else if (n == 5) {
				$scope.cq = "西湖区";
			} else if (n == 6) {
				$scope.cq = "滨江区";
			} else if (n == 7) {
				$scope.cq = "西湖经济技术开发区";
			} else {
				$scope.cq = "西湖风景名胜区";
			}
		};
		function init () {
			//初始化日期查询
			$scope.monthTab = {
				year: "2017-11-22T16:00:00.000Z",
				month: "2017-01-22T16:00:00.000Z",
				cq: 2
			};
			$scope.csq($scope.monthTab.cq);
			$scope.time = new Date();
			$scope.monthTabSearch();
			$scope.cqItems = 1;
			$scope.getCQ();
		};
		init();
	}]);
	app.controller('historyLogCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){
		//获取城区列表
		$scope.getCQ = function () {
			$http.get("/common/cq").then(function (data) {
				$scope.cqItems = data.data;
			})
		};
		//生成报表按钮
		$scope.historyLogSearch = function () {
			var startTime = $filter('date')($scope.historyLog.startTime, "yyyy-MM-dd"),
			    endTime = $filter('date')($scope.historyLog.endTime, "yyyy-MM-dd");
			$http.get("/report/taizhang?"
					  + "startTime=" + startTime
					  + "&endTime=" + endTime
					  + "&cq=" + $scope.historyLog.cq).then(function (data) {
				$scope.historyLogStatic = data.data;
				$scope.yjnsySum = 0;
				$scope.sjnsySum = 0;
				for (var i = 0; i < $scope.historyLogStatic.length; i++) {
					$scope.yjnsySum += $scope.historyLogStatic[i].yjnsy;
					$scope.sjnsySum += $scope.historyLogStatic[i].sjnsy;
				};
			});
		};
		//打印
		$scope.print = function () {
            var str = document.getElementById('historyLog').innerHTML;
            var content = "<div class='monthTable historyLog' style='height: 100%; overflow-y: scroll'><div class='detail'>"
            content = content + str + "</div></div>"
            window.document.body.innerHTML = content;
            window.print();
            window.location.reload();
        };
		//绑定select中选定的值
		$scope.csq = function (n) {
			if (n == 1) {
				$scope.cq = "上城区";
			} else if (n == 2) {
				$scope.cq = "下城区";
			} else if (n == 3) {
				$scope.cq = "江干区";
			} else if (n == 4) {
				$scope.cq = "拱墅区";
			} else if (n == 5) {
				$scope.cq = "西湖区";
			} else if (n == 6) {
				$scope.cq = "滨江区";
			} else if (n == 7) {
				$scope.cq = "西湖经济技术开发区";
			} else {
				$scope.cq = "西湖风景名胜区";
			}
		};
		function init () {
			//初始化日期查询
			$scope.historyLog = {
				startTime: "2017-06-22T16:00:00.000Z",
				endTime: "2017-08-22T16:00:00.000Z",
				cq: 1
			};
			$scope.yjnsySum = 0;
			$scope.sjnsySum = 0;
			$scope.getCQ();
			$scope.csq($scope.historyLog.cq);
			$scope.historyLogSearch();
		};
		init();
	}]);
	app.controller('analyzeCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){
		$scope.analyzeSearch = function () {
			var startTime = $filter('date')($scope.historyLog.startTime, "yyyy-MM-dd"),
			    endTime = $filter('date')($scope.historyLog.endTime, "yyyy-MM-dd");
			$http.get("/report/huizong?"
					  + "startTime=" + startTime
					  + "&endTime=" + endTime).then(function (data) {
				$scope.analyzeStatic = data.data;
				console.log(data);
			});
		};
		//打印
		$scope.print = function () {
            var str = document.getElementById('analyze').innerHTML;
            var content = "<div class='monthTable analyze'><div class='detail'>"
            content = content + str + "</div></div>"
            window.document.body.innerHTML = content;
            window.print();
            window.location.reload();
        };
		function init () {
			//初始化日期查询
			$scope.historyLog = {
				startTime: "2017-10-22T16:00:00.000Z",
				endTime: "2017-12-22T16:00:00.000Z",
			};
			$scope.ddd = 2;
			$scope.analyzeSearch();
		};
		init();
	}]);
});
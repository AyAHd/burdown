(function(){
    	var app = angular.module('burdown', ["ngTable", "chart.js"]); 
	    app.controller('TableController', TableController);
	    app.controller('ChartController', ChartController);

	    function TableController ($scope, NgTableParams, PointService, $http){
			// open chrome dev tools and uncomment the following line 
		    //debugger;
			
		    PointService.async().then(function(d){
				console.log(PointService.cachedData)

				$scope.tableParams = new NgTableParams({}, {
				    total: 0, // length of data
					getData: function($defer, params){
						PointService.getData($defer, params);
					},
					data : PointService.cachedData
				});


				$scope.tableParams.reload();
			})
	    } 
	    
	    function ChartController ($scope, PointService, $http){
	    	PointService.async().then(function(d){
				$scope.labels = PointService.clearDates(PointService.cachedData)
				$scope.series = [
					'Worked',
					'Estimated', 
				];
				$scope.data = [
					PointService.pointsFill(PointService.cachedData),
					PointService.avgFill(PointService.cachedData), 
				];
				console.log($scope.data);
				$scope.onClick = function (points, evt) {
			  		console.log(points, evt);
				};
	    	});
	    };

	    app.service("PointService", function($http){
 		  	var service = {
  		    	cachedData : [],
  		    	cachedPromise : null, 
  		    	getData : function($defer, params){
  		      		if(service.cachedData.length>0){
  		      			$defer.resolve(service.cachedData);
  		        		return service.cachedData;
  		      		}
  		      		else{
  		        		var p = $http.get("http://localhost:3000/points").then(function(resp){
  		          			angular.copy(angular.fromJson(resp.data),service.cachedData);
  		          			$defer.resolve(service.cachedData);
  		          			return resp.data;
		            	});
  		        		return p;
  		      		}
  		    	},
  		    	async : function(){
  		    		if(service.cachedPromise){
  		    			return service.cachedPromise;
  		    		}
  		    		else {
		            	var p = $http.get("http://localhost:3000/points").then(function(resp){
		            		angular.copy(angular.fromJson(resp.data),service.cachedData);
							return angular.fromJson(resp.data);
						});
  		    			angular.copy(p,service.cachedPromise);
  		    		}
  		    		return p;
  		    	},
  		    	clearPoints : function(data){
  		    		var total = data.length;

  		    		var res = data.map(function(row){
  		    			return row["attPoints"];
  		    		});
  		    		return res;
  		    	},
  		    	clearDates : function(data){
  		    		var total = data.length;
  		    		var res = data.map(function(row){
  		    			var date = new Date(row["attDate"].$date);
  		    			return date.getDate()+" / "+ (date.getMonth()+1) +"";
  		    		});
  		    		return res;
  		    	},
  		    	avgFill : function(data){
					var len = data.length;
					var total = service.sum(service.clearPoints(data));
					var val = total/len;
  		    		var res = [];
  		    		for (var i = 0; i < len; i++){
  		    			res[i] = (len-i-1)*val; 
  		    		}
  		    		return res;
  		    	},
  		    	pointsFill : function(data){
  		    		var len = data.length;
					var total = service.sum(service.clearPoints(data));
  		    		var res = [];
  		    		data = service.clearPoints(data)
  		    		for (var i = 0; i < len; i++){
  		    			res[i] = total - data[i]; 
  		    			total -= data[i];
  		    		}
  		    		return res;
  		    	},
  		    	sum : function(data){
  		    		return data.reduce(function(pv, cv) { return pv + cv; }, 0)
  		    	}
  		  	};
  		  	return service;  
  		});
    })();
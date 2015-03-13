app.controller('uploadController', ['$scope', '$resource', 
	function($scope, $resource){

	var Upload = $resource('/api/songs/');
	Upload.query(function(results){
			var numbersongs = results.length;
			$scope.songs = results[numbersongs-1];
		})
	$scope.songpath=[{name: "hello"}];

	// $scope.getTime=function(){setInterval(function(){$scope.time=song.currentTime},1);}
	var i=5;
	setInterval(function(){i+=1; $scope.times=i},1);

	$scope.playSong = function(){
		
		song=new Audio($scope.songs.url);
		$('body').append(song);
		song.play();
		
	}

	$scope.addCustomer = function(){
		var d = new Date();
		var month=d.getMonth()+1;
		var day= d.getDate();
		var year= d.getFullYear();
		var date= month+ "/" + day + "/" + year
		var customer = new Customer();
		customer.name = $scope.customerName;
		customer.created=date;
		customer.$save(function(result){
			$scope.customers.push(result);
			$scope.customerName="";
		});

	}

	
}])
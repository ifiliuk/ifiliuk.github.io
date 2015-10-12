angular
    .module("albumsModule",[])
    .controller("albumsController", function($scope, $http){
        $scope.albums = [];

        $http.get('/albums.json').
            success(function(data, status, headers, config) {
                for(var i=0; i<data["albums"].length; i++){
                    $scope.albums.push(data["albums"][i]);
                }
            }).
            error(function(data, status, headers, config) {
                alert('error');
            });

    });
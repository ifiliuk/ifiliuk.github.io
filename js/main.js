angular
    .module("okeanModule",["ngRoute"])
    .config(function($routeProvider){
        $routeProvider
            .when('/album/:index',{
                templateUrl: '/album-detail.html',
                controller: 'albumDetail'
            })
            .when('/', {
                templateUrl: '/album-list.html'
            })
    })
    .controller("bandController", function($scope, $http){
        $scope.band = [];

        $http.get('/band.json').
            success(function(data, status, headers, config) {
                for(var i=0; i<data["band"].length; i++){
                    $scope.band.push(data["band"][i]);
                }
            }).
            error(function(data, status, headers, config) {
                alert('error');
            });
    })
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

    })
    .controller("albumDetail", function($scope, $routeParams){
        $scope.album = $scope.albums[$routeParams.index];
        $scope.songs = $scope.album["songs"];
    });

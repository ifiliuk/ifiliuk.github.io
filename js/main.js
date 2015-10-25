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
    .controller("albumsController", function($scope, $http, $timeout){
        $scope.loadedAlbums = false;
        getJsonData($scope, $http, $timeout, "albums");
        $scope.setCurrentSong = function(path){
            $scope.currentSong = path;
        }
    })
    .controller("albumDetail", function($scope, $routeParams){
        $scope.album = $scope.albums[$routeParams.index];
        $scope.songs = $scope.album["songs"];
    });

function getJsonData(scope, http, timeout, jsonData){
    scope[jsonData] = [];

    http.get('/' + jsonData + '.json').
        success(function(data, status, headers, config) {
            for(var i=0; i<data[jsonData].length; i++){
                scope[jsonData].push(data[jsonData][i]);
            }
            timeout(function(){
                scope.loadedAlbums = true;
            },1500);
        }).
        error(function(data, status, headers, config) {
            alert('error');
        });

    return scope;
}

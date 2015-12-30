var trustUrl = "https://copy.com/**",
    songsStorage = "https://copy.com/web/users/user-16099445/copy";
angular
    .module("okeanModule",["ngRoute"])
    .config(function($routeProvider){
        $routeProvider
            .when("/album/:index",{
                templateUrl: "/album-detail.html",
                controller: "albumDetail"
            })
            .when("/", {
                templateUrl: "/album-list.html"
            })
    })
    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(["self", trustUrl]);
    })
    .controller("albumsController", function($scope, $http, $timeout){
        $scope.loadedAlbums = false;
        getJsonData($scope, $http, $timeout, "albums");
        $scope.setPlayingSong = function(song){
            $scope.playingSong = song;
            $scope.playingSongPath = songsStorage + song.source;
        }
    })
    .controller("albumDetail", function($scope, $routeParams){
        $scope.album = $scope.albums[$routeParams.index];
        $scope.songs = $scope.album["songs"];
    })
    .directive('audioLoad', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var audio = false;
                attrs.$observe('src', function() {
                    if (!audio){
                        audio = audiojs.createAll({"autoplay": true});
                    } else {
                        audio[0].load(scope.playingSongPath);
                        audio[0].play();
                    }
                });
            }
        };
    });

function getJsonData(scope, http, timeout, jsonData){
    scope[jsonData] = [];

    http.get("/" + jsonData + ".json").
        success(function(data, status, headers, config) {
            for(var i=0; i<data[jsonData].length; i++){
                scope[jsonData].push(data[jsonData][i]);
            }
            timeout(function(){
                scope.loadedAlbums = true;
            },1500);
        }).
        error(function(data, status, headers, config) {
            alert("error");
        });

    return scope;
}

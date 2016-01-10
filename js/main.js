var trustUrl = "https://copy.com/**",
    songsStorage = "https://copy.com/web/users/user-16099445/copy";
angular
    .module("okeanModule",["ngRoute","ngAnimate"])
    .config(function($routeProvider){
        $routeProvider
            .when("/album/:index",{
                templateUrl: "/album-detail.html",
                controller: "albumDetailCtrl"
            })
            .when("/", {
                templateUrl: "/album-list.html"
            })
    })
    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(["self", trustUrl]);
    })
    .factory("audioData", function(){
        var audioData = {
            album: {},
            songs: [],
            currentSong: {}
        };
        return audioData;
    })
    .controller("albumsCtrl", function($scope, $http, $timeout){
        $scope.loadedAlbums = false;
        $scope.albums = [];
        $http.get("/albums.json").
            success(function(data, status, headers, config) {
                for(var i=0; i<data["albums"].length; i++){
                    $scope.albums.push(data["albums"][i]);
                }
                $timeout(function(){
                    $scope.loadedAlbums = true;
                }, 1500);
            }).
            error(function(data, status, headers, config) {
                alert("error");
            });

    })
    .controller("albumDetailCtrl", function($scope, $routeParams, audioData){
        $scope.album = $scope.albums[$routeParams.index];
        $scope.songs = $scope.album["songs"];
        audioData.album = $scope.album;
        audioData.songs = $scope.songs;
    })
    .controller("audioCtrl", function($scope, $rootScope, audioData){
        $scope.playlist = [];
        $scope.playerHided = false;
        $rootScope.setPlayingSong = function(song){
            $scope.playingSong = song;
            $scope.playingSongPath = songsStorage + song.source;
            $scope.showPlayer();
            $scope.$apply();
        };
        $rootScope.addToPlaylist = function(song){
            $scope.playlist.push(song);
            song.addedToPlaylist = true;
        };
        $rootScope.removeFromPlaylist = function(index){
            $scope.playlist[index]["addedToPlaylist"] = false;
            $scope.playlist.splice(index,1);
        };
        $scope.callNextTrack = function(){
            var playlistEnd = false;
            if ($scope.playlist.length){
                for (var i=0; i<$scope.playlist.length; i++){
                    if (($scope.playlist[i] === $scope.playingSong)&&(i !== $scope.playlist.length)){
                        $rootScope.setPlayingSong($scope.playlist[i+1]);
                        playlistEnd = false;
                        break;
                    } else {
                        playlistEnd = true;
                    }
                }
                if (playlistEnd){
                    $rootScope.setPlayingSong($scope.playlist[0]);
                }
            }
        };
        $scope.hidePlayer = function(){
            $scope.playerShowed = false;
            $scope.playerHided = true;
        };
        $scope.showPlayer = function(){
            $scope.playerShowed = true;
            $scope.playerHided = false;
        };
    })
    .directive('audioLoad', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var audio = false;
                attrs.$observe('src', function() {
                    if (!audio){
                        audio = audiojs.createAll({
                            autoplay: true,
                            trackEnded: function() {
                                scope.callNextTrack();
                            }
                        });
                    } else {
                        audio[0].load(scope.playingSongPath);
                        audio[0].play();
                    }
                });
            }
        };
    });


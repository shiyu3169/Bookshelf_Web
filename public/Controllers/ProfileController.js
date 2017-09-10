//confroller for Profile
app.controller("ProfileController", function ($scope, $http, $rootScope, BookService) {
    var username = $rootScope.currentUser.username;
    $http.get('/api/users/' + username).success(function (response) {
        $scope.user = response;
    });

    $scope.BookDetail = function (book) {
        var fakeBook = {
            volumeInfo: book
        }
        BookService.BookDetail(fakeBook);
    }

    $scope.RemoveBook = function (index) {
        $http.delete('/api/books/' + username + '/' + index).success(function (response) {
            $scope.user = response;
        });
    }

    $scope.RemoveFollower = function (index) {
        $http.delete('/api/follower/' + username + '/' + index).success(function (response) {
            $scope.user = response;
        });
    }

    $scope.RemoveFollowing = function (index) {
        $http.delete('/api/following/' + username + '/' + index).success(function (response) {
            $scope.user = response;
        });
    }

    $scope.follow = function () {
        var person = $scope.person;
        $http.post('/api/follow/' + username + '/' + person).success(function (response) {
            $scope.user = response;
        })
        .error(function (err) {
            alert("This user doesn't exist. (Don't follow yourself!)");
        });;
    }

    $scope.checkFollow = function (follow) {
        $http.get('/api/users/' + follow).success(function (response) {
            $scope.user = response;
        });
    }
});
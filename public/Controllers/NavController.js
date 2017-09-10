
app.controller("NavController", function ($rootScope, $scope, $http, $location) {
    $scope.logout = function () {
        $http.post("/logout")
        .success(function () {
            $rootScope.currentUser = null;
            $location.url("/home");

        });
    }
});


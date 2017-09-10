//controller for register
app.controller("RegisterController", function ($scope, $http, $location, $rootScope) {
    $scope.register = function (user) {
        $http.post('/register', user)
        .success(function (user) {
            $rootScope.currentUser = user;
            $location.url("/home");
        })
        .error(function (err) {
            alert("Username or Email is already registed");

        });
    }
});
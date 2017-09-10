//controller for login
app.controller("LoginController", function ($scope, $http, $location, $rootScope) {
    $scope.login = function (user) {
        $http.post('/login', user)
        .success(function (response) {
            $rootScope.currentUser = user;
            $location.url("/home");
        })
        .error(function (err) {
            alert("Password and Username Do Not Match!");

        });
    }
});
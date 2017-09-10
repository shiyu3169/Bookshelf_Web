var app = angular.module("app", ["ngRoute"]);

//routing
app.config(function ($routeProvider) {
    $routeProvider
     
    .when('/home', {
        templateUrl: 'views/BookList.html',
        controller: 'BookListSearchController'
    })
    .when('/login', {
        templateUrl: 'views/Login.html',
        controller: 'LoginController'
    })
    .when('/register', {
        templateUrl: 'views/Registration.html',
        controller: 'RegisterController'
    })
    .when('/profile', {
        templateUrl: 'views/Profile.html',
        controller: 'ProfileController',
        resolve: {
            logincheck:checkLogin
        }
    })
    .when('/book', {
        templateUrl: 'views/Book.html',
        controller: 'BookController'
    })
    .when('/api/users', {
    })
    .otherwise({
        redirectTo: '/home'
    })
});

var checkLogin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user)
    {
        $rootScope.errorMessage = null;
        if (user !== '0')
        {
            $rootScope.currentUser = user;
            deferred.resolve();
        }
        else
        {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');
        }
    });
    
    return deferred.promise;
};









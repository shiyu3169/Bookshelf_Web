//controller for Book Detail
app.controller("BookController", function ($scope, $http, $rootScope, BookService) {
    $scope.theBook = BookService.getBook();

    $scope.AddtoBookshelf = function () {
        var username = $rootScope.currentUser.username;
        var book = $scope.theBook;
        $http.put('/AddtoBookshelf/' + username, book).success(function () {
            alert("The book is added to bookshelf");
        });
    }
});
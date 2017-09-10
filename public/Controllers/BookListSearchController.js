//controller for home
app.controller("BookListSearchController", function ($scope, $http, $rootScope, BookService) {

    $scope.searchBook = function () {
        BookService.searchBooks($scope.search, function (response) {
            $scope.books = response.items;
        });
    }

    $scope.BookDetail = function (book) {
        BookService.BookDetail(book);
    }

    $scope.AddtoBookshelf = function (book) {
        var username = $rootScope.currentUser.username;
        $http.put('/AddtoBookshelf/' + username, book).success(function () {
            alert("The book is added to bookshelf");
        });

    }
});
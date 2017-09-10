
//service
app.factory('BookService', function BookService($http) {

    var theBook;

    var searchBooks = function (search, callback) {
        var url = "https://www.googleapis.com/books/v1/volumes?q="
                + search
                + "&filter=partial&maxResults=20";
        $http.jsonp(url + "&callback=JSON_CALLBACK").success(callback);
    }

    var BookDetail = function (book) {
        theBook = book;
    }

    var getBook = function () {
        return theBook;
    }

    return {
        searchBooks: searchBooks,
        BookDetail: BookDetail,
        getBook: getBook
    };
});
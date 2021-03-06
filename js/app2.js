$(function () {

    // curl -X POST -i -H "Content-Type: application/json" -d'{"isbn":"34321","title":"Thinking in Java","publisher":"Helion","type":"programming","author":"Bruce Eckel"}' http://localhost:8282/books

    var bookListDiv = $(".book-list");
    bookListDiv.on("click", ".book-title", handleTitleClick);
    bookListDiv.on("click", ".delete-book-btn", handleBtnClick);

    var addBookForm = $(".add-book-form");
    addBookForm.on("submit", handleAddBookSubmit);

    refreshBookList();

    function refreshBookList() {
        renderBookList(bookListDiv);
    }

    function renderBookList(renderingPoint) {
        var url = "http://localhost:8282/books";

        function getBookListSuccess (booksArr) {
            renderingPoint.empty();

            for (var i = 0; i < booksArr.length; i++) {
                var book = booksArr[i];

                var descriptionDiv = $('<div class="description">');
                var delBtn = $('<button class="delete-book-btn">Usuń</button>');
                var titleDiv = $('<div class="book-title">');
                titleDiv.text(book.title);
                titleDiv.data("id", book.id);
                titleDiv.append(delBtn);
                titleDiv.append(descriptionDiv);

                renderingPoint.append(titleDiv);
            }
        }

        sendGenericRequest(url, "GET", undefined, getBookListSuccess);

    }


    function handleTitleClick() {
        var thisTitle = $(this);
        var id = thisTitle.data("id");
        var url = "http://localhost:8282/books/" + id;

        function getBookSuccess(book){
            var descriptionDiv = thisTitle.find(".description");
            descriptionDiv.empty();

            var authorDiv = $("<div>");
            authorDiv.text("Author: " + book.author);

            var publisherDiv = $("<div>");
            publisherDiv.text("Publisher: " + book.publisher);

            var typeDiv = $("<div>");
            typeDiv.text(book.type);

            var isbnDiv = $("<div>");
            isbnDiv.text(book.isbn);

            descriptionDiv.append(authorDiv);
            descriptionDiv.append(publisherDiv);
            descriptionDiv.append(typeDiv);
            descriptionDiv.append(isbnDiv);

            descriptionDiv.slideDown();
        }

        sendGenericRequest(url, "GET", undefined, getBookSuccess);
    }

    function handleAddBookSubmit() {
        var book = {
            title: this.elements.title.value,
            author: this.elements.author.value,
            publisher: this.elements.publisher.value,
            type: this.elements.type.value,
            isbn: this.elements.isbn.value,
        };

        var url = "http://localhost:8282/books/";

        sendGenericRequest(url, "POST", book, refreshBookList);


        return false;
    }

    function handleBtnClick(event) {
        event.stopPropagation();

        var thisTitle = $(this).parent();
        var id = thisTitle.data("id");
        var url = "http://localhost:8282/books/" + id;

        sendGenericRequest(url, "DELETE", undefined, refreshBookList);

    }

    function sendGenericRequest(url, type, data, successHandlerFn) {

        $.ajax({
            url: url,
            type: type,
            data: data === undefined ? "" : JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function (dataReturnedByServer) {
            if(successHandlerFn !== undefined){
                successHandlerFn(dataReturnedByServer);
            }

        }).fail(function (xhr, status, err) {
            console.log(xhr, status, err);
        })

    }

});
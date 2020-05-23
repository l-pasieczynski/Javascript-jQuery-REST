$(function(){
    var bookListDiv = $(".book-list");

    refreshBookList();

    function refreshBookList() {
        renderBookList(bookListDiv);
    }

    function renderBookList(renderingPoint) {
        renderingPoint.text("to jest lista książek");

    }

});
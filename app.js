// Book Class 
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handles Updating UI
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, alertType) {
        const div = document.createElement('div');
        div.className = `alert alert-${alertType}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Remove alert after a few seconds
        setTimeout(() => document.querySelector('.alert').remove(), 5000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}


// Store Class: Handles Data
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    
    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Add Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate form
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        //Instantiate book
        const book = new Book(title, author, isbn);

        //Add book to UI
        UI.addBookToList(book);

        //Add book to storage
        Store.addBook(book);

        //Show success message
        UI.showAlert('Book Added!', 'success');

        //Clear fields
        UI.clearFields();
    }
});

// Remove Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Book Removed!', 'success');
});
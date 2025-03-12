const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Invalid request"});
  }
  // if (users[username]) {
  //   return res.status(400).json({message: "User already exists"});
  // }
  // users[username] = password;
  // return res.status(200).json({message: "User created successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.status(200).json({
    message: "Books available in the shop",
    books: books
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
  return res.status(200).json({
    message: "Book details by ISBN",
    book
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params;
  const bookArray = Array.from(Object.values(books));
  const book = bookArray.find((book) => book.author === author);
  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
  return res.status(200).json({
    message: "Book details by ISBN",
    author : author,
    book,
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
  const bookArray = Array.from(Object.values(books));
  const booksWithTitle = bookArray.find((book) => book.title === title);
  if (!booksWithTitle) {
    return res.status(404).json({
      message: "Books with the given title not found"
    });
  }
  return res.status(200).json({
    message: "Book details by title",
    title : title,
    book : booksWithTitle,
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  const reviewOfBook = books[isbn].reviews;
  if (!reviewOfBook) {
    return res.status(404).json({
      message: "Book review not found"
    });
  }
  return res.status(200).json({
    message: "Book review by ISBN",
    isbn : isbn,
    review : reviewOfBook,
  });
});

module.exports.general = public_users;

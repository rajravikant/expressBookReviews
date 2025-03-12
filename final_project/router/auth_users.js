const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.filter((user) => user.username === username).length > 0;
}

const authenticatedUser = (username,password)=>{ 
  return users.filter((user) => user.username === username && user.password === password).length > 0;
}

regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Please provide username and password"});
  }
  if (!isValid(username)) {
    return res.status(400).json({message: "User does not exist"});
  }
  if (!authenticatedUser(username,password)) {
    return res.status(400).json({message: "Invalid credentials"});
  }

  const token = jwt.sign({
    username
  }, "fingerprint_customer",{
    expiresIn: 60*60
  });

  req.session.authorization = {
    accessToken : token,
    username,
  }

  return res.status(200).json({message: "Login successful", token});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.body;
  const user = req.user
  if (!isbn || !review) {
    return res.status(400).json({
      message: "Please provide ISBN and review"
    });
  }

  const userAlreadyReviewed = books[isbn].reviews[user.username];
  if (user) {
    books[isbn].reviews[user.username] = review;
    return res.status(200).json({
      updatedReview : userAlreadyReviewed ? "Review updated" : "Review added",
      book: books[isbn]
    });
  }
  else {
    return res.status(403).json({
      message: "Forbidden"
    }
  );
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

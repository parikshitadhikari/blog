const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB");

const blogSchema = {
  title: String,
  content: String
}

const Blog = mongoose.model("Blog", blogSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Blog.find({}, function (err, blogs) {
    res.render("home", {
      posts_: blogs
    });
  })
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  const blog = new Blog({
    title: post.title,
    content: post.content
  })
  blog.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
})

app.get("/posts/:blogID", function (req, res) {
  const requestedBlogId = req.params.blogID;
  Blog.findOne({ _id: requestedBlogId }, function (err, blog) {
    res.render("post", {
      title: blog.title,
      content: blog.content
    })
  })
})

app.listen(5000);

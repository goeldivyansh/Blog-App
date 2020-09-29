const express = require("express");
const methodOverride = require('method-override')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

//App Config
mongoose.connect('mongodb://localhost/blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Mongoose Schema and model setup
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     title: "TEST BLOG",
//     image: "https://image.shutterstock.com/image-photo/beautiful-water-drop-on-dandelion-260nw-789676552.jpg",
//     body: "Test Body"
// });

//Restful Routes

//Index Route
app.get("/", (req, res) => {
    res.redirect("/blogs");
});
//Index Route
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("Error!!");
        }
        else {
            res.render("index", { blogs: blogs });
        }
    })
});

//New Route
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

//Create Route
app.post("/blogs", (req, res) => {
    //Create Blog
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            //Redirect to index
            res.redirect("/blogs");
        }
    })
    // res.render("index");
});

//Show Route
app.get("/blogs/:id", function (req, res) {
    // res.send("Show PAge");
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
})

//Edit Route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//Update Route
app.put("/blogs/:id", function(req,res) {
    // res.send("Update Route");
    // console.log(req.params);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE Route
app.delete("/blogs/:id", (req,res) => {
    // res.send("Destroy route");
    Blog.findByIdAndDelete(req.params.id, (err)=>{
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, () => { console.log("Server Running") });
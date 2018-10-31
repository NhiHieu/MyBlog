const express = require('express');
const debug = require('debug')('app:adminRoutes');
const passport = require('passport');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category')

const postRoutes = express.Router();

function router(){
    postRoutes.route('/')
    .get((req, res)=>{
        if(req.user)
            res.render('post')
        else{
            res.redirect('/');
        }
    })
    .post((req, res)=>{
        console.log("Here is method post!")
        let { title, content, category } = req.body;
        title = title.toLowerCase();
        console.log("category in body:" + category);
        Category.findOne({name : category}, function(error, cate){
            if(error)
                console.log(error)
            else{
                const posts = new Post({title : title, content : content, categoryId : cate._id});
                console.log("posts:" + posts);
                posts.save(function(error){
                if(error)
                    console.log(error);
                else
                    console.log("Ok, got it!")
        })
        
            }
            res.redirect('/post');       
        })
        //console.log("Category_id:" + cate);
        
       // res.send(category)
    })

    postRoutes.route('/logout')
        .get((req, res) =>{
            res.clearCookie('connect.sid');
            console.log('Deleted cookie!');
            res.redirect('/');
        })
    return postRoutes;
}

module.exports = router;
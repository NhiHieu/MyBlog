const express = require('express');
const debug = require('debug')('app:adminRoutes');
const Post = require('../models/Post');
const Category = require('../models/Category')

const viewPageRoutes = express.Router();

function urlSlug(title){
    title = title.toLowerCase();
    return title.split(" ").join("-");
}

function handle(title){
    title = title.toLowerCase();
    let arr =  title.split("-");
    console.log(arr);
    for(let i = 0; i < arr.length; i++){
        console.log(arr[i].charAt(0).toUpperCase())
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        
    }
    console.log(arr)
    return arr.join(" ");
}
function router(){
    viewPageRoutes.route('/')
        .get((req, res) =>{
            res.redirect('/');
        })
        
    viewPageRoutes.route('/:id')
        .get((req, res)=>{
            let { id } = req.params;
            console.log(id);
            //res.send("Ok right here!")
            //let category = "dev";
            
            (async function query(){
                let arr = [];
                const posts = await Post.find({});
               // debug(posts);
                const categories = await Category.find({name: id});
                debug(categories)
                console.log("type cate:" + (typeof categories))
                console.log(categories[0]['_id'])
                for(let i = 0; i < posts.length; i++){    
                        //Remember _id in mongo is object -> compare object not use == or ===
                        
                        if(posts[i].categoryId.toString() == categories[0]['_id'].toString()){
                            let cate = categories[0].name;
                            let {content, title, timeStamp} = posts[i];
                            let urlTitle = urlSlug(title);
                            console.log("Here is into loop")
                            console.log(cate)
                            console.log(content)
                            console.log(title)
                            arr.push({content, title, cate, timeStamp, urlTitle});
                        }
                    }
                debug(arr);
                res.render('viewCategory', {arr});
            }())
        })
        viewPageRoutes.route('/:id/:titleUrl')
        .get((req, res)=>{
            let { titleUrl ,id} = req.params;
            titleUrl = handle(titleUrl);
            console.log("title: " + titleUrl);
            (async function query(){
                const posts = await Post.findOne({title: titleUrl});
                console.log(posts)
                debug(posts);
                
                
                res.render('viewPost', {posts});
            }())
            
        })

    return viewPageRoutes;
}

module.exports = router;
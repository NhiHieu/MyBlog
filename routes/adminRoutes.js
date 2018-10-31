const express = require('express');
const debug = require('debug')('app:adminRoutes');
const passport = require('passport');
const Users = require('../models/Users');
const adminRoutes = express.Router();

//require('../config/passport');
function router(){
    adminRoutes.route('/')
        .get((req, res) =>{
            res.render('admin');
        })

    adminRoutes.route('/login')
        .post(passport.authenticate('local', {
            successRedirect: '/admin/profile',
            failureRedirect: '/admin'
        }))

    adminRoutes.route('/signup')
        .post((req, res) =>{
            (async function sign(){
                const {username, email, password } = req.body;
                const user = {username, email, password};
                const result = await Users.create(user);
            //req.session.id = user._id;
            //console.log(user);
            console.log(result);
            //onsole.log("user._id:" + user._id);
            //req.login(res[0])
            req.login(result._id, ()=>{
                res.redirect('/admin/profile')
            })
           // res.json(req.session.id)
            }())
            
        })
    
    adminRoutes.route('/profile')
        .all((req, res, next)=>{
            if(req.user)
                next();
            else{
                res.redirect('/admin');
            }
        })
        .get((req, res) =>{
            res.redirect('/post')
        })
    


    return adminRoutes;
}

module.exports = router;

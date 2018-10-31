const mongoose = require('mongoose')
const Category = require('./models/Category')
//connect mongo
mongoose.connect('mongodb://localhost/feedtowin');
db = mongoose.connection;
db.on('error',console.log.bind(console,'connection error:'));
db.once('open', function(){
    console.log("opened")
})
//const categories = [{name: "web"}, {name: "bullshit"}];
//Category.insertMany([{name: "web"}, {name: "bullshit"}]);
(async function add(){
    const cate = await [{name: "web"}, {name: "bullshit"}];
    const hihi = Category.create({name: "bullshit"});
    console.log("hihi");
}())

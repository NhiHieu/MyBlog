const mongoose = require('mongoose')

//Connect mongoose
mongoose.connect('mongodb://localhost/feedtowin');
db = mongoose.connection;
db.on('error',console.log.bind(console,'connection error:'));
db.once('open', function(){
    console.log("opened")
})

const Category = require('./models/Category');

Category.insertMany([{name: "web"}, {name: "bullshit"}], function(error, cb){
    if(error)
        console.log(error);
    else
        console.log("Inserted category");
})
const mongoose = require('mongoose')

const { Schema } = mongoose;

const postSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        default: "",
    },
    categoryId:[{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    timeStamp:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', postSchema)
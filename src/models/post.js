const mongoose = require('mongoose');

const { Schema } = mongoose;

const Post = new Schema({
    title: String,
    body: String,
    tags: [String], // 문제열 배열
    publishedDate: {
        type: Date,
        defualt: new Date() // 현재 날짜를 기본 값으로 지정
    }
});
module.exports = mongoose.model('Post', Post);
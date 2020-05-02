import mongoose, { Schema } from 'mongoose';
Schema.Types.ObjectId
const PostSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본 값으로 지정
  },
  user: {
    _id: mongoose.Types.ObjectId,
    profile: {
      username: String,
      thumbnail: { type: String, default: '/static/images/default_thumbnail.png' }
    },
  },
});

const Post = mongoose.model('Post', PostSchema);
export default Post;
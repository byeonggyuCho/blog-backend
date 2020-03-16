import Post from '../../models/post.js';
import Joi  from 'joi';
import mongoose  from 'mongoose';
import  sanitizeHtml from 'sanitize-html';


const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};


export const checkObjectId = (req:any, res:any, next:any) =>{
    const { id } = req.params;

    // 검증 실패
    if (!ObjectId.isValid(id)) {
        req.status = 400; // 400 Bad Request
        return null;
    }

    next(); // next를 리턴해야 req.body가 제대로 설정된다.
}

/** 
    포스트 작성
    POST /api/posts
    {title, body}
*/
export const write = async (req:any ,res:any) => {
    

    const schema = Joi.object().keys({
        title: Joi.string().required(), // 필수항목이라는 의미
        body: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required()  // 문자열 배열 
    });

    // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
    const result = Joi.validate(req.body, schema);
    

    // 오류가 발생하면 오류 내용을 응답.
    if(result.error) {
        res.status = 400;
        res.body = result.error;
        return;
    }

    // REST API의 request body는 req.request.body에서 조회할 수 있습니다.
    const { title, body, tags } = req.body;


    // 새 Post 인스턴스를 만듭니다.
    const post = new Post({
        title, 
        body : sanitizeHtml(body, sanitizeOption), 
        tags,
    });


    try {
        await post.save(); // 데이터베이스에 등록합니다.
        res.send(post);
    } catch(e) {
        // 데이터베이스의 오류가 발생합니다.
        throw new Error(e);
    }
};

/**
 * 포스트 목록 조회
 * GET /api/posts
 */
export const list = async (req:any ,res:any) => {
    // page가 주어지니 않았다면 1로 간주한다.
    // query는 문자열 형태로 받아 오므로 숫자로 변환
    const page = parseInt(req.query.page || 1, 10);
    const { tag } = req.query;


    // query 조건 (where)
    const query = tag ? {
        tags: tag // tags 배열에 tag를 가진 포스트 찾기
    } : {};

    // 잘못된 페이지가 주어졌다면 오류
    if(page < 1) {
        req.status = 400;
        return;
    }

    try {
        const posts = await Post.find(query)
                            .sort({_id: -1})
                            .limit(10)
                            .skip((page - 1) * 10)
                            .exec();
                            
        const postCount = await Post.countDocuments().exec();
        const limitBodyLength = (post:any) => ({
            ...post,
            body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
        });
        
        // 글자 제한.
        let result  = posts.map(limitBodyLength);

        // 마지막 페이지 알려주기
        // req.set은 response header를 설정
        res.setHeader('Last-Page', Math.ceil(postCount / 10));
        res.send(result);
    } catch(e) {
        throw e
    }
};

/**
 * 특정 포스트 조회
 * GET /api/posts/:id
 */
export const read = async (req:any,res:any) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id).exec();
        //포스트가 존재하지 않습니다.
        if(!post) {
            req.status = 404;
            return;
        }
        // req.body = post;
        res.send(post);
    } catch(e) {
        throw new Error(e);
    }
};

/*
    특정 포스트 제거
    DELETE /api/postid/:id
*/
export const remove = async (req:any,res:any) => {
    const { id }= req.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        req.status = 204;
    }catch(e) {
        throw new Error(e);
    }
};

/**
 * 포스트 수정(특정 필드 변경)
 * PATCH /api/posts/:id
 * { title, body }
 */
export const update = async (req:any,res:any ) => {
    //PATCh 메서드는 주어진 필드만 교체한다.    
    const {id} = req.params;

    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string())
    });

    const result = Joi.validate(req.body, schema);
    if(result.error){
        res.status = 400;
        res.send(result.error)
    }

    const nextData = {...req.body };

    if(nextData.body){
        nextData.body = sanitizeHtml(nextData.body);
    }


    try{
        const post = await Post.findByIdAndRemove(id, {
            strict: true
            // 이 값을 설정해야 업데이트된 객체를 반환합니다.
            // 설정하지 않으면 업데이터되기 전의 객체를 반환합니다.
        }).exec();

        //포스트가 존재하지 않을때
        if(!post){
            req.status = 404;
            return;
        }

        res.send(post)
    }catch(e){
        throw new Error(e);
    }
}


/**
 * 로그인 여부 체크
 */
 export const checkLogin = (req:any, res:any, next:any) => {

    console.log('[System] checkLogin', req.session.logged)

     if(!req.session.logged) {
         req.status = 401; // Unathorized
         return null;
     }
     next();
 };
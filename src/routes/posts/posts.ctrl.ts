import Post from '../../models/post';
import Joi  from 'joi';
import mongoose  from 'mongoose';
import {Request,Response} from 'express'
import Result from '../../lib/result'
// import  sanitizeHtml from 'sanitize-html';

interface RouterInterface {
    (req:Request, res:Response, next:()=>void) : void
}

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


export const checkObjectId:RouterInterface = (req, res, next) =>{
    const { id } = req.params;
    

    // 검증 실패
    if (!ObjectId.isValid(id)) {
        res.status(400)// 400 Bad Request
        return null;
    }

    next(); // next를 리턴해야 req.body가 제대로 설정된다.
}

/** 
    포스트 작성
    POST /api/posts
    {title, body}
*/
export const write = async (req:Request ,res:Response) => {
    
    const re = new Result();
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
        // res.status(400);

        re.setMessage(result.error.message).setStatus('F')
        res.send(re.getResult());
        return;
    }

    // REST API의 request body는 req.request.body에서 조회할 수 있습니다.
    const { title, body, tags } = req.body;

    // @ts-ignore
    const userInfo = res._decoded;

    // 새 Post 인스턴스를 만듭니다.
    const post = new Post({
        title, 
        body : body, //sanitizeHtml(body, sanitizeOption), 
        tags,
        user: userInfo// _id, username
    });


    
    try {
        await post.save(); // 데이터베이스에 등록합니다.

        re.setData(post)
        res.send(re.getResult());
    } catch(e) {
        // 데이터베이스의 오류가 발생합니다.
        re.setMessage(e.message).setStatus('F')
        res.send(re.getResult())
    }
};

/**
 * 포스트 목록 조회
 * GET /api/posts
*/
export const list = async (req:Request ,res:Response) => {
    // page가 주어지니 않았다면 1로 간주한다.
    // query는 문자열 형태로 받아 오므로 숫자로 변환
    const page = parseInt(req.query.page || 1, 10);
    const re = new Result();
    
    // 잘못된 페이지가 주어졌다면 오류
    if(page < 1) {
        res.status(400);
        return;
    }
    const { tag, username } = req.query;

    // query 조건 (where)
    const query = {
        ...(tag ? {tags: tag }: {}), // tags 배열에 tag를 가진 포스트 찾기
        // ...(username ? {user: {profile: {username}} }: {}), // tags 배열에 tag를 가진 포스트 찾기
        ...(username ? { $where: `this.user.profile.username=== "${username}"` } : {}), // tags 배열에 tag를 가진 포스트 찾기
    }

    // db.articles.find( { $where: `this.user.profile.username=== ${username}` } )
    // 


    try {
        const posts = await Post.find(query)
                            .sort({_id: -1})
                            .limit(10)
                            .skip((page - 1) * 10)
                            .lean()
                            .exec();
                            
        const postCount = await Post.countDocuments().exec();

        // const removeHtmlAndShorten = (body: string)=>body.length < 200 ? body : `${body.slice(0, 200)}...`

        const removeHtmlAndShorten = (text:string)=>{

            text = text.replace(/<br\/>/ig, "\n");
            text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
            text = text.length < 200 ? text : `${text.slice(0,200)}...`
        
            return text;
        }
          
        
        // 글자 제한.
        let result  = posts.map((post:any) => ({
            ...post,
            body: removeHtmlAndShorten(post.body)
        }));

        re.setData(result)

        // 마지막 페이지 알려주기
        res.setHeader('lastpage', Math.ceil(postCount / 10));
        res.send(re.getResult());
    } catch(e) {
        throw e
    }
};

/**
 * 특정 포스트 조회
 * GET /api/posts/:id
 */
export const read = async (req:Request,res:Response) => {
    const { id } = req.params;
    const re = new Result()

    try {
        const post = await Post.findById(id).exec();

        //포스트가 존재하지 않습니다.
        if(!post) {
            // res.status(404);
            re.setMessage('포스트가 존재하지 않습니다.')
            res.send(re.getResult())
            return;
        }

        re.setData(post)
        // req.body = post;
        res.send(re.getResult());
    } catch(e) {

        // res.status(400)
        re.setMessage(e.message).setStatus('F')
        res.send(re.getResult())
    }
};

/*
    특정 포스트 제거
    DELETE /api/postid/:id
*/
export const remove = async (req:Request,res:Response) => {
    const { id }= req.params;
    const re = new Result();
    try{
        await Post.findByIdAndRemove(id).exec();

        re.setData(true)
        res.status(204);
        res.send(re.getResult())
    }catch(e) {
        res.status(400)
        re.setMessage(e.message).setStatus('F')
        res.send(re.getResult())
        // throw new Error(e);
    }
};

/**
 * 포스트 수정(특정 필드 변경)
 * PATCH /api/posts/:id
 * { title, body }
 */
export const update = async (req:Request,res:Response ) => {
    //PATCh 메서드는 주어진 필드만 교체한다.    
    const {id} = req.params;
    const re = new Result()

    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string())
    });

    const result = Joi.validate(req.body, schema);
    if(result.error){
        // res.status(400);
        re.setMessage(result.error.message)
        res.send(re.getResult())
    }

    const nextData = {...req.body };

    if(nextData.body){
        nextData.body = nextData.body//`sanitizeHtml(nextData.body);
    }


    try{
        const post = await Post.findByIdAndUpdate(id, nextData,{
            new: true, 
            // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
            // false 일 때에는 업데이트 되기 전의 데이터를 반환합니다.
        }).exec();

        //포스트가 존재하지 않을때
        if(!post){
            // res.status(404);
            re.setMessage('포스트가 존재하지 않습니다.')
            res.send(re.getResult())
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
//  export const checkLogin = (req:any, res:any, next:any) => {

//     console.log('[SYSTEM] posts.checkLogin', req.session.logged)

//      if(!req.session.logged) {
//          req.status = 401; // Unathorized
//          return null;
//      }
//      next();
//  };
 export const checkLogin:RouterInterface = (req ,res,next ) => {

    // @ts-ignore
    const { _decoded : user} = res
    const re = new Result();

    if( !user ) {
        // res.status(403);
        re.setMessage('로그인되지 않았습니다.').setStatus('F');
        res.send(re.getResult())
    }else{
        console.log('[checkLogin]',user.profile.username)
        // res.send(user.profile)
        next();
    }

};


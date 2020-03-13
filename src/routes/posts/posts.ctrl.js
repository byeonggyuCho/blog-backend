const Post = require('../../models/post.js');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;


exports.checkObjectId = (req, next) =>{
    const { id } = req.params;

    // 검증 실패
    if (!ObjectId.isValid(id)) {
        req.status = 400; // 400 Bad Request
        return null;
    }

    return next(); // next를 리턴해야 req.body가 제대로 설정된다.
}

/** 
    포스트 작성
    POST /api/posts
    {title, body}
*/
exports.write = async (req,res) => {
    
    const schema = Joi.object().keys({
        title: Joi.string().required(), // 필수항목이라는 의미
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required()    // 문자열 배열 
    });

    // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
    const result = Joi.validate(req.request.body, schema);
    

    // 오류가 발생하면 오류 내용응ㄹ 응답.
    if(result.error) {
        req.status = 400;
        req.body = result.error;
        return;
    }

    // REST API의 request body는 req.request.body에서 조회할 수 있습니다.
    const { title, body, tags } = req.request.body;


    // 새 Post 인스턴스를 만듭니다.
    const post = new Post({
        title, body, tags
    });

    try {
        await post.save(); // 데이터베이스에 등록합니다.
        //req.body = post; // 저장된 결과를 반환합니다.
        res.send(post);
    } catch(e) {
        // 데이터베이스의 오류가 발생합니다.
        throw new Error(e, 500);
    }
};

/**
 * 포스트 목록 조회
 * GET /api/posts
 */
exports.list = async (req,res) => {
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
        const limitBodyLength = post => ({
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
exports.read = async (req,res) => {
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
        throw new Error(e, 500);
    }
};

/*
    특정 포스트 제거
    DELETE /api/postid/:id
*/
exports.remove = async (req,res) => {
    const { id }= req.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        req.status = 204;
    }catch(e) {
        throw new Error(e, 500);
    }
};

/** 
 * 포스트 수정
 * PUT /api/posts/:id
 * { titile, body }
*/
exports.replace = (req) => {
    // PUT 메서드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용합니다.
    const { id } = req.params;

    // 해당 id를 가진 post가 몇 번째인지 확인합니다.
    const index = posts.findIndex(p => p.id.toString(0 === id));

    // 포스트가 없으면 오류를 반환합니다.
    if(index === -1) {
        req.status = 404;
        req.body = {
            message:'포스트가 존재하지 않습니다.'
        };
        return;
    }

    // 전체 객체를 덮어씌웁니다.
    // 따라서 id를 제외한 기존 정보를 날리고 객체를 새로 만듭니다.
     posts[index] = {
         id,
         ...req.request.body
     };
     req.body = posts[index];
};

/**
 * 포스트 수정(특정 필드 변경)
 * PATCH /api/posts/:id
 * { title, body }
 */
exports.update = async (req) => {
    //PATCh 메서드는 주어진 필드만 교체한다.    
    const {id} = req.params;
    try{
        const post = await Post.findByIdAndRemove(id, req.request.boxy, {
            new: true
            // 이 값을 설정해야 업데이트된 객체를 반환합니다.
            // 설정하지 않으면 업데이터되기 전의 객체를 반환합니다.
        }).exec();

        //포스트가 존재하지 않을때
        if(!post){
            req.status = 404;
            return;
        }
        req.body = post;
    }catch(e){
        throw new Error(e, 500);
    }
}


/**
 * 로그인 여부 체크
 */
 exports.checkLogin = (req, next) => {
     if(!req.session.logged) {
         req.status = 401; // Unathorized
         return null;
     }
     return next();
 };
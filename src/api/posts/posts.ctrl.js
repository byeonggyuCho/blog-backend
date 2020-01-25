const Post = require('models/post');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;


exports.checkObjectId = (ctx, next) =>{
    const { id } = ctx.params;

    // 검증 실패
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; // 400 Bad Request
        return null;
    }

    return next(); // next를 리턴해야 ctx.body가 제대로 설정된다.
}

/** 
    포스트 작성
    POST /api/posts
    {title, body}
*/
exports.write = (ctx) => {
    
    const schema = Joi.object().keys({
        title: Joi.string().required(), // 필수항목이라는 의미
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required()    // 문자열 배열 
    });

    // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
    const result = Joi.validate(ctx.request.body, schema);
    

    // 오류가 발생하면 오류 내용응ㄹ 응답.
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    // REST API의 request body는 ctx.request.body에서 조회할 수 있습니다.
    const { title, body, tags } = ctx.request.body;


    // 새 Post 인스턴스를 만듭니다.
    const post = new post({
        title, body, tags
    });

    try {
        await post.save(); // 데이터베이스에 등록합니다.
        ctx.body = post; // 저장된 결과를 반환합니다.
    } catch(e) {
        // 데이터베이스의 오류가 발생합니다.
        ctx.throw(e, 500);
    }
};

/**
 * 포스트 목록 조회
 * GET /api/posts
 */
exports.list = async (ctx) => {
    // page가 주어지니 않았다면 1로 간주한다.
    // query는 문자열 형태로 받아 오므로 숫자로 변환
    const page = parseInt(ctx.query.page || 1, 10);
    const { tag } = ctx.query;

    // query 조건 (where)
    const query = tag ? {
        tags: tag // tags 배열에 tag를 가진 포스트 찾기
    } : {};

    // 잘못된 페이지가 주어졌다면 오류
    if(page < 1) {
        ctx.status = 400;
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
        
        ctx.body = posts.map(limitBodyLength);
        // 마지막 페이지 알려주기
        // ctx.set은 response header를 설정
        ctx.set('Last-Page', Math.ceil(postCount / 10));
        ctx.gody = posts;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

/**
 * 특정 포스트 조회
 * GET /api/posts/:id
 */
exports.read = async (ctx) => {
    const { id } = ctx.params;

    try {
        const post = await Post.findById(id).exec();
        //포스트가 존재하지 않습니다.
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(e, 500);
    }
};

/*
    특정 포스트 제거
    DELETE /api/postid/:id
*/
exports.remove = async (ctx) => {
    const { id }= ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    }catch(e) {
        ctx.throw(e, 500);
    }
};

/** 
 * 포스트 수정
 * PUT /api/posts/:id
 * { titile, body }
*/
exports.replace = (ctx) => {
    // PUT 메서드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용합니다.
    const { id } = ctx.params;

    // 해당 id를 가진 post가 몇 번째인지 확인합니다.
    const index = posts.findIndex(p => p.id.toString(0 === id));

    // 포스트가 없으면 오류를 반환합니다.
    if(index === -1) {
        ctx.status = 404;
        ctx.body = {
            message:'포스트가 존재하지 않습니다.'
        };
        return;
    }

    // 전체 객체를 덮어씌웁니다.
    // 따라서 id를 제외한 기존 정보를 날리고 객체를 새로 만듭니다.
     posts[index] = {
         id,
         ...ctx.request.body
     };
     ctx.body = posts[index];
};

/**
 * 포스트 수정(특정 필드 변경)
 * PATCH /api/posts/:id
 * { title, body }
 */
exports.update = async (ctx) => {
    //PATCh 메서드는 주어진 필드만 교체한다.    
    const {id} = ctx.params;
    try{
        const post = await Post.findByIdAndRemove(id, ctx.request.boxy, {
            new: true
            // 이 값을 설정해야 업데이트된 객체를 반환합니다.
            // 설정하지 않으면 업데이터되기 전의 객체를 반환합니다.
        }).exec();

        //포스트가 존재하지 않을때
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(e, 500);
    }
}
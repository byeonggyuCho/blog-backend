const { ADMIN_PASS: adminPass } = process.env;
import {generateToken} from '../../lib/token'
import {Request, Response} from "express"
import Joi  from'joi';
import Account  from '../../models/account';


interface RouterInterface {
    (req:Request, res:Response) : void
}

// 로컬 회원가입
export const register:RouterInterface = async (req, res) => {


   // 데이터 검증
   const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(4).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6)
    });

    const result = Joi.validate(req.body, schema);

    if(result.error) {
        res.status(400);
        res.send()
    }
  // 아이디 / 이메일 중복 체크
    let existing = null;
    try { 
        // @ts-ignore
        existing = await Account.findByEmailOrUsername(req.body);
    } catch (e) {
        console.error(e)
    }

    if(existing) {
        // 중복되는 아이디/이메일이 있을 경우
        res.status(409); // Conflict
        // 어떤 값이 중복되었는지 알려줍니다
        res.send ({
            error: {
                // @ts-ignore
                message: `${existing.email === req.email ? 'email' : 'username'}이 중복되었습니다.`
            }
        });
        return;
    }

    // 계정 생성
    let account = null;
    try {

        console.log('authCtrl:',req.body)
        // @ts-ignore
        account = await Account.register(req.body);
    } catch (e) {
        console.error(e)
    }


    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        console.log(e)
    }

    res.cookie('access_token', token, { 
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 * 24 * 7 
    });

   res.send(account.profile); // 프로필 정보로 응답합니다.
};



// 이메일 / 아이디 존재유무 확인
export const exists:RouterInterface = async (req, res) => {
    const { key, value } = req.params;


    let account = null;

    try {
        // key 에 따라 findByEmail 혹은 findByUsername 을 실행합니다.
        // @ts-ignore
        account = await (key === 'email' ? Account.findByEmail(value) : Account.findByUsername(value));    
    } catch (e) {
       console.error(e)
    }

    res.send({
        exists: account !== null
    })
};


export const login: RouterInterface =  async (req ,res ) => {


      // 데이터 검증
      const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        
    const result = Joi.validate(req.body, schema);

    if(result.error) {
        res.status (400); // Bad Request
        return;
    }

    // TODO: 아이디패스워드 복호화로직 추가....



    const { email, password } = req.body; 

    let account = null;
    try {
        // 이메일로 계정 찾기
        // @ts-ignore
        account = await Account.findByEmail(email);
    } catch (e) {
        console.log(e)
    }

    const isValid = account  && account.validatePassword(password)

    if(isValid) {

        // 토큰 발급
        let token = null;
        try{
             token =  await account.generateToken();
        }catch(e) {
            // res.throw(e);
            console.log(e)
        }

        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        });

        res.send(account.profile)
    }
};

export const check:RouterInterface = (req ,res ) => {

    // @ts-ignore
    const { _decoded : user} = res
    let session = req.session as Express.Session

    // console.log('[SYSTEM] auth.check_1', req.session.logged)

    if( !user ) {
        res.status(403);
        res.send({logged: false})
    }else{
        res.send(user.profile)
    }

};

export const logout: RouterInterface = (req, res) => {


    // @ts-ignore
    req.session.destroy((err: any)=>{
        if(err)
            console.error(err);
    })

    res.cookie('access_token', null, {
        maxAge: 0, 
        httpOnly: true
    });

    res.status(204); // No Content
    res.send({
        success : true
    })
};
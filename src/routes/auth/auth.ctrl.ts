const { ADMIN_PASS: adminPass } = process.env;

// import Joi from 'joi';
// import User from '../../models/user'

export const login = (req: any,res: any) => {

    const { password } = req.body;

    if(adminPass === password ) {
        // 로그인에 성공하면 logged 값을 true로 설정한다.
        req.session.logged = true;
        res.send({
            success: true
        })

    } else {
        req.status = 401; // Unathorized
        res.send({
            success: false
        })
    }
};

export const check = (req: any,res: any) => {

    let result  = {
        logged: !!req.session.logged
    };

    console.log('[SYSTEM] auth.check_1', req.session.logged)

    res.send(result);
};

export const logout = (req: any, res: any) => {
    req.session.destroy((err: any)=>{
        if(err)
            console.error(err);
    })
    req.status = 204; // No Content
    res.send({
        success : true
    })
};
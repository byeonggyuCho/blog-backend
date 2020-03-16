const { ADMIN_PASS: adminPass } = process.env;

import Joi from 'joi';
import User from '../../models/user'

export const login = (req,res) => {

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

export const check = (req,res) => {

    let result  = {
        logged: !!req.session.logged
    };

    res.send(result);
};

export const logout = (req) => {
    req.session.destroy((err)=>{
        if(err)
            console.error(err);
    })
    req.status = 204; // No Content
};
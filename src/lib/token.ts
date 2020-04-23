const jwtSecret: string = process.env.JWT_SECRET as string;
import {Request,Response } from 'express'

import jwt from 'jsonwebtoken';

interface ExpressMiddleware {
    (req:Request, res: Response,  next:Function) : void
}


/**
 * JWT 토큰 생성
 * @param {any} payload 
 * @returns {string} token
 */
export function generateToken(payload : any, type?: string) {
    return new Promise(
        (resolve, reject) => {
            jwt.sign(
                payload,
                jwtSecret,
                {
                    expiresIn: '7d'
                }, (error, token) => {
                    if(error) reject(error);
                    resolve(token);
                }
            );
        }
    );
};


function decodeToken(token:any) {
    return new Promise(
        (resolve, reject) => {
            jwt.verify(token, jwtSecret, (error: Error, decoded: any) => {
                if(error) reject(error);
                resolve(decoded);
            });
        }
    );
}

export const jwtMiddleware:ExpressMiddleware = async (req, res,  next) => {

    const token = req.cookies && req.cookies.access_token; //access_token; // ctx 에서 access_token 을 읽어옵니다
    if(!token) return next(); // 토큰이 없으면 바로 다음 작업을 진행합니다.

    try {
        const decoded : any = await decodeToken(token); // 토큰을 디코딩 합니다

        // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다
        if(Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
            // 하루가 지나면 갱신해준다.
            const { _id, profile } = decoded;
            const freshToken = await generateToken({ _id, profile }, 'account');
            res.cookie('access_token', freshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
                httpOnly: true
            });
        }

        // ctx.request.user 에 디코딩된 값을 넣어줍니다
        // @ts-ignore
        req.decoded = decoded;
    } catch (e) {
        // token validate 실패
        // @ts-ignore
        req.user = null;
    }

    return next();
};


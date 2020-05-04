import jwt from'jsonwebtoken'
import * as express from 'express'

const secretKey:string = process.env.JWT_SECRET as string;

const authMiddleware = (req: express.Request, res: express.Response, next: any) => {
    // read the token from header or url 
    const token = req.cookies['access_token'] || req.query.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            status:'F',
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise<string>(
        (resolve, reject) => {
            jwt.verify(token, secretKey, (err: Error, decoded : any) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error:Error) => {
        res.status(403).json({
            success: false,
            status:'F',
            message: error.message
        })
    }

    // process the promise
    p.then((decoded)=>{

        // @ts-ignore
        res._decoded = decoded
        next()
    }).catch(onError)
}



export default authMiddleware
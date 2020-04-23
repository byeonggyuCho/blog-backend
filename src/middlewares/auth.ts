import jwt from'jsonwebtoken'
import * as express from 'express'

const authMiddleware = (req: express.Request, res: express.Response, next: any) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise<string>(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err: Error, decoded : any) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error:Error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    // process the promise
    p.then((decoded)=>{

        console.log('auth',decoded)
        req.params._decoded = decoded
        next()
    }).catch(onError)
}



export default authMiddleware
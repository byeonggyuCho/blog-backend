
/**
 * 통신결과를 알리는 객체
 */
export default class Result {

    constructor(msg:string= "", status = "S", data:any =null){
        this.msg = msg;
        this.status = status;
        this.data = data;  
    }

    msg:string
    status:string
    data:any

    setMessage(msg: string){
        this.msg = msg
        return this
    }

    setData(data:any){
        this.data = data;
        return this;
    }

    setStatus(status: string){
        this.status = status;
        return this;
    }

    getResult(){

        return {
            msg: this.msg,
            data: this.data,
            stats: this.status
        }
    }
}

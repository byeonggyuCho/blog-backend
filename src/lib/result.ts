
/**
 * 통신결과를 알리는 객체
 */
export default class Result {

    constructor(msg:string= "", status = "S", data:any =null){
        this.message = msg;
        this.status = status;
        this.data = data;  
    }

    message:string
    status:string
    data:any

    setMessage(msg: string){
        this.message = msg
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
            message: this.message,
            data: this.data,
            status: this.status
        }
    }
}

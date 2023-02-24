export class storageHandler{
    setLocalStorage(token,id){
        localStorage.setItem("token",token)
        localStorage.setItem("id",id)
    }

    getLocalStorage(){
        let token = localStorage.getItem("token")
        let id = localStorage.getItem("id")
        return {token,id}
    }

    clearLocalStorage(){
        localStorage.clear() 
    }
}
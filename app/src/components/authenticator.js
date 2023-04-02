import React from 'react'
import { storageHandler } from '../components/localStorageHandler'

import { useLocation, useNavigate } from 'react-router-dom'



export default function Authenticator() {
    const localStorageHandler = new storageHandler()

    const storage = localStorageHandler.getLocalStorage()

    const storedId = storage.id
    const storedToken = storage.token

    const navigate = useNavigate();
    const location = useLocation();
    
console.log(location.state)

if(location.state == null){
    localStorageHandler.clearLocalStorage()
    return navigate("/login",{replace:true})
}   
else{
    if(location.state.id != storedId || location.state.token != storedToken){
        localStorageHandler.clearLocalStorage()
        return navigate("/login",{replace:true})
    }
}


}

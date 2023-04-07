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

    if (location.state == null) {
        localStorageHandler.clearLocalStorage()
        return window.location.replace("/login")
    }
    else {
        if (location.state.id != storedId || location.state.token != storedToken) {
            localStorageHandler.clearLocalStorage()
            return window.location.replace("/login")
        }
    }


}

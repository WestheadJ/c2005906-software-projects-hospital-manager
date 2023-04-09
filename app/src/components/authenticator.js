import { storageHandler } from '../components/localStorageHandler'

import { useLocation } from 'react-router-dom'

export default function Authenticator() {
    const localStorageHandler = new storageHandler()

    const storage = localStorageHandler.getLocalStorage()

    const storedId = storage.id
    const storedToken = storage.token

    const location = useLocation();

    if (!location.state) {
        localStorageHandler.clearLocalStorage()
        alert("You need to log in")
        return window.location.replace("/login")
    }
    else {
        // eslint-disable-next-line
        if (location.state.id != storedId || location.state.token != storedToken) {
            localStorageHandler.clearLocalStorage()
            alert("You need to log in")

            return window.location.replace("/login")
        }
    }


}

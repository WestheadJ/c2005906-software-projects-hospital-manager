import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'
import Paitents from '../components/Paitents'
import { IP } from '../configs/configs'
import "../styles/Dashboard.css"
import Authenticator from '../components/authenticator'

export default function Dashboard() {

    const navigate = useNavigate()
    const location = useLocation()

    const [data, setData] = useState([])

    useEffect(() => {
        isCorrectRole()
    }, [])

    async function getNursesPatients() {
        await axios.get(`${IP}/get/patients/nurse`, {
            params: {
                nurse_id: location.state.id
            }
        })
            .then(async (response) => {
                setData(response.data)
                // setLoading(true)
                console.log(data)

            })
            .catch(err => {
                console.log(err)
                // setLoading(false)
            })
    }

    async function getDoctorsPatients() {
        await axios.get(`${IP}/get/patients/doctor`, {
            params: {
                doctor_id: location.state.id
            }
        })
            .then((response) => {
                console.log(response.data)
                return setData(response.data)
            })
            .catch((err) => console.log(err))
    }

    function isCorrectRole() {
        if (!location.state) {
            console.log(true)
            return window.location.replace("/login")

        }
        else if (location.state.role === "Nurse") {

            return getNursesPatients()
        }
        else if (location.state.role === "Doctor") {
            return getDoctorsPatients()

        } else {
            return window.location.replace("/login")

        }
    }

    return (
        <>
            <Authenticator />

            <div>
                {!location.state ? <></> : <NavBarHeader role={location.state.role} person_id={location.state.id} />}
            </div>

            <Paitents data={data} role={location.state.role} />

        </>
    )
}

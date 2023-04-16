import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'
import Paitents from '../components/Paitents'
import { IP } from '../configs/configs'
import "../styles/Dashboard.css"
import Authenticator from '../components/authenticator'
import { Button } from 'react-bootstrap'

export default function Dashboard() {

    const location = useLocation()
    const navigate = useNavigate()

    const [data, setData] = useState([])


    useEffect(() => {
        isCorrectRole()
        // eslint-disable-next-line
    }, [])

    async function getNursesPatients() {
        await axios.get(`${IP}/get/patients/nurse`, {
            params: {
                nurse_id: location.state.id
            }
        })
            .then(async (response) => {
                setData(response.data)

            })
            .catch(err => {
                console.log(err)
                alert("Error Getting Patients")
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
            .catch((err) => {
                console.log(err); alert("Error Getting Patients")
            })
    }

    function isCorrectRole() {
        if (!location.state) {

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
            {/* <<--- Authentication --->> */}
            <Authenticator />
            <div>
                {!location.state ? <></> :
                    <>
                        {/* <<--- Nav Bar --->> */}
                        <NavBarHeader role={location.state.role} person_id={location.state.id} />
                        {/* <<--- Main Content */}
                        <Paitents data={data} role={location.state.role} />
                        <div style={{ justifyContent: "center", width: "100%", display: "flex" }}>
                            <Button onClick={() => {
                                navigate("/register-patient", { state: location.state })
                            }}>Register a new Patient</Button>
                        </div>
                    </>
                }
            </div>


        </>
    )
}

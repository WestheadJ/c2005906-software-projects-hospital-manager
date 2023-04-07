
import axios from "axios"
import { IP } from "../configs/configs"
import { useEffect } from "react"
import { useLocation, useNavigate } from 'react-router-dom'

export default function Paitents({ data, role }) {

    const navigate = useNavigate()

    function toPatientsProfile(patient_id) {
        navigate("/patient-profile")
    }

    async function getPatientsInfo(patient) {
        await axios.get(`${IP}/get/patients/file`, {
            params: {
                given_id: patient.Paitent_Id,
                given_role: role
            }
        })
            .then((response) => {
                console.log(response.data)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: "center", }}>
                <div style={{ width: '50%' }}>
                    {data.map((patient) => {
                        return (
                            <div key={patient.Patient_Id} className="patient-card">
                                <span stlye={{ float: "left" }}>
                                    {patient.Paitent_Forename}
                                    {patient.Paitent_Surname}
                                </span>
                                <span style={{ float: "right", marginRight: "10px" }}>
                                    Ward:{patient.Ward_Id}
                                </span>
                            </div>

                        )
                    })}
                </div>

            </div>
        </>
    )
}

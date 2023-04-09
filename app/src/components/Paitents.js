import { useLocation, useNavigate } from 'react-router-dom'

export default function Paitents({ data, role }) {

    const navigate = useNavigate()
    const location = useLocation()

    function toPatientsProfile(patient_id) {
        navigate("/patient-profile", { state: { role: role, token: location.state.token, id: location.state.id, patient_id: patient_id } })
    }


    return (
        <>
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: "center", }}>
                <div style={{ width: '50%' }}>
                    {data.map((patient) => {
                        return (
                            <div key={patient.Paitent_Id} className="patient-card" onClick={() => { toPatientsProfile(patient.Paitent_Id) }}>
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

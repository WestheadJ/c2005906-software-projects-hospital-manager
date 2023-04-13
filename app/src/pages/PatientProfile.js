import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'
import Authenticator from '../components/authenticator'
import axios from "axios"
import { IP } from "../configs/configs"
import "../styles/PatientProfile.css"
import { Button } from 'react-bootstrap'

export default function PatientProfile() {

  const location = useLocation()
  const navigate = useNavigate()

  const [patientForename, setPatientForename] = useState("");
  const [patientSurname, setPatientSurname] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientDOB, setPatientDOB] = useState("")
  const [patientWardId, setPatientWardId] = useState("")
  const [patientMobile, setPatientMobile] = useState("")
  const [medications, setMedications] = useState([])
  const [healthcareText, setHealthcareText] = useState("")
  const [healthcareMedication, setHealthcareMedication] = useState([])
  const [patientRecords, setPatientRecords] = useState([])


  useEffect(() => {
    getInfo()
  }, [])

  async function getInfo() {
    await axios.get(`${IP}/get/patients/file`, {
      params: {
        id: location.state.id,
        role: location.state.role,
        patient_id: location.state.patient_id
      }
    }).then((res) => {
      let patient = res.data.patient_data
      setPatientForename(patient.Paitent_Forename)
      setPatientSurname(patient.Paitent_Surname)
      setPatientDOB(patient.Paitent_Dob)
      setPatientWardId(patient.Ward_Id)
      setPatientMobile(patient.Paitent_Email)
      setPatientEmail(patient.Paitent_Email)
      setMedications(res.data.Medications)
      setHealthcareMedication(res.data.Healthcare_Plan.Medications)
      setHealthcareText(res.data.Healthcare_Plan.Text)
      if (location.state.role === "Doctor") {
        if (res.data.Records.length === 0) {
          setPatientRecords([])
        }
        else {
          setPatientRecords(res.data.Records)
        }
      }

    })
      .catch((err) => {
        alert("There was an error")
        console.log(err)
      })

  }

  function createHealthcarePlan() {
    navigate("/create-healthcare-plan", {
      state: location.state
    })
  }

  function editHealthcarePlan() {
    navigate("/edit-healthcare-plan", {
      state: location.state
    })
  }

  return (
    <>
      {/* <<--- Authentication --->> */}
      <Authenticator />
      {!location.state ? <></> :
        <>
          {/* <<--- Nav Bar --->> */}
          <NavBarHeader role={location.state.role} />
          {/* <<--- Main Content */}
          <div id='main-container'>
            <div id="patient-info-main">
              <h3>Patient Info</h3>
              <hr />
              <h4>Patient Forename: {patientForename}</h4>
              <h4>Patient Surname: {patientSurname}</h4>
              <h4>Patient DOB: {patientDOB}</h4>
              <h4>Patient Ward_Id: {patientWardId}</h4>
              <h3>Medications:{medications}</h3>
              <hr />
              <h3>Patient Contact Details</h3>
              <hr />
              <h4>Patient Email: {patientEmail}</h4>
              <h4>Patient Mobile Number: {patientMobile}</h4>
              <hr />

            </div>
            <div id="healthcare-plan" className="patient-info-records">
              <h3>Healthcare Plan</h3>
              <h5>Healthcare Plan Medication:</h5>
              {healthcareMedication.length === 0 && healthcareText === '' ? <>No Healthcare Plan</> :
                <>
                  {
                    healthcareMedication.map((item, key) => {
                      return (
                        <div key={key}>
                          <h5>Medication:</h5>
                          <p>- {item.medication}
                          </p>
                          <h5>Instructions:</h5>
                          <p>{item.instructions}</p>
                        </div>)
                    })
                  }
                </>}
              <h5>Healthcare Brief:</h5>
              <div>
                {healthcareText}
              </div>
            </div>

            {location.state.role === "Doctor" ? <div className='patient-info-records'>
              <h3>Records:</h3>
              {!patientRecords ? <>{patientRecords.map(item => {
                return <>Item</>
              })}</> : <>No records on file</>}
            </div> :
              <></>
            }

            <div>

              <div id="patient-info-controls">
                <Button onClick={createHealthcarePlan}>+ Create New Healthcare Plan</Button>
                <Button onClick={editHealthcarePlan}>Edit Healthcare Plan</Button>
                <Button>+ New Medicine</Button>
                <Button>+ Create New Appointment</Button>
                <Button>Transfer Patient</Button>
              </div>

            </div>
            {/* {location.state.role == "Doctor" ? <></> : <p>Appointments: No Appointments</p>} */}
          </div>
        </>
      }
    </>
  )
}

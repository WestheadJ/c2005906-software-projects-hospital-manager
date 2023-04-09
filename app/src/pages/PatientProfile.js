import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'
import Authenticator from '../components/authenticator'
import axios from "axios"
import { IP } from "../configs/configs"
import Paitents from '../components/Paitents'

export default function PatientProfile() {

  const location = useLocation()

  const [patientInfo, setPatientInfo] = useState([]);

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
      console.log(res.data)
      return setPatientInfo(res.data)
    })
      .catch((err) => {
        alert("There was an error")
        console.log(err)
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
          <div className='main-container'>
            <div id="patient-info-main">
              {/* {patientInfo.patient_data} */}
            </div>
          </div>
        </>
      }
    </>
  )
}

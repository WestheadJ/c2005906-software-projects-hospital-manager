import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'
import Authenticator from '../components/authenticator'
import axios from "axios"
import { IP } from "../configs/configs"

export default function PatientProfile() {

  const location = useLocation()

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


        </>
      }
    </>
  )
}

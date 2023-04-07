import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'

export default function PatientProfile() {

  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      {!location.state ? <></> : <NavBarHeader role={location.state.role} />}
    </>
  )
}

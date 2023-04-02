import React from 'react'
import { useLocation,useNavigate } from 'react-router-dom'

export default function PatientProfile() {

  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <div>PatientProfile</div>
    </>
  )
}

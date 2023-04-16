import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'
import Authenticator from '../components/authenticator'
import axios from "axios"
import { IP } from "../configs/configs"
import "../styles/PatientProfile.css"
import { Accordion, Button, Dropdown, Modal } from 'react-bootstrap'

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

  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [modalMedication, setModalMedication] = useState("")
  const [modalMedicationInstruction, setModalMedicationInstructions] = useState("")

  const [wards, setWards] = useState([])
  const [doctors, setDoctors] = useState([])
  const [modalTransferWard, setModalTransferWard] = useState("")
  const [modalTransferDoctor, setModalTransferDoctor] = useState("")
  const [showTransferWardModal, setShowTransferWardModal] = useState(false)
  const [showTransferDoctorModal, setShowTransferDoctorModal] = useState(false)



  function handleCloseMedicationModal() {
    setShowMedicationModal(false)
    setModalMedication("")
    setModalMedicationInstructions("")
  };
  const handleShowMedicationModal = () => setShowMedicationModal(true);


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

  async function saveChanges() {
    setMedications([...medications, { medication: modalMedication, instructions: modalMedicationInstruction }])


    await axios.put(`${IP}/edit/medications`, {
      role: location.state.role,
      id: location.state.id,
      patient_id: location.state.patient_id,
      medications: [...medications, { medication: modalMedication, instructions: modalMedicationInstruction }]
    })
      .then((err, res) => {
        if (err) {
          console.log(err)
          return alert(err)
        }
        else return handleCloseMedicationModal()
      })
  }

  function createRecord() {
    navigate("/create-record", { state: location.state })
  }

  function transferWard() {
    axios.put(`${IP}/transfer/ward`, {
      role: location.state.role,
      id: location.state.id,
      patient_id: location.state.patient_id,
      ward_id: modalTransferWard
    })
      .then((res, err) => {
        console.log(res)
        if (err) {
          console.log(err)
          alert("ERROR")
        }
        else {
          if (res.data === "Success") {
            handleCloseTransferWardModal()
          }
          return alert("ERROR")
        }
      })
  }

  function transferDoctor() {
    console.log("Transfering Doctor")
  }

  function handleShowTransferWardModal() {
    axios.get(`${IP}/get/wards`, {
      params: {
        role: location.state.role,
        id: location.state.id
      }
    })
      .then(res => {
        setWards(res.data)
      })
    setShowTransferWardModal(true)
  }

  function handleCloseTransferWardModal() {
    setPatientWardId(modalTransferWard)

    setShowTransferWardModal(false)
    setModalTransferWard("")
  }

  function handleShowTransferDoctorModal() {
    setShowTransferDoctorModal(true)
    getDoctors()
  }

  function handleCloseTransferDoctorModal() {
    setShowTransferDoctorModal(false)
  }

  function getDoctors() {
    axios.get(`${IP}/get/doctors`, { params: { role: location.state.role, id: location.state.id } })
      .then((res, err) => {
        if (err) {
          console.log(err)
          return alert("ERROR")
        }
        return setDoctors(res.data)
      })
  }

  useEffect(() => {
    getInfo()
  }, [])

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
              <h3>Medications:
                {medications.map((item, key) => {
                  return (<div key={key}>
                    <h5>Medication:</h5>
                    <p>- {item.medication}</p>
                    <h5>Instructions:</h5>
                    <p>{item.instructions}</p>
                  </div>)
                })}
              </h3>
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
              {!patientRecords ? <>No records on file</> :
                <>
                  <Accordion>
                    {patientRecords.map((item, i) => {
                      return (

                        <Accordion.Item eventKey={i}>
                          <Accordion.Header>{item.title}</Accordion.Header>
                          <Accordion.Body>{item.content}</Accordion.Body>
                        </Accordion.Item>
                      )
                    })}
                  </Accordion>
                </>}
            </div> :
              <></>
            }

            <div>

              <div id="patient-info-controls">
                <Button onClick={createHealthcarePlan}>+ Create New Healthcare Plan</Button>
                <Button onClick={editHealthcarePlan}>Edit Healthcare Plan</Button>
                <Button onClick={handleShowMedicationModal}>+ New Medicine</Button>
                <Button onClick={createRecord}>+ Create New Record</Button>
                <Dropdown>
                  <Dropdown.Toggle variant='primary'>Transfer Patient</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleShowTransferWardModal}>Transfer To Another Ward</Dropdown.Item>
                    <Dropdown.Item onClick={handleShowTransferDoctorModal}>Transfer To Another Doctor</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

            </div>
            {/* {location.state.role == "Doctor" ? <></> : <p>Appointments: No Appointments</p>} */}
          </div>

          {/* Add Medication Modal */}
          <Modal style={{ color: "#293241", }} show={showMedicationModal} onHide={handleCloseMedicationModal}>
            <Modal.Header style={{ backgroundColor: "#98C1D9" }} closeButton>
              <Modal.Title>Add A Medication</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#98C1D9", justifyContent: "center" }}>
              <label for="medication">Medication:</label>
              <input name="medication" onChange={e => setModalMedication(e.target.value)} type="text" />

              <label for="instructions">Medication Instructions</label>
              <textarea onChange={e => setModalMedicationInstructions(e.target.value)} name='instructions'>

              </textarea>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#98C1D9" }}>
              <Button variant="secondary" onClick={handleCloseMedicationModal}>
                Close
              </Button>
              <Button variant="primary" onClick={saveChanges}>
                Add Medication
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Transfer Ward Modal */}
          <Modal style={{ color: "#293241", }} show={showTransferWardModal} onHide={handleCloseTransferWardModal}>
            <Modal.Header style={{ backgroundColor: "#98C1D9" }} closeButton>
              <Modal.Title>Transfer Patients Ward</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#98C1D9", justifyContent: "center" }}>
              <h3>Current Ward: {patientWardId} | Transfer to Ward: {modalTransferWard}</h3>
              <h3>Wards To Transfer Patient:</h3>
              {wards.map((ward, key) => {
                return (<>
                  {ward.Ward_Id === patientWardId ? <></> : <><div className='ward' onClick={e => {
                    setModalTransferWard(ward.Ward_Id)
                  }} key={key}>
                    <p>{ward.Ward_Id}</p>
                  </div></>}


                </>
                )
              })}

            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#98C1D9" }}>
              <Button variant="secondary" onClick={handleCloseTransferWardModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => {
                if (modalTransferWard === "") {
                  return alert("Please select a ward")
                }
                return transferWard()
              }}>
                Transfer Patient
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Transfer Doctor Modal */}
          <Modal style={{ color: "#293241", }} show={showTransferDoctorModal} onHide={handleCloseTransferDoctorModal}>
            <Modal.Header style={{ backgroundColor: "#98C1D9" }} closeButton>
              <Modal.Title>Transfer Patients Doctor</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#98C1D9", justifyContent: "center" }}>
              <h3>Transfer to Dr: </h3>
              <h3>Doctor to Transfer:</h3>
              {doctors.map((doctor, key) => {
                console.log(doctor)
                return (<>
                  {doctor.Doctor_id !== location.state.id ? <><div className='ward' onClick={e => {
                    setModalTransferDoctor(doctor.Doctor_Id)
                  }} key={key}>
                    <p>{doctor.Doctor_Firstname} {doctor.Doctor_Surname}</p>
                  </div></> : <></>}


                </>
                )
              })}

            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#98C1D9" }}>
              <Button variant="secondary" onClick={handleCloseTransferWardModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => {
                if (modalTransferWard === "") {
                  return alert("Please select a ward")
                }
                return transferWard()
              }}>
                Transfer Patient
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      }
    </>
  )
}

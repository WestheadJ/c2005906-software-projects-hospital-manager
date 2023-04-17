import React, { useEffect, useState } from 'react'
import Authenticator from '../components/authenticator'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBarHeader from '../components/NavBarHeader'
import { Button, Modal } from 'react-bootstrap'
import "../styles/CreateHealthcarePlan.css"
import axios from 'axios'
import { IP } from '../configs/configs'

export default function EditHealthcarePlan() {

    const location = useLocation()
    const navigate = useNavigate()

    const [medications, setMedications] = useState([])
    const [textAreaValue, setTextAreaValue] = useState("")

    const [showModal, setShowModal] = useState(false);
    const [modalMedication, setModalMedication] = useState([])
    const [modalMedicationInstruction, setModalMedicationInstructions] = useState("")


    function handleClose() {
        setShowModal(false)
        setModalMedication([])
        setModalMedicationInstructions("")
    };
    const handleShow = () => setShowModal(true);

    function saveChanges() {
        setMedications([...medications, { medication: modalMedication, instructions: modalMedicationInstruction }])
        handleClose()
    }

    async function createHealthcarePlan() {
        await axios.put(`${IP}/edit/healthcare-plan`,
            {
                role: location.state.role,
                patient_id: location.state.patient_id,
                text: textAreaValue,
                medications: medications,
                id: location.state.id
            }).then((res, err) => {
                // DEBUG
                // console.log(res.data)
                if (res.data === "Success") {
                    navigate("/patient-profile", { state: location.state })
                }
                if (err) {
                    // DEBUG
                    // console.log(err)
                    return alert("ERROR")
                }
                else {
                    // DEBUG
                    // console.log(err)
                    return alert("ERROR")
                }

            })
    }

    async function getHealthcarePlan() {
        await axios.get(`${IP}/get/healthcare-plan`, {
            params: {
                id: location.state.id,
                patient_id: location.state.patient_id,
                role: location.state.role
            }
        })
            .then((res, err) => {
                // DEBUG
                // console.log(res.data)
                if (err) {
                    // DEBUG
                    // console.log(err)
                    return alert(err)
                }
                else {

                    setMedications(res.data.Medications)
                    return setTextAreaValue(res.data.Text)
                }
            })
    }

    useEffect(() => {
        getHealthcarePlan()
    }, [])
    return (
        <>
            <Authenticator />

            {!location.state ? <></> :
                <>
                    {/* <<--- Nav Bar --->> */}
                    <NavBarHeader role={location.state.role} />
                    {/* <<--- Main Content */}
                    <div id="wrapper">
                        <div className='main-container'>
                            <div id="plan-description">
                                <h3>Plan Medications:</h3>
                                {medications.map((item, key) => {
                                    return (
                                        <div key={key}>
                                            <h5>Medication:</h5>
                                            <p>- {item.medication}
                                                {/*https://react.dev/learn/updating-arrays-in-state  */}
                                                <span onClick={() => {
                                                    setMedications(medications.filter(i =>
                                                        i.medication !== item.medication
                                                    ))

                                                }} className="remove-medication">remove</span>
                                            </p>
                                            <h5>Instructions:</h5>
                                            <p>{item.instructions}</p>
                                        </div>)
                                })}

                            </div>
                            <div id="plan-actions">
                                <Button onClick={handleShow}>+ Add Medication</Button>
                                <Button onClick={createHealthcarePlan} variant='success' >Edit Plan</Button>
                                <Button onClick={() => navigate("/patient-profile", { state: location.state })} variant="secondary">Cancel</Button>
                            </div>

                        </div>
                        <hr />
                        <div id="plan-brief">
                            <h3>Plan Brief:</h3>
                            <textarea id="Healthcare Plan Text " onChange={(e) => {
                                setTextAreaValue(e.target.value)
                            }}>
                            </textarea>
                        </div>

                    </div >

                    {/* Add Medication Modal */}
                    <Modal Modal style={{ color: "#293241", }
                    } show={showModal} onHide={handleClose} >
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
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={saveChanges}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal >

                </>

            }
        </>
    )
}

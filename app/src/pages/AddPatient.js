import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Authenticator from '../components/authenticator'
import { Card, Button, Dropdown } from 'react-bootstrap'
import axios from 'axios'
import { IP } from '../configs/configs'
import NavBarHeader from '../components/NavBarHeader'


export default function AddPatient() {

    const location = useLocation()
    const navigate = useNavigate()


    const [wardId, setWardId] = useState(" ")
    const [doctorId, setDoctorId] = useState(" ")
    const [forename, setForename] = useState(" ")
    const [surname, setSurname] = useState(" ")
    const [mobile, setMobile] = useState(" ")
    const [dob, setDob] = useState(" ")
    const [email, setEmail] = useState("")
    const [emergencyContact1Forename, setEmergencyContact1Forename] = useState(" ")
    const [emergencyContact1Surname, setEmergencyContact1Surname] = useState(" ")
    const [emergencyContact1Mobile, setEmergencyContact1Mobile] = useState(" ")
    const [emergencyContact1Email, setEmergencyContact1Email] = useState(" ")
    const [emergencyContact2Forename, setEmergencyContact2Forename] = useState(" ")
    const [emergencyContact2Surname, setEmergencyContact2Surname] = useState(" ")
    const [emergencyContact2Mobile, setEmergencyContact2Mobile] = useState(" ")
    const [emergencyContact2Email, setEmergencyContact2Email] = useState(" ")

    const [doctors, setDoctors] = useState([])
    const [wards, setWards] = useState([])

    const [doctorsName, setDoctorsName] = useState("")


    function getDoctors() {
        axios.get(`${IP}/get/doctors`, { params: { role: location.state.role, id: location.state.id } })
            .then((res, err) => {
                if (err) {
                    // DEBUG
                    // console.log(err)
                    return alert("ERROR")
                }
                else {
                    return setDoctors(res.data)
                }
            })
    }

    async function getWards() {
        await axios.get(`${IP}/get/wards`, { params: { role: location.state.role, id: location.state.id } })
            .then((res, err) => {
                if (err) {
                    // DEBUG
                    // console.log(err)
                    return alert("ERROR")
                }
                else {
                    return setWards(res.data)
                }
            })
    }

    async function registerPatient() {
        await axios.post(`${IP}/add/patient`, {
            role: location.state.role,
            id: location.state.id,
            doctor_id: doctorId,
            ward_id: wardId,
            forename: forename,
            surname: surname,
            mobile: mobile,
            dob: dob,
            email: email,
            emergency_contact_1_forename: emergencyContact1Forename,
            emergency_contact_1_surname: emergencyContact1Surname,
            emergency_contact_1_mobile: emergencyContact1Mobile,
            emergency_contact_1_email: emergencyContact1Email,
            emergency_contact_2_forename: emergencyContact2Forename,
            emergency_contact_2_surname: emergencyContact2Surname,
            emergency_contact_2_mobile: emergencyContact2Mobile,
            emergency_contact_2_email: emergencyContact2Email
        })
            .then((res, err) => {
                if (err) {
                    // DEBUG
                    // console.log(err)
                    return alert("ERROR")
                }
                else {
                    if (res.data === "Success") { navigate("/", { state: location.state }) }
                    else {
                        return alert("ERROR")
                    }
                }
            })
    }

    useEffect(() => {
        getDoctors()
        getWards()
    }, [])

    return (
        <>
            {/* <<--- Authentication --->> */}
            <Authenticator />
            {!location.state ? <></> :
                <>
                    {/* <<--- Nav Bar --->> */}
                    <NavBarHeader role={location.state.role} />
                    <Card id="patient-info" style={{
                        width: "88%", backgroundColor: "#98C1D9", margin: "15% auto auto auto"
                    }}>
                        <Card.Title style={{ textAlign: "center", paddingTop: "5%" }}><h1>Register Patient</h1></Card.Title>
                        <hr />
                        <Card.Body style={{ display: 'flex', flexDirection: "column" }}>

                            <label>Selected Doctor: {doctorsName}</label>
                            <Dropdown>
                                <Dropdown.Toggle variant='primary'>Select Doctor</Dropdown.Toggle>
                                <Dropdown.Menu >
                                    {doctors.map((item, key) => {
                                        return (<Dropdown.Item key={key} onClick={() => {
                                            setDoctorsName(item.Doctor_Firstname + " " + item.Doctor_Surname)
                                            setDoctorId(item.Doctor_id)
                                        }}>{item.Doctor_Firstname} {item.Doctor_Surname}</Dropdown.Item>)

                                    })}
                                </Dropdown.Menu>
                            </Dropdown>

                            <label>Selected Doctor: {wardId}</label>
                            <Dropdown>
                                <Dropdown.Toggle variant='primary'>Select Ward</Dropdown.Toggle>
                                <Dropdown.Menu >
                                    {wards.map((item, key) => {
                                        return (<Dropdown.Item key={key} onClick={() => {
                                            setWardId(item.Ward_Id)
                                        }}>{item.Ward_Id}</Dropdown.Item>)

                                    })}
                                </Dropdown.Menu>
                            </Dropdown>

                            <h3>Patient:</h3>
                            <label for="forename">Forename:</label>
                            <input type="text" name="forename" onChange={(e) => {
                                setForename(e.target.value)
                            }} placeholder='Forename*' />

                            <label for="surname">Surname:</label>
                            <input name="surname" onChange={(e) => {
                                setSurname(e.target.value)
                            }} placeholder='Surname*' />

                            <label for="mobile">Mobile Number*: </label>
                            <input name="mobile" type="tel" onChange={(e) => {
                                setMobile(e.target.value)
                            }} placeholder='Mobile Number*' />

                            <label for="email">Email Address: </label>
                            <input name="email" onChange={(e) => {
                                setEmail(e.target.value)
                            }} placeholder='Email Address*' />

                            <label for="dob">Date of Birth*: </label>
                            <input name="dob" type="date" onChange={(e) => {
                                setDob(e.target.value)
                            }} placeholder='Date of Birth*' />

                            <h3>Emergency Contacts:</h3>
                            <h4>Emergency Contact 1</h4>
                            <label for="emergency-contact-1-forename">Forename: </label>
                            <input name="emergency-contact-1-forename" type="text" onChange={(e) => {
                                setEmergencyContact1Forename(e.target.value)
                            }} placeholder='Forename' />

                            <label for="emergency-contact-1-surname">Surname: </label>
                            <input name="emergency-contact-1-surname" type="text" onChange={(e) => {
                                setEmergencyContact1Surname(e.target.value)
                            }} placeholder='Surname' />

                            <label for="emergency-contact-1-mobile">Mobile Number: </label>
                            <input name="emergency-contact-1-mobile" type="mobile" onChange={(e) => {
                                setEmergencyContact1Mobile(e.target.value)
                            }} placeholder='Mobile Number' />

                            <label for="emergency-contact-1-email">Email: </label>
                            <input name="emergency-contact-1-email" type="email" onChange={(e) => {
                                setEmergencyContact1Email(e.target.value)
                            }} placeholder='Email Address' />

                            <h4>Emergency Contact 2</h4>
                            <label for="emergency-contact-2-forename">Forename: </label>
                            <input name="emergency-contact-2-forename" type="text" onChange={(e) => {
                                setEmergencyContact2Forename(e.target.value)
                            }} placeholder='Forename' />

                            <label for="emergency-contact-2-surname">Surname: </label>
                            <input name="emergency-contact-2-surname" type="text" onChange={(e) => {
                                setEmergencyContact2Surname(e.target.value)
                            }} placeholder='Surname' />

                            <label for="emergency-contact-2-mobile">Mobile Number: </label>
                            <input name="emergency-contact-2-mobile" type="mobile" onChange={(e) => {
                                setEmergencyContact2Mobile(e.target.value)
                            }} placeholder='Mobile Number' />

                            <label for="emergency-contact-2-email">Email: </label>
                            <input name="emergency-contact-2-email" type="email" onChange={(e) => {
                                setEmergencyContact2Email(e.target.value)
                            }} placeholder='Email Address' />

                            <div style={{ display: 'flex', justifyContent: "flex-end", width: '100%' }}>
                                <Button style={{ width: "20%", float: 'right' }} id="registerButton" onClick={() => {
                                    if (forename === "" || surname === "" || email === "" || mobile === "" || dob === "") {
                                        alert("Fill in empty fields marked with *")
                                    }
                                    else { return registerPatient() }
                                }}>Register</Button>
                            </div>

                        </Card.Body>
                    </Card >
                </>}
        </>
    )
}

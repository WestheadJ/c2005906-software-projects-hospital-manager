import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Authenticator from '../components/authenticator';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { IP } from '../configs/configs';
import "../styles/CreateRecord.css"

export default function CreateRecord() {

    const location = useLocation();
    const navigate = useNavigate();
    const currentDate = new Date()

    const [content, setContent] = useState("")

    const date = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`

    function createRecord() {
        let record = {}
        record.title = date
        record.content = content
        axios.post(`${IP}/create/new-record`, {
            role: location.state.role,
            id: location.state.id,
            patient_id: location.state.patient_id,
            content: content,
            title: date
        }).then((res, err) => {
            if (err) {
                console.log(err)
                alert("There was an error")
            }
            if (res.data === 'Success') {
                navigate("/patient-profile", { state: location.state })
            }
        })
    }

    return (
        <>
            <Authenticator />
            {!location.state ? <></> :
                <>
                    <div id="main-content">
                        <h1>Create Record - {date}</h1>
                        <hr />

                        <label for="patient-record">Record Content:</label>
                        <textarea onChange={e => setContent(e.target.value)} name="patient-record" />

                        <div id="button-controls">
                            <Button class="cancel-button" variant='secondary'>Cancel</Button>
                            <Button onClick={createRecord} class="save-button" variant="success">Submit Record</Button>
                        </div>

                    </div>
                </>}
        </>



    )
}

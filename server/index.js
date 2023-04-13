const express = require('express')
const sqlite = require('sqlite3')
const app = express()
const cors = require('cors')
const fs = require('fs')
const { hospitalCode } = require('./configs/config')
const IP = "127.0.0.1";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
}));

const db = new sqlite.Database('configs/hospital-management.db')

const folderName = "data"


try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
    }
    const sql = "SELECT Paitent_id FROM Patients"
    db.all(sql, (err, rows) => {

        if (err) {
            console.log(err)
        }
        else {
            const dataFiles = fs.readdirSync(folderName)
            if (dataFiles.length === 0) {
                rows.forEach(id => {
                    var boilerPlate =
                    {
                        "Paitent_id": id.Paitent_Id,
                        "Medications": [],
                        "Healthcare_Plan": {
                            "Medications": [],
                            "Text": "",

                        },
                        "Records": []
                    }
                    var contents = JSON.stringify(boilerPlate)

                    fs.writeFile(`data/${id.Paitent_Id}.json`, contents, err => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            // console.log('Successful')
                        }
                    })
                })
            }
            else {
                let files = []
                dataFiles.forEach(file => {
                    files.push(file.split("."[0]))
                })

                rows.forEach(patient => {
                    if (!files.includes(patient.Paitent_Id)) {
                    }
                    else {
                        var boilerPlate =
                        {
                            "Paitent_id": patient.Paitent_Id,
                            "Medications": [],
                            "Healthcare_Plan": {
                                "Medications": [],
                                "Text": "",

                            },
                            "Records": []
                        }
                        var contents = JSON.stringify(boilerPlate)

                        fs.writeFile(`data/${patient.Paitent_Id}.json`, contents, err => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log('Successful')
                            }
                        })
                    }
                })
            }
        }
    })
}
catch (err) {
    console.log(err)
}

const PORT = 3001;

async function Authenticate(role, id) {
    if (role === "Doctor") {
        db.get(`SELECT Doctor_id From Doctors WHERE Doctor_id=${id}`, (err, row) => {
            if (err) {
                console.log(err)
                return false
            }
            else {
                if (row.Doctor_id == id) { return true } else {
                    console.log("Error")
                    return false
                }
            }
        })
    }
    else if (role === "Nurse") {
        db.get(`SELECT Nurse_Id From Nurses WHERE Nurse_Id=${id}`, (err, row) => {
            if (err) {
                console.log(err)
                return false
            }
            else { if (row.Nurse_Id == id) { return true } else return false }
        })
    }
    else return false
}
app.listen(PORT, () => console.log(`Server address is: http://${IP}:${PORT} \nTo test go to: http://${IP}:${PORT}/test `));

app.get('/test', (req, res) => res.send("<h1>Test Endpoint</h1>"))

app.get('/login', (req, res) => {
    const reqEmail = req.query.email
    const reqPassword = req.query.password
    const reqRole = req.query.role
    if (reqRole === "Nurse") {
        const sql = `SELECT Nurse_Id,Nurse_Email,Nurse_Password FROM Nurses WHERE Nurse_Email= ? AND Nurse_Password= ?`
        db.get(sql, [reqEmail, reqPassword], (error, row) => {
            if (error) {
                console.log(error)
                res.statusCode(500)
            }
            else {
                if (row === undefined) {
                    return res.send({ state: false })
                }
                else {
                    return res.send({ state: true, data: row.Nurse_Id })
                }
            }


        })
    }
    else if (reqRole === 'Doctor') {
        const sql = `SELECT Doctor_id,Doctor_Email,Doctor_Password FROM Doctors WHERE Doctor_Email = ? AND Doctor_Password = ?`
        db.get(sql, [reqEmail, reqPassword], (error, row) => {
            if (error) {
                console.log(error)
                return res.statusCode(500)
            }
            else {
                if (row === undefined) {
                    return res.send({ state: false })
                }
                else {
                    return res.send({ state: true, data: row.Doctor_id })
                }
            }

        })
    }
    else {
        return res.send({ state: false, reason: "Incorrect role" })
    }
})

app.get("/get/patients/nurse", (req, res) => {
    const id = req.query.nurse_id
    const sql = "SELECT DISTINCT Patients.Paitent_Id,Patients.Paitent_Forename,Patients.Paitent_Surname,Patients.Ward_Id FROM Patients INNER JOIN Wards on Patients.Ward_Id = Wards.Ward_id INNER JOIN Nurses on Wards.Ward_Manager = ?"
    db.all(sql, [id], (err, rows) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else {
            return res.send(rows)
        }
    })
})

app.get("/get/patients/doctor", (req, res) => {
    const doctorId = req.query.doctor_id
    db.all("SELECT Paitent_Forename,Paitent_Surname,Ward_Id,Paitent_Id FROM Patients WHERE Doctor_Id=?", [doctorId], (err, rows) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        else {
            return res.send(rows)
        }
    })
})

app.get("/get/healthcare-plan", (req, res) => {
    const patientId = req.query.patient_id
    const clientId = req.query.id
    const clientRole = req.query.role


    if (Authenticate(clientRole, clientId)) {
        fs.readFile(`data/${patientId}.json`, (err, contents) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            else {
                contents = JSON.parse(contents)
                return res.json(contents.Healthcare_Plan)
            }
        })
    }
    else {
        res.send("ERROR")
    }
})

app.get("/get/patients/file", (req, res) => {
    const id = req.query.id
    const role = req.query.role
    const patientId = req.query.patient_id


    if (Authenticate(role, id)) {
        fs.readFile(`data/${patientId}.json`, (err, contents) => {
            if (err) {
                return res.send(err)
            }
            else {
                data = JSON.parse(contents)
                db.get(`SELECT * FROM Patients WHERE Paitent_Id=${patientId}`, (err, row) => {
                    if (err) {
                        console.log(err)
                        return res.send("ERROR")
                    }
                    else {
                        if (role === "Nurse") {
                            return res.json({
                                "patient_data": row,
                                "Medications": data.Medications,
                                "Healthcare_Plan": data.Healthcare_Plan
                            })
                        }
                        else {
                            return res.json({ "patient_data": row, "Medications": data.Medications, "Healthcare_Plan": data.Healthcare_Plan, "Records": data.Records })
                        }
                    }
                })
            }
        })
    }
    else {
        res.send("ERROR")
    }
})

app.post("/register", (req, res) => {
    const submittedHospitalCode = req.body.hospitalCode
    if (submittedHospitalCode == hospitalCode) {
        const submittedRole = req.body.role
        const submittedForename = req.body.forename
        const submittedSurname = req.body.surname
        const submittedEmail = req.body.email
        const submittedPassword = req.body.password
        const submittedMobileNumber = req.body.mobileNumber
        console.log(req.body)
        if (submittedRole === "Nurse") {
            const sql = "INSERT INTO Nurses(Nurse_Firstname,Nurse_Surname,Nurse_Mobile_Number,Nurse_Email,Nurse_Password) VALUES (?,?,?,?,?)"
            db.serialize(() => {
                db.run(sql, [submittedForename, submittedSurname, submittedMobileNumber, submittedEmail, submittedPassword], (err) => {
                    if (err) {
                        console.log(err)
                        return res.send(false)
                    }
                    else {
                        return res.send(true)
                    }
                })
            })
        }
        else if (submittedRole === "Doctor") {
            const sql = "INSERT INTO Doctors(Doctor_Forename,Doctor_Surname,Doctor_Mobile_Number,Doctor_Email,Doctor_Password) VALUES (?,?,?,?,?)"
            db.serialize(() => {
                db.run(sql, [submittedForename, submittedSurname, submittedMobileNumber, submittedEmail, submittedPassword], (err) => {
                    if (err) {
                        console.log(err)
                        return res.send(false)
                    }
                    else {
                        return res.send(true)
                    }
                })
            })
        }
    }
    else {
        return res.send(false)
    }

})

app.put("/edit/healthcare-plan", (req, res) => {
    const patientId = req.body.patient_id
    let text = req.body.text
    let medications = req.body.medications
    const id = req.body.id
    const role = req.body.role

    if (!req.body.role) {
        res.send("No role")
    }
    else {
        if (Authenticate(role, id)) {
            fs.readFile(`data/${patientId}.json`, (err, contents) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                }
                else {
                    contents = JSON.parse(contents)
                    let healthcareJson = contents.Healthcare_Plan
                    healthcareJson.Medications = medications
                    healthcareJson.Text = text
                    contents.Healthcare_Plan = healthcareJson


                    contents = JSON.stringify(contents)
                    fs.writeFile(`data/${patientId}.json`, contents, err => {
                        if (err) {
                            console.log(err)
                            res.send(err)
                        }
                        else {
                            console.log('Successful')
                            res.send("Success")
                        }
                    })
                }
            })
        }
        else {
            res.send("ERROR")
        }
    }
})


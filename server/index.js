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
            // DEBUG
            // console.log(err)
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
                            // DEBUG
                            // console.log(err)
                        }
                        else {
                            // DEBUG
                            // console.log('Successful')
                        }
                    })
                })
            }
            else {
                let files = []
                dataFiles.forEach(file => {
                    files.push(file.split(".")[0])
                })

                // DEBUG
                // console.log(files)

                rows.forEach(patient => {
                    if (files.includes(patient.Paitent_Id.toString())) {
                        return
                        // console.log("File already exists")
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
                                // DEBUG
                                // console.log(err)
                            }
                            else {
                                // DEBUG
                                // console.log('Successful')
                            }
                        })
                    }
                })
            }
        }
    })
}
catch (err) {
    // DEBUG
    // console.log(err)
}

const PORT = 3001;

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
                // DEBUG
                // console.log(error)
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
                // DEBUG
                // console.log(error)
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
            // DEBUG
            // console.log(err)
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

    fs.readFile(`data/${patientId}.json`, (err, contents) => {
        if (err) {
            // DEBUG
            // console.log(err)
            return res.send(err)
        }
        else {
            contents = JSON.parse(contents)
            return res.json(contents.Healthcare_Plan)
        }
    })


})

app.get("/get/patients/file", (req, res) => {
    const role = req.query.role
    const patientId = req.query.patient_id

    // DEBUG
    // console.log("Authorised")
    fs.readFile(`data/${patientId}.json`, (err, contents) => {
        if (err) {
            return res.send(err)
        }
        else {
            data = JSON.parse(contents)
            db.get(`SELECT * FROM Patients WHERE Paitent_Id=${patientId}`, (err, row) => {
                if (err) {
                    // DEBUG
                    // console.log(err)
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
        // DEBUG
        // console.log(req.body)
        if (submittedRole === "Nurse") {
            const sql = "INSERT INTO Nurses(Nurse_Firstname,Nurse_Surname,Nurse_Mobile_Number,Nurse_Email,Nurse_Password) VALUES (?,?,?,?,?)"
            db.serialize(() => {
                db.run(sql, [submittedForename, submittedSurname, submittedMobileNumber, submittedEmail, submittedPassword], (err) => {
                    if (err) {
                        // DEBUG
                        // console.log(err)
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
                        // DEBUG
                        // console.log(err)
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

    if (!req.body.role) {
        res.send("No role")
    }
    else {

        fs.readFile(`data/${patientId}.json`, (err, contents) => {
            if (err) {
                // DEBUG
                // console.log(err)
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
                        // DEBUG
                        // console.log(err)
                        res.send(err)
                    }
                    else {
                        // DEBUG
                        // console.log('Successful')
                        res.send("Success")
                    }
                })
            }
        })

    }
})

app.put(`/edit/medications`, (req, res) => {

    const patientId = req.body.patient_id
    const medications = req.body.medications



    fs.readFile(`data/${patientId}.json`, (err, contents) => {
        if (err) {
            // DEBUG
            // console.log(err)
            return res.send(err)
        }
        else {
            contents = JSON.parse(contents)
            contents.Medications = medications
            contents = JSON.stringify(contents)
            fs.writeFile(`data/${patientId}.json`, contents, err => {
                if (err) {
                    // DEBUG
                    // console.log(err)
                    res.send(err)
                }
                else {
                    // DEBUG
                    // console.log('Successful')
                    res.send("Success")
                }
            })
        }
    })

})

app.post("/create/new-record", (req, res) => {

    const patientId = req.body.patient_id
    const title = req.body.title
    const content = req.body.content


    fs.readFile(`data/${patientId}.json`, (err, contents) => {

        if (err) {
            return res.send("Error")
        }
        else {
            let data = JSON.parse(contents)
            data.Records.push({ title: title, content: content })
            fs.writeFile(`data/${patientId}.json`, JSON.stringify(data), err => {
                if (err) {
                    // DEBUG
                    // console.log(err)
                    return res.send(err)
                }
                else {
                    // DEBUG
                    // console.log('Successful')
                    return res.send("Success")
                }
            })
        }

    })

})

app.get("/get/wards", (req, res) => {
    db.all("SELECT DISTINCT ward_id FROM wards", (err, rows) => {
        if (err) {
            // DEBUG
            // console.log(err)
            return res.send("ERROR")
        }
        return res.send(rows)
    })

})

app.get("/get/doctors", (req, res) => {

    db.all("SELECT Doctor_id,Doctor_Firstname,Doctor_Surname FROM DOCTORS", (err, rows) => {
        if (err) {
            // DEBUG
            // console.log(err)
            return res.send("ERROR")
        }
        else { return res.send(rows) }
    })

})

app.put("/transfer/ward", (req, res) => {
    const patientId = req.body.patient_id
    const wardId = req.body.ward_id

    db.run(`UPDATE Patients SET Ward_Id=${wardId} WHERE Paitent_Id=${patientId}`, err => {
        if (err) {
            // DEBUG
            // console.log(err)
            return res.send("ERROR")
        }
        else {
            return res.send("Success")
        }
    })

})

app.put("/transfer/doctor", (req, res) => {

    const patientId = req.body.patient_id
    const doctorId = req.body.doctor_id


    db.run(`UPDATE Patients SET Doctor_Id=${doctorId} WHERE Paitent_Id=${patientId}`, err => {
        if (err) {
            // DEBUG
            // console.log(err)
            return res.send("ERROR")
        }
        else {
            return res.send("Success")
        }
    })

})

app.post("/add/patient", (req, res) => {
    const wardId = req.body.ward_id
    const doctorId = req.body.doctor_id
    const forename = req.body.forename
    const surname = req.body.surname
    const mobile = req.body.mobile
    const dob = req.body.dob
    const email = req.body.email
    const emergencyContact1Forename = req.body.emergency_contact_1_Forename
    const emergencyContact1Surname = req.body.emergency_contact_1_surname
    const emergencyContact1Mobile = req.body.emergency_contact_1_mobile
    const emergencyContact1Email = req.body.emergency_contact_1_email
    const emergencyContact2Forename = req.body.emergency_contact_2_forename
    const emergencyContact2Surname = req.body.emergency_contact_2_surname
    const emergencyContact2Mobile = req.body.emergency_contact_2_mobile
    const emergencyContact2Email = req.body.emergency_contact_2_email

    // DEBUG

    // console.log(req.body, "\n")

    // console.log(role, id, wardId, doctorId, forename, surname, mobile, dob, email, emergencyContact1Forename, emergencyContact1Surname, emergencyContact1Mobile, emergencyContact1Email, emergencyContact2Forename, emergencyContact2Surname, emergencyContact2Mobile, emergencyContact2Email)

    const sql = "INSERT INTO Patients(Doctor_Id,Ward_Id,Paitent_Forename,Paitent_Surname,Paitent_Mobile_Number,Paitent_Dob,Paitent_Email,Paitent_Emergency_Contact_1_Forename,Paitent_Emergency_Contact_1_Surname,Paitent_Emergency_Contact_1_Mobile_Number,Paitent_Email,Paitent_Emergency_Contact_2_Forename,Paitent_Emergency_Contact_2_Surname,Paitent_Emergency_Contact_2_Mobile_Number,Paitent_Emergency_Contact_2_Email) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    db.serialize(() => {
        db.run(sql, [doctorId, wardId, forename, surname, mobile, dob, email, emergencyContact1Forename, emergencyContact1Surname, emergencyContact1Mobile, emergencyContact1Email, emergencyContact2Forename, emergencyContact2Surname, emergencyContact2Mobile, emergencyContact2Email], err => {
            if (err) {
                // DEBUG
                // console.log(err)
                return res.send("ERROR")
            }

        })

    })
    db.all("SELECT Paitent_Id FROM Patients", (err, rows) => {
        if (err) {
            // DEBUG
            // console.log(err)
            return res.send("ERROR")
        }
        else {
            // DEBUG
            // console.log(rows)
            var boilerPlate =
            {
                "Paitent_id": rows[(rows.length - 1)].Paitent_Id,
                "Medications": [],
                "Healthcare_Plan": {
                    "Medications": [],
                    "Text": "",

                },
                "Records": []
            }
            var contents = JSON.stringify(boilerPlate)

            fs.writeFile(`data/${rows[(rows.length - 1)].Paitent_Id}.json`, contents, err => {
                if (err) {
                    // DEBUG
                    // console.log(err)
                    return res.send("ERROR")
                }
                else {
                    // DEBUG
                    // console.log('Successful')
                    return res.send("Success")
                }
            })
        }
    })

})

app.delete("/discharge", (req, res) => {
    const patientId = req.originalUrl.split("?")[1]
    db.run(`DELETE FROM Patients WHERE Paitent_Id=${patientId}`, err => {
        if (err) {
            // DEBUG
            // console.log(err)
            return res.send("ERROR")
        }
        else {
            return res.send("Success")
        }
    })

})
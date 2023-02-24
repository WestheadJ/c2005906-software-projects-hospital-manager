const express = require('express')
const sqlite = require('sqlite3')
const app = express()
const cors = require('cors')
const networkInterface = require('os').networkInterfaces()
const IP = networkInterface['en0'][1].address

app.use(cors({
    origin: 'http://localhost:3000',
}));

const db = new sqlite.Database('configs/hospital-management.db')

app.get('/test',(req,res)=>res.send("<h1>Test Endpoint</h1>"))

app.get('/login',(req,res)=>{
        const reqEmail = req.query.email
        const reqPassword = req.query.password
        const reqRole = req.query.role
        if(reqRole === "Nurse"){
            const sql = `SELECT Nurse_Id,Nurse_Email,Nurse_Password FROM Nurses WHERE Nurse_Email= ? AND Nurse_Password= ?`
            db.get(sql,[reqEmail,reqPassword],(error,row)=>{
                if(error){
                    console.log(error)
                    res.statusCode(500)
                }
                else{
                    if(row===undefined){
                        return res.send({state:false})
                    }
                    else{
                        return res.send({state:true,data:row.Nurse_Id})
                    }
                    // console.log(row.Nurse_Email,row.Nurse_Password)
                }
                
                
            })
        } 
        else if(reqRole === 'Doctor'){
            const sql = `SELECT Doctor_id,Doctor_Email,Doctor_Password FROM Doctors WHERE Doctor_Email = ? AND Doctor_Password = ?`
            db.get(sql,[reqEmail,reqPassword],(error,row)=>{
                if(error){
                    console.log(error)
                    return res.statusCode(500)
                }
                else{
                    if(row===undefined){
                        return res.send({state:false})
                    }
                    else{
                        return res.send({state:true,data:row.Doctor_id})
                    }
                }
                
            })
        }
        else{
            return res.send({state:false,reason:"Incorrect role"})
        }
})

app.get("/get/paitents/nurse",(req,res)=>{
    const id = req.query.nurse_id
    const sql = "SELECT DISTINCT Paitents.Paitent_Id,Paitents.Paitent_Forename FROM Paitents INNER JOIN Wards on Paitents.Ward_Id = Wards.Ward_id INNER JOIN Nurses on Wards.Ward_Manager = ?"
    db.all(sql,[id],(err,rows)=>{
        if(err){
            console.log(err)
            return res.send(err)
        }
        else{
            return res.send(rows)
        }
    })
})

app.get("/get/paitents/doctor",(req,res)=>{
    const doctor_id = req.query.doctor_id
    db.all("SELECT * FROM Paitents WHERE Doctor_Id=?",[doctor_id],(err,rows)=>{
        if(err){
            console.log(err)
            return res.send(err)
        }
        else{
            return res.send(rows)
        }
    })
})

const PORT = 3001;

app.listen(PORT, () => console.log(`Server address is: http://${IP}:${PORT} \nTo test go to: http://${IP}:${PORT}/test `));
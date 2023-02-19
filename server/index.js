const express = require('express')
const sqlite = require('sqlite3')
const app = express()

const networkInterface = require('os').networkInterfaces()
const IP = networkInterface['en0'][1].address

const db = sqlite



app.get('/test',(req,res)=>{
        res.send("Received!")
})

const PORT = 3001;

// create the server and listen on the port set by heroku
app.listen(PORT, () => console.log(`Server address is: http://${IP}:${PORT} \nTo test go to: http://${IP}:${PORT}/test `));
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { storageHandler } from '../components/localStorageHandler'
import { IP } from '../configs/configs'
import "../styles/Dashboard.css"

export default function Dashboard() {

    const localStorageHandler = new storageHandler()

    const navigate = useNavigate()
    const location = useLocation()

    const storage = localStorageHandler.getLocalStorage()

    const storedId = storage.id
    const storedToken = storage.token

    useEffect(()=>{
    
        if(location.state == null){
            localStorageHandler.clearLocalStorage()
            return navigate("/login",{replace:true})
        }   
        else{
            if(location.state.id != storedId || location.state.token != storedToken){
                localStorageHandler.clearLocalStorage()
                return navigate("/login",{replace:true})
            }
        }
        if(location.state.role === "Nurse"){
            console.log("YOU'RE A NURSE")
            getNursesPaitents()
            
        }
        if(location.state.role === "Doctor"){
            console.log("YOURE A DOCTOR")
            getDoctorsPaitents()
        }
        },[])
        
        async function getNursesPaitents(){
            await axios.get(`${IP}/get/paitents/nurse`,{
                params:{
                    nurse_id:location.state.id
                }
            })
            .then((response)=>{
                console.log(response.data)
            })
        }

        async function getDoctorsPaitents(){
            await axios.get(`${IP}/get/paitents/doctor`,{
                params:{
                    doctor_id:location.state.id
                }
            })
            .then((response)=>{
                console.log(response.data)
            })
        }

    return(
        <>Dashboard </>
    )
}

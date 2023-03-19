
import axios from "axios"
import { IP } from "../configs/configs"

export default function Paitents({data,role}) {
    
    async function getPatientsInfo(patient){
        await axios.get(`${IP}/get/patients/file`,{
            params:{
                given_id: patient.Paitent_Id,
                given_role: role
            }
        })
        .then((response)=>{
            console.log(response.data)
        })
        .catch(err=>console.log(err))
    }

    return (
        <>
            <div style={{width:"100%",display:'flex',flexDirection:'column',alignItems:"center",}}>
                <div style={{width:'50%'}}>
            {data.map((paitent)=>{
                return(
                        <div onClick={()=>getPatientsInfo(paitent)} class="patient-card">
                            <span stlye={{float:"left"}}>
                                {paitent.Paitent_Forename}
                                {paitent.Paitent_Surname}
                            </span>
                            <span style={{float:"right",marginRight:"10px"}}>
                                Ward:{paitent.Ward_Id}
                            </span>                            
                        </div>
                        
                )
            })}
            </div>
                        
                        </div>
        </>
    )
}


export default function Paitents({data}) {
    
    console.log(data)
    return (
        <>
            <div style={{width:"100%",display:'flex',flexDirection:'column',alignItems:"center",}}>
                <div style={{width:'50%'}}>
            {data.map((paitent)=>{
                return(
                        <div class="patient-card">
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

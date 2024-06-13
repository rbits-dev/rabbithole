import Spiner from "../componants/Spiner"


function ConfirmationDialog({message}) {
    return (
        <>
            <div>
                {/* <h1 className="text-center heading mb10"  style={{fontSize:'10px'}}>
                    THE RBITSHole
                </h1> */}
                <h2 className="text-center heading mb10" style={{fontSize:'12px'}}>
                    Wallet Confirmation
                </h2>
                <div>
                    <Spiner/>
                </div>
                <div className="text-center">
                    <button className="matchbutton" >
                        {message}
                    </button>
                </div>
                <h3 className="text-center heading mb10 mt10" style={{fontSize:'6px'}}>
                   Check Carefully
                </h3>
                {/* <div className="text-center">
                    <button className="matchbutton" style={{width:"fit-content",margin:" 1rem auto 2rem"}}>
                        Start Breeding
                    </button>
                </div> */}
            </div>
        </>
    )
}

export default ConfirmationDialog
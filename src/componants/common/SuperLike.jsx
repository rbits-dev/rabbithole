


function SuperLike({data}) {
    return (
        <>
           
            <div className="  align-items-center text-center  wp100 justify-center " style={{width:"100%", display:"flex",gap:"10px"}} >
                <div className="icon icon1 mb-0">
                    <button className="tooltip">
                        <img className="icon-change icon-change1" src="/assets/siteimage/danger.jpg" width="42px" alt="" />
                        <span className="tooltiptext tooltiptextdislike">Dislike</span>
                    </button>
                </div>
                <div className="icon icon1" >
                    <button className="tooltip">
                        <img className="icon-change icon-change1" src="/assets/siteimage/yellowfire.jpg" width="42px" alt="" />
                        <span className="tooltiptext tooltiptextsuper">Super Like</span>
                    </button>
                </div>
                <div className="icon icon1"  >
                    <button className="tooltip">
                        <img className="icon-change icon-change1" src="/assets/siteimage/greenlove.jpg" width="42px" alt="" />
                        <span className="tooltiptext tooltiptextlike">Like</span>
                    </button>
                </div>
            </div>
            
        </>
    )
}

export default SuperLike
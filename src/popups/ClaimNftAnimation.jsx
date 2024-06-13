


function ClaimNftAnimation() {
    return (
        <>
            <div>
                <div className="text-center">
                    <video width="800" height="500" autoPlay loop muted style={{ maxWidth: '100%' }}>
                        <source src="https://ik.imagekit.io/2krrx9ghk/wood.mp4?updatedAt=1717141016912" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="d-flex gap-3 mt15" style={{justifyContent:"center",alignContent:"center"}}>
                    <button className="btn btn-outline-primary btn-outline-primaryp kde disconnect-btn claimnftbtn">
                        View Family Tree
                    </button>
                </div>
            </div>

        </>
    )
}

export default ClaimNftAnimation
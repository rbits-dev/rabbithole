import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
function WrongChainSelected({ message }) {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-center heading mb10" style={{ fontSize: "10px" }} >{message}</h2>
        <ConnectButton chainStatus={"full"}/>
      </div>
      <h3 className="text-center heading mb10 mt10" style={{ fontSize: "6px" }}>
        Check Carefully
      </h3>
      {/* <div className="text-center">
                    <button className="matchbutton" style={{width:"fit-content",margin:" 1rem auto 2rem"}}>
                        Start Breeding
                    </button>
                </div> */}
    </div>
  );
}

export default WrongChainSelected;

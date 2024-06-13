import React from "react";

function ConfirmationYesNo({ message,onClose }) {
  return (
    <div>
      <div className="text-center">
        <h3
          className="text-center heading mb10 mt10"
          style={{ fontSize: "15px" }}
        >
          {message}
        </h3>
      </div>
      <div className="d-flex gap-3">
    
      <button  onClick={()=>onClose(false)} className="matchbutton bg-danger yesnobutton">
        No
      </button>
      <button onClick={()=>onClose(true)} className="matchbutton bg-success yesnobutton">
        Yes
      </button>
      </div>
    </div>
  );
}

export default ConfirmationYesNo;

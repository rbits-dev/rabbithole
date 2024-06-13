import React from "react";
import Spiner from "../componants/Spiner";

function SuperLikeConfirmationDialog({ message }) {
  return (
    <div>
      <h2 className="text-center heading mb10" style={{ fontSize: "10px" }}>
        Wallet Confirmation
      </h2>
      <div>
        <Spiner />
      </div>
      <div className="text-center">
        <button className="matchbutton" style={{ width: "300px" }}>
          {message}
        </button>
      </div>
      <h3 className="text-center heading mb10 mt10" style={{ fontSize: "6px" }}>
        In the Breeding Room, giving a Super Like is a way to tell the other
        Ra8bit that you are especially interested in them. Your possible future
        match will receive a notification and you can start to mingle! If you
        accept the transaction RA8BIT will be deducted from your balance.
      </h3>
      <h3 className="text-center heading mb10 mt10" style={{ fontSize: "6px" }}>
        Please standby
      </h3>
    </div>
  );
}

export default SuperLikeConfirmationDialog;

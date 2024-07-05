import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import PopupModals from "../componants/common/PopupModals";
import ConfirmationDialog from "./ConfirmationDialog";
import { toast } from "react-toastify";
import { blockConfig } from "../config/BlockChainConfig";
import BRABI from "../abis/breeding.json";
import { post } from "../services/ApiService";
import useWaitForTransaction from "../hooks/useWaitForTransaction";

function WaitingTimeConvertForUnderBreeding({
  item,
  setHasBreedReady,
  apiCall,
  setIsShowAnimi
}) {
  const {waitForTransaction} = useWaitForTransaction()
  
  const { chainId } = useAccount();
  const [days, setDays] = useState("--");
  const [hours, setHours] = useState("--");
  const [minutes, setMinutes] = useState("--");
  const [seconds, setSeconds] = useState("--");
  const { writeContractAsync } = useWriteContract();
  const [isTransaction, setIsTransaction] = useState(false);
  const [txMessage, setTxMessage] = useState("Please wait...");
  const [isBreedEnd, setIsBreedEnd] = useState(false);

  //HANDLE TO CLAIM NFT
  const handleClaimNft = async () => {
    try {
      setIsTransaction(true);
      setTxMessage("Waiting for transaction to complete...");
      const txhash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "claimNft",
        args: [item.breedId, item.isDead],
      });
      await waitForTransaction(txhash);
      await post("verify-hash", {
        tnxHash: txhash,
        chainId: chainId.toString(),
        eventName: "ClaimNft",
      });

      setTimeout(() => {
        if (item.isDead) {
          // toast.error(item.deadMessage);
        } else {
          toast.success("Nft claim successfully.");
        }
        setIsTransaction(false);
        if (setIsShowAnimi) {
          setIsShowAnimi(true)
        }
        if (apiCall) {
          apiCall();
        }
      }, 15000);
    } catch (error) {
      setIsTransaction(false);
      setTxMessage("Please Wait...");
      toast.error(error?.details || error.shortMessage);
      console.log(error);
    }
  };

  const handleDialogClose = () => {
    setIsTransaction(false);
  };

  useEffect(() => {
    (async () => {
      const endTime = item.endTime * 1000;
      const intervalId = setInterval(() => {
        const currentTime = new Date().getTime();
        const distance = endTime - currentTime;
        const calculatedDays = Math.floor(distance / (1000 * 60 * 60 * 24));
        const calculatedHours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const calculatedMinutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        );
        const calculatedSeconds = Math.floor((distance % (1000 * 60)) / 1000);

        setDays(calculatedDays < 10 ? "0" + calculatedDays : calculatedDays);
        setHours(
          calculatedHours < 10 ? "0" + calculatedHours : calculatedHours
        );
        setMinutes(
          calculatedMinutes < 10 ? "0" + calculatedMinutes : calculatedMinutes
        );
        setSeconds(
          calculatedSeconds < 10 ? "0" + calculatedSeconds : calculatedSeconds
        );

        if (calculatedDays < 0) {
          setDays("--");
          setHours("--");
          setMinutes("--");
          setSeconds("--");
          setIsBreedEnd(true);
          clearInterval(intervalId);
          setHasBreedReady && setHasBreedReady(true);
        }
      }, 1000);
    })();
  }, []);
  return (
    <>
      {isTransaction && (
        <PopupModals open={true} onDialogClose={handleDialogClose}>
          <ConfirmationDialog message={txMessage} />
        </PopupModals>
      )}
      <div className="text-center">
        {!isBreedEnd && (
          <div>
            <h4 className="text-primary">
              Waiting Time <br />
              {days}:{hours}:{minutes}:{seconds}
            </h4>
          </div>
        )}
        {isBreedEnd && item.isClaim == 0 && (
          <div className="">
            <button
              onClick={handleClaimNft}
              className="btn-primary bg-success mb0"
            >
              {item.isPaying ? "Claim new NFT" : "Claim"}
            </button>
          </div>
        )}
        {isBreedEnd && item.isClaim == 1 && item.isPaying === false && (
          <div className="">
            <button className="btn-primary bg-success mb0">{"claimed"}</button>
          </div>
        )}
        {/* <div >
        <button className="btn-primary bg-dark">Claimed</button>
    </div> */}
      </div>
    </>
  );
}

export default WaitingTimeConvertForUnderBreeding;

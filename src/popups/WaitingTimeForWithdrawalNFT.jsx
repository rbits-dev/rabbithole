import { readContract } from "@wagmi/core";
import { configRead } from "../App";
import { blockConfig } from "../config/BlockChainConfig";
import BRABI from "../abis/breeding.json";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { post } from "../services/ApiService";
import { waitForTransaction } from "../utils/waitForTransaction";
import { toast } from "react-toastify";
import PopupModals from "../componants/common/PopupModals";
import ConfirmationDialog from "../popups/ConfirmationDialog";

function WaitingTimeForWithdrawalNFT({ item,apiCall }) {
  const { chainId } = useAccount();
  const [days, setDays] = useState("--");
  const [hours, setHours] = useState("--");
  const [minutes, setMinutes] = useState("--");
  const [seconds, setSeconds] = useState("--");
  const { writeContractAsync } = useWriteContract();
  const [isTransaction, setIsTransaction] = useState(false);
  const [txMessage, setTxMessage] = useState("Please wait...");
  const [isWidthrawalTimeEnded, setIsWidthrawalTimeEnded] = useState(false);

  //GET BREED TIME
  const getBreedTime = async () => {
    try {
      const btime = await readContract(configRead, {
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "breedingTime",
      });
      return Number(btime);
    } catch (error) {
      return 0;
    }
  };

  //HANDLE TO CLAIM PENDIGN TOKENS
  const handleClaimPendingTokens = async () => {
    try {
      setIsTransaction(true);

      setTxMessage("Waiting for transaction to complete...");
      const txhash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "withdrawalNft",
        args: [item.breedId],
      });
      await waitForTransaction(txhash);
      await post("verify-hash", {
        tnxHash: txhash,
        chainId: chainId.toString(),
        eventName: "WithdrawalNft",
      });
      setTimeout(() => {
         apiCall()
        toast.success("Nft token claim successfully.");
        setIsTransaction(false);
      }, 30000);
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
      const ssdTime = await getBreedTime();
      let breedTime = ssdTime * 1000;
      let startDate = new Date(item.claimTime * 1000).getTime();
      const intervalId = setInterval(() => {
        let currentDate = new Date().getTime();
        let time = currentDate - startDate;
        if (time > breedTime) {
          setIsWidthrawalTimeEnded(true);
          clearInterval(intervalId);
        } else {
          const distance = breedTime - time;
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
            setIsWidthrawalTimeEnded(true);
            clearInterval(intervalId);
          }
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
        <div>
          {!isWidthrawalTimeEnded && (
            <div className="superlikeheading">
              <h4 className="text-primary mb0">
                Waiting Time: <br/>{days}:{hours}:{minutes}:{seconds}
              </h4>
            </div>
          )}
        </div>
        {isWidthrawalTimeEnded && item.status === 0 && item.isClaim && (
          <>
            <button
              className="btn-primary bg-danger mb0"
              onClick={handleClaimPendingTokens}
            >
              cancel
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default WaitingTimeForWithdrawalNFT;

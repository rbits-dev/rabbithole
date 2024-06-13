import { readContract } from "@wagmi/core";
import { checkNftUnderBreeding, configRead } from "../App";
import { blockConfig } from "../config/BlockChainConfig";
import BRABI from "../abis/breeding.json";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { post } from "../services/ApiService";
import { waitForTransaction } from "../utils/waitForTransaction";
import { toast } from "react-toastify";
import PopupModals from "../componants/common/PopupModals";
import ConfirmationDialog from "../popups/ConfirmationDialog";
import { useNavigate } from "react-router-dom";

function WaitingTimeForCliam({ item, isType,apiCall }) {
  const userData =
    localStorage.getItem("userData") &&
    JSON.parse(localStorage.getItem("userData"));
  const { chainId } = useAccount();
  const [days, setDays] = useState("--");
  const [hours, setHours] = useState("--");
  const [minutes, setMinutes] = useState("--");
  const [seconds, setSeconds] = useState("--");
  const { writeContractAsync } = useWriteContract();
  const [isTransaction, setIsTransaction] = useState(false);
  const [txMessage, setTxMessage] = useState("Please wait...");
  const [isSuperLikeProcessEnded, setIsSuperLikeProcessEnded] = useState(false);
  const navigate = useNavigate();
  const getSuperLikeClaimTime = async () => {
    try {
      const time = await readContract(configRead, {
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "waitFprSuperLikeTime",
      });
      return Number(time);
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const getSuperLikeDetails = async () => {
    try {
      const sd = await readContract(configRead, {
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "SuperlikeDetails",
        args: [item.superLikeNftId],
      });
      return Number(sd[1]);
    } catch (error) {
      return 0;
    }
  };
  //HANDLE TO CLAIM PENDIGN TOKENS
  const handleClaimPendingTokens = async () => {
    try {
      setIsTransaction(true);
      const getSignature = await post("claim-superlike-signature", {
        userNftId: item.userNftId?.toString(),
      });
      const { seed, signature } = getSignature.data;
      setTxMessage("Waiting for transaction to complete...");
      const txhash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "claimPendingTokensFromSuperLike",
        args: [
          userData.nftId,
          userData.contractAddress,
          item.nftId,
          item.contractAddress,
          item.userAddress,
          seed,
          item.superLikeNftId,
          signature,
        ],
      });
      await waitForTransaction(txhash);
      await post("verify-hash", {
        tnxHash: txhash,
        chainId: chainId.toString(),
        eventName: "claimPendingTokensFromSuperLike",
      });
      setTimeout(() => {
        toast.success("Nft token claim successfully.");
        setIsTransaction(false);
         apiCall()
      }, 30000);
    } catch (error) {
      setIsTransaction(false);
      setTxMessage("Please Wait...");
      const result = await checkNftUnderBreeding(
        chainId,
        userData.contractAddress,
        userData.nftId
      );
      if (result) {
        toast.error("NFT under breeding you can't superLike");
      } else {
        toast.error(error.details || error.shortMessage);
      }
      console.log(error);
    }
  };
  //HANDLE TO CLAIM PENDIGN TOKENS
  const handleAcceptSuperLike = async () => {
    try {
      setIsTransaction(true);
      const getSignature = await post("accept-superlike-signature", {
        userNftId: item.userNftId?.toString(),
      });
      const { seed, signature } = getSignature.data;
      setTxMessage("Waiting for transaction to complete...");
      const txhash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "acceptSuperLike",
        args: [
          item.nftId,
          item.contractAddress,
          item.userAddress,
          userData.nftId,
          userData.contractAddress,
          seed,
          item.superLikeNftId,
          signature,
        ],
      });
      await waitForTransaction(txhash);
      await post("verify-hash", {
        tnxHash: txhash,
        chainId: chainId.toString(),
        eventName: "SuperLikeResponse",
      });
      setTimeout(() => {
        toast.success("super like accepted successfully.");
        navigate(`/selected-target/${item.contractAddress}/${item.nftId}/0`);
        setIsTransaction(false);
        apiCall()
      }, 30000);
    } catch (error) {
      setIsTransaction(false);
      setTxMessage("Please Wait...");
      const result = await checkNftUnderBreeding(
        chainId,
        userData.contractAddress,
        userData.nftId
      );
      if (result) {
        toast.error("NFT is under breeding you can't accept superLike.");
      } else {
        toast.error(error.details || error.shortMessage);
      }
    }
  };
  //HANDLE TO CLAIM PENDIGN TOKENS
  const handleRejectSuperLike = async () => {
    try {
      setIsTransaction(true);
      const getSignature = await post("reject-superlike-signature", {
        userNftId: item.userNftId?.toString(),
      });
      const { seed, signature } = getSignature.data;
      setTxMessage("Waiting for transaction to complete...");
      const txhash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "rejectSuperLike",
        args: [
          item.nftId,
          item.contractAddress,
          item.userAddress,
          userData.nftId,
          userData.contractAddress,
          seed,
          item.superLikeNftId,
          signature,
        ],
      });
      await waitForTransaction(txhash);
      await post("verify-hash", {
        tnxHash: txhash,
        chainId: chainId.toString(),
        eventName: "SuperLikeResponse",
      });
      setTimeout(() => {
        toast.success("super like rejected successfully.");
        setIsTransaction(false);
        apiCall()

      }, 30000);
    } catch (error) {
      setIsTransaction(false);
      setTxMessage("Please Wait...");
      console.log(error);
      const result = await checkNftUnderBreeding(
        chainId,
        userData.contractAddress,
        userData.nftId
      );
      if (result) {
        toast.error("NFT is under breeding you can't reject superLike.");
      } else {
        toast.error(error.details || error.shortMessage);
      }
    }
  };
  // HANDLE DIALOG CLOSE
  const handleDialogClose = () => {
    setIsTransaction(false);
  };

  useEffect(() => {
    (async () => {
      const timeSL = await getSuperLikeDetails();
      const ssdTime = await getSuperLikeClaimTime();
      let superLikeTime = ssdTime * 1000;
      let startDate = new Date(timeSL * 1000).getTime();
      const intervalId = setInterval(() => {
        let currentDate = new Date().getTime();
        let time = currentDate - startDate;
        if (time > superLikeTime) {
          setIsSuperLikeProcessEnded(true);
          clearInterval(intervalId);
        } else {
          const distance = superLikeTime - time;
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
            setIsSuperLikeProcessEnded(true);
            clearInterval(intervalId);
            apiCall()
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
          {!isSuperLikeProcessEnded && item.status==1 && (
            <div className="superlikeheading">
              <h4 className="text-primary">
                Waiting Time:<br/> {days}:{hours}:{minutes}:{seconds}
              </h4>
            </div>
          )}
        </div>
        {isType == 0 && isSuperLikeProcessEnded && item.status === 1 && (
          <>
            <button
              className="btn-primary bg-danger"
              onClick={handleClaimPendingTokens}
            >
              Cashed In
            </button>
            {/* <button className="btn-primary bg-dark">cancelled</button> */}
          </>
        )}
        {isType == 0 && isSuperLikeProcessEnded && item.status === 2 && (
          <>
            <button className="btn-primary bg-success">Accepted</button>
          </>
        )}
        {isType == 0 && isSuperLikeProcessEnded && item.status === 3 && (
          <>
            <button className="btn-primary bg-danger">Rejected</button>
          </>
        )}
        {isType == 0 && isSuperLikeProcessEnded && item.status === 4 && (
          <>
            <button className="btn-primary bg-success">Claimed</button>
          </>
        )}
        {isType == 1 && item.status == 1 && (
          <div className="mt15">
            <button
              className="btn-primary bg-success"
              onClick={handleAcceptSuperLike}
            >
              Accept
            </button>
            <button
              className="btn-primary bg-danger"
              onClick={handleRejectSuperLike}
            >
              Reject
            </button>
          </div>
        )}
        {isType == 1 && item.status == 2 && (
          <button className="btn-primary bg-success">Accepted</button>
        )}
        {isType == 1 && item.status == 3 && (
          <button className="btn-primary bg-danger">Rejected</button>
        )}
        {isType == 1 && item.status == 4 && (
          <button className="btn-primary bg-success">Claimed</button>
        )}

        <div></div>
      </div>
    </>
  );
}

export default WaitingTimeForCliam;

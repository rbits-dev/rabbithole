import { useState } from "react";
import Layout from "../componants/common/Layout";
import PopupModals from "../componants/common/PopupModals";

import ConfirmationDialog from "../popups/ConfirmationDialog";
import { useParams, useNavigate } from "react-router";
import { get, post } from "../services/ApiService";
import { useEffect } from "react";
import { blockConfig } from "../config/BlockChainConfig";
import { readContract } from "@wagmi/core";
import { checkNftUnderBreeding, configRead } from "../App";
import BRABI from "../abis/breeding.json";
import TOKEN_ABI from "../abis/ratbitsToken.json";
import NFT_ABI from "../abis/nft.json";
import { useAccount, useWriteContract } from "wagmi";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import ImageWithFallback from "../componants/common/ImageWithFallback";
import ConfirmationYesNo from "../popups/ConfirmationYesNo";
import CaretDisplay from "../componants/common/CaretDisplay";
import useWaitForTransaction from "../hooks/useWaitForTransaction";


function TargetSelect() {
  const {waitForTransaction} = useWaitForTransaction()
  const { chainId, address } = useAccount();
  const { contractAddress, nftId, breedId } = useParams();
  const [isTransaction, setIsTransaction] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [breedInfoList, setBreedInfoList] = useState(null);
  const [txMessage, setTxMessage] = useState("Please wait...");
  const [isPaying, setIsPaying] = useState(true);
  const { writeContractAsync } = useWriteContract();
  const userData =
    localStorage.getItem("userData") &&
    JSON.parse(localStorage.getItem("userData"));
  const [fromUser, setFromUser] = useState(null);
  const [toUser, setToUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const getAllData = async () => {
    try {
      setIsLoading(true);
      const [profileInfo1, profileInfo2] = await Promise.all([
        post(`get-profile-info`, {
          contractAddress: userData.contractAddress,
          nftId: userData.nftId?.toString(),
          chainId: chainId?.toString(),
          tokenUri: null
        }),
        post(`get-profile-info`, {
          contractAddress: contractAddress,
          nftId: nftId?.toString(),
          chainId: chainId?.toString(),
          tokenUri: null
        })
      ]);
      setFromUser(profileInfo1.data);
      setToUser(profileInfo2.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  function handleDialogClose() {
    setIsTransaction(false);
  }

  //handle down to rabbit hole
  const handleDownToRabitHole = async () => {
    try {
      if (breedId == 0) {
        handleBreedingRoomFirst();
      } else {
        if (!isPaying && Number(breedInfoList[7]) == 0) {
          setIsConfirm(true);
        } else {
          handleBreedingRoomSecond();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //getBreeding info
  const getBreedingInfo = async () => {
    try {
      const result = await readContract(configRead, {
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "breedInfoList",
        args: [breedId],
      });
      setBreedInfoList(result);
    } catch (error) {
      console.log(error);
      // return error
    }
  };

  //handle breeding room first
  const handleBreedingRoomFirst = async () => {
    try {
      const amount = await calculateCost();
      const userBalance = await checkTokenBalance();
      if (amount > userBalance)
        return toast.error(`to send ratbit for breeding need ${Number(amount) / 1e9} Ra8bits token`);
      setIsTransaction(true);
      setTxMessage("Checking Allowance...");
      const allowance = await checkAllowance();
      if (amount > allowance) {
        setTxMessage("Getting Approval...");
        await setApproval(amount);
      }
      setTxMessage("Waiting for NFT approval.");
      const isApprove = await isApproveForAll(fromUser.contractAddress);
      if (!isApprove) {
        await setApproveForAll(fromUser.contractAddress);
      }

      setTxMessage("Waiting for transaction to complete");

      const tnxHash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "sendToBreedingRoomFirst",
        args: [
          fromUser.id,
          toUser.id,
          toUser.userAddress,
          0,
          fromUser.contractAddress,
          toUser.contractAddress,
          isPaying,
        ],
      });
      await waitForTransaction(tnxHash);
      await post("verify-hash", {
        tnxHash: tnxHash,
        chainId: chainId.toString(),
        eventName: "BreedParentA",
      });
      setTimeout(() => {
        setIsTransaction(false);
        toast.success("Send to breeding successfully.");
        navigate("/breeding-room?tab=0");
      }, 15000);
    } catch (error) {
      const result = await checkNftUnderBreeding(
        chainId,
        fromUser.contractAddress,
        fromUser.nftId
      );
      if (result) {
        toast.error("NFT already under breeding.");
      } else {
        toast.error(error.details || error.shortMessage);
      }
      setIsTransaction(false);
      console.log(error);
    }
  };

  //handle breeding room second
  const handleBreedingRoomSecond = async () => {
    try {
      const amount = await calculateCost();
      const userBalance = await checkTokenBalance();
      if (amount > userBalance)
        return toast.error(`to send ratbit for breeding need ${Number(amount) / 1e9} Ra8bits token`);
      setIsTransaction(true);
      setTxMessage("Checking Allowance...");
      const allowance = await checkAllowance();
      if (amount > allowance) {
        setTxMessage("Getting Approval...");
        await setApproval(amount);
      }

      setTxMessage("Waiting for NFT approval.");
      const isApprove = await isApproveForAll(fromUser.contractAddress);
      if (!isApprove) {
        await setApproveForAll(fromUser.contractAddress);
      }

      setTxMessage("Waiting for transaction to complete");
      const tnxHash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "sendToBreedingRoomSecond",
        args: [0, breedId, isPaying],
      });
      await waitForTransaction(tnxHash);
      await post("verify-hash", {
        tnxHash: tnxHash,
        chainId: chainId.toString(),
        eventName: "BreedParentB",
      });
      setTimeout(() => {
        setIsTransaction(false);
        toast.success("Send to breeding successfully.");
        navigate("/breeding-room?tab=1");
      }, 15000);
    } catch (error) {
      const result = await checkNftUnderBreeding(
        chainId,
        fromUser.contractAddress,
        fromUser.nftId
      );
      if (result) {
        toast.error("NFT under breeding you can't superLike");
      } else {
        toast.error(error.details || error.shortMessage);
      }
      setIsTransaction(false);
      console.log(error);
    }
    
  };

  const calculateCost = async () => {
    try {
      const cost = await readContract(configRead, {
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "calculateCost",
        args: [fromUser.id, toUser.id, 0, isPaying],
      });
      return cost;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const checkTokenBalance = async () => {
    try {
      const tokenBalace = await readContract(configRead, {
        abi: TOKEN_ABI,
        address: blockConfig[chainId].ra8BitsToken,
        functionName: "balanceOf",
        args: [address],
      });
      return tokenBalace;
    } catch (error) {
      console.log(error);

      return 0;
    }
  };

  const checkAllowance = async () => {
    try {
      const tokenBalace = await readContract(configRead, {
        abi: TOKEN_ABI,
        address: blockConfig[chainId].ra8BitsToken,
        functionName: "allowance",
        args: [address, blockConfig[chainId].breedingAddress],
      });
      return tokenBalace;
    } catch (error) {
      console.log(error);

      return 0;
    }
  };

  const setApproval = async (amount) => {
    try {
      const approval = await writeContractAsync({
        abi: TOKEN_ABI,
        address: blockConfig[chainId].ra8BitsToken,
        functionName: "approve",
        args: [blockConfig[chainId].breedingAddress, amount],
      });
      await waitForTransaction(approval);
      return approval;
    } catch (error) {
      console.log(error);
      toast.error(error.details);
      throw error;
    }
  };

  const isApproveForAll = async (nftAddress) => {
    try {
      const isApp = await readContract(configRead, {
        abi: NFT_ABI,
        address: nftAddress,
        functionName: "isApprovedForAll",
        args: [address, blockConfig[chainId].breedingAddress],
      });
      return isApp;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const setApproveForAll = async (nftAddress) => {
    try {
      const tnxHash = await writeContractAsync({
        abi: NFT_ABI,
        address: nftAddress,
        functionName: "setApprovalForAll",
        args: [blockConfig[chainId].breedingAddress, true],
      });
      await waitForTransaction(tnxHash);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  //handleConfirmationClose
  const handleConfirmationClose = (apiCall) => {
    if (apiCall) {
      handleBreedingRoomSecond();
    }
    setIsConfirm(false);
  };

  useEffect(() => {
    getAllData();
    if (breedId != "0") {
      getBreedingInfo();
    }
  }, []);

  return (
    <>
      {isTransaction && (
        <PopupModals
          open={true}
          onDialogClose={handleDialogClose}
        >
          <ConfirmationDialog message={txMessage} />
        </PopupModals>
      )}
      {isConfirm && (
        <PopupModals open={true} onDialogClose={handleConfirmationClose}>
          <ConfirmationYesNo
            isCloseBtn={true}
            message={`${fromUser.nickname} is not paying are you sure to breed ?`}
            onClose={handleConfirmationClose}
          />
        </PopupModals>
      )}
      <Layout>
        <section className="inner inn inne1">
          <div className="intro introc introc1 mt0">
            <div className="waveWrapper banner p-t-0  waveAnimation ">
              <div className="flex-container  text-center">
                <div className="">
                  <div className="heading text-white">
                    <h3 className=" headings text-uppercase">
                      Selected Target
                    </h3>
                  </div>

                  <div className="flex-containers">
                    <div className="flex-item-left dflex">
                      <div className="my-profile m10 dinline text-center">
                        <div style={{ position: "relative" }}>
                          <div className="yourprofile">You</div>
                          {!isLoading && (
                            <ImageWithFallback
                              src={fromUser?.image}
                              alt={fromUser?.nickname}
                              className="imgclassName imgloader"
                            />
                          )}
                          {isLoading && (
                            <div className="skeleton-img">
                            <Skeleton
                              width={300}
                              baseColor="#0905149c"
                              highlightColor="#321241d4"
                              height={298}
                            />
                            </div>
                          )}
                        </div>
                        <div className="mt15  d-flex align-item-center justify-content-center flex-col">
                          <h4
                            className="text-white head title  title-target1 mb0"
                            style={{ fontSize: "12px" }}
                          >
                            {fromUser?.nickname}
                          </h4>
                          {/* <h3
                            className="text-white head title title-target1  mb0"
                            style={{ fontSize: "12px" }}
                          >
                            {fromUser?.description}
                         </h3> */}
                        </div>

                        <div className="white-background">
                          <div
                            className="left heading p-l-5"
                            style={{ fontSize: "8px" }}
                          >
                            <p className="mb-0">Rarity</p>
                            <p className="m-t-0 mb-0">Score</p>
                          </div>

                          <CaretDisplay value={fromUser?.rarityPoints} className={'right d-flex m-l-10'} style={{ alignItems: "center" }} />

                        </div>
                      </div>
                    </div>
                    <div className="here"></div>
                    <div className="flex-item-right dflex">
                      <div className="other-profile m10 dinline text-center">
                        <div style={{ position: "relative" }}>
                          <div className="yourprofile">the other</div>
                          {!isLoading && (
                            <ImageWithFallback
                              src={toUser?.image}
                              alt={toUser?.nickname}
                              className="imgclassName imgloader"
                            />
                          )}
                          {isLoading && (
                            <div className="skeleton-img">
                            <Skeleton
                              width={300}
                              baseColor="#0905149c"
                              highlightColor="#321241d4"
                              height={298}
                            />
                            </div>
                          )}
                        </div>
                        <div className="mt15  d-flex align-item-center justify-content-center flex-col">
                          <h4
                            className="text-white head title mb0  title-target1"
                            style={{ fontSize: "12px", marginBottom: "0px" }}
                          >
                            {toUser?.nickname}
                          </h4>
                          {/* <h3
                            className="text-white head title mb0  title-target1"
                            style={{ fontSize: "12px", marginBottom: "0px" }}
                          >
                            {toUser?.description}
                             </h3> */}
                        </div>
                        <div className="white-background">
                          <div
                            className="left heading p-l-5"
                            style={{ fontSize: "8px" }}
                          >
                            <p className="mb-0">Rarity</p>
                            <p className="m-t-0 mb-0">Score</p>
                          </div>
                          <CaretDisplay value={toUser?.rarityPoints} className={'right d-flex m-l-10'} style={{ alignItems: "center" }} />

                        </div>
                        {/* <div className="other-profile-name m5">
                                            <div className="other-profile">
                                                <button type="button" className="btn btn-outline-warning" >Harry Buts</button>
                                            </div>
                                        </div>
                                        <div className="flex-col mt10 align-items-center text-center">
                                            <SuperLike />

                                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="freespan">
                    <h4 className="paytuition">Pay Tuition Fee</h4>
                    <div className="checkbox-apple">
                      <input
                        className="yep"
                        id="check-apple"
                        onChange={(e) => setIsPaying(e.currentTarget.checked)}
                        checked={isPaying}
                        type="checkbox"
                      />
                      <label htmlFor="check-apple"></label>
                    </div>
                  </div>
                  <div className="freespan1">
                    <div>
                      <span className="imagediv">
                        <img
                          src={fromUser?.image}
                          alt={fromUser?.name}
                          className="thraitimge"
                        />
                      </span>
                    </div>
                    <button
                      className="matchbutton"
                      style={{ marginTop: "0" }}
                      onClick={handleDownToRabitHole}
                    >
                      Down the Rabbithole
                    </button>
                    <div>
                      <span className="imagediv">
                        <img
                          src={toUser?.image}
                          alt={toUser?.name}
                          className="thraitimge"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="flex-containers">
                    <div className="flex-item-left dflex">
                      <div className="my-profile m10 dinline text-center my-profile1">
                        <div className="traits">
                          <h3 className="thraitheading mb30">TRAITS</h3>

                          <div>
                            {fromUser?.attributes?.length > 0 &&
                              !isLoading &&
                              fromUser?.attributes.map((item) => (
                                <div className="flex justify-center properties mb30">
                                  <p className="mr20 text-right">
                                    {item?.trait_type || item?.key}
                                  </p>
                                  <p className="text-left">{item.value}</p>
                                </div>
                              ))}
                            {isLoading && (
                              <div className="flex justify-center properties mb30">
                                <p className="mr20 text-right">
                                  <Skeleton
                                    baseColor="#0905149c"
                                    highlightColor="#321241d4"
                                    count={15}
                                  />
                                </p>
                                <p className="text-left">
                                  <Skeleton
                                    baseColor="#0905149c"
                                    highlightColor="#321241d4"
                                    count={15}
                                  />
                                </p>
                              </div>
                            )}

                            {/* 
                        <div className=" mt10 properties mb30">
                          <p className="mr20 text-center">
                            character-06283.json
                          </p>
                          <p className="text-center mt5">3436.524390526235</p>
                        </div>
                        <div className=" mt10 properties mb30">
                          <p className="mr20 text-center">Price:</p>
                          <p className="text-center mt5">
                            1,000,000,000,000 Ra8bit
                          </p>
                        </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="here"></div>
                    <div className="flex-item-left dflex">
                      <div className="my-profile m10 dinline text-center my-profile2">
                        <div className="traits">
                          <h3 className="thraitheading mb30">TRAITS</h3>

                          <div>
                            {toUser?.attributes?.length > 0 &&
                              !isLoading &&
                              toUser?.attributes.map((item) => (
                                <div className="flex justify-center properties mb30">
                                  <p className="mr20 text-right">
                                    {item?.trait_type || item?.key}
                                  </p>
                                  <p className="text-left">{item.value}</p>
                                </div>
                              ))}
                            {isLoading && (
                              <div className="flex justify-center properties mb30">
                                <p className="mr20 text-right">
                                  <Skeleton
                                    baseColor="#0905149c"
                                    highlightColor="#321241d4"
                                    count={15}
                                    width={100}
                                  />
                                </p>
                                <p className="text-left">
                                  <Skeleton
                                    baseColor="#0905149c"
                                    highlightColor="#321241d4"
                                    count={15}
                                    width={100}
                                  />
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default TargetSelect;

import Layout from "../componants/common/Layout";
import React, { useMemo, useRef, useState } from "react";
import { get, post } from "../services/ApiService";
import { useEffect } from "react";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";
import { toast } from "react-toastify";
import BRABI from "../abis/breeding.json";
import TOKEN_ABI from "../abis/ratbitsToken.json";
import { blockConfig } from "../config/BlockChainConfig";
import { readContract } from "@wagmi/core";
import { checkNftUnderBreeding, configRead, getCollectionName } from "../App";
import { waitForTransaction } from "../utils/waitForTransaction";
import PopupModals from "../componants/common/PopupModals";
import { useNavigate } from "react-router";
import ConfirmationDialog from "../popups/ConfirmationDialog";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TinderCard from "../componants/common/cardStack";

function SelectBreed() {
  const [isTransaction, setIsTransaction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [txMessage, setTxMessage] = useState("Please wait...");
  const { writeContractAsync } = useWriteContract();
  const { chainId, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [currentIndex, setCurrentIndex] = useState();
  const navigate = useNavigate();
  const userData =
    localStorage.getItem("userData") &&
    JSON.parse(localStorage.getItem("userData"));
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);
  const [profileList, setProfileList] = useState([]);
  const fullFillRef = useRef(null);
  const childRefs = useMemo(
    () =>
      Array(profileList.length)
        .fill(0)
        .map((i) => React.createRef()),
    [profileList]
  );

  const getProfileListing = async () => {
    try {
      setIsLoading(true);
      const result = await get("nft-profile-listing");
      for (let item of result.data.data) {
        const collectionName = await getCollectionNameData(
          item.contractAddress
        );
        item.collectionName = collectionName;
      }
      setProfileList(result.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log();
    }
  };

  useEffect(() => {
    getProfileListing();
    checkToUpgradePlan();
  }, []);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // const canGoBack = currentIndex < db.length - 1

  // const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (dir, item, idx) => {
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    if (dir === "left") return handleDislike(item, idx);
    if (dir === "right") return handleLike(item, idx);
    if (dir === "up") return handleSuperLike(item, idx);
  };

  const swipe = async (dir) => {
    // if (canSwipe && currentIndex < db.length) {
    await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    // }
  };

  // increase current index and show card
  const goBack = async () => {
    // if (!canGoBack) return

    updateCurrentIndex(currentIndex);
    await childRefs[currentIndex].current.restoreCard();
  };

  const handleDislike = async (item, index) => {
    try {
      const result = await post("dislike-nft", {
        chainId,
        userId: item.userId?.toString(),
      });
      toast.success(result.data.message);
      getProfileListing();
      checkToUpgradePlan();
    } catch (e) {
      await goBack();
      console.log(e);
    }
  };

  const handleLike = async (item, index) => {
    try {
      const message = JSON.stringify({
        userId: item.userId?.toString(),
        userAddress: address,
      });
      const signature = await signMessageAsync({
        message: message,
      });
      const result = await post("like-nft", {
        chainId,
        userId: item.userId?.toString(),
        signature,
      });
      toast.success(result.data.message);
      getProfileListing();
      checkToUpgradePlan();
    } catch (e) {
      console.log(e);
      await goBack();
    }
  };

  const handleSuperLike = async (item, index) => {
    try {
      const amount = await getSuperLikeCost();
      const userBalance = await checkTokenBalance();
      if (amount > userBalance)
        return (
          toast.error(
            `to send super like need ${Number(amount) / 1e9} Ra8bits token.`
          ),
          await goBack()
        );
      setIsTransaction(true);
      setTxMessage("Checking Allowance...");
      const allowance = await checkAllowance();
      if (amount > allowance) {
        setTxMessage("Getting Approval...");
        await setApproval(amount);
      }
      setTxMessage("Waiting for transaction to complete");
      const sign = await post("superlike-signature", {
        fromUserId: userData.id?.toString(),
        toUserId: item.userId?.toString(),
      });
      const { seed, signature } = sign.data;
      const tnxHash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "superLikeNFT",
        args: [
          userData.nftId,
          userData.contractAddress,
          item.nftId,
          item.contractAddress,
          item.userAddress,
          seed,
          signature,
        ],
      });
      setTxMessage("Submitting transaction to Blockchain...");
      await waitForTransaction(tnxHash);
      await post("verify-hash", {
        tnxHash: tnxHash,
        chainId: chainId.toString(),
        eventName: "superLike",
      });
      setTimeout(() => {
        toast.success("Super like send successfully");
        setIsTransaction(false);
        setTxMessage("Please wait...");
        getProfileListing();
        checkToUpgradePlan();
      }, 10000);
    } catch (error) {
      await goBack();
      setIsTransaction(false);
      setTxMessage("Please wait...");
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
      toast.error(error.details);
      throw error;
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
      return 0;
    }
  };

  const getSuperLikeCost = async () => {
    try {
      const suprlikeCost = await readContract(configRead, {
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "costForSuperLike",
      });
      return suprlikeCost;
    } catch (error) {
      return 0;
    }
  };

  //HANDLE VIEW MORE
  const handleViewMoreNfts = async () => {
    try {
      const amount = await getTokenAmountForSwiping();
      const userBalance = await checkTokenBalance();
      if (amount > userBalance)
        return (
          toast.error(
            `to view more nft's need  ${Number(amount) / 1e9} Ra8bits token.`
          ),
          await goBack()
        );
      setIsTransaction(true);
      setTxMessage("Checking Allowance...");
      const allowance = await checkAllowance();
      if (amount > allowance) {
        setTxMessage("Getting Approval...");
        await setApproval(amount);
      }
      setTxMessage("Waiting for transaction to complete");
      const tnxHash = await writeContractAsync({
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "sendTokensForSwiping",
        args: [userData.contractAddress, userData.nftId],
      });
      await waitForTransaction(tnxHash);
      await post("verify-hash", {
        tnxHash: tnxHash,
        chainId: chainId.toString(),
        eventName: "SendTokensForSwiping",
      });
      setTimeout(() => {
        toast.success("Now you can swap more nfts.");
        getProfileListing();
        setIsUpgrade(false);
        setIsTransaction(false);
      }, 30000);
    } catch (error) {
      setIsTransaction(false);
      console.log(error);
    }
  };

  //HANDLE TO CHECK
  const checkToUpgradePlan = async () => {
    try {
      const result = await get("check-upgrade-superlike");
      setIsUpgrade(result.data.isNftAvailableForUpgrade);
    } catch (error) {
      console.log();
    }
  };

  //tokenAmountForSwiping
  const getTokenAmountForSwiping = async () => {
    try {
      const amount = await readContract(configRead, {
        abi: BRABI,
        address: blockConfig[chainId].breedingAddress,
        functionName: "tokenAmountForSwiping",
      });
      return amount;
    } catch (error) {
      return 0;
    }
  };

  //HANDLE DIALOG CLOSE
  const handleDialogClose = () => {
    // setIsTransaction(false);
  };

  //HANDLE VIEW PROFILE
  const handleViewProfile = async () => {
    const item = profileList[currentIndex];
    navigate(`/profile/${item.contractAddress}/${item.nftId}`);
  };

  const getCollectionNameData = async (contractAddress) => {
    try {
      const result = await getCollectionName(contractAddress);
      return result;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    setCurrentIndex(profileList.length - 1);
  }, [profileList]);

  return (
    <>
      {isTransaction && (
        <PopupModals open={true} onDialogClose={handleDialogClose}>
          <ConfirmationDialog message={txMessage} />
        </PopupModals>
      )}

      <Layout>
        <div className="inner">
          <div className="no-data">
            <div className="limit-text">
              <h3>You have exceeded the daily limit</h3>
              <div>
                <button className="btn-primary">View More</button>
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div className="heading text-white">
              <h3 className=" headings text-uppercase">
                Like or Dislike Nft's
              </h3>
            </div>
            <div className="section section-nft flex-col">
              {!isLoading && profileList.length !== 0 && (
                <div className="cardContainer cardnft">
                  {profileList.map((item, index) => (
                    <TinderCard
                      onRelease={(dir) => {
                        let cardElement = fullFillRef.current;
                        if (cardElement) {
                          cardElement.classList.remove("likeClass");
                          cardElement.classList.remove("crossClass");
                        }
                      }}
                      ref={childRefs[index]}
                      key={item.name}
                      onSwipe={(dir) => swiped(dir, item, index)}
                      onCardLeftScreen={(dir) => outOfFrame(dir, item, index)}
                      className="swipe"
                      preventSwipe={["down"]}
                      onSwipeRequirementFulfilled={(dir) => {
                        let cardElement = fullFillRef.current;
                        if (cardElement && dir == "right") {
                          console.log("likeClass");
                          cardElement.classList.remove("crossClass");

                          cardElement.classList.add("likeClass");
                        }
                        if (cardElement && dir == "left") {
                          console.log("crossClass");
                          cardElement.classList.remove("likeClass");
                          cardElement.classList.add("crossClass");
                        }
                      }}
                    >
                      <div
                        style={{
                          backgroundImage: `url(${item.imagePath})`,
                        }}
                        className="card card-like"
                      ></div>
                      <div ref={fullFillRef}></div>
                      {index === currentIndex && (
                        <>
                          <div className="mt10 d-flex align-item-center justify-content-center flex-col card-text">
                            <h4 className="text-white head title mb4">
                              {profileList[currentIndex]?.nickname}
                            </h4>
                          </div>

                          <div className="mt15 d-flex align-item-center justify-content-center flex-col card-text-bottom">
                            <h4 className="text-white head title mb4">
                              {profileList[currentIndex]?.collectionName}
                            </h4>
                          </div>
                        </>
                      )}
                    </TinderCard>
                  ))}
                </div>
              )}
              {isLoading && (
                <>
              <div className="cardContainer cardnft">
                  <div className="card-skeleton cardnft">
                    {[...Array(5)].map((_, index) => (
                      <div
                        className="swipe"
                        style={{ border: "1px solid #fff" }}
                      >
                        <Skeleton
                          baseColor="#0905149c"
                          highlightColor="#321241d4"
                          count={1}
                          width={287}
                          height={296}
                        />
                      </div>
                    ))}
                  </div>
              </div>
                </>
              )}
              {!isLoading && profileList.length > 0 && (
                <div className="likes tinderlike">
                  <button className="tooltip" onClick={handleViewProfile}>
                    <img
                      className="icon-change1"
                      src="assets/siteimage/viewProfile.png"
                      width="50px"
                      alt=""
                    />
                    <span className="tooltiptext">View Profile</span>
                  </button>
                  <button className="tooltip" onClick={() => swipe("left")}>
                    <img
                      className="icon-change1"
                      src="assets/siteimage/danger.jpg"
                      width="50px"
                      alt=""
                    />
                    <span className="tooltiptext tooltiptextdislike">
                      Dislike
                    </span>
                  </button>
                  <button className="tooltip" onClick={() => swipe("up")}>
                    <img
                      className="icon-change1"
                      src="assets/siteimage/yellowfire.jpg"
                      width="50px"
                      alt=""
                    />

                    <span className="tooltiptext tooltiptextsuper">
                      Super Like
                    </span>
                  </button>

                  <button className="tooltip" onClick={() => swipe("right")}>
                    <img
                      className="icon-change1"
                      src="assets/siteimage/greenlove.jpg"
                      width="50px"
                      alt=""
                    />
                    <span className="tooltiptext tooltiptextlike">Like</span>
                  </button>
                </div>
              )}
              {isLoading && (
                <>
                  <Skeleton
                    baseColor="#0905149c"
                    highlightColor="#321241d4"
                    count={1}
                    width={300}
                    height={50}
                  />
                </>
              )}
              {profileList.length == 0 && isUpgrade && !isLoading && (
                <>
                  {/* add question mar k here */}
                  <div className="card cardnft d-flex" style={{ margin: "0" }}>
                    <h2 className="question-nft">?</h2>
                  </div>
                  <button
                    className="btn-primary mt15 "
                    onClick={handleViewMoreNfts}
                  >
                    View more
                  </button>
                </>
              )}
              {profileList.length == 0 && !isUpgrade && !isLoading && (
                <div
                  className="notfound notfoundnft"
                  style={{ top: "35%", position: "absolute" }}
                >
                  <h2>No more nft's to show</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
export default SelectBreed;

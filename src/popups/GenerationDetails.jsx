import { Link } from "react-router-dom";
import { get, post } from "../services/ApiService";
import { useState } from "react";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import ImageWithFallback from "../componants/common/ImageWithFallback";
import { useAccount } from "wagmi";
import CaretDisplay from "../componants/common/CaretDisplay";
function GenerationDetails({ data,onClose }) {
  console.log(data);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { chainId } = useAccount();
  const getProfileInfo = async () => {
    try {
      setIsLoading(true);
      const result = await post(`get-profile-info`, {
        contractAddress:data.contractAddress,
        nftId:data.nftId?.toString(),
        chainId: chainId?.toString(),
        tokenUri:null
      });
      setProfileData(result.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, []);
  return (
    <>
    
        <div className="text-center  w-100 divide-area">
          <div className="info info-breeding ">
            {!isLoading && (
              <div className="">
                <div className="heading text-white">
                  <h2 className="text-bold text-uppercase primary-font">
                    {" "}
                    {profileData?.nickname}
                  </h2>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="">
                <div className="heading text-white">
                  <h2 className="text-bold text-uppercase primary-font">
                    <Skeleton
                      baseColor="#0905149c"
                      highlightColor="#321241d4"
                      count={1}
                    />
                  </h2>
                </div>
              </div>
            )}
            <div className="nft-box">
              {!isLoading && (
                <ImageWithFallback
                  src={profileData?.image}
                  alt={profileData?.nickname}
                  className="imgclassName"
                />
              )}
              {isLoading && (
                <Skeleton
                  baseColor="#0905149c"
                  highlightColor="#321241d4"
                  width={274}
                  height={274}
                />
              )}
            </div>

            <div className="rarity-score rounded mt5 ">
              <div className="left heading p8">
                <p className="mb-0" >
                  Rarity <br />
                  Score
                </p>
              </div>
                <CaretDisplay value={data.rarityPoints}/>
            </div>
            <div className="mt15">
              <Link onClick={onClose}
                to={`/generation-chart/${data.contractAddress}/${data.nftId}`}
              >
                <button className="btn-primary">view family tree</button>
              </Link>
            </div>
          </div>
          <div className="Detail breeding-details grow-2">
            <div className="title invisible-md"></div>
            <div className="traits w-100">
              <div className="heading text-white mb30 flex-col">
                <p className=" text-center">Traits</p>
              </div>
              <div>
                {profileData?.attributes?.length > 0 &&
                  !isLoading &&
                  profileData?.attributes.map((item) => (
                    <div className="flex justify-center properties PROGRESS-Table mb30">
                      <p className="mr20 text-right left-side  progress-left ">
                        {item?.trait_type || item?.key}
                      </p>
                      <p className="text-left right-side progress-right ">
                        {item.value}
                      </p>
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
                {/* <div className=" mt10 properties mb30">
                      <p className="mr20 text-center">character-06283.json</p>
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
  
    </>
  );
}

export default GenerationDetails;

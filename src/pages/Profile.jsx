import { Link, useParams } from "react-router-dom";
import Layout from "../componants/common/Layout";
import { post } from "../services/ApiService";
import { useState } from "react";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import ImageWithFallback from "../componants/common/ImageWithFallback";
import { useAccount } from "wagmi";
import { getCollectionName } from "../App";
import CaretDisplay from "../componants/common/CaretDisplay";
function Profile() {
  const { nftId, contractAddress } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const { chainId } = useAccount();

  const getProfileInfo = async () => {
    try {
      setIsLoading(true);
      const result = await post(`get-profile-info`, {
        contractAddress,
        nftId: nftId?.toString(),
        chainId: chainId?.toString(),
        tokenUri: localStorage.getItem("profileUri"),
      });

      const cc = await getCollectionName(contractAddress);
      setCollectionName(cc);
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
      <Layout>
        <section className="inner inner-breeding">
          <div className="intro">
            <div className="waveWrapper banner  waveAnimation waveprofile">
              <div className="text-center divide-area w-100">
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
                  <div className="nft-box nft-box1">
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
                        width={395}
                        height={395}
                      />
                    )}
                  </div>


                  <div className="mt15">
                    {isLoading && (
                      <Skeleton
                        baseColor="#0905149c"
                        highlightColor="#321241d4"
                        count={1}
                      />
                    )}
                    {
                      !isLoading &&
                      <div className=" text-white ">
                        <h2 className="text-bold text-uppercase  head mb0" style={{ marginBottom: "0" }}>
                          {" "}
                          {collectionName}
                        </h2>

                      </div>

                    }
                    {/* {isLoading && (
                      <Skeleton
                        baseColor="#0905149c"
                        highlightColor="#321241d4"
                        count={1}
                      />
                    )}
                    {
                      !isLoading &&
                      
                      <div className="heading text-white">
                         <h2 className="text-bold text-uppercase  head"> {nftId}</h2>
                        </div>
                    } */}
                  </div>

                  {isLoading && (
                    <Skeleton
                      baseColor="#0905149c"
                      highlightColor="#321241d4"
                      count={1}
                    />
                  )}
                  {
                    !isLoading &&
                    <div className="rarity-score rounded mt15 ">
                      <div className="left heading p8">
                        <p className="mb-0">
                          Rarity <br />
                          Score
                        </p>
                      </div>
                      <CaretDisplay value={profileData?.rarityPoints} />
                    </div>
                  }
                  {profileData?.isViewFamilyTree && (
                    <div className="mt15">
                      <Link
                        to={`/generation-chart/${contractAddress}/${nftId}`}
                      >
                        <button className="btn-primary">
                          view family tree
                        </button>
                      </Link>
                    </div>
                  )}


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
                            <p className="mr20 text-right left-side  progress-left">
                              {item?.trait_type || item?.key}
                            </p>
                            <p className="text-left right-side progress-right">
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
                  
                    <div className="flex flex-col  justify-center text-center nft-id ">
                      <p className=" mt10">
                        NFTID
                      </p>
                      <h2 className="text-bold text-uppercase  head mt10 mb10"> {nftId}</h2>
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

export default Profile;

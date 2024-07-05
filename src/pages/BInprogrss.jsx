import Layout from "../componants/common/Layout";
import { get } from "../services/ApiService";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import WaitingTimeConvertForUnderBreeding from "../popups/WaitingTimeConvertForUnderBreeding";
import AnimatedCard from '../componants/AnimatedCard';
import CaretDisplay from "../componants/common/CaretDisplay";

function BInprogrss() {
  const childRef = useRef();
  const { breedId } = useParams();
  const [breedData, setBreedData] = useState(null);
  const [progressPer, setProgressPer] = useState(0);
  const [hasBreedReady, setHasBreedReady] = useState(false);
  const [isShowAnimi, setIsShowAnimi] = useState(false);
  const [breedingMetaData, setBreedingMetaData] = useState(null);
  const [attributes, setAttributes] = useState([
    { key: "background", value: "****" },
    { key: "body", value: "****" },
    { key: "clothes", value: "****" },
    { key: "mouth", value: "****" },
    { key: "sideburns ", value: "****" },
    { key: "eyes", value: "****" },
    { key: "moustache ", value: "****" },
    { key: "shoes", value: "****" },
    { key: "hair or hat", value: "****" },
    { key: "loose part", value: "****" },
  ]);

  //it is used to call child function
  const callChildFunction = () => {
    if (childRef.current) {
      childRef.current.callChildFunction();
    }
  }

  const getBreedInProgressData = async () => {
    try {
      const result = await get(`breed-inprogress/${breedId}`);
      setBreedData(result.data.data);
      setBreedingMetaData(result.data.data.metadata);

    } catch (error) {
      console.log(error);
    }
  };

  //handle progress percetage
  const handleProgressCalculation = (data) => {
    const intervalID = setInterval(() => {
      let startDate = data.startTime * 1000;
      let endDate = data.endTime * 1000;
      let currentDate = new Date();
      let currentOfDate = currentDate.getTime();
      const daysDifference = endDate - startDate;
      const difference = currentOfDate - startDate;
      const result = Math.round((difference / daysDifference) * 100);
      if (result <= 100 && result > 0) {
        setProgressPer(result);
        const index = Math.floor(result / 10);
        const parseAtrributes = JSON.parse(breedingMetaData.attributes);
        if (parseAtrributes.length > 0) {
          const updatedAttributes = attributes;
          for (let i = 0; i <= index && i < attributes.length; i++) {
            updatedAttributes[i].value = parseAtrributes[i].value;
          }
          setAttributes(updatedAttributes);
        }
      } else {
        if (breedingMetaData) {
          const data = JSON.parse(breedingMetaData.attributes);
          setAttributes(data.length > 0 ? data : attributes);
        }
        intervalID && clearInterval(intervalID);
      }
    }, 1000);
  };

  useEffect(() => {
    getBreedInProgressData();
  }, []);


  useEffect(() => {
    if (breedData) {
      handleProgressCalculation(breedData);
    }
  }, [breedingMetaData]);

  useEffect(() => {
    if (breedingMetaData?.image && isShowAnimi) {
      setTimeout(() => {
        callChildFunction()
      }, 500);
    }
  }, [breedingMetaData, isShowAnimi]);

  //breed status 
  const BreedStatus = () => {
    const isBreedReady = hasBreedReady && breedData?.isClaim === 0;
    const isBreedingInProgress = !hasBreedReady;
    const isBreedFailed = breedData?.isPaying && breedData?.isClaim === 1 && breedData?.isDead;

    return (
      <div className="heading text-white flex-col">
        {isBreedReady && (
          <h2 className="text-bold text-uppercase primary-font">Breed Ready</h2>
        )}
        {isBreedingInProgress && (
          <h2 className="text-bold text-uppercase primary-font">Breeding in progress</h2>
        )}
        {isBreedFailed && (
          <h2 className="text-bold text-uppercase primary-font">Breed Failed</h2>
        )}
      </div>
    );
  };

  const backgroundImage = "url('/assets/img/silhouet.webp')";
  const gradient =
    "radial-gradient(circle, rgba(14, 105, 42, 1) 8%, rgba(10, 102, 55, 1) 42%, rgba(0, 56, 17, 1) 88%)";
  const userImageStyle = {
    background: `${gradient}, ${backgroundImage}`,
  };


  return (
    <>
      <Layout>
        <div className="inner inner-breeding">
          <div className="intro">
            <div className="waveWrapper banner  waveAnimation waveprofile">
              <div className="text-center divide-area w-100">
                <div className="info info-breeding">
                  <BreedStatus/>
                  {breedData?.isClaim == 0 && (
                    <div className="userImage" style={userImageStyle}>
                      {hasBreedReady && (
                        <div className="overlay questionMark">
                          <span >?</span>
                        </div>
                      )}
                      {!hasBreedReady && (
                        <div className="user-progress">
                          <h3 className="progress-label">{progressPer}%</h3>
                          <ProgressBar
                            completed={progressPer}
                            className="wrapper"
                            barContainerClassName="container"
                            borderRadius="50px"
                            baseBgColor="#000"
                            bgColor="#00a751"
                            labelClassName="label"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {breedData?.isPaying == false && breedData?.isClaim == 1 && !breedData?.isDead && (
                    <div className="userImage questionImage" style={userImageStyle}>
                      <div className="overlay questionMark">
                        <span>?</span>
                      </div>
                    </div>
                  )}

                  {breedData?.isPaying == true && breedData?.isClaim == 1 && !breedData?.isDead && (
                    <>
                      {
                        !isShowAnimi ?
                          <div
                            className="userImage"
                            style={{
                              background: `url(${breedingMetaData?.image})`,
                            }}
                          ></div> :
                          <AnimatedCard ref={childRef} imagePath={breedingMetaData?.image} />
                      }
                    </>


                  )}

                  {breedData?.isPaying == true &&
                    breedData?.isClaim == 1 &&
                    breedData.isDead && (
                      <div
                        className="userImage"
                        style={{
                          background: `url('/assets/img/dead.jpg')`,
                        }}
                      ></div>
                    )}

                  <div className="head mt15">
                    <h2 className="text-white head mb0" style={{lineHeight:"28px"}}>
                      {breedData?.isPaying == true &&
                        breedData?.isClaim == 1 &&
                        breedData.isDead
                        ? "Unfortunately, the leveret didn't survive..."
                        : breedingMetaData?.name}
                    </h2>
                  </div>
                  <div className="text-center mt15">
                    <h4 className="text-primary waiting-time mb0">
                      {breedData && (
                        <WaitingTimeConvertForUnderBreeding
                          item={breedData}
                          setHasBreedReady={setHasBreedReady}
                          apiCall={getBreedInProgressData}
                          setIsShowAnimi={setIsShowAnimi}
                        />
                      )}
                    </h4>
                  </div>
                  {
                    breedData?.isClaim == 1 && breedData?.isPaying == true && !breedData.isDead &&
                    <div className="white-background mt15">
                      <div
                        className="left heading"
                        style={{ fontSize: "10px", lineHeight: "0.8rem" }}
                      >
                        <p>
                          Rarity <br /> Score
                        </p>
                      </div>


                      <CaretDisplay value={breedData?.rarityPoints} className={'right dflex'} />

                    </div>
                  }
                  {/* {!hasBreedReady && (
                        <>
                          <div className="button-contaier">
                            <div className="confirm progress-confirm">
                              <button type="button" className="btn btn-warning">
                                traits bias
                              </button>
                            </div>
                          </div>
                          <div className="button-contaier">
                            <div className="mb50">
                              <div className="confirm progress-confirm">
                                <button
                                  type="button"
                                  className="btn btn-danger "
                                >
                                  Super Powers
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )} */}

                  {breedData?.isClaim == 1 && breedData?.isPaying == true && !breedData.isDead && (
                    <div className="button-contaier">
                      <div className="confirm progress-confirm">
                        <Link
                          to={`/generation-chart/${breedingMetaData?.gen1NftAddress}/${breedingMetaData?.gen1nftId}`}
                          type="button"
                          className="btn btn-warning"
                          style={{ display: "inline-block" }}
                        >
                          view family tree
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <div className="Detail breeding-details">
                  <div className="heading text-white mb30 flex-col">
                    <h6 className="text-bold text-uppercase">Traits</h6>
                  </div>
                  <div className="paraghraph align-items-center dflex m-t-5">
                    {attributes.map((item) => (
                      <div className="PROGRESS-Table" key={item.key}>
                        <div className="left-side  progress-left">
                          <p className="text-uppercase text-end ">{item.key}</p>
                        </div>
                        <div className="right-side progress-right">
                          <p className="text-uppercase text-start m0">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}{" "}
                    {/* <div className="progress-data">
                          <div className="progress-center">
                            <p className="text-uppercase text-center ">
                              character-06283.json
                            </p>
                          </div>
                          <div className="progress-center">
                            <p className="text-uppercase text-center m0">
                              ****
                            </p>
                          </div>
                        </div>
                        <div className="progress-data">
                          <div className="progress-center">
                            <p className="text-uppercase text-center ">Price</p>
                          </div>
                          <div className="progress-center">
                            <p className="text-uppercase text-center m0">
                              ****
                            </p>
                          </div>
                        </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="inner">
          <div className="intro">
            <div className="waveWrapper banner p-t-0  waveAnimation">
              <div className="flex-container start-section text-center">
                <div className="text-center">
                  <div className="text-center dflex divide-area">
                    <div className="info">
                      <div className="heading text-white flex-col">
                        <h3 className="text-bold text-uppercase primary-font">
                          Breed Failed
                        </h3>
                      </div>
                      <div className="userImage"></div>
                      <div className="head">
                        <h4 className="text-white head">
                          Unfortunately, the leveret didnt survive...
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </Layout>
    </>
  );
}

export default BInprogrss;

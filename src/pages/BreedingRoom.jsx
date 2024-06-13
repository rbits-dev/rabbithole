import { useRef, useState } from "react";
import Layout from "../componants/common/Layout";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link, useSearchParams } from "react-router-dom";
import { get } from "../services/ApiService";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WaitingTimeConvertForUnderBreeding from "../popups/WaitingTimeConvertForUnderBreeding";
import ImageWithFallback from "../componants/common/ImageWithFallback";
import WaitingTimeForWithdrawalNFT from "../popups/WaitingTimeForWithdrawalNFT";

function BreedingRoom() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tabIndex, setTabIndex] = useState(
    (searchParams.get("tab") && parseInt(searchParams.get("tab"))) || 0
  );
  const tabPanelsRefs = useRef([]);
  const [waitingNFTList, setWaitingNFTList] = useState([]);
  const [underBreedingNFTList, setUnderBreedingNFTList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollToTabPanel = () => {
    const selectedTabPanelRef = tabPanelsRefs.current[tabIndex];
    if (selectedTabPanelRef) {
      window.scrollTo({
        top: selectedTabPanelRef.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const getWaingForBreedingNFTList = async () => {
    try {
      setUnderBreedingNFTList([]);
      setIsLoading(true);
      const result = await get("waiting-in-breedingRoom-list");
      setWaitingNFTList(result.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getUnderBreedingNFTList = async () => {
    try {
      setWaitingNFTList([]);
      setIsLoading(true);
      const result = await get("under-in-breedingRoom-list");
      setUnderBreedingNFTList(result.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (tabIndex === 0) {
      getWaingForBreedingNFTList();
    } else {
      getUnderBreedingNFTList();
    }
  }, [tabIndex]);

  useEffect(() => {
    setSearchParams({ tab: tabIndex });
  }, [tabIndex, searchParams]);

  return (
    <>
      <Layout>
      <div className="inner inne1">
      <div className="intro introc1">
            <div className="heading text-white">
              <h3 className=" headings text-uppercase">Breeding Room</h3>
            </div>
            <div>
              <Tabs
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
              >
                <TabList>
                  <Tab onClick={scrollToTabPanel}>WAITING FOR BREEDING</Tab>
                  <Tab onClick={scrollToTabPanel}> UNDER BREEDING </Tab>
                </TabList>

                <div className="tabssection">
                  <TabPanel
                  // ref={(el) => (tabPanelsRefs.current[0] = el)}
                  >
                    <div className="replycards">
                      {waitingNFTList.map((item, index) => (
                        <div key={item.name} className="cardgap">
                          <div style={{ marginRight: " 10px",position:"relative" }} className="superliketab">
                            <ImageWithFallback
                              className="video-fluid"
                              src={item.image}
                              style={{
                                height: "300px",
                                border: "3px solid white",
                              }}
                            />
                            <div className="superlikeheading mt15">
                              <h3 className="text-white text-center mb0 head h-25 ">
                                {item.nickName}
                              </h3>
                            </div>

                            <div className="mt15 ">
                              <h4 className="text-primary mb0 waiting-time">
                                {item.isClaim && (
                                  <WaitingTimeForWithdrawalNFT item={item}  apiCall={getWaingForBreedingNFTList}/>
                                )}
                              </h4>
                              <div className="mt15">
                                <Link
                                  to={`/profile/${item.contractAddress}/${item.nftId}`}
                                >
                                  <button type="button" className="btn-primary">
                                    view Profile
                                  </button>
                                </Link>
                                {!item.isClaim && (
                                  <Link
                                    to={`/selected-target/${
                                      item.contractAddress
                                    }/${item.nftId}/${item?.breedId || 0}`}
                                  >
                                    <button
                                      type="button"
                                      className="btn-primary"
                                    >
                                      Breed
                                    </button>
                                  </Link>
                                )}
                                {/* <div className="mb">
                                <label className="label-primary">Breed</label>
                              </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {waitingNFTList.length == 0 && isLoading && (
                        <>
                          <Skeleton
                            baseColor="#0905149c"
                            highlightColor="#321241d4"
                            count={1}
                            width={220}
                            height={260}
                          />
                          <Skeleton
                            baseColor="#0905149c"
                            highlightColor="#321241d4"
                            count={1}
                            width={220}
                            height={260}
                          />
                          <Skeleton
                            baseColor="#0905149c"
                            highlightColor="#321241d4"
                            count={1}
                            width={220}
                            height={260}
                          />
                          <Skeleton
                            baseColor="#0905149c"
                            highlightColor="#321241d4"
                            count={1}
                            width={220}
                            height={260}
                          />
                        </>
                      )}
                    </div>
                    {waitingNFTList.length == 0 && !isLoading && (
                      <div className="notfound">
                        <h2>Data Not Found</h2>
                      </div>
                    )}
                  </TabPanel>
                  <TabPanel

                  // ref={(el) => (tabPanelsRefs.current[1] = el)}
                  >
                    <div className="replycards">
                      {underBreedingNFTList.map((item, index) => (
                        <div className="cardgap" key={item.nickName}>
                          <div style={{ marginRight: " 10px",position:"relative" }} className="superliketab">
                            <ImageWithFallback
                              className="video-fluid"
                              src={item.image}
                              style={{
                                height: "300px",
                                border: "3px solid white",
                              }}
                            />
                            <div className="superlikeheading mt15">
                              <h3 className="text-white text-center mb0 head h-25 ">
                                {item.nickName}
                              </h3>
                            </div>

                            <div className="mt15">
                              <h4 className="text-primary waiting-time mb0">
                                <WaitingTimeConvertForUnderBreeding
                                  item={item}
                                  isType={1}
                                  apiCall={getUnderBreedingNFTList}
                                />
                              </h4>
                              {/* <Link to={`/profile/${item.contractAddress}/${item.nftId}`}>
                              <button type="button" className="btn-primary">
                                view Profile
                              </button>
                            </Link> */}
                              <div className="mt15">
                                <Link to={`/breed-inprogress/${item.breedId}`}>
                                  <button type="button" className="btn-primary">
                                    view
                                  </button>
                                </Link>
                              </div>

                              {/* <div className="mb">
                              <label className="label-primary">Breed</label>
                            </div> */}
                            </div>
                          </div>
                        </div>
                      ))}
                      {underBreedingNFTList.length == 0 && isLoading && (
                        <>
                          <Skeleton
                            baseColor="#0905149c"
                            highlightColor="#321241d4"
                            count={1}
                            width={220}
                            height={260}
                          />
                          <Skeleton
                            baseColor="#0905149c"
                            highlightColor="#321241d4"
                            count={1}
                            width={220}
                            height={260}
                          />
                          <Skeleton
                            baseColor="#0905149c"
                            highlightColor="#321241d4"
                            count={1}
                            width={220}
                            height={260}
                          />
                          <Skeleton
                            baseColor="#0905149c"
                            highlightColor="#321241d4"
                            count={1}
                            width={220}
                            height={260}
                          />
                        </>
                      )}
                    </div>
                    {underBreedingNFTList.length == 0 && !isLoading && (
                      <div className="notfound">
                        <h2>Data Not Found</h2>
                      </div>
                    )}
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default BreedingRoom;

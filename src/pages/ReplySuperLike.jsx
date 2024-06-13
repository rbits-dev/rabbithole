import { useRef, useState } from "react";
import Layout from "../componants/common/Layout";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link, useSearchParams } from "react-router-dom";
import { get } from "../services/ApiService";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ImageWithFallback from "../componants/common/ImageWithFallback";
import WaitingTimeForCliam from "../popups/WaitingTimeForCliam";
function ReplySuperLike() {

  const [searchParams, setSearchParams] = useSearchParams()

  const [tabIndex, setTabIndex] = useState((searchParams.get("tab") && parseInt(searchParams.get("tab"))) || 0);
  const tabPanelsRefs = useRef([]);
  const [sendNFTList, setSendNFTList] = useState([]);
  const [recieveNFTList, setRecieveNftList] = useState([])
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

  const getSendSuperLike = async () => {
    try {
      setRecieveNftList([]);
      setIsLoading(true);
      const result = await get("send-super-like-nft-list");
      setSendNFTList(result.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getRecieveSuperLike = async () => {
    try {
      setSendNFTList([]);
      setIsLoading(true);
      const result = await get("request-super-like-nft-list");
      setRecieveNftList(result.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
    }
  };

  useEffect(() => {
    if (tabIndex === 0) {
      getSendSuperLike();
    } else {
      getRecieveSuperLike();
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
              <h3 className=" headings text-uppercase">My Super Likes</h3>
            </div>
            <div>
              <Tabs
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
              >
                <TabList>
                  <Tab onClick={scrollToTabPanel}>SEND SUPERLIKES</Tab>
                  <Tab onClick={scrollToTabPanel}> RECEIVED SUPER LIKE </Tab>
                </TabList>

                <div className="tabssection">
                  <TabPanel
                  // ref={(el) => (tabPanelsRefs.current[0] = el)}
                  >
                    <div className="replycards">
                      {sendNFTList.map((item, index) => (
                        <div key={item.name} className="cardgap">
                          <div style={{ marginRight: " 10px",position:"relative"}} className="superliketab">
                          <ImageWithFallback   className="video-fluid"
                              src={item.imagePath}
                              style={{
                                height: "300px",
                                border: "3px solid white",
                              }}/>
                            <div className="superlikeheading">
                              <h3 className=" mt15 mb15 h-25 ">{item.nickname}</h3>
                            </div>

                            <div className="mt30">
                              <WaitingTimeForCliam item={item} isType={0} apiCall={getSendSuperLike}/>
                              {/* <Link to={`/profile/${item.contractAddress}/${item.nftId}`}>
                                <button type="button" className="btn-primary">
                                  view Profile
                                </button>
                              </Link> */}
                              {/* <div className="mb">
                                <label className="label-primary">Breed</label>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      ))}

                      {sendNFTList.length == 0 && isLoading && (
                        <>
                         <Skeleton baseColor="#0905149c" count={1} highlightColor="#321241d4" width={220} height={260} />
                          <Skeleton baseColor="#0905149c" count={1} highlightColor="#321241d4"  width={220} height={260} />
                          <Skeleton baseColor="#0905149c" count={1} highlightColor="#321241d4"  width={220} height={260} />
                          <Skeleton baseColor="#0905149c" count={1} highlightColor="#321241d4"  width={220} height={260} />
                        </>
                      )}
                    </div>
                    {sendNFTList.length == 0 && !isLoading && (
                      <div className="notfound">
                        <h2>Data Not Found</h2>
                      </div>
                    )}

                  </TabPanel>
                  <TabPanel

                  // ref={(el) => (tabPanelsRefs.current[1] = el)}
                  >
                    <div className="replycards">
                      {recieveNFTList.map((item, index) => (
                        <div className="cardgap" key={item.name}>
                          <div style={{ marginRight: " 10px", position:"relative" }} className="superliketab ">
                             <ImageWithFallback   className="video-fluid"
                              src={item.imagePath}
                              style={{
                                height: "300px",
                                border: "3px solid white",
                              }}/>
                            <div className="superlikeheading">
                              <h3 className=" mt15 mb15 h-25 ">{item.nickname}</h3>
                            </div>

                            <div className="mt15">
                              <WaitingTimeForCliam item={item} isType={1} apiCall={getRecieveSuperLike} />
                              {/* <Link to={`/profile/${item.contractAddress}/${item.nftId}`}>
                                <button type="button" className="btn-primary">
                                  view Profile
                                </button>
                              </Link> */}

                              {/* <div className="mb">
                              <label className="label-primary">Breed</label>
                            </div> */}
                            </div>
                          </div>
                        </div>
                      ))}

                      {recieveNFTList.length == 0 && isLoading && (
                        <>
                          <Skeleton baseColor="#0905149c" count={1} highlightColor="#321241d4" width={220} height={260} />
                          <Skeleton baseColor="#0905149c" count={1} highlightColor="#321241d4"  width={220} height={260} />
                          <Skeleton baseColor="#0905149c" count={1} highlightColor="#321241d4"  width={220} height={260} />
                          <Skeleton baseColor="#0905149c" count={1} highlightColor="#321241d4"  width={220} height={260} />

                        </>
                      )}
                    </div>
                    {recieveNFTList.length == 0 && !isLoading && (
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

export default ReplySuperLike;

import Layout from "../componants/common/Layout";
import "swiper/css";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import { EffectCoverflow } from "swiper";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../services/ApiService";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect } from "react";
import { useState } from "react";
import NftSwiperSkeleton from "../componants/common/NftSwiperSkeleton";
import ImageWithFallback from "../componants/common/ImageWithFallback";

function NftSelect() {
  const { address, chainId } = useAccount();
  const [nftData, setNftData] = useState([]);
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState();
  const [cursor,setCursor] = useState(null)
  const navigate = useNavigate();
  //GET NFT DATA
  const getNFTData = async () => {
    try {
      setIsLoading(true);
      const result = await get(
        `get-nft-data?userAddress=${address}&chainId=${chainId}`
      );
      for (let item of result.data.result) {
        // const nftInfo = await getMetadata(item.token_uri);
        // item.nftdata = nftInfo.data;
        item.nftdata = item.metadata && JSON.parse(item.metadata);
        console.log(item.nftdata);
        item.onError = false;
      }
      setCursor(result.data.cursor)
      setNftData(result.data.result);
      setActiveIndex(Math.floor(result.data.result.length / 2));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

const loadMoreNfts = async()=>{
  try {
    const result = await get(
      `get-nft-data-pagination?userAddress=${address}&chainId=${chainId}&cursor=${cursor}`
    );
    for (let item of result.data.result) {
      // const nftInfo = await getMetadata(item.token_uri);
      // item.nftdata = nftInfo.data;
      item.nftdata = item.metadata && JSON.parse(item.metadata);
      console.log(item.nftdata);
      item.onError = false;
    }
    setCursor(result.data.cursor)
    setNftData([...nftData,...result.data.result]);
  } catch (error) {
    
  }
}


  const handleSelectNFT = async (item, index) => {
    if (activeIndex !== index) return;
    if (item.onError) return;
    localStorage.setItem("tokenURI", item.token_uri);
    if (item.isProfileSetup) {
      const signature = await signMessageAsync({
        message: JSON.stringify({
          name: item.nickname,
          description: item.description,
        }),
      });
      try {
        const result = await post("get-user-profile", {
          contractAddress: item.token_address,
          signature,
          chainId,
          nftId: item.token_id,
          nickname: item.nickname,
          description: item.description,
          fireBaseToken: localStorage.getItem("fireBaseToken"),
        });
        localStorage.setItem("access_token", result.data.token);
        localStorage.setItem("userData", JSON.stringify(result.data));
        navigate("/select-breed");
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate(`/nft-detail/${item.token_address}/${item?.nftdata?.id}`);
    }
  };

  const handleSlideChange = (event) => {
    if(cursor && (nftData.length-2)==event.activeIndex){
      loadMoreNfts()
    }
    setActiveIndex(event.activeIndex);
  };

  useEffect(() => {
    getNFTData();
  }, []);

  return (
    <>
      <Layout>
        {/* <div className="waveWrapper banner waveAnimation Wavenft"> */}
        <div className="inner">
          <div className="flex-container  text-center">
            <div className="wp100 wp10">
              <div className="heading text-white">
                <h3 className=" headings text-uppercase">Select your Rabbit</h3>
              </div>
              {/* <div className="no-data1">
                                <h3 className="text-bold text-white  text-uppercase">You dont have any Ra8bit NFTs</h3>
                                <a className="btn-primary mt20" target="_blank">Buy Nft</Link>
                            </div> */}
              <section id="landing-nfts" className="landing-nfts">
                <section className="landing-carousel">
                  {nftData.length > 0 && (
                    <Swiper
                      effect={"coverflow"}
                      grabCursor={true}
                      centeredSlides={true}
                      loop={false}
                      lazy={true}
                      roundLengths={true}
                      loopedSlides={true}
                      slideToClickedSlide={true}
                      slidesPerView={"auto"}
                      coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                      }}
                      
                      onSlideChange={handleSlideChange}
                      initialSlide={Math.floor(nftData.length / 2)}
                      modules={[EffectCoverflow]}
                      className="swiper_container"
                      active
                    >
                      {nftData.map((item, index) => (
                        <SwiperSlide
                          key={item.token_id}
                          className={item.in_breeding && "nft-images-label"}
                          data-label="Under Breeding"
                        >
                          <a
                            onClick={() => handleSelectNFT(item, index)}
                            className="nft-image-container"
                          >
                            <ImageWithFallback
                              src={item?.nftdata?.image}
                              alt={
                                item.isProfileSetup
                                  ? item.nickname
                                  : item?.nftdata?.name
                              }
                              item={item}
                            />
                          </a>
                          <div className="mt10 d-flex align-item-center justify-content-center flex-col">
                            <h4 className="text-white head title mb4">
                              {item.isProfileSetup
                                ? item.nickname
                                : item?.nftdata?.name}
                            </h4>
                            <h3
                              className="text-white head title tooltipdesc mt5"
                              style={{ width: "80%" }}
                            >
                              {item.isProfileSetup
                                ? item.description.length > 30
                                  ? item.description.substring(0, 30) + "..."
                                  : item.description
                                : item.nftdata?.description.length > 30
                                ? item.nftdata.description.substring(0, 30) +
                                  "..."
                                : item.nftdata?.description}
                              {/* <span class="tooltiptextdesc">{item.isProfileSetup
                                ? item.description
                                : item?.nftdata?.description}</span> */}
                            </h3>
                          </div>

                          <div className="d-flex likes nft-likes  mb10">
                            <span>
                              {" "}
                              <div className="icon icon-nft-select">
                                <img
                                  className="icon-change"
                                  src="assets/siteimage/like.webp"
                                  alt=""
                                />
                              </div>
                              <span className="green">{`x${item.likeCount}`}</span>
                            </span>
                            <span>
                              <div className="icon icon-nft-select">
                                <img
                                  className="icon-change"
                                  src="assets/siteimage/superlike .webp"
                                  width="40px"
                                  alt=""
                                />
                              </div>
                              <span className="yellow">{`x${item.superlikeCount}`}</span>
                            </span>
                            <span>
                              <div className="icon icon-nft-select">
                                <img
                                  className="icon-change"
                                  src="assets/siteimage/dislike.webp"
                                  width="40px"
                                  alt=""
                                />
                              </div>
                              <span className="red">{`x${item.dislikeCount}`}</span>
                            </span>
                          </div>
                          {item?.isProfileSetup && activeIndex === index && (
                            <Link to={`/edit-profile/${item.userId}`}>
                              <button className="btn-primary">
                                Edit Profile
                              </button>
                            </Link>
                          )}
                          {activeIndex === index && (
                            <Link
                              to={`/profile/${item.token_address}/${item?.nftdata?.id}`}
                              onClick={() =>
                                localStorage.setItem(
                                  "profileUri",
                                  item.token_uri
                                )
                              }
                            >
                              <button className="btn-primary">
                                View Profile
                              </button>
                            </Link>
                          )}
                        </SwiperSlide>
                      ))}
                      {/* <SwiperSlide>
                        <a
                          onClick={() => handleSelectNFT(item, index)}
                          className="nft-image-container nft-load"
                        >
                          <div className="load-more">
                            <button
                              className="btn-primary"
                              style={{ padding: "5px 20px", width: "auto" }}
                            >
                              Load More
                            </button>
                          </div>
                        </a>
                      </SwiperSlide> */}
                    </Swiper>
                  )}

                  {nftData.length == 0 && isLoading && (
                    <Swiper
                      modules={[EffectCoverflow]}
                      className="swiper_container"
                      effect={"coverflow"}
                      grabCursor={true}
                      centeredSlides={true}
                      loop={false}
                      roundLengths={true}
                      loopedSlides={true}
                      slideToClickedSlide={true}
                      initialSlide={5}
                      slidesPerView={"auto"}
                      coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                      }}
                    >
                      {[...Array(9)].map((_, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="nft-image-container">
                            <NftSwiperSkeleton />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                  {nftData.length == 0 && !isLoading && (
                    <div className="notfound notfoundselectnft">
                      <h2 className=" m-0">Data Not Found</h2>
                    </div>
                  )}
                </section>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default NftSelect;

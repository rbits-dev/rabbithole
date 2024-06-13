import Layout from "../componants/common/Layout";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import { EffectCoverflow } from "swiper";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { useState } from "react";
import { get } from "../services/ApiService";
import { useEffect } from "react";
import NftSwiperSkeleton from "../componants/common/NftSwiperSkeleton";
import ImageWithFallback from "../componants/common/ImageWithFallback";

function Match() {
  const [nftData, setNftList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState();

  const getMatchList = async () => {
    try {
      setIsLoading(true);
      const result = await get("like-nft-list");
      setNftList(result.data.data);
      setActiveIndex(Math.floor(result.data.data.length / 2));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleSlideChange = (event) => {
    setActiveIndex(event.activeIndex);
  };

  useEffect(() => {
    getMatchList();
  }, []);
  return (
    <>
      <Layout>
        <div className="inner">
          <div className="flex-container  text-center">
            <div className="wp100 wp10">
              <div className="heading text-white">
                <h3 className=" headings text-uppercase">
                  My Matches
                </h3>
              </div>
              <section id="landing-nfts" className="landing-nfts">
                <section className="landing-carousel">
                  {nftData.length > 0 && (
                    <Swiper
                      effect={"coverflow"}
                      grabCursor={true}
                      centeredSlides={true}
                      loop={false}
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
                          <Link  to={`/selected-target/${item.contractAddress}/${item.nftId}/0`}
                            
                            className="nft-image-container"
                          >
                             <ImageWithFallback
                            alt={item.nickname}
                            src={item.imagePath}
                            className="nftimg"
                          />
                          </Link>
                          <span className="linkclasses">
                          <button
                            className="matchbutton matchbutton1"
                            style={{ cursor: "default", width: "275px" }}
                          >
                            <h4 className="text-white head font-weight-normal mb0 line-height-normal">
                              {item.nickname}
                            </h4>
                            <p className="text-white head font-weight-normal mb0 line-height-normal">
                              {item.description.length > 30
                                ? item.description.substring(0, 30) + "..."
                                : item.description}
                            </p>
                          </button>
                        </span>
                          {activeIndex === index && (
                            <Link className="mt15"
                              to={`/profile/${item.contractAddress}/${item.nftId}`}
                            >
                              <button className="btn-primary">
                                View Profile
                              </button>
                            </Link>
                          )}
                        </SwiperSlide>
                      ))}
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

export default Match;

import Layout from "../componants/common/Layout"
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import { EffectCoverflow } from "swiper";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import SuperLike from "../componants/common/SuperLike";





function SelectMatches() {

    return (
        <>
            <Layout>
                <div className="waveWrapper banner waveAnimation">
                    <div className="flex-container  text-center">
                        <div className="wp100 wp10">
                            <div className="heading text-white">
                                <h3 className=" headings text-uppercase">
                                    Select your breeding match
                                </h3>
                            </div>
                           

                            <section id="landing-nfts" className="match-nfts" >
                                <section className="landing-carousel">
                                    {/* <Swiper
                                        effect="coverflow"
                                        grabCursor={true}
                                        centeredSlides={true}
                                        slidesPerView={'auto'}
                                        coverflowEffect={{
                                            "rotate": 50,
                                            "stretch": 0,
                                            "depth": 100,
                                            "modifier": 1,
                                            "slideShadows": true
                                        }}
                                        pagination={true}
                                        className="mySwiper"
                                    >
                                        <div className="swiper-wrapper">
                                            {[...Array(10)].map((_, index) => (
                                                <SwiperSlide key={index}>
                                                    <a className="nft-image-container">
                                                        <img alt="to" src="/assets/img/us1.png" className="nftimg" />
                                                    </a>

                                                </SwiperSlide>
                                            ))}
                                        </div>
                                        <div className="" style={{ margin: "5rem auto", maxWidth: "277px" }}>
                                            <h4 className="text-white head title mb4">dfgfgf</h4>
                                            <h3 className="text-white head title mt4 mb4">#rg564g</h3>

                                            <SuperLike />
                                            <Link to="/profile">
                                                <button className="btn-primary" >View Profile</button>
                                            </Link>
                                        </div>
                                    </Swiper> */}

                                    <Swiper
                                        effect={"coverflow"}
                                        grabCursor={true}
                                        centeredSlides={true}
                                        loop={true}
                                        slidesPerView={"auto"}
                                        coverflowEffect={{
                                            rotate: 0,
                                            stretch: 0,
                                            depth: 100,
                                            modifier: 2.5,
                                        }}

                                        modules={[EffectCoverflow]}
                                        className="swiper_container"
                                    >

                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container otherthanactive">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide> <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>
                                        <SwiperSlide >
                                            <Link to="javascript:void();" className="nft-image-container">

                                                <img alt="to" src="/assets/img/us1.png" className="nftimg" />

                                            </Link>

                                        </SwiperSlide>

                                        <div className="" style={{ margin: " auto", maxWidth: "277px" }}>
                                            <h4 className="text-white head title mb4">Jody Simpson</h4>
                                            <h4 className="text-white head title mt4 mb4">#06283</h4>

                                            <SuperLike className="mt10" />
                                            <Link to="/profile">
                                                <button className="btn-primary mt10" >View Profile</button>
                                            </Link>
                                        </div>

                                    </Swiper>

                                </section >
                            </section >
                        </div >
                    </div >
                </div >

            </Layout>
        </>
    )
}

export default SelectMatches
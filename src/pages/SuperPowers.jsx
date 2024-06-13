
import { Link } from "react-router-dom";
import Layout from "../componants/common/Layout"
import { Swiper, SwiperSlide } from "swiper/react";


function SuperPowers() {
    return (
        <>
            <Layout>
                <div className="waveWrapper banner waveAnimation">
                    <div className="flex-container container text-center">
                        <div className="wp100 wp10">
                            <div className="heading text-white">
                                <h3 className=" headings text-uppercase">
                                    Desired Super Power
                                </h3>
                            </div>


                            <section id="landing-nfts" className="match">

                                <section className="landing-carousel">
                                    <Swiper
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
                                                        <img alt="to" src="/assets/img/character-05918.png" className="nftimg" />
                                                    </a>
                                                    <div className="rarity-score rounded mt20 " style={{ width: "100%" }}>
                                                        <div className="left heading p8">
                                                            <p className="mb-0">
                                                                Rarity <br />
                                                                Score
                                                            </p>
                                                        </div>
                                                        <div className="rarity flex">
                                                            <div >
                                                                <img src="/assets/siteimage/blackchilli.jpg" alt="" />
                                                            </div>
                                                            <div >
                                                                <img src="/assets/siteimage/blackchilli.jpg" alt="" />
                                                            </div>

                                                            <div >
                                                                <img src="/assets/siteimage/redchilli.jpg" alt="" />
                                                            </div> <div >
                                                                <img src="/assets/siteimage/redchilli.jpg" alt="" />
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <Link to=""><button className="matchbutton">
                                                        Billi Bowman
                                                        <br />
                                                        #djhf454
                                                    </button></Link>
                                                </SwiperSlide>
                                            ))}
                                        </div>

                                    </Swiper>



                                </section >

                            </section>
                        </div>
                    </div>
                </div>
            </Layout>

        </>
    )
}

export default SuperPowers
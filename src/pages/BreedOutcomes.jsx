
import { Link } from 'react-router-dom'
import Layout from '../componants/common/Layout'


function BreedOutcomes() {
  return (
    <div>
        <Layout>
        <section className="inner">
          <div className="intro">
          <div className="title">
                  <div className="heading text-white">
                    <h3 className=" text-bold text-uppercase">
                      <span style={{padding:"0px !important"}}>Breed Outcomes</span>
                    </h3>
                  </div>
                </div>
            <div className="text-center divide-area">
                
              <div className="nft-item mr-md-40">
                
                <div className="nft-box">
                  <img src="/assets/img/character-05918.png" alt="" />


                </div>
                <div className="m15">
                  <h4 className="text-white head font-weight-normal">
                  Harry Butts
                  </h4>
                  <h4 className="text-white head font-weight-normal">
                  #45673
                  </h4>
                </div>
                <div className="rarity-score rounded mt5 ">
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

                




              </div >

              <div className="grow-2">


                <div className="traits">
                  <div className="heading text-white mb15 flex-col">
                    <p className="text-bold text-uppercase">Traits</p>
                  </div>

                  <div >
                    <div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        Color
                      </p>
                      <p className="text-left">
                        white
                      </p>
                    </div>
                    <div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        background
                      </p>
                      <p className="text-left">
                        black
                      </p>
                    </div>
                    <div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        mouth
                      </p>
                      <p className="text-left">
                        black lady
                      </p>
                    </div>
                    <div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        smoke
                      </p>
                      <p className="text-left">
                        -
                      </p>
                    </div>
                    <div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        eyes
                      </p>
                      <p className="text-left">
                        swag tripes
                      </p>
                    </div><div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        hat/hair
                      </p>
                      <p className="text-left">
                        pink hat brown hair
                      </p>
                    </div>
                    <div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        cloth
                      </p>
                      <p className="text-left">
                        stripped purple
                      </p>
                    </div>
                    <div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        shoes
                      </p>
                      <p className="text-left">
                        purple lady
                      </p>
                    </div>
                    <div className="flex justify-center properties mb30">
                      <p className="mr20 text-right">
                        character
                      </p>
                      <p className="text-left">
                      00hsfs4587.json
                      </p>
                    </div>
                    <div className=" properties mb30">
                      <p className="mr20 text-center">
                        Price
                      </p>
                      <p className="text-center">
                      1,000,000,000,000 Ra8bit
                      </p>
                    </div>

                  </div>
                  <div className="flex justify-center icon social mt15 mb15">

                    <button className="pt-5 sharebtn">
                      share
                    </button>
                  </div>
                </div >
                <div className='flexss'>
                  <Link to="" className='social-media-icons'>
                    <img src="https://cdn2.iconfinder.com/data/icons/threads-by-instagram/24/x-logo-twitter-new-brand-512.png" alt="" />
                  </Link>
                  <Link to=""  className='social-media-icons'>
                    <img src="https://static-00.iconduck.com/assets.00/instagram-icon-2048x2048-uc6feurl.png" alt="" />
                  </Link>
                </div>
              </div >
            </div >
          </div >
        </section >
        
      </Layout>
    </div>
  )
}

export default BreedOutcomes
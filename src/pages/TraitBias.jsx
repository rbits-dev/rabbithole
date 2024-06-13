import Layout from "../componants/common/Layout"
import PopupModals from "../componants/common/PopupModals";
import TraitBiasDialog from "../popups/TraitBiasDialog";




function TraitBias() {
  const [openDialog, setDialogOpen] = useState(false);
  function handleDialogClose() {
    setDialogOpen(false);
  }
  return (
    <>
      {openDialog ? (
        <PopupModals
          open={true}
          onDialogClose={handleDialogClose}
          title={"Ticket Details"}
        >
          <TraitBiasDialog onClose={handleDialogClose} />
        </PopupModals>
      ) : (
        <></>
      )}
      <Layout>
        <section className="inner">
          <div className="intro">
            <div className="text-center divide-area">
              <div className="nft-item mr-md-40">
                <div className="title">
                  <div className="heading text-white">
                    <h3 className=" headings text-uppercase">
                      trait bias
                    </h3>
                  </div>

                </div>
                <div className="nft-box">
                  <img src="/assets/img/character-05918.png" alt="" />


                </div>
                <div className="m15">
                  <h3 className="text-white head font-weight-normal">
                    nft Profile
                  </h3>
                  <h3 className="text-white head font-weight-normal">
                    #fg345
                  </h3>
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
                      <img src="/assets/siteimage/redchilli.jpg" alt="" />
                    </div> <div >
                      <img src="/assets/siteimage/redchilli.jpg" alt="" />
                    </div>

                  </div>
                </div>

                <div className="">
                  <button className="btn-primary btn-bias" onClick={() => (setDialogOpen(true))} >view</button>
                </div>
                <div className="">
                  <button className="btn-primary btn-bias" onClick={() => (setDialogOpen(true))} >Confrim</button>
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
                    <div className="properties mt30 mb30">
                      <p className="mr20 text-center">
                        character-06283.json
                      </p>
                      <p className="text-center mt5">
                        3436.524390526235
                      </p>
                    </div>
                    <div className="properties mt10 mb30">
                      <p className="mr20 text-center">
                        Price:
                      </p>
                      <p className="text-center mt5">
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
              </div >
            </div >
          </div >
        </section >

      </Layout>
    </>
  )
}

export default TraitBias
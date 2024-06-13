import { Link } from "react-router-dom";
import Layout from "../componants/common/Layout";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Home() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Layout>
        <div className="start-section  waveWrapper Waveresponsive">
          <div className="flex-container text-center hspace">
            <a className="logo-container text-uppercase logo">RBITS</a>
            <p className="subtitle text-center text-uppercase">
              breeding <span>room</span>
            </p>
            <div className="flex-col mt-3 text-center justify-content-center align-items-center mx-auto">
              <div className="social-icon flex flex-col align-items-center mt30  ">
              {!isConnected && (
                <div className="connect-button">
                  {/* <button
                    type="button"
                    className="btn  p-3 text-bold m-b-30 text-uppercase mb30"
                    style={{ background: "transparent", border: "0" }}
                  > */}
                   <ConnectButton />
                 {/* </button> */}
              
                </div>
                  )}
                {isConnected && (
                  <h3 className="walletaddress mb10" style={{ color: "red" }}>
                    You are connected With :{" "}
                    {address &&
                      address.substring(0, 4) +
                        ".." +
                        address.substring(38, 42)}
                  </h3>
                )}

                {isConnected && (
                  <div className="grp-btn">
                    <Link to="/nft-select">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-outline-primaryp mt-2 start-btn"
                        style={{ color: "black !important" }}
                      >
                        Start
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-outline-primaryp kde disconnect-btn"
                      style={{ color: "#fff !important",background:"#000 !important" }}
                      onClick={()=>(disconnect(),localStorage.removeItem("userData"))}
                    >
                      Disconnect{" "}
                    </button>
                  </div>
                )}
                <div className="text-snoogans">
                  <p className="text-uppercase check">Check carefully</p>
                </div>
                <div className="align-items-center hide-text heading var-color mt20  letterspace max-heading">
                  <h2 className="mb0">NSFW</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Home;

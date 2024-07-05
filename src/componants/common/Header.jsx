import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import PopupModals from "./PopupModals";
import { blockConfig } from "../../config/BlockChainConfig";
import WrongChainSelected from "../../popups/WrongChainSelected";
import { useEffect } from "react";
import { useChainModal } from "@rainbow-me/rainbowkit";
import Logo from "../../assets/img/Logo.webp"
function Header() {
  const { openChainModal } = useChainModal();
  const { isConnected, chainId, chain ,address} = useAccount();
  const [isWrongWallet, setIsWrongWallet] = useState(false);
  const { disconnect } = useDisconnect();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState(pathname);
  const navigate = useNavigate();
  const userData =
    localStorage.getItem("userData") &&
    JSON.parse(localStorage.getItem("userData"));

  const handleDialogClose = () => {
    setIsWrongWallet(false);
  };
  //HANDLE LOGOUT
  const handleLogOut = () => {
    disconnect();
  };

  useEffect(() => {
    if (!isConnected) {
      localStorage.removeItem("userData");
      navigate("/");
    }
  }, [isConnected]);

  useEffect(() => {
    chainId &&
      setIsWrongWallet(!Object.keys(blockConfig).includes(chainId.toString()));
      if(localStorage.getItem('oldChainId')!=chainId || localStorage.getItem('oldChainId')==null ){
        localStorage.setItem('oldChainId',chainId)
        localStorage.removeItem('userData')
        navigate('/')
      }
      if(localStorage.getItem('oldAddress')!=address || localStorage.getItem('oldAddress')==null){
        localStorage.setItem('oldAddress',address)
        localStorage.removeItem('userData')
        navigate('/')
      }
  }, [chainId,address]);


  return (
    <>
      {isWrongWallet && isConnected && (
        <PopupModals open={true} onDialogClose={handleDialogClose}>
          <WrongChainSelected message={"Wrong chain selected"} />
        </PopupModals>
      )}
      <nav className="nav">
        <input type="checkbox" id="nav-check" />
        <Link to="/" className="flex-center">
          <img
            className="logo-img"
            src={Logo}
            alt=""
            style={{ width: "300px", height: "auto" }}
          />
        </Link>
        <div className="nav-btn">
          <label htmlFor="nav-check">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>

        <ul className="nav-list">
          <div className="nav-container">
            <ul className="nav-tabs">
              <div className="navbar">
                {userData && (
                  <>
                    <li
                      className={`nav-tab pointer ${
                        activeTab === "/select-breed" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="/select-breed"
                        className="nav-link text-uppercase"
                      >
                        Explore
                      </Link>
                    </li>
                    <div className="vi"></div>
                  </>
                )}
                {isConnected && (
                  <li
                    className={`nav-tab pointer ${
                      activeTab === "/nft-select" ? "active" : ""
                    }`}
                  >
                    <Link to="/nft-select" className="nav-link text-uppercase">
                      My NFTs
                    </Link>
                  </li>
                )}
                {userData && (
                  <>
                    <div className="vi"></div>
                    <li
                      className={`nav-tab pointer ${
                        activeTab === "/match" ? "active" : ""
                      }`}
                    >
                      <Link to="/match" className="nav-link text-uppercase">
                        My Matches
                      </Link>
                    </li>

                    <div className="vi"></div>
                    <li
                      className={`nav-tab pointer ${
                        activeTab === "/reply-super-like" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="/reply-super-like"
                        className="nav-link text-uppercase"
                      >
                        My SuperLikes
                      </Link>
                    </li>
                    <div className="vi"></div>
                    <li
                      className={`nav-tab pointer ${
                        activeTab === "/breeding-room" ? "active" : ""
                      }`}
                    >
                      <Link
                        to="/breeding-room"
                        className="nav-link text-uppercase"
                      >
                        Breeding Room
                      </Link>
                    </li>
                  </>
                )}
                <div className="vi"></div>
              </div>
              <li className="nav-tab ">
                <Link
                  to="https://rbitsdev.codetentaclestechnologies.tech/"
                  className="nav-link text-uppercase"
                  target="_blank"
                >
                  Buy Rbbits
                </Link>
              </li>
              <div className="vi"></div>
              {isConnected && (
                <>
                  <li className="nav-tab " onClick={handleLogOut}>
                    <Link className="nav-link text-uppercase">Log Out</Link>
                  </li>
                </>
              )}
             
              
            </ul>
          </div>
        </ul>
        <div className="d-flex chain-button gap-2" style={{gap:"10px"}}>
        {openChainModal && (
                <button
                  onClick={openChainModal}
                  className="btn btn-outline-primary btn-outline-primaryp kde chain-btn d-flex"
                  type="button"
                >
                  {chain&&chain.name}
                  <svg fill="none" height="7" width="14" xmlns="http://www.w3.org/2000/svg"><title>Dropdown</title><path d="M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001" stroke="currentColor"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg"></path></svg>
                </button>
              )}
        <div className="brand-name">
          <div className="nav-tab">
            <div className="nav-link text-uppercase rl">RBITS</div>
          </div>
        </div>
        </div>
      </nav>
    </>
  );
}

export default Header;

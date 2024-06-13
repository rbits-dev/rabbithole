import { useAccount } from "wagmi";
import FooterLogo from "../../assets/img/Logo.webp"
function Footer() {
  const { address } = useAccount();
  return (
    <>
      <div className="footer">
        <div className="text-center ">
          <div className="">
            <div className="text-sm-end " style={{ margin: "10px" }}>
              <a className="flex-center">
                <img
                  src={FooterLogo}
                  alt=""
                  style={{ width: "300px", height: "auto" }}
                />
              </a>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div className="copy-right-area">
            <p className="mb-0">
              {" "}
              © 2024-2027 by <a target="_blank">RBITS</a>
            </p>
          </div>
          <div className="">
            connected Wallet :
            <span className="address">
              {address ? (
                <>
                  <span className="truncated-address">{address.substring(0, 4) + ".." + address.substring(38, 42)}</span>
                  <span className="full-address">{address}</span>
                </>
              ) : (
                <span className="default-address">0x00...0000</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;

import { useState, useEffect, useRef } from "react";
import Layout from "../componants/common/Layout";
import PopupModals from "../componants/common/PopupModals";
import GenerationDetails from "../popups/GenerationDetails";
import { get } from "../services/ApiService";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";


function GenerationChart() {
  const { contractAddress, nftId } = useParams();
  const { chainId } = useAccount();
  const [generationData, setGenerationData] = useState(null);

  const getGenerationData = async () => {
    try {
      const result = await get(
        `chartApi/${nftId}/${contractAddress}/${chainId}`
      );
      setGenerationData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGenerationData();
  }, [nftId, contractAddress]);

  return (
    <>
      <Layout>
        <section className="inner container inner-breeding-tree">
          <div className="intro intro1 innerresponsive">
            <div className="heading text-white">
              <h3 className="headings text-uppercase">breed ancestry</h3>
            </div>
            {generationData && <FamilyTree data={generationData} />}
          </div>
        </section>
      </Layout>
    </>
  );
}

export default GenerationChart;

const FamilyTree = ({ data }) => {
  const [openDialog, setDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);


  function handleDialogClose() {
    setDialogOpen(false);
  }

  const renderTree = (node) => (
    <li key={node.image}>
      <a href="#" onClick={() => (setDialogOpen(true), setProfileData(node))}>
        <img src={node.image} alt="" />
      </a>
      {node.children && node.children.length > 0 && (
        <ul>{node.children.map((child) => renderTree(child))}</ul>
      )}
    </li>
  );

  return (
    <>
    <div
      className="section section-nft section-nft-tree" >
      <div className="tree1" >


        {openDialog && (
          <PopupModals
            isCloseBtn={true}
            open={true}
            onDialogClose={handleDialogClose}
            title={"Ticket Details"}
            className="generationpopup"
          >
            <GenerationDetails data={profileData} onClose={handleDialogClose} />
          </PopupModals>
        )}

        <ul>
          <li>
            <div className="yourprofile1">{data.name}</div>
            <a className="main-nft"
              href="#"
              onClick={() => (setDialogOpen(true), setProfileData(data))}
            >
              <img
                src={data.image}
                alt=""
                style={{ width: "200px", height: "200px" }}
              />
            </a>
            {data.children && data.children.length > 0 && (
              <ul className="child-nft">{data.children.map((child) => renderTree(child))}</ul>
            )}
          </li>
        </ul>
      </div>
    </div>

    </>

  );
};

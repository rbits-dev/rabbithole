import { useNavigate, useParams } from "react-router-dom";
import Layout from "../componants/common/Layout";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSignMessage } from "wagmi";
import { toast } from "react-toastify";
import { post } from "../services/ApiService";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import ImageWithFallback from "../componants/common/ImageWithFallback";
import CaretDisplay from "../componants/common/CaretDisplay";

function NftDetail() {
  const url = localStorage.getItem("tokenURI");
  const { signMessageAsync } = useSignMessage();
  const { address, chainId } = useAccount();
  const { artistAddress, id } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSkeleton, setLoadingSkeleton] = useState(false);
  const navigate = useNavigate();
  const [nftData, setNftData] = useState(null);
  
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
   

    validationSchema: Yup.object({
      name: Yup.string()
    .required("Nickname is required")
    .max(20, "Must be 20 characters or less"),
  description: Yup.string().required("Description is required"),
  
}),

    onSubmit: async (values) => {
      try {
        if (!nftData?.image) return toast.error('Unable to fetch NFT data. Please reload the page and try again.');
        setLoading(true);
        const sign = await signMessageAsync({
          message: JSON.stringify(values),
        });

        const body = {
          userAddress: address,
          signature: sign,
          chainId: chainId,
          nftId: id,
          name: nftData?.name,
          nickname: values.name,
          description: values.description,
          imagePath: nftData?.image,
          contractAddress: artistAddress,
          tokenUri: url,
          characterNo: extractNumberFromUrl(nftData?.image),
          fireBaseToken: localStorage.getItem("fireBaseToken") || null,
        };
        const result = await post("add-user-profile", body);
        toast.success(result.data.message);
        localStorage.setItem("userData", JSON.stringify(result.data));
        localStorage.setItem("access_token", result.data.token);
        setTimeout(() => {
          navigate("/select-breed");
        }, 700);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error?.details || error.shortMessage);
      }
    },
  });

  const extractNumberFromUrl = (url) => {
    const regex = /character-(\d+)\.(png|json)$/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  const getNFTdata = async () => {
    try {
      setLoadingSkeleton(true);
      const url = localStorage.getItem("tokenURI");
      const result = await axios.get(url);
      setNftData(result.data);
      if (result.data && result.data.description) {
        formik.setFieldValue('description', result.data.description);
        formik.setFieldValue('name', result.data.name);
      }
      setLoadingSkeleton(false);
    } catch (error) {
      setLoadingSkeleton(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getNFTdata();
  }, [id]);

  return (
    <Layout>
      <section className="inner container inne1">
        <div className="intro intro1 innerresponsive introc1">
          <div className="">
            <div className="title">
              <div className="heading text-white">
                <h3 className="headings text-uppercase">
                  Set up your profile
                </h3>
              </div>
            </div>
            <div className="section section-nft">
              <div className="text-center divide-area">
                <div className="nft-item mr-md-40">
                  <div className="rarity-score">
                    <div className="left heading p8 mb-0">
                      <p className="mb-0">
                        Rarity <br />
                        Score
                      </p>
                    </div>
                    <CaretDisplay value={1} />
                    
                  </div>
                  <div className="nft-box nft-select-box border-top-0">
                    {!isLoadingSkeleton && (
                      <ImageWithFallback
                        src={nftData?.image}
                        className="wp100"
                        alt={nftData?.name}
                        loading="lazy"
                      />
                    )}
                    {isLoadingSkeleton && (
                      <Skeleton
                        baseColor="#0905149c"
                        highlightColor="#321241d4"
                        count={1}
                        width={298}
                        height={276}
                      />
                    )}
                  </div>
                  <div className="mt20 mb20">
                    <h4 className="text-white head">{nftData?.name}</h4>
                    <h4 className="text-white" style={{ marginTop: "0px !important" }}>
                      {nftData?.description}
                    </h4>
                  </div>
                </div>
                <form className="nftdetailsform" onSubmit={formik.handleSubmit}>
                  <div className="grow-2 mt30">
                    <div className="mb10">
                      <input
                      style={{color:"#b7b7b7"}}
                        type="text"
                        className="btn btn-outline-primary m-b-10 text-uppercase"
                        name="name"
                        placeholder={formik.values.name ? "" : "Nickname"}
                        id="name"
                        onChange={formik.handleChange}
                        onFocus={() => formik.setFieldValue('name', '')}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            formik.setFieldValue('name', nftData?.name || "");
                          }
                          formik.handleBlur(e);
                        }}
                        value={formik.values.name}
                      />
                 {formik.touched.name && formik.errors.name ? (
          <div style={{ color: '#ed1d26',marginTop:"6px" }}>{formik.errors.name}</div>
        ) : null}
                    </div>

                    <div className="social-media ml-4 mt-4 mb10">
                      <textarea
                       style={{color:"#b7b7b7"}}
                        rows="10"
                        placeholder={formik.values.description ? "" : "Description"}
                        id="description"
                        className="btn btn-outline-primary text-uppercase text-center m-t-0"
                        name="description"
                        onChange={formik.handleChange}
                        onFocus={() => formik.setFieldValue('description', '')}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            formik.setFieldValue('description', nftData?.description || "");
                          }
                          formik.handleBlur(e);
                        }}
                        value={formik.values.description}
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="btn btn-outline-primary m-t-5 text-uppercase"
                        disabled={isLoading}
                      >
                        {isLoading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default NftDetail;

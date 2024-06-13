import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../componants/common/Layout";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSignMessage } from "wagmi";
import { toast } from "react-toastify";
import { get, post } from "../services/ApiService";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import ImageWithFallback from "../componants/common/ImageWithFallback";

function EditProfile() {
  const { signMessageAsync } = useSignMessage();
  const { chainId } = useAccount();
  const { id } = useParams();
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
        .max(20, 'Must be 20 characters or less')
        .required('Required')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const sign = await signMessageAsync({
          message: JSON.stringify(values),
        });

        const body = {
          userId: id,
          nickname: values.name,
          description: values.description,
          signature: sign,
        };

        const result = await post("edit-user-profile", body);
        toast.success(result.data.message);
        navigate("/select-breed");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error?.details || error.shortMessage);
      }
    },
  });

  const getNFTdata = async () => {
    try {
      setLoadingSkeleton(true);
      const result = await get(
        `view-nft-profile?userId=${id}&chainId=${chainId}`
      );
      formik.setFieldValue("description", result.data.userData.description);
      formik.setFieldValue("name", result.data.userData.nickname);
      setNftData(result.data.userData);
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
    <>
      <Layout>
        <section className="inner container">
          <div className="intro intro1 innerresponsive">
            <div className="">
              <div className="title">
                <div className="heading text-white">
                  <h3 className=" headings text-uppercase">
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
                      <div className="rarity flex">
                        <img src="/assets/siteimage/redchilli.jpg" alt="" />
                        <img src="/assets/siteimage/blackchilli.jpg" alt="" />
                      </div>
                    </div>
                    <div className="nft-box border-top-0">
                      {!isLoadingSkeleton && (
                        <ImageWithFallback
                          src={nftData?.imagePath}
                          className="wp100"
                          alt={nftData?.nickname}
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
                      <h4 className="text-white head  ">{nftData?.nickname}</h4>
                      <h4
                        className="text-white"
                        style={{ marginTop: "0px !important" }}
                      >
                        {nftData?.description}
                      </h4>
                    </div>
                  </div>
                  <form
                    className="nftdetailsform"
                    onSubmit={formik.handleSubmit}
                  >
                    <div className="grow-2 mt30">
                      <div className="mb10">
                        <input
                         style={{color:"#b7b7b7"}}
                          type="text"
                          className="btn btn-outline-primary m-b-10 text-uppercase"
                          name="name"
                          placeholder="nickname"
                          id="name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name ? (
          <div style={{ color: '#ed1d26',marginTop:"6px" }}>{formik.errors.name}</div>
        ) : null}
                      </div>

                      <div className="social-media ml-4 mt-4 mb10">
                        <textarea
                          rows="10"
                          placeholder="Description"
                          id="description"
                          className="btn btn-outline-primary text-uppercase text-center m-t-0"
                          name="description"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                        ></textarea>
                        {/* {formik.errors.description && (
                        <p className="error">{formik.errors.description}</p>
                      )} */}
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
    </>
  );
}

export default EditProfile;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ImageWithFallback = ({ src, alt,item,className,style }) => {
  const loadingSrc = "/assets/img/rabitloader.gif";
  const fallbackSrc = "/assets/img/nftnotfound.jpg";

  const [imageSrc, setImageSrc] = useState(loadingSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setHasError(false);
      if(item){
        item.onError=false
      }
    };
    img.onerror = () => {
      setImageSrc(fallbackSrc);
      setHasError(true);
       if(item){
        item.onError=true
      }
    };
  }, [src]);

  const handleRetry = () => {
    setImageSrc(loadingSrc);
    setHasError(false);
  
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setHasError(false);
      if(item){
        item.onError=false
      }
    };
    img.onerror = () => {
      toast.error('Unable to fetch NFT data please try after sometime')
      setImageSrc(fallbackSrc);
      setHasError(true);
      if(item){
        item.onError=true
      }
    };
  };
  return (
    <>
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={style}
      />
      {hasError && (
        <button className='matchbutton retrybutton bg-danger'
          onClick={handleRetry}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '5px 20px',
           backgroundColor: '#ff0000',
          }}
        >
          Retry
        </button>
      )}
    </>
  );
};

export default ImageWithFallback;

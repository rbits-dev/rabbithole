import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
function NftSwiperSkeleton() {

  return (
    <>
    <Skeleton  baseColor="#0905149c"  highlightColor="#321241d4" count={1}  width={355} height={355}/>
    </>
  )
}

export default NftSwiperSkeleton
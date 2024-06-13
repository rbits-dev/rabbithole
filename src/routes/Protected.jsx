
import { Outlet, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Header from '../componants/common/Header'
import BInprogrss from '../pages/BInprogrss'
import GenerationChart from '../pages/GenerationChart'
import Match from '../pages/Match'
import NftDetail from '../pages/NftDetail'
import NftSelect from '../pages/NftSelect'
import Profile from '../pages/Profile'
import ReplySuperLike from '../pages/ReplySuperLike'
import SelectBreed from '../pages/SelectBreed'
import SuperPowers from '../pages/SuperPowers'
import TargetSelect from '../pages/TargetSelect'
import TraitBias from '../pages/TraitBias'
import PageNotFOund from '../page-not-found/PageNotFOund'
import SelectMatches from '../pages/SelectMatches'
import BreedOutcomes from '../pages/BreedOutcomes'
import BreedingRoom from '../pages/BreedingRoom'
import EditProfile from '../pages/EditProfile'

function Protected() {
  return (
    <>
    
    <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index path="/" element={<Home />} />
          <Route index path="/breed-inprogress/:breedId" element={<BInprogrss />} />
          <Route index path="/generation-chart/:contractAddress/:nftId" element={<GenerationChart />} />
          <Route index path="/match" element={<Match />} />
          <Route index path="/nft-detail/:artistAddress/:id" element={<NftDetail />} />
          <Route index path="/edit-profile/:id" element={<EditProfile />} />
          <Route index path="/nft-select" element={<NftSelect />} />
          <Route index path="/profile/:contractAddress/:nftId/" element={<Profile />} />
          <Route index path="/reply-super-like" element={<ReplySuperLike />} />
          <Route index path="/select-breed" element={<SelectBreed />} />
          <Route index path="/super-powers" element={<SuperPowers />} />
          <Route index path="/selected-target/:contractAddress/:nftId/:breedId" element={<TargetSelect />} />
          <Route index path="/trait-Bias" element={<TraitBias />} />
          <Route index path="/select-matches" element={<SelectMatches />} />
          <Route index path="/header" element={<Header />} />
          <Route index path="/breed-outcomes" element={<BreedOutcomes />} />
          <Route index path="/breeding-room" element={<BreedingRoom />} />

          {/* <Route index path="/super-like" element={<SuperLike />} /> */}
          <Route index path="*" element={<PageNotFOund />} />
        </Route>
      </Routes>
    </>
  )
}

export default Protected
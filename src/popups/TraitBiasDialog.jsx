import { Box, Slider } from "@mui/material"


function TraitBiasDialog() {
  return (
    <>
      <div className="container">
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias background</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={10} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias body</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={20} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias clothes</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={30} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias mouth</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={40} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias sideburns</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias eyes</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={60} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias moustache</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={70} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias shoes</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={80} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div><div className="traitflex" >
          <div className="w-100">
            <p >Bias hair or a hat</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={90} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div className="traitflex" >
          <div className="w-100">
            <p >Bias loose part</p>
          </div>
          <div>
            <Box sx={{ width: 300 }}>
              <Slider defaultValue={100} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="bt1 heading">Confirm</button>
        </div>
      </div>
    </>
  )
}

export default TraitBiasDialog
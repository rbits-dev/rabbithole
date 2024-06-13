import { useState, useEffect }  from 'react'

// this hook ensures that window size is only updated on the client and not on the server when using Next.js
function useWindowSize () {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    function handleResize () {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize,{passive:true})
    handleResize()

    return () => window.removeEventListener('resize', handleResize,{passive:true})
  }, [])
  return windowSize
}

export default useWindowSize
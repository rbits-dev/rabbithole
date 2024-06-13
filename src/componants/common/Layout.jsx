import Footer from "./Footer"
import Header from "./Header"


// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <div>
     
      <Header />

      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
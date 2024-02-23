import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './Pages/Home';
import TextToSign from './Pages/TextToSign';
import SignToText from "./Pages/SignToText";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';


function App() {
  return(
    <Router>
      <div>
        {/* <Navbar />/ */}
        <Routes>
          <Route exact path='/home' element={<Home />} />
          <Route exact path='/text-to-sign' element={<TextToSign />} />
          <Route exact path='/sign-to-text' element={<SignToText />} />

          <Route exact path='*' element={<Home/>} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App;
import { useEffect, useState } from "react";
import axios from "axios";

import NavigationBar from "./components/NavigationBar";
import "./App.css";
// import logo from './logo.svg';

function App() {
  const baseURL = "http://localhost:7071";
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  //TODO: API functions (more to be added) should be in their own file!
  const getEvents = () => {
    axios
      .get(`${baseURL}/events`)
      .then(function (response) {
        setImages(response.data.scanResults);
        console.log(response);
      })
      .catch(function (error) {
        //TODO: this should display an error in the UI!
        console.log(error);
      });
  };

  useEffect(() => {
    getEvents();
  }, []);

  const handlePreviousImage = () => {
    let newImageIndex = currentImageIndex - 1;
    if (newImageIndex < 0) {
      newImageIndex = images.length - 1;
    }
    setCurrentImageIndex(newImageIndex);
  }

  const handleNextImage = () => {
    let newImageIndex = currentImageIndex + 1;
    if (newImageIndex >= images.length) {
      newImageIndex = 0
    }
    setCurrentImageIndex(newImageIndex);
  }

  return (
    //TODO: This code should be factored out into multiple files
    <div className="App">

      <NavigationBar />

      <div className="Content">

        <button className="Scan-Button" type="button" onClick={handlePreviousImage}>Previous Image</button>

        <div>
          <div className="Image-Header">
            <div> {images.length} total images </div>
            <div> Index: {currentImageIndex} </div>
          </div>

          {images.length > 0 && <img className="Scan-Results" src={images[currentImageIndex].jpg} alt="Potential Leak Scan Results" />}

          {images[currentImageIndex]?.createdOn && (
            <div> Scan Timestamp: {images[currentImageIndex].createdOn} </div>
          )}

          {/* TODO: Finish adding image metadata!  */}
          <div> Image Metadata: INCOMPLETE </div>

          {images[currentImageIndex]?.detectionsList && (
            <div> Number of Detections: {images[currentImageIndex].detectionsList.length} </div>
          )}
        </div>

        <button className="Scan-Button" type="button" onClick={handleNextImage}>Next Image</button>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const baseURL = "http://localhost:7071";
  const [images, setImages] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checked, setChecked] = useState(true);

  //TODO: API functions (more to be added) should be in their own file!
  const getEvents = () => {
    axios
      .get(`${baseURL}/events`)
      .then(function (response) {
        console.log(response.data.scanResults)
        setImages(response.data.scanResults);
        setAllImages(response.data.scanResults);
        let detectionScans = [];
        for (let result of response.data.scanResults) {
          if (result.detectionsList && result.detectionsList.length !== 0) {
            detectionScans.push(result)
          }
        }
        setFilteredImages(detectionScans);
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

  const handleFilterToggle = () => {
    if (checked) {
      setImages(filteredImages);
    } else {
      setImages(allImages);
    }
    setChecked((state) => !state);
  }

  return (
    <div className="Home">

        <button className="Scan-Button" type="button" onClick={handlePreviousImage}>Previous Image</button>

        <div>
          <div className="Image-Header">
            <div> {images.length} total images </div>
            <div> Index: {currentImageIndex} </div>
          </div>

          {images.length > 0 && <img className="Scan-Results" src={images[currentImageIndex].jpg} alt="Potential Leak Scan Results" />}

          <div className="Filter">
            <label htmlFor="Toggle-No-Detection-Scans">
              <input type="checkbox" 
                id="Toggle-No-Detection-Scans" 
                defaultChecked={checked}
                onChange={handleFilterToggle}/>
              Include No-Detection Scans
            </label>
          </div>

          {images[currentImageIndex]?.createdOn && (
            <div> Scan Timestamp: {images[currentImageIndex].createdOn} </div>
          )}

          {/* Metadata */}
          {images[currentImageIndex]?.noiseFloorMetric ? (
            <div> Noise Floor Metric: {images[currentImageIndex].noiseFloorMetric} </div>
          ) : ""}
          {images[currentImageIndex]?.overallConf ? (
            <div> Overall Confidence: {images[currentImageIndex].overallConf} </div>
          ) : ""}

          {images[currentImageIndex]?.detectionsList && (
            <div> Number of Detections: {images[currentImageIndex].detectionsList.length} </div>
          )}

          {images[currentImageIndex]?.detectionsList.map((detection, index) => (
            <div className="Metadata-Group">
              <div>Detection {index + 1} Metadata</div>
              <div>Meancoldens: {detection.meancoldens}</div>
              <div>Meanconf: {detection.meanconf}</div>
              <div>Sumconf: {detection.sumconf}</div>
              <div>UUID: {detection.uuid}</div>
              <div>Roicoordslist: {JSON.stringify(detection.roicoordsList)}</div>
            </div>
          ))}
          
        </div>

        <button className="Scan-Button" type="button" onClick={handleNextImage}>Next Image</button>
    </div>
  )
}

export default Home
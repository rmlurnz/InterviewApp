import { useEffect, useState } from "react";
import { useEventsContext } from "../hooks/useEventsContext";
import axios from "axios";

const Home = () => {
  const baseURL = "http://localhost:7071";

  const {events, dispatch} = useEventsContext();

  const [viewableEvents, setViewableEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [checked, setChecked] = useState(true);

  //TODO: API functions (more to be added) should be in their own file!
  const getEvents = () => {
    axios
      .get(`${baseURL}/events`)
      .then(function (response) {

        console.log(response.data.scanResults);

        dispatch({type: "SET_EVENTS", payload: response.data.scanResults})
   
        setViewableEvents(response.data.scanResults);

        let detectionScans = [];

        for (let result of response.data.scanResults) {
          if (result.detectionsList && result.detectionsList.length !== 0) {
            detectionScans.push(result)
          }
        }

        setFilteredEvents(detectionScans);
      })
      .catch(function (error) {
        //TODO: this should display an error in the UI!
        console.log(error);
      });
  };

  useEffect(() => {
    getEvents();
  }, []);

  const handlePreviousEvent = () => {
    let newEventIndex = currentEventIndex - 1;
    if (newEventIndex < 0) {
      newEventIndex = events.length - 1;
    }
    setCurrentEventIndex(newEventIndex);
  }

  const handleNextEvent = () => {
    let newEventIndex = currentEventIndex + 1;
    if (newEventIndex >= events.length) {
      newEventIndex = 0
    }
    setCurrentEventIndex(newEventIndex);
  }

  const handleFilterToggle = () => {
    if (checked) {
      setViewableEvents(filteredEvents);
    } else {
      setViewableEvents(events);
    }
    setChecked((state) => !state);
  }

  return (
    <div className="Home">
      <button className="Scan-Button" type="button" onClick={handlePreviousEvent}>Previous</button>

      <div>
        <div className="Image-Header">
          <div> {viewableEvents.length} total images </div>
          <div> Index: {currentEventIndex} </div>
        </div>

        {viewableEvents.length > 0 && <img className="Scan-Results" src={viewableEvents[currentEventIndex].jpg} alt="Potential Leak Scan Results" />}

        <div className="Filter">
          <label htmlFor="Toggle-No-Detection-Scans">
            <input type="checkbox" 
              id="Toggle-No-Detection-Scans" 
              defaultChecked={checked}
              onChange={handleFilterToggle}/>
            Include No-Detection Scans
          </label>
        </div>

        {viewableEvents[currentEventIndex]?.createdOn && (
          <div> Scan Timestamp: {viewableEvents[currentEventIndex].createdOn} </div>
        )}

        {/* Metadata */}
        {viewableEvents[currentEventIndex]?.noiseFloorMetric ? (
          <div> Noise Floor Metric: {viewableEvents[currentEventIndex].noiseFloorMetric} </div>
        ) : ""}
        {viewableEvents[currentEventIndex]?.overallConf ? (
          <div> Overall Confidence: {viewableEvents[currentEventIndex].overallConf} </div>
        ) : ""}

        {viewableEvents[currentEventIndex]?.detectionsList && (
          <div> Number of Detections: {viewableEvents[currentEventIndex].detectionsList.length} </div>
        )}

        {viewableEvents[currentEventIndex]?.detectionsList.map((detection, index) => (
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

      <button className="Scan-Button" type="button" onClick={handleNextEvent}>Next</button>
    </div>
  )
}

export default Home;
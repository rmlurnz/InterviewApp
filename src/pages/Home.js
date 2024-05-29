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
  const [error, setError] = useState(null);

  //TODO: API functions (more to be added) should be in their own file!
  useEffect(() => {
    axios
      .get(`${baseURL}/events`)
      .then(function (response) {
        setError(null);

        dispatch({type: "SET_EVENTS", payload: response.data.scanResults});

        setViewableEvents(response.data.scanResults);

        let detectionScans = [];

        for (let result of response.data.scanResults) {
          if (result.detectionsList && result.detectionsList.length !== 0) {
            detectionScans.push(result);
          }
        }

        setFilteredEvents(detectionScans);
      })
      .catch(function (error) {
        setError(error.message);
      });
  }, [dispatch]);

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
    <div className="Home-Container">
      {error ? <div className="Error">{ error }</div> : 
      <div className="Home-Content">

        <div className="Home-Left">
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
        </div>

        <div className="Home-Right">
          <div className="Home-Buttons">
            <button className="Scan-Button" type="button" onClick={handlePreviousEvent}>Previous</button>
            <button className="Scan-Button" type="button" onClick={handleNextEvent}>Next</button>
          </div>

          <table className="Event-Data-Table">
            {viewableEvents[currentEventIndex]?.createdOn && (
              <tr>
                <td>Scan Timestamp:</td>
                <td>{viewableEvents[currentEventIndex].createdOn}</td>
              </tr>
            )}
            {/* Metadata */}
            {viewableEvents[currentEventIndex]?.noiseFloorMetric ? (
              <tr>
                <td>Noise Floor Metric:</td>
                <td>{viewableEvents[currentEventIndex].noiseFloorMetric}</td>
              </tr>
            ) : ""}
            {viewableEvents[currentEventIndex]?.overallConf ? (
              <tr>
                <td>Overall Confidence:</td>
                <td>{viewableEvents[currentEventIndex].overallConf}</td>
              </tr>
            ) : ""}
            {viewableEvents[currentEventIndex]?.detectionsList && (
              <tr>
                <td>Number of Detections:</td>
                <td>{viewableEvents[currentEventIndex].detectionsList.length}</td>
              </tr>
            )}
          </table>

          {viewableEvents[currentEventIndex]?.detectionsList.map((detection, index) => (
              <table className="Event-Data-Table Detection-Table">
                <tr><td className="Detection-Title">Detection {index + 1}</td></tr>
                <tr>
                  <td>Meancoldens:</td>
                  <td>{detection.meancoldens}</td>
                </tr>
                <tr>
                  <td>Meanconf:</td>
                  <td>{detection.meanconf}</td>
                </tr>
                <tr>
                  <td>Sumconf:</td>
                  <td>{detection.sumconf}</td>
                </tr>
                <tr>
                  <td>UUID:</td>
                  <td>{detection.uuid}</td>
                </tr>
                <tr>
                  <td>Roicoordslist:</td>
                  <td>{JSON.stringify(detection.roicoordsList)}</td>
                </tr>
              </table>
          ))}
        </div>        
      </div>}
    </div>
  )
}

export default Home;
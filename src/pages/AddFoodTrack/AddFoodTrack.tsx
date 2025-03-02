import MorningItem from "../../components/DetailedItem/MorningItem/MorningItem";
import { useState, useEffect } from "react";
import ToggleButton from "../../components/ToggleButton/ToggleButton";
import AfternoonItem from "../../components/DetailedItem/AfternoonItem/AfternoonItem";
import "./AddFoodTrack.css";
import EveningItem from "../../components/DetailedItem/EveningItem/EveningItem";
import { Link } from "react-router";
import { useAddFoodTrack } from "../../contexts/AddFoodTrackContext/AddFoodTrackContext";
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { doc, updateDoc,arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useFirebaseDb } from "../../contexts/FirebaseDbContext/FirebaseDbContext";
import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import Loading from "../../components/Loading/Loading";
import checkDateExists from "../../firebase/checkDateExists";

export default function AddFoodTrack() {
  const [morningFoodItemsIsOn, setmorningFoodItemsIsOn] = useState(true);
  const [afternoonFoodItemsIsOn, setAfternoonFoodItemsIsOn] = useState(true);
  const [eveningFoodItemsIsOn, setEveningFoodItemsIsOn] = useState(true);
  const [selectedDate, setSelectedDate] = useState({"rawDate":"","day":"","month":"","year":""});
  const [selectedDateDisplay, setSelectedDateDisplay] = useState("");
  const {morningFoodItems, afternoonFoodItems, eveningFoodItems} = useAddFoodTrack();
  const {currentUser, userLoggedIn,loading} = useAuth();
  const {setFirebaseDbData}=useFirebaseDb();
  const [navigateToHome, setNavigateToHome] = useState(false);
  const {FirebaseDbData,firebaseError,firebaseLoading} = useFirebaseDb();
  const [addfoodtrackLoading, setAddfoodtrackLoading] = useState<boolean>(false);

  useEffect(() => {
    flatpickr("#food-track-date", {
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          const date = selectedDates[0]; 
          const day = parseInt(String(date.getDate()).padStart(2, '0'))
          const month = parseInt(String(date.getMonth() + 1).padStart(2, '0'))
          const year = date.getFullYear();
          setSelectedDateDisplay(`${day}-${month}-${year}`)
          setSelectedDate({"rawDate":date,"day":day,"month":month,"year":year});
        }
      },
      dateFormat: "d-m-Y",
      maxDate:"today",
      minDate:new Date().setDate(new Date().getDate()- 20)});
  }, []);

  const handleOnCreate = async () => {
    setAddfoodtrackLoading(true);
  
    if (checkDateExists(FirebaseDbData["foodtrack"][`${selectedDate.year}`], selectedDateDisplay)) {
      alert("Selected 🗓️date already exists!");
      setAddfoodtrackLoading(false);
      return;
    }
  
    const foodTrackingObject = {
      id: Date.now(),
      date: selectedDateDisplay,
      afternoon_state: afternoonFoodItemsIsOn,
      morning_state: morningFoodItemsIsOn,
      evening_state: eveningFoodItemsIsOn,
      morning_data: morningFoodItems,
      afternoon_data: afternoonFoodItems,
      evening_data: eveningFoodItems,
    };
  
    try {
      const docRef = doc(db, "cal8BitAi", currentUser?.uid);
      await updateDoc(docRef, {
        [`foodtrack.${selectedDate.year}`]: arrayUnion(foodTrackingObject),
      });
      alert("🥗🍗Food track added successfully!");
      setFirebaseDbData((prevState) => ({
        ...prevState,
        foodtrack: {
          ...prevState.foodtrack,
          [selectedDate.year]: [
            ...(prevState.foodtrack[selectedDate.year] || []),
            foodTrackingObject,
          ],
        },
      }));
      setNavigateToHome(true);
    } catch {
      alert("Failed❌ to add food track.");
    } finally {
      setAddfoodtrackLoading(false);
    }
  };

  if (firebaseError !==null){
    return <div className="error-page">{firebaseError}</div>
  }
  if (addfoodtrackLoading || firebaseLoading || loading) {
    return <Loading state={true} />;
  }
  if (navigateToHome) {
    return <Navigate to="/" replace={true} />; 
  }
  if (!userLoggedIn) {
    return <Navigate to="/sign-in" replace={true} />;
  }

  return (
    <>
    <div className="add-food-track-container">
      <h4 style={{ textAlign: "center", paddingBottom: "15px" }}>
        🥗🍗Add Food Track
      </h4>
      <div style={{paddingBottom:"25px"}}>
      <label htmlFor="birthday" style={{paddingRight:"10px"}}>Select a date:</label>
      <input
      style={{padding:"10px", borderRadius:"10px", fontSize:"16px"}}
        type="text"
        id="food-track-date"
        value={selectedDateDisplay}
        readOnly
      />
    </div>
        {/* MorningItem*/}
        <div className="morning-item-container">
          <div className="morning-item-container-header">
            <h5>🌅Morning:</h5>
            <ToggleButton
              isEnable={morningFoodItemsIsOn}
              setIsEnable={setmorningFoodItemsIsOn}
            />
          </div>
          {morningFoodItemsIsOn && <MorningItem />}
        </div>

        {/* AfternoonItem*/}
        <div className="afternoon-item-container">
          <div className="afternoon-item-container-header">
            <h5>🌤️Afternoon:</h5>
            <ToggleButton
              isEnable={afternoonFoodItemsIsOn}
              setIsEnable={setAfternoonFoodItemsIsOn}
            />
          </div>
          {afternoonFoodItemsIsOn && <AfternoonItem />}
        </div>

        {/* EveningItem*/}
        <div className="evening-item-container">
          <div className="evening-item-container-header">
            <h4>🌙Evening:</h4>
            <ToggleButton
              isEnable={eveningFoodItemsIsOn}
              setIsEnable={setEveningFoodItemsIsOn}
            />
          </div>
          {eveningFoodItemsIsOn && <EveningItem />}
        </div>
        <div className="addfoodtrack-footer">
          <Link to="/" className="add-food-track-footer-buttons">
            Cancel❌
          </Link>
          {<button disabled={selectedDateDisplay? false : true} style={{fontWeight: "bold", fontSize: "16px"}} onClick={handleOnCreate}>Create✔️</button>}
        </div>
    </div>
    </>
  );
}

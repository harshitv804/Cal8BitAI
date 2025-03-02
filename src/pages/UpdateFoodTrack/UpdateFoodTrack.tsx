import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useFirebaseDb } from "../../contexts/FirebaseDbContext/FirebaseDbContext";
import Loading from "../../components/Loading/Loading";
import ToggleButton from "../../components/ToggleButton/ToggleButton";
import MorningItemEdit from "../../components/DetailedItem/MorningItem/MorningItemEdit";
import { useUpdateFoodTrack } from "../../contexts/UpdateFoodTrackContext/UpdateFoodTrackContext";
import EveningItemEdit from "../../components/DetailedItem/EveningItem/EveningItemEdit";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import AfternoonItemEdit from "../../components/DetailedItem/AfternoonItem/AfternoonItemEdit";
import { Link, Navigate } from "react-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function UpdateFoodTrack() {
  const { year, index } = useParams();
  const { FirebaseDbData, setFirebaseDbData, firebaseError, firebaseLoading } =
    useFirebaseDb();
  const [morningFoodItemsIsOn, setmorningFoodItemsIsOn] = useState(true);
  const [afternoonFoodItemsIsOn, setAfternoonFoodItemsIsOn] = useState(true);
  const [eveningFoodItemsIsOn, setEveningFoodItemsIsOn] = useState(true);
  const { currentUser, userLoggedIn, loading } = useAuth();
  const [addfoodtrackLoading, setAddfoodtrackLoading] =
    useState<boolean>(false);
  const [navigateToHome, setNavigateToHome] = useState(false);
  const [indexFirebaseData, setIndexFirebaseData] = useState(null);
  const {
    setEditMorningFoodItems,
    setEditEveningFoodItems,
    setEditAfternoonFoodItems,
    editMorningFoodItems,
    editAfternoonFoodItems,
    editEveningFoodItems,
  } = useUpdateFoodTrack();

  useEffect(() => {
    if (FirebaseDbData && FirebaseDbData["foodtrack"][year] && FirebaseDbData["foodtrack"][year][index]) {
      const currentTrack = FirebaseDbData["foodtrack"][year][index];
      setIndexFirebaseData(FirebaseDbData["foodtrack"][year]);
      setmorningFoodItemsIsOn(currentTrack["morning_state"]);
      setAfternoonFoodItemsIsOn(currentTrack["afternoon_state"]);
      setEveningFoodItemsIsOn(currentTrack["evening_state"]);
  
      setEditMorningFoodItems(currentTrack["morning_data"]);
      setEditAfternoonFoodItems(currentTrack["afternoon_data"]);
      setEditEveningFoodItems(currentTrack["evening_data"]);
    } else {
      setNavigateToHome(true);
    }
  }, [FirebaseDbData, year, index]);

  const handleOnUpdate = async () => {
    setAddfoodtrackLoading(true);
    const updateFoodTrackingObject = {
      afternoon_state: afternoonFoodItemsIsOn,
      morning_state: morningFoodItemsIsOn,
      evening_state: eveningFoodItemsIsOn,
      morning_data: editMorningFoodItems,
      afternoon_data: editAfternoonFoodItems,
      evening_data: editEveningFoodItems,
    };
    const updatedObject = {
      ...FirebaseDbData["foodtrack"][year][index],
      ...updateFoodTrackingObject,
    };
    const updatedArray = [
      ...FirebaseDbData["foodtrack"][year].slice(0, index),
      updatedObject,
      ...FirebaseDbData["foodtrack"][year].slice(index + 1),
    ];
    try {
      const docRef = doc(db, "cal8BitAi", currentUser?.uid);
      await updateDoc(docRef, {
        [`foodtrack.${year}`]: updatedArray,
      });
      setFirebaseDbData((prevState) => ({
        ...prevState,
        foodtrack: {
          ...prevState.foodtrack,
          [`${year}`]: updatedArray,
        },
      }));
      alert("🥗🍗Food track Updated successfully!");
      setNavigateToHome(true);
    } catch (error) {
      alert("Failed❌ to update food track.");
    } finally {
      setAddfoodtrackLoading(false);
    }
  };
  const handleOnDelete = async () => {
    setAddfoodtrackLoading(true);
    const updatedArray = [
      ...FirebaseDbData["foodtrack"][year].slice(0, index),
      ...FirebaseDbData["foodtrack"][year].slice(index + 1),
    ];
    try {
      const docRef = doc(db, "cal8BitAi", currentUser?.uid);
      await updateDoc(docRef, {
        [`foodtrack.${year}`]: updatedArray,
      });
      setFirebaseDbData((prevState) => ({
        ...prevState,
        foodtrack: {
          ...prevState.foodtrack,
          [`${year}`]: updatedArray,
        },
      }));
      alert("🥗🍗Food track Deleted successfully!");
      setNavigateToHome(true);
    } catch (error) {
      alert("Failed❌ to deleted food track.");
    } finally {
      setAddfoodtrackLoading(false);
    }
  };
  if (firebaseError !== null) {
    return <div className="error-page">{firebaseError}</div>;
  }
  if (navigateToHome) {
    return <Navigate to="/" replace={true} />;
  }
  if (!userLoggedIn) {
    return <Navigate to="/sign-in" replace={true} />;
  }
  if (addfoodtrackLoading || firebaseLoading || loading) {
    return <Loading state={true} />;
  }

  return (
    <>
      <div className="add-food-track-container">
      <h4 style={{ textAlign: "center", paddingBottom: "15px" }}>
        🥗🔔Update Food Track
      </h4>
        <h5 style={{ textAlign: "center", paddingBottom: "15px" }}>📆 {FirebaseDbData["foodtrack"][year][index]["date"]}</h5>
        <div className="morning-item-container">
          <div className="morning-item-container-header">
            <h5>🌅Morning:</h5>
            <ToggleButton
              isEnable={morningFoodItemsIsOn}
              setIsEnable={setmorningFoodItemsIsOn}
            />
          </div>
          {morningFoodItemsIsOn && <MorningItemEdit />}
        </div>
        <div className="afternoon-item-container">
          <div className="afternoon-item-container-header">
            <h5>🌤️Afternoon:</h5>
            <ToggleButton
              isEnable={afternoonFoodItemsIsOn}
              setIsEnable={setAfternoonFoodItemsIsOn}
            />
          </div>
          {afternoonFoodItemsIsOn && <AfternoonItemEdit />}
        </div>
        <div className="evening-item-container">
          <div className="evening-item-container-header">
            <h5>🌙Evening:</h5>
            <ToggleButton
              isEnable={eveningFoodItemsIsOn}
              setIsEnable={setEveningFoodItemsIsOn}
            />
          </div>
          {eveningFoodItemsIsOn && <EveningItemEdit />}
        </div>
        <div className="addfoodtrack-footer">
          <Link to="/" className="add-food-track-footer-buttons">
            Cancel❌
          </Link>
          <button
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              backgroundColor: "#FF0000",
              color: "white",
            }}
            onClick={handleOnDelete}
          >
            Delete🗑️
          </button>
          <button
            style={{ fontWeight: "bold", fontSize: "16px" }}
            onClick={handleOnUpdate}
          >
            Update🔔
          </button>
        </div>
      </div>
    </>
  );
}

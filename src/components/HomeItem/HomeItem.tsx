import './HomeItem.css';
import { useFirebaseDb } from "../../contexts/FirebaseDbContext/FirebaseDbContext";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { Link, Navigate } from "react-router"; 
import Loading from "../Loading/Loading";
import AddFoodTrackButton from "../AddFoodTrackButton/AddFoodTrackButton";
import { useState, useEffect } from 'react';
import Pagination from '../Pagination/Pagination';

export default function HomeItem() {
  const { FirebaseDbData, firebaseLoading, firebaseError } = useFirebaseDb();
  const { userLoggedIn, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]); 

  // Fetch available years from Firebase data
  useEffect(() => {
    if (FirebaseDbData && FirebaseDbData["foodtrack"]) {
      const keys = Object.keys(FirebaseDbData["foodtrack"]);
      setAvailableYears(keys);
      if (!selectedYear) {
        setSelectedYear(keys[keys.length - 1]);
      }
    }
  }, [FirebaseDbData]);

  // Redirect if the user is not logged in
  if (!userLoggedIn) {
    return <Navigate to="/sign-in" replace={true} />;
  }

  // Show loading spinner if data is loading
  if (firebaseLoading || loading) {
    return <Loading state={true} />;
  }

  // Show error if Firebase encountered an error
  if (firebaseError !== null) {
    return <div className='error-page'>{firebaseError}</div>;
  }

  const foodTrackData = selectedYear ? FirebaseDbData["foodtrack"][selectedYear] : [];
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentItems = Array.isArray(foodTrackData)
    ? foodTrackData.slice(firstPostIndex, lastPostIndex)
    : [];

  // Helper function to calculate totals
  const calculateTotals = (data: any) => {
    let totalCalories = 0;
    let totalProteins = 0;

    if (data["morning_state"]) {
      totalCalories += data["morning_data"]?.reduce((sum: number, item: any) => sum + item.calories, 0) || 0;
      totalProteins += data["morning_data"]?.reduce((sum: number, item: any) => sum + item.protein, 0) || 0;
    }

    if (data["afternoon_state"]) {
      totalCalories += data["afternoon_data"]?.reduce((sum: number, item: any) => sum + item.calories, 0) || 0;
      totalProteins += data["afternoon_data"]?.reduce((sum: number, item: any) => sum + item.protein, 0) || 0;
    }

    if (data["evening_state"]) {
      totalCalories += data["evening_data"]?.reduce((sum: number, item: any) => sum + item.calories, 0) || 0;
      totalProteins += data["evening_data"]?.reduce((sum: number, item: any) => sum + item.protein, 0) || 0;
    }

    return { totalCalories, totalProteins };
  };

  return (
    <div className="homeitem-container">
      <div className="year-selector" style={{ marginBottom: "20px" }}>
        <label htmlFor="year-select" style={{ paddingRight: "10px" }}>Filter by Year:</label>
        <select
          id="year-select"
          value={selectedYear || ""}
          style={{ padding: "10px", fontWeight: "bold", border: "2px solid", borderRadius: "10px" }}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="homeitem">
        {FirebaseDbData["foodtrack"] && currentItems.length > 0 ? (
          currentItems.map((foodtrack: any, index: number) => {
            const globalIndex = firstPostIndex + index;
            const { totalCalories, totalProteins } = calculateTotals(foodtrack);

            return (
              <div className="item-container" key={globalIndex}>
                <div className="item-header">
                  <div className="date-box">
                    <p>{foodtrack["date"]}</p>
                  </div>
                  <div className="meal-selection">
                    <span>
                      M-<span className={foodtrack["morning_state"] ? "circle-true" : "circle-false"}></span>
                    </span>
                    <span>
                      A-<span className={foodtrack["afternoon_state"] ? "circle-true" : "circle-false"}></span>
                    </span>
                    <span>
                      E-<span className={foodtrack["evening_state"] ? "circle-true" : "circle-false"}></span>
                    </span>
                  </div>
                </div>
                <div className="item-info-container">
                  <div className="calories-box">
                    <p className="label">Calories:</p>
                    <p className="value">{totalCalories} kcal</p>
                  </div>
                  <div className="protein-box">
                    <p className="label">Proteins:</p>
                    <p className="value">{totalProteins} mg</p>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Link
                    style={{
                      backgroundColor: "#292929",
                      color: "white",
                      textDecoration: "none",
                      padding: "6px 10px",
                      borderRadius: "10px",
                    }}
                    to={`/edit/${selectedYear}/${globalIndex}`}
                  >
                    Edit✏️
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          selectedYear === availableYears[availableYears.length - 1] ? (
            <div className='error-page'>Add✨ your first Food Track!</div>
          ) : (
            <div className='error-page'>No data🗂️ found!</div>
          )
        )}
        {selectedYear && (
          <Pagination
            totalPosts={foodTrackData.length}
            postsPerPage={postsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
      <AddFoodTrackButton />
    </div>
  );
}

import { Link } from "react-router";
import './AddFoodTrackButton.css';

export default function AddFoodTrackButton() {
  return (
    <div className="add-food-track-button-container">
          <Link to="/addfoodtrack" className="add-food-track-button">
            Add FoodTrack✔️
          </Link>
      </div>
  );
}

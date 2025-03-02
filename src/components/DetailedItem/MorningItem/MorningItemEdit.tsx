import { memo, useState } from "react";
import "./MorningItem.css";
import { useUpdateFoodTrack } from "../../../contexts/UpdateFoodTrackContext/UpdateFoodTrackContext";
import { hfModelApi } from "../../../hfModel/hfModelApi";

const MorningItemEdit = function MorningItem() {
  const {editMorningFoodItems,setEditMorningFoodItems,editAddFoodItem,editRemoveFoodItem,editHandleInputChange} = useUpdateFoodTrack();
    const [loadingItems, setLoadingItems] = useState({});
  
    const handleOnAI = async (id) => {
      setLoadingItems((prevState) => ({ ...prevState, [id]: true })); // Mark as loading for this item
  
      const idItem = editMorningFoodItems.find((item) => item.id === id);
    
      if (idItem) {
        const result = await hfModelApi({jsonObject: idItem});
        if (result) {
          setEditMorningFoodItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id
                ? { ...item, name: result.name, quantity: result.quantity, calories: result.calories, protein: result.protein }
                : item
            )
          );
        }
      }
  
      setLoadingItems((prevState) => ({ ...prevState, [id]: false })); // Mark as not loading after the update
    };
  return (
    <div className="detailed-item-container">
      {editMorningFoodItems.length !== 0 && (
        <div className="detailed-item-titles">
          <div className="detailed-item-food">Food</div>
          <div className="detailed-item-qty">Quantity</div>
          <div className="detailed-item-calories">Calories</div>
          <div className="detailed-item-proteins">Proteins (mg)</div>
        </div>
      )}

      {editMorningFoodItems.map((item) => (
        <div key={item.id} className="detailed-item">
          <textarea
            className="detailed-item-textarea"
            rows={2}
            cols={15}
            value={item.name}
            onChange={(e) => editHandleInputChange("morning", item.id, "name", e.target.value)}
          />
          <textarea
            className="input-qty"
            rows={2}
            cols={15}
            value={item.quantity}
            onChange={(e) => editHandleInputChange("morning", item.id, "quantity", e.target.value)}
          />
          <input
            type="number"
            className="input-cal-pro"
            value={item.calories}
            min={1}
            max={1000}
            onChange={(e) => editHandleInputChange("morning", item.id, "calories", parseInt(e.target.value, 10) || 0)}
          />
          <input
            type="number"
            className="input-cal-pro"
            value={item.protein}
            onChange={(e) => editHandleInputChange("morning", item.id, "protein", parseInt(e.target.value, 10) || 0)}
          />
                    <button 
            className="ai-improve-button" 
            onClick={() => handleOnAI(item.id)} 
            disabled={loadingItems[item.id]} 
          >
            {!loadingItems[item.id] ? "AI✨" : "⏳"}
          </button>
          {editMorningFoodItems.length>1 &&
          <button
            className="delete-button"
            onClick={() => editRemoveFoodItem("morning", item.id)}
          >
            ➖
          </button>}
        </div>
      ))}
      <div>
        <button onClick={() => editAddFoodItem("morning")} className="add-button">
          ➕
        </button>
      </div>
    </div>
  );
};

export default MorningItemEdit;

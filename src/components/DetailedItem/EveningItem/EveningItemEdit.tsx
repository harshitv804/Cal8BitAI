import { useState } from "react";
import { useUpdateFoodTrack } from "../../../contexts/UpdateFoodTrackContext/UpdateFoodTrackContext";
import "./EveningItem.css";
import { hfModelApi } from "../../../hfModel/hfModelApi";

const EveningItemEdit = function EveningItem() {
  const {editEveningFoodItems,setEditEveningFoodItems,editAddFoodItem,editRemoveFoodItem,editHandleInputChange} = useUpdateFoodTrack();
  const [loadingItems, setLoadingItems] = useState({});
  
    const handleOnAI = async (id) => {
      setLoadingItems((prevState) => ({ ...prevState, [id]: true }));
  
      const idItem = editEveningFoodItems.find((item) => item.id === id);
    
      if (idItem) {
        const result = await hfModelApi({jsonObject: idItem});
        if (result) {
          setEditEveningFoodItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id
                ? { ...item, name: result.name, quantity: result.quantity, calories: result.calories, protein: result.protein }
                : item
            )
          );
        }
      }
  
      setLoadingItems((prevState) => ({ ...prevState, [id]: false }));
    };
  return (
    <div className="detailed-item-container">
      {editEveningFoodItems.length !== 0 && (
        <div className="detailed-item-titles">
          <div className="detailed-item-food">Food</div>
          <div className="detailed-item-qty">Quantity</div>
          <div className="detailed-item-calories">Calories</div>
          <div className="detailed-item-proteins">Proteins (mg)</div>
        </div>
      )}

      {editEveningFoodItems.map((item) => (
        <div key={item.id} className="detailed-item">
          <textarea
            className="detailed-item-textarea"
            rows={2}
            cols={15}
            value={item.name}
            onChange={(e) => editHandleInputChange("evening", item.id, "name", e.target.value)}
          />
          <textarea
            className="input-qty"
            rows={2}
            cols={15}
            value={item.quantity}
            onChange={(e) => editHandleInputChange("evening", item.id, "quantity", e.target.value)}
          />
          <input
            type="number"
            className="input-cal-pro"
            value={item.calories}
            min={1}
            max={1000}
            onChange={(e) => editHandleInputChange("evening", item.id, "calories", parseInt(e.target.value, 10) || 0)}
          />
          <input
            type="number"
            className="input-cal-pro"
            value={item.protein}
            onChange={(e) => editHandleInputChange("evening", item.id, "protein", parseInt(e.target.value, 10) || 0)}
          />
          <button 
            className="ai-improve-button" 
            onClick={() => handleOnAI(item.id)} 
            disabled={loadingItems[item.id]} 
          >
            {!loadingItems[item.id] ? "AI✨" : "⏳"}
          </button>
          {editEveningFoodItems.length>1 &&
          <button
            className="delete-button"
            onClick={() => editRemoveFoodItem("evening", item.id)}
          >
            ➖
          </button>}
        </div>
      ))}
      <div>
        <button onClick={() => editAddFoodItem("evening")} className="add-button">
          ➕
        </button>
      </div>
    </div>
  );
};

export default EveningItemEdit;

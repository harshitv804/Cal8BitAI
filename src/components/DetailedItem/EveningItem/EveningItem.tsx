import { memo, useState } from "react";
import { useAddFoodTrack } from "../../../contexts/AddFoodTrackContext/AddFoodTrackContext";
import "./EveningItem.css";
import { hfModelApi } from "../../../hfModel/hfModelApi";

const EveningItem = memo(function EveningItem() {
  const {
    eveningFoodItems,
    setEveningFoodItems,
    addFoodItem,
    removeFoodItem,
    handleInputChange,
  } = useAddFoodTrack();
  const [loadingItems, setLoadingItems] = useState({});
  const handleOnAI = async (id) => {
    setLoadingItems((prevState) => ({ ...prevState, [id]: true }));

    const idItem = eveningFoodItems.find((item) => item.id === id);

    if (idItem) {
      const result = await hfModelApi({jsonObject: idItem});
      if (result) {
        setEveningFoodItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  name: result.name,
                  quantity: result.quantity,
                  calories: result.calories,
                  protein: result.protein,
                }
              : item
          )
        );
      }
    }

    setLoadingItems((prevState) => ({ ...prevState, [id]: false }));
  };
  return (
    <div className="detailed-item-container">
      {eveningFoodItems.length !== 0 && (
        <div className="detailed-item-titles">
          <div className="detailed-item-food">Food</div>
          <div className="detailed-item-qty">Quantity</div>
          <div className="detailed-item-calories">Calories</div>
          <div className="detailed-item-proteins">Proteins (mg)</div>
        </div>
      )}

      {eveningFoodItems.map((item) => (
        <div key={item.id} className="detailed-item">
          <textarea
            className="detailed-item-textarea"
            rows={2}
            cols={15}
            value={item.name}
            onChange={(e) =>
              handleInputChange("evening", item.id, "name", e.target.value)
            }
          />
          <textarea
            className="input-qty"
            rows={2}
            cols={15}
            value={item.quantity}
            onChange={(e) =>
              handleInputChange("evening", item.id, "quantity", e.target.value)
            }
          />
          <input
            className="input-cal-pro"
            type="number"
            value={item.calories}
            min={1}
            max={1000}
            onChange={(e) =>
              handleInputChange(
                "evening",
                item.id,
                "calories",
                parseInt(e.target.value, 10) || 0
              )
            }
          />
          <input
            className="input-cal-pro"
            type="number"
            value={item.protein}
            onChange={(e) =>
              handleInputChange(
                "evening",
                item.id,
                "protein",
                parseInt(e.target.value, 10) || 0
              )
            }
          />
          <button
            className="ai-improve-button"
            onClick={() => handleOnAI(item.id)}
            disabled={loadingItems[item.id]}
          >
            {!loadingItems[item.id] ? "AI✨" : "⏳"}
          </button>
          {eveningFoodItems.length > 1 && (
            <button
              className="delete-button"
              onClick={() => removeFoodItem("evening", item.id)}
            >
              ➖
            </button>
          )}
        </div>
      ))}
      <div>
        <button onClick={() => addFoodItem("evening")} className="add-button">
          ➕
        </button>
      </div>
    </div>
  );
});

export default EveningItem;

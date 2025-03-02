import { memo, useState } from "react";
import { useAddFoodTrack } from "../../../contexts/AddFoodTrackContext/AddFoodTrackContext";
import "./MorningItem.css";
import { hfModelApi } from "../../../hfModel/hfModelApi";

const MorningItem = memo(function MorningItem() {
  const {
    morningFoodItems,
    addFoodItem,
    setMorningFoodItems,
    removeFoodItem,
    handleInputChange,
  } = useAddFoodTrack();
  const [loadingItems, setLoadingItems] = useState({});
  const handleOnAI = async (id) => {
    setLoadingItems((prevState) => ({ ...prevState, [id]: true }));

    const idItem = morningFoodItems.find((item) => item.id === id);

    if (idItem) {
      const result = await hfModelApi({jsonObject: idItem});
      if (result) {
        setMorningFoodItems((prevItems) =>
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
      {morningFoodItems.length !== 0 && (
        <div className="detailed-item-titles">
          <div className="detailed-item-food">Food</div>
          <div className="detailed-item-qty">Quantity</div>
          <div className="detailed-item-calories">Calories</div>
          <div className="detailed-item-proteins">Proteins (mg)</div>
        </div>
      )}

      {morningFoodItems.map((item) => (
        <div key={item.id} className="detailed-item">
          <textarea
            className="detailed-item-textarea"
            rows={2}
            cols={15}
            value={item.name}
            onChange={(e) =>
              handleInputChange("morning", item.id, "name", e.target.value)
            }
          />
          <textarea
            className="input-qty"
            rows={2}
            cols={15}
            value={item.quantity}
            onChange={(e) =>
              handleInputChange("morning", item.id, "quantity", e.target.value)
            }
          />
          <input
            type="number"
            className="input-cal-pro"
            value={item.calories}
            min={1}
            max={1000}
            onChange={(e) =>
              handleInputChange(
                "morning",
                item.id,
                "calories",
                parseInt(e.target.value, 10) || 0
              )
            }
          />
          <input
            type="number"
            className="input-cal-pro"
            value={item.protein}
            onChange={(e) =>
              handleInputChange(
                "morning",
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
          </button>{" "}
          {morningFoodItems.length > 1 && (
            <button
              className="delete-button"
              onClick={() => removeFoodItem("morning", item.id)}
            >
              ➖
            </button>
          )}
        </div>
      ))}
      <div>
        <button onClick={() => addFoodItem("morning")} className="add-button">
          ➕
        </button>
      </div>
    </div>
  );
});

export default MorningItem;

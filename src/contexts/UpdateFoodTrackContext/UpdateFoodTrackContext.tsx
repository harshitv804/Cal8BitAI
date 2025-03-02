import {createContext, useState,useContext, useEffect} from "react";

type TFoodItem = {
    id: number;
    name: string;
    quantity: string;
    calories: number;
    protein: number;
  };
  
const UpdateFoodTrackContext = createContext<any>(undefined);

export default function UpdateFoodTrackContextProvider({children}){
    const [editMorningFoodItems, setEditMorningFoodItems] = useState<TFoodItem[]>([]);
    const [editAfternoonFoodItems, setEditAfternoonFoodItems] = useState<TFoodItem[]>([]);
    const [editEveningFoodItems, setEditEveningFoodItems] = useState<TFoodItem[]>([]);

    const editHandleInputChange = (meal,id,field,value)=>{
        const clampValue = (value,field)=>{
            if (field ==="calories"){
                return(Math.max(0,Math.min(3000,parseInt(value))))
            }
            else if(field === "protein"){
                return(Math.max(0,Math.min(1000,parseInt(value))))
            }
            else{
                return value
            }
        }
        
        const updateItems = (items,setItems)=>{
            setItems(items.map((item)=>item.id === id ? {...item, [field]:clampValue(value,field)}:item))
        }
        if (meal==="morning"){
            updateItems(editMorningFoodItems,setEditMorningFoodItems);
        }else if (meal==="afternoon"){
            updateItems(editAfternoonFoodItems,setEditAfternoonFoodItems);
        }else {
            updateItems(editEveningFoodItems,setEditEveningFoodItems)
        }
    }
    const editAddFoodItem = (meal: "morning" | "afternoon" | "evening") => {
        const newItem: TFoodItem = {
          id: Date.now(),
          name: "",
          quantity: "",
          calories: 0,
          protein: 0,
        };
    
        if (meal === "morning") {
            setEditMorningFoodItems([...editMorningFoodItems, newItem]);
        } else if (meal === "afternoon") {
            setEditAfternoonFoodItems([...editAfternoonFoodItems, newItem]);
        } else {
            setEditEveningFoodItems([...editEveningFoodItems, newItem]);
        }
      };

      const editRemoveFoodItem = (meal: "morning" | "afternoon" | "evening", id: number) => {
        if (meal === "morning") {
          setEditMorningFoodItems(editMorningFoodItems.filter((item) => item.id !== id));
        } else if (meal === "afternoon") {
          setEditAfternoonFoodItems(editAfternoonFoodItems.filter((item) => item.id !== id));
        } else {
          setEditEveningFoodItems(editEveningFoodItems.filter((item) => item.id !== id));
        }
      };
    return(
        <UpdateFoodTrackContext.Provider value={
            {setEditMorningFoodItems,setEditEveningFoodItems,setEditAfternoonFoodItems,editMorningFoodItems,editAfternoonFoodItems,editEveningFoodItems,editAddFoodItem,editRemoveFoodItem,editHandleInputChange}
        }>
            {children}
        </UpdateFoodTrackContext.Provider>
    )
}

export const useUpdateFoodTrack=()=>{
    return (useContext(UpdateFoodTrackContext))
}
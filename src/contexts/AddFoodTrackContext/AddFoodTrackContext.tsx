import React, {createContext, useState,useContext} from "react";

type TFoodItem = {
    id: number;
    name: string;
    quantity: string;
    calories: number;
    protein: number;
  };

type TAddFoodTrackContext = {
    morningFoodItems:TFoodItem[];
    afternoonFoodItems:TFoodItem[];
    eveningFoodItems:TFoodItem[];
}
  
const AddFoodTrackContext = createContext<any>(undefined);

export default function AddFoodTrackProvider({children}){
    const [morningFoodItems, setMorningFoodItems] = useState<TFoodItem[]>([{"id":1735924467261,"name":"","quantity":"","calories":0,"protein":0}]);
    const [afternoonFoodItems, setAfternoonFoodItems] = useState<TFoodItem[]>([{"id":1735924467561,"name":"","quantity":"","calories":0,"protein":0}]);
    const [eveningFoodItems, setEveningFoodItems] = useState<TFoodItem[]>([{"id":1735924437261,"name":"","quantity":"","calories":0,"protein":0}]);

    const handleInputChange = (meal,id,field,value)=>{

        const clampValue = (value,field)=>{
            if (field ==="calories"){
                return(Math.max(0,Math.min(3000,value)))
            }
            else if(field === "protein"){
                return(Math.max(0,Math.min(1000,value)))
            }
            else{
                return value
            }
        }
        
        const updateItems = (items,setItems)=>{
            setItems(items.map((item)=>item.id === id ? {...item, [field]:clampValue(value,field)}:item))
        }
        if (meal==="morning"){
            updateItems(morningFoodItems,setMorningFoodItems);
        }else if (meal==="afternoon"){
            updateItems(afternoonFoodItems,setAfternoonFoodItems);
        }else {
            updateItems(eveningFoodItems,setEveningFoodItems)
        }
    }
    const addFoodItem = (meal: "morning" | "afternoon" | "evening") => {
        const newItem: TFoodItem = {
          id: Date.now(),
          name: "",
          quantity: "",
          calories: 0,
          protein: 0,
        };
    
        if (meal === "morning") {
            setMorningFoodItems([...morningFoodItems, newItem]);
        } else if (meal === "afternoon") {
            setAfternoonFoodItems([...afternoonFoodItems, newItem]);
        } else {
            setEveningFoodItems([...eveningFoodItems, newItem]);
        }
      };

      const removeFoodItem = (meal: "morning" | "afternoon" | "evening", id: number) => {
        if (meal === "morning") {
          setMorningFoodItems(morningFoodItems.filter((item) => item.id !== id));
        } else if (meal === "afternoon") {
          setAfternoonFoodItems(afternoonFoodItems.filter((item) => item.id !== id));
        } else {
          setEveningFoodItems(eveningFoodItems.filter((item) => item.id !== id));
        }
      };
    return(
        <AddFoodTrackContext.Provider value={
            {morningFoodItems, setMorningFoodItems, setAfternoonFoodItems, setEveningFoodItems, afternoonFoodItems,eveningFoodItems,addFoodItem,removeFoodItem,handleInputChange}
        }>
            {children}
        </AddFoodTrackContext.Provider>
    )
}

export const useAddFoodTrack=()=>{
    return (useContext(AddFoodTrackContext))
}
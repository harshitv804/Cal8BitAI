import "./ToggleButton.css"

export default function ToggleButton({isEnable,setIsEnable}){
    const handleclick=()=>{
        setIsEnable(!isEnable);
    };
    return(
        <button onClick={handleclick} className={`toggle-button ${!isEnable?"enable":"disable"}`}>
            {!isEnable?"Enable":"Disable"}
        </button>
    )
}
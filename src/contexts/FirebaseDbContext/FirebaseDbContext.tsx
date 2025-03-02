import { createContext,useState,useContext, ReactNode, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../AuthContext/AuthContext";

const FirebaseDbContext = createContext<any>(null);

export default function FirebaseDbProvider({children}:{children:ReactNode}){
    const [FirebaseDbData,setFirebaseDbData] = useState<any>(null);
    const {userLoggedIn,currentUser} = useAuth();
    const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);
    const [firebaseError, setFirebaseError] = useState<string|null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
          if (userLoggedIn) {
            try {
              const docRef = doc(db, "cal8BitAi", currentUser?.uid);
              const docSnap = await getDoc(docRef);
      
              if (docSnap.exists()) {
                // Check if the document is empty (i.e., if there's no foodtrack data)
                const data = docSnap.data();
                if (!data.foodtrack || Object.keys(data.foodtrack).length === 0) {
                  const defaultData = { foodtrack: { [new Date().getFullYear()]: [] } };
                  await setDoc(docRef, defaultData); 
                  setFirebaseDbData(defaultData); 
                } else {
                  setFirebaseDbData(data);
                }
              } else {
                const defaultData = { foodtrack: { [new Date().getFullYear()]: [] } };
                await setDoc(docRef, defaultData); 
                setFirebaseDbData(defaultData); 
              }
            } catch {
              setFirebaseError("❌Failed Connecting to Database. Please Try Again Later😔.");
            } finally {
              setFirebaseLoading(false);
            }
          }
        };
        fetchDocument();
      }, [userLoggedIn]);
      

    return (
        <FirebaseDbContext.Provider value={{FirebaseDbData,setFirebaseDbData,firebaseLoading,firebaseError}}>
            {children}
        </FirebaseDbContext.Provider>
    )
}

export function useFirebaseDb() {
    const context = useContext(FirebaseDbContext);
    return context;
  }
  
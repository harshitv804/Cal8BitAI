import HomeItem from "./components/HomeItem/HomeItem";
import FirebaseDbProvider from "./contexts/FirebaseDbContext/FirebaseDbContext";
import { BrowserRouter, Routes, Route } from "react-router";
import AddFoodTrackProvider from "./contexts/AddFoodTrackContext/AddFoodTrackContext";
import AddFoodTrack from "./pages/AddFoodTrack/AddFoodTrack";
import GSignIn from "./components/GSignIn/GSignIn";
import AuthProvider from "./contexts/AuthContext/AuthContext";
import Header from "./components/Header/Header";
import UpdateFoodTrack from "./pages/UpdateFoodTrack/UpdateFoodTrack";
import UpdateFoodTrackContextProvider from "./contexts/UpdateFoodTrackContext/UpdateFoodTrackContext";

function App() {
  return (
    <AuthProvider>
      <FirebaseDbProvider>
        <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/sign-in" element={<GSignIn />} />
            <Route path="/addfoodtrack" element={<AddFoodTrackProvider><AddFoodTrack /></AddFoodTrackProvider>} />
            <Route path="/" element={<HomeItem />} />
            <Route path="/edit/:year/:index" element={<UpdateFoodTrackContextProvider><UpdateFoodTrack/></UpdateFoodTrackContextProvider>} />
            <Route path="*" element={<GSignIn />} />
          </Routes>
        </BrowserRouter>
      </FirebaseDbProvider>
    </AuthProvider>
  );
}

export default App;

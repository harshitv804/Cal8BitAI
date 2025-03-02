import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { signInWithGoogle } from "../../firebase/auth";
import { Navigate } from "react-router";  // Use 'react-router-dom' instead of 'react-router'

function GSignIn() {
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { userLoggedIn } = useAuth();

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      signInWithGoogle().catch(err => {
        setErrorMessage(err.message);
        setIsSigningIn(false);
      });
    }
  };

  return (
    <div className="g-sign-in">
      {userLoggedIn && <Navigate to="/" replace={true} />}
      <h3>🥗Cal8BitAI🍗</h3><br></br>
      <button onClick={onGoogleSignIn} style={{borderRadius:"10px", padding:"20px",fontWeight:"bold"}} disabled={isSigningIn}>
        {isSigningIn ? '🔑Signing in...' : '🔐SignIn with Google'}
      </button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default GSignIn;

import { ReactNode, useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { auth } from '../../firebase/firebase';

type TAuthContext = {
  currentUser: string | null;
  logIn: (email: string, password: string) => Promise<void>;
};
type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<TAuthContext | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading,setLoading]= useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(initialzeUser);
    return unsubscribe;
  }, []);
  async function initialzeUser(user) {
    if(user){
      setCurrentUser({...user});
      setUserLoggedIn(true);
    }else{
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }
    const values = {
      currentUser,
      userLoggedIn,
      loading
    };

  return (
    <AuthContext.Provider value={values}>
      {!loading&&children}
    </AuthContext.Provider>
  )
}

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type UserContextType = {
  currentUser: string | null;
  setCurrentUser: (user: string | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUserState] = useState<string | null>(() => {
    return localStorage.getItem('currentUser');
  });
  const navigate = useNavigate();

  const setCurrentUser = (user: string | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('currentUser', user);
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUser') {
        setCurrentUserState(event.newValue);
        if (!event.newValue) {
          navigate('/login');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
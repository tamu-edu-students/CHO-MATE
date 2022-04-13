import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useState, useContext, useEffect } from 'react';

import LoadingIndicator from '../components/LoadingIndicator';
import { auth } from '../config/firebase';
import AuthStack from './AuthStack';
import MainNavigation from './tabs';

export default function RootNavigator() {
  const [user, setUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribeFromAuthStatuChanged;
  }, [user]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return <NavigationContainer>{user ? <MainNavigation /> : <AuthStack />}</NavigationContainer>;
}

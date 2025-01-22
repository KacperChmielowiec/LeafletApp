import React, { createContext, useContext, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';
import {DarkBackground} from '../style/style'
const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
        <DarkBackground disappear={loading}>
        <LoadingOverlay
        active={loading}
        spinner={true}
        text='Loading your content...'
        >
        </LoadingOverlay>
      </DarkBackground>
      {children}
    </LoadingContext.Provider>
  );
};

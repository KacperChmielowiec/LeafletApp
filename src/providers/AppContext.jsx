
import { ModalProvider } from './ModalProvider';
import { LoadingProvider } from './SpinnerContext';
import { GameStateProvider } from './GameStateProvider';
const AppProviders = ({ children }) => {
  return (
    <LoadingProvider>
        <ModalProvider>
          <GameStateProvider>
            {children}
          </GameStateProvider>
        </ModalProvider>
    </LoadingProvider>
  );
};

export default AppProviders;
import React, { useState } from 'react';
import Menu from '../components/Menu';
import Game from '../components/Game';
import MenuSlider from '../components/MenuSlider';
import { AppAPI } from '../api/Api';
import styles from '../style/mystyle.module.css'
import {GameDTO} from '../api/types'
import { GameMap, GamePoint, GameState, MenuItem, PointType, QuestionType, SavedGame} from './types';
import { useLoading } from '../providers/SpinnerContext';
import { useModal } from '../providers/ModalProvider';
import { stateMapMenu, HomeState,createMapCallbacks, HomeAction, QuizState } from './types';
import { useStateMachine } from '../hooks/useStateMachine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useLocalStorage } from '../hooks/useStorage';
import { getRandomGamePhoto } from '../utils/random';
import { modalUtils } from '../utils/modalUtils';
import { useGameState } from '../providers/GameStateProvider';
const Home: React.FC = () => {
  const { showModal } = useModal()
  const [ gameList, setGameList ] = useState<GameDTO[]>([])
  const [ gameMap, setGameMap ] = useState<GameMap | null>(null)
  const saveGameContext = useGameState()
  const { startLoading, stopLoading } = useLoading(); 
  const { state, updateState, addCallBackIn, addCallBackOut } = useStateMachine( { currState: HomeState.Home, stateMap: stateMapMenu,cbMap: createMapCallbacks()})
  addCallBackOut(HomeState.Loading, stopLoading)
  addCallBackIn(HomeState.Loading,startLoading)
  const defaultState: SavedGame = {
    gameId: null,
    state: {
     currPoint: 0,
     currPointActive: false,
     gameStarted: false,
     modelOpen: false,
     currentPoints: 0,
     quizState: {} as QuizState,
     gameFinished: false
 
   }
 }
 const [ gameState, setGameState ] = useState<SavedGame>(defaultState)

 const menuGameList = () : MenuItem[] => {
      return gameList.map(game => { return { id: game.id.toString(), label: game.name, desc: game.desc, onClick: () => gameListCallback(game.id), img: getRandomGamePhoto(), disabled: false } });
  };
     
  const fetchGameList = async () => {
      updateState(HomeAction.START_GAME)
      try{
        const games = await AppAPI().getGamesList()()
        setGameList(games as GameDTO[])
        updateState(HomeAction.FINISH_FETCH_GAME_LIST)
      }catch(e){
        console.error(e)
        updateState(HomeAction.ERROR_FETCH_GAME_LIST)
        modalUtils(showModal).errorFetchModal({
          title: 'Fetch error', 
          text: 'Coś poszło nie tak podczas pobierania Gier', 
          icon: 'error',  
          confirmText: "Ok",
          confirm: () => updateState(HomeAction.FINISH_FETCH_GAME_LIST)})
      }
  }

  const fetchGame = async (id: number) => {
      updateState(HomeAction.START_GAME)
      try{
        const game = await AppAPI().getGame(id)()
        setGameMap(game)
        setGameState({...defaultState, gameId: id});
        updateState(HomeAction.COMPLETE_START_GAME)
      }catch(e){
        console.error(e)
        updateState(HomeAction.ERROR_START_GAME)
        modalUtils(showModal).errorFetchModal({
          title: 'Fetch error', 
          text: 'Coś poszło nie tak podczas pobierania Gry', 
          icon: 'error',  
          confirmText: "Ok",
          confirm: () => updateState(HomeAction.COMPLETE_START_GAME)})
      }
  }

  const gameListCallback = (id: number) => {
      fetchGame(id)
  }

  const loadSavedGame = async () => {
    updateState(HomeAction.START_GAME)
    try{
      if (saveGameContext.gameSave == null || saveGameContext.gameSave.gameId == null) throw new Error("Game save is empty")
      const game = await AppAPI().getGame(saveGameContext.gameSave.gameId)()
      setGameMap(game)
      setGameState(saveGameContext.gameSave);
      updateState(HomeAction.COMPLETE_START_GAME);
    }catch(e){
      console.error(e)
      updateState(HomeAction.ERROR_START_GAME)
      modalUtils(showModal).errorFetchModal({
        title: 'Fetch error', 
        text: 'Coś poszło nie tak podczas pobierania Gry', 
        icon: 'error',  
        confirmText: "Ok",
        confirm: () => updateState(HomeAction.COMPLETE_START_GAME)})
    }
  }

  const menuItems = () => { return [
    { id: 'load', label: 'Wznów gre', onClick: () =>  loadSavedGame(), disabled: saveGameContext.gameSave == null },
    { id: 'games', label: 'Wybierz trasy', onClick: () =>  fetchGameList() , disabled: false },
  ]}

  return <div className={styles.wrapperMain}>
        {(state == HomeState.Home) && 
          <div className={styles.wrapperMenu}>
            <Menu items={menuItems()} title='Menu Gry'/>
          </div>
        }
        {state == HomeState.GameList && 
          <div className={styles.wrapperGameList}>
            <MenuSlider items={menuGameList()} cardPerView={3}>
                  <div className='flex justify-between py-4 w-full'>
                    <h1 className='text-2xl' >Lista gier:</h1>
                    <div className='text-2xl cursor-pointer' onClick={() =>updateState(HomeAction.BACK_HOME)}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </div>
                  </div>
            </MenuSlider>
          </div>
        }
        {state == HomeState.Game && gameMap &&
             <Game game={gameMap} gameState={gameState.state} finishCallback={() => updateState(HomeAction.BACK_HOME)} /> 
        } 
      </div>
};

export default Home;
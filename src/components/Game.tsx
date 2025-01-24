import { useEffect, useReducer, useRef, useState } from "react"
import { LatLngTuple } from "leaflet"
import { MapContainer,TileLayer } from "react-leaflet"
import styles from '../style/mystyle.module.css'
import QuizContainer from "./QuizContainer"
import { GameMap, GamePoint, GameState, PointType, QuizState, SavedGame } from "../pages/types"
import { calculateSquare, isPointInCircle } from "../utils/mapUtils"
import RoutineMachine from "../components/RoutineMachine";
import { LocationMarker } from "./LocationMarker"
import { StartPointComponent } from "./StartPointComponent"
import { GamePointsComponent } from "./GamePointsComponent"
import { useModal } from "../providers/ModalProvider"
import { useLocalStorage } from "../hooks/useStorage"
import MessageBoard from "./MessageBoard"
import { modalUtils } from "../utils/modalUtils"
import { useGameState } from "../providers/GameStateProvider"

enum GameActionType
{
    SWITCH_MODAL,
    SWITCH_POINT_STATE,
    QUIZ_STATE,
    GAME_START,
    GAME_LEVEL,
}

type GameAction = 
{
   type: GameActionType.SWITCH_MODAL;
   payload: boolean
} |
{
  type: GameActionType.GAME_START;
  payload: boolean
} |
{
  type: GameActionType.GAME_LEVEL;
  payload: number
} |
{
  type: GameActionType.QUIZ_STATE;
  payload: QuizState
} |
{
  type: GameActionType.SWITCH_POINT_STATE;
  payload: boolean
}

// Our reducer function that uses a switch statement to handle our actions
function gameReducer(state: GameState, action: GameAction) : GameState  {
  const { type, payload } = action;
  switch(type)
  {
     case GameActionType.SWITCH_MODAL:
        return {...state, modelOpen: payload}
     case GameActionType.GAME_START:
        return {...state,gameStarted: payload}
     case GameActionType.GAME_LEVEL:
        return {...state, currPoint: payload}
     case GameActionType.QUIZ_STATE:
        return {...state, quizState: payload}
     case GameActionType.SWITCH_POINT_STATE:
        return {...state,currPointActive: payload}
     default:
        throw new Error("error")
  }
}


const Game = ( props: { game: GameMap, gameState: GameState, finishCallback: () => void } ) => {
  
  const { game, finishCallback } = props
  const rMachine = useRef<any>();
  const { showModal } = useModal()
  const [position, setPosition] = useState<LatLngTuple>([0,0])
  const [draggable, setDraggable] = useState(true)
  const [gameState, setGameState] = useState<GameState>(props.gameState)
  const [s,dispatch] = useReducer(gameReducer,props.gameState)
  const saveGameContext = useGameState()


  const getStartPoint = () : GamePoint => {
    
    const points = props.game.gamePoints
    if(!points.length) throw new Error("Points are empty")

    const startPoint = props.game.gamePoints[0]
    if(startPoint.pointType != PointType.START) throw new Error("Start points doesnt exists")

    return startPoint
  }

  useEffect(() => {
    if (rMachine.current && !inCurrPointScope()) {
      rMachine.current.setWaypoints([position,game.gamePoints[gameState.currPoint]]);
    }
    if(inCurrPointScope())
    {
      const currPoint = gameState.currPoint
      rMachine.current.setWaypoints([]);
      
      if(!gameState.modelOpen && !gameState.gameStarted){
          openModal()
          modalUtils(showModal).showGameStartModal(startGame, () => {closeModal()})
      }
      if(!gameState.modelOpen && gameState.gameStarted && !gameState.currPointActive)
      {
          openModal()
          modalUtils(showModal).showQuizStartModal(gameState.currPoint,startQuiz,() => {closeModal()})

      }
    }
  }, [position, rMachine, gameState.currPoint]);

  useEffect(() => {
    if(gameState.gameStarted)
    {
      saveGameContext.setGameSave({gameId: game.id, state: gameState})
    }
  },[gameState])

  const startGame = () => {
    //setGameState((prev) => { return {...prev, gameStarted: true, currPoint: 1 }})
    dispatch({type: GameActionType.GAME_START, payload: true})
    dispatch({type: GameActionType.GAME_LEVEL, payload: 1})
  }

  const startQuiz = () => {
     const quiz : QuizState =  {
        currQuestion: 0,
        currPoints: 0,
        prevQuestion: [],
        prevAnswers: []
     }
     const level = gameState.currPoint
     //setGameState( (prev) => { return {...prev, quizState: quiz, currPointActive: true } })
     dispatch({type: GameActionType.QUIZ_STATE, payload: quiz})
     dispatch({type: GameActionType.SWITCH_POINT_STATE, payload: true})
  }
  
 const inCurrPointScope = () => {
    if(game.gamePoints[gameState.currPoint].pointType == PointType.START)
    {
      const [topLeft,bottomRight] = getStartArea()
      const isLatInBounds = position[0] >= bottomRight[0] && position[0] <= topLeft[0];
      const isLngInBounds = position[1] >= topLeft[1] && position[1] <= bottomRight[1];
      return isLatInBounds && isLngInBounds;
    }
    else{
       const point = game.gamePoints[gameState.currPoint]
       return isPointInCircle(position[0],position[1],point.lat,point.lng,15)
    }
  }
  const openModal = () => {
    dispatch({type: GameActionType.SWITCH_MODAL, payload: true})
  }
  const closeModal = () => {
    dispatch({type: GameActionType.SWITCH_MODAL, payload: false})
  }

  const typeCurrPoint = () => {
    return game.gamePoints[gameState.currPoint].pointType
  }

  const updatePos = (pos: LatLngTuple) => {
      setPosition(pos)
  } 
  
  const getAllPoints = () => {
    const points = game.gamePoints
    if(points.length < 1) throw new Error("Points are empty")
    const startPoint = points[0]
    if(!startPoint || startPoint.pointType !== PointType.START) throw new Error("No start point on begining")
    return game.gamePoints
  }
  const getAllPointsByType = (type : PointType) => {
    return getAllPoints().filter(p => p.pointType == type)
  }

  const getStartArea = () : LatLngTuple[] => {

    const points = game.gamePoints
    if(!points.length) throw new Error("Points are empty")

    const startPoint = points[0]
    if(!startPoint || startPoint.pointType !== PointType.START) throw new Error("Start points doesnt exists")
      
    const cor = calculateSquare(startPoint.lat,startPoint.lng, 15)
    return [cor.topLeft,cor.bottomRight] as LatLngTuple[]
    
  }
  const isPlaying = () => {
    return !gameState.gameFinished
  }

  const FinishQuizPoint = () => {

    const level = gameState.currPoint
    const points = getAllPoints()

    if( level < points.length - 1 )
    {
        const quiz : QuizState = {
          currQuestion: 0,
          currPoints: 0,
          prevQuestion: [],
          prevAnswers: []
        }
        setGameState((prev) => { return {...prev, quizState: quiz, currPoint: level + 1, currPointActive: false }})
    }
    else{
       gameState.gameFinished = true
       saveGameContext.remove()
       modalUtils(showModal).showFinishModal(game.maxPoint,gameState.currPoint,finishCallback)
    }
  }

  const updateQuizStateCallback = (state: QuizState) => {
      setGameState(prev => {return {...prev, quizState: state }})
  }

  const renderQuiz = () => {

    const level = gameState.currPoint
    const isQuizPoint = game.gamePoints[level]?.pointType == PointType.QUIZ
    const isPlaying = !gameState.gameFinished
    const questions = game.gamePoints[level]?.questions
    const isActivePoint = gameState.currPointActive
    const quizState = gameState.quizState
    
    if(!isPlaying) return <></>;

    if(isQuizPoint && !questions) {

      throw new Error("Point has not got any question in !")
      return <></>

    }
    if (!gameState.gameStarted)
    {
      return <MessageBoard message={'Wejdz na punkty startowy'}/>
    }
    else if(isQuizPoint && inCurrPointScope() && isActivePoint && questions)
    { 
      return <QuizContainer quiz={questions} CompleteCallback={FinishQuizPoint} state={gameState.quizState} updateQuizState={updateQuizStateCallback} /> 
    }
    else if (isQuizPoint  && !inCurrPointScope() && isActivePoint)
    {
      return <MessageBoard message={'Wróć na aktualny punkt,aby kontynuować quiz'}/>
    }
    else
    {
       return <MessageBoard message={'Idz do nastepnego punktu'}/>
    }

  }

  const quizComponent = renderQuiz()

  return <>
        <div className={styles.gamePage}>
            <div  className={styles.gameBoard}>
                <MapContainer zoom={13} scrollWheelZoom={true} center={position}>
                    <LocationMarker fixed={false} draggable={draggable} setPositionCb={updatePos} />
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <StartPointComponent isStartPoint={typeCurrPoint() == PointType.START} inScope={inCurrPointScope()} startArea={getStartArea()} />
                    <GamePointsComponent quizPoints={getAllPointsByType(PointType.QUIZ)} startPoint={getStartPoint()} currPoint={game.gamePoints[gameState.currPoint]} inScope={inCurrPointScope()} radius={15}/>
                    <RoutineMachine ref={rMachine} webpoints={[position, game.gamePoints[gameState.currPoint] ]} /> 
                </MapContainer>
            </div>
            <div className={styles.quizBoard}>
                 {isPlaying() && quizComponent}
            </div>
        </div>
    </>

}

export default Game
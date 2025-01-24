import { GameState, QuizState } from "../pages/types";
export enum GameActionType
{
    SWITCH_MODAL,
    SWITCH_POINT_STATE,
    QUIZ_STATE,
    GAME_START,
    GAME_LEVEL,
}

export type GameAction = 
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
export function gameReducer(state: GameState, action: GameAction) : GameState  {
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
export type MenuItem = {
    id: string
    label: string;
    desc?: string
    img?: string
    onClick: () => void;
    disabled: boolean
};

export type MenuSliderItem = {
    id: string
    title: string,
    description: string,
    buttonText:string,
    img: string
    onClick: () => void,
} 

export enum HomeState {
    Home,
    GameList,
    Game,
    Loading,
    FetchError,
}
export enum HomeAction{
    FETCH_GAME_LIST,
    FINISH_FETCH_GAME_LIST,
    ERROR_FETCH_GAME_LIST,
    BACK_HOME,
    START_GAME,
    ERROR_START_GAME,
    COMPLETE_START_GAME

}

export const stateMapMenu = {
    [HomeState.Home] : {
      [HomeAction.FETCH_GAME_LIST]: HomeState.Loading,
      [HomeAction.START_GAME] : HomeState.Loading
    },
    [HomeState.Loading]: {
      [HomeAction.ERROR_FETCH_GAME_LIST]: HomeState.FetchError,
      [HomeAction.FINISH_FETCH_GAME_LIST]: HomeState.GameList,
      [HomeAction.COMPLETE_START_GAME]: HomeState.Game,
      [HomeAction.ERROR_START_GAME]: HomeState.FetchError
    },
    [HomeState.FetchError]:{
      [HomeAction.FINISH_FETCH_GAME_LIST]: HomeState.Home,
      [HomeAction.COMPLETE_START_GAME]: HomeState.Home
    },
    [HomeState.GameList]:{
      [HomeAction.BACK_HOME] : HomeState.Home,
      [HomeAction.START_GAME] : HomeState.Loading
    },
    [HomeState.Game]: {
      [HomeAction.BACK_HOME] : HomeState.Home,
    }
  }

type StateMap = {
    [key in HomeState]: {
        [key in HomeState]: []; // Klucze to inne stany, a wartości to puste tablice
    };
};

export const createMapCallbacks = (): StateMap => {
    const states = Object.values(HomeState) as HomeState[];

    const stateMap = {} as StateMap;

    for (const state of states) {
        stateMap[state] = {} as any;

        for (const targetState of states) {
            if (state !== targetState) {
                stateMap[state][targetState] = [];
            }
        }
    }

    return stateMap;
};



export enum QuestionType{
    close,
    open
  }
  
export interface Question{
    point: number
    questionText: string,
    correct: number,
    answers: string[]
    type: QuestionType
  }
  
export interface Quiz {
    max_point: number,
    min_point: number,
    questions: Question[]
}
  
export interface PointSection{
     title?: string,
     photo?: string,
     desc: string
}
  
export enum PointType{
    START,
    QUIZ,
}
export interface GamePoint {
     id: number
     order: number
     name: string,
     mainDesc: string,
     level: number,
     lat: number,
     lng: number,
     placeDesc: PointSection[],
     placePopup: string,
     questions?: Quiz,
     pointType: PointType,
}
  
export interface GameMap {
    id: number
    gamePoints: GamePoint[]
    name: string
    desc: string
    maxPoint: number
    min_points: number
  }
  export interface QuizState {
    currQuestion: number,
    prevQuestion: number[],
    prevAnswers: number[]
    currPoints: number
  }

  export interface GameState {
    currPoint: number,
    currPointActive: boolean
    gameStarted: boolean,
    gameFinished: boolean
    modelOpen: boolean,
    currentPoints: number,
    quizState: QuizState
  }

  export interface SavedGame 
  {
     gameId: number | null
     state: GameState
  }
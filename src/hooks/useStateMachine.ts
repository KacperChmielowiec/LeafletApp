import { useState, useEffect } from "react";
import { usePrevious } from "./usePrevious";

type r = Record<string, string | number>

type StateValue = r[keyof r]; 
type ActionName = r[keyof r]; 
type Callback = () => void
// Mapa przejść: typ oparty o stany i akcje

type TransitionMapCallback = {
    [key in StateValue]: {
        [key in StateValue]: Callback[]
    }
}
type TransitionMapAction = {
    [key in StateValue]: {
    [key in ActionName]: StateValue;
    };
};

export function useStateMachine<T extends r, K extends r>(
    config: {
        currState : StateValue, 
        stateMap: TransitionMapAction,
        cbMap: TransitionMapCallback
    }
){
    const { stateMap ,cbMap } = config
    const [ state, setState ] = useState<StateValue>(config.currState)
    const prevState = usePrevious(state)

    const switchState = (currState: StateValue, action_name: ActionName) => { 
        const nextState = stateMap[currState][action_name];
        return nextState !== undefined ? nextState : currState
    }
      
    const updateState = (action_name: ActionName) => {
        setState( (s) => switchState(s, action_name) as ActionName);
    };
      
    const addCallback = (prevState: StateValue, newState: StateValue, callback: Callback) => {
        cbMap[prevState][newState].push(callback)
    }
    const addCallBackOut = ( prevState: StateValue,callback: Callback ) => {
        Object.values(cbMap[prevState]).forEach((arr) => {
                arr.push(callback)
        })
    }
    const addCallBackIn = ( nextState: StateValue, callback: Callback ) => {
        const callbacks = []
        Object.values(cbMap).forEach(value => {

            const next = nextState

            const filtered = Object.entries(value).filter(([key,value]) => {return key == next})
            .map(([key,value]) => value)

            filtered.forEach(cb => {
                cb.push(callback)
            })
        })
    }
    useEffect(() => {
        cbMap[prevState][state]?.forEach(c => c())
    },[state])

    return {
        state,
        updateState,
        addCallback,
        addCallBackIn,
        addCallBackOut
    }
}
    

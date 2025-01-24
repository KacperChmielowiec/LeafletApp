import { FetchArgs,GameDTO } from "./types"
import { GameMap } from "../pages/types"

export const AppAPI = function () {
    const BASE_PATH = "http://localhost:3001"
    return {
      getGamesList(
        options?: any
      ): (basePath?: string) => Promise<Array<GameDTO>> {
        const localVarFetchArgs = getGamesListCreator(
          options,
          BASE_PATH
        )
        return (basePath: string = BASE_PATH) => {
          return timeout(2000).then(r => {
            return fetch(localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
              if (response.status >= 200 && response.status < 300) {
                return response.json()
              } else {
                throw response
              }
            })
          })
        }
      },
      getGame(id : number, options?: any): (basePath?: string) => Promise<GameMap> {
        const localVarFetchArgs = getGameCreator(
          options,
          BASE_PATH,
          id
        )
        return (basePath: string = BASE_PATH) => {
          return timeout(2000).then(r => {
          return fetch(localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
            if (response.status >= 200 && response.status < 300) {
              return response.json()
            } else {
              throw response
            }
          })
        })
        }
      }
    }
}
            
function getGamesListCreator(options: any = {}, baseURL: string): FetchArgs {
    const localVarPath = '/list'
    const localVarUrlObj = new URL(localVarPath,baseURL)
    const localVarRequestOptions = Object.assign({ method: "GET" }, options)

    const currentParams = Object.fromEntries(localVarUrlObj.searchParams.entries())
    const updateParams = Object.assign({},currentParams,options.query)

    Object.entries(updateParams).forEach(([key, value]) => {
        localVarUrlObj.searchParams.set(key, value as string);
    });

    localVarRequestOptions.headers = options.headers

    return {
        url: localVarUrlObj.toString(),
        options: localVarRequestOptions as object,
    }
}

function getGameCreator(options: any = {}, baseURL: string, id: number): FetchArgs
{
    const localVarPath = `/game/${id}`
    const localVarUrlObj = new URL(localVarPath,baseURL)
    const localVarRequestOptions = Object.assign({ method: "GET" }, options)

    const currentParams = Object.fromEntries(localVarUrlObj.searchParams.entries())
    const updateParams = Object.assign({},currentParams,options.query)

    Object.entries(updateParams).forEach(([key, value]) => {
        localVarUrlObj.searchParams.set(key, value as string);
    });

    localVarRequestOptions.headers = options.headers

    return {
        url: localVarUrlObj.toString(),
        options: localVarRequestOptions as object,
    }
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
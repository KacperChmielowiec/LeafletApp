export type FetchArgs =
{
    url: string,
    options: object
}

export class RequiredError extends Error {
    parameterName = ""
    constructor(parameterName: string, message: string) {
        // Wywołanie konstruktora klasy Error
        super(message);
        
        // Zachowuje nazwę błędu dla łatwiejszej identyfikacji
        this.name = "RequiredError";
        
        // Zachowuje nazwę wymaganego parametru dla lepszej informacji
        this.parameterName = parameterName;

        Object.setPrototypeOf(this, RequiredError.prototype);
    }
}

export interface GameDTO{
    id: number,
    name: string,
    desc: string
    mapPoints: number,
}

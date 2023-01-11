import { Request, Response } from 'express';
import { Swapi } from '../helpers/swapiInterface';
interface IValidResources {
    films: () => Promise<Array<object>>;
    species: () => Promise<Array<object>>;
    starships: () => Promise<Array<object>>;
    vehicles: () => Promise<Array<object>>;
    planets: () => Promise<Array<object>>;
}
export const getResource = async (req: Request, res: Response) => {

    if(req.swapi_id && req.params.type) {
        const swapi = new Swapi(req.swapi_id);
        const validTypes: IValidResources = {
            films: () => swapi.getFilms(),
            species: () => swapi.getSpieces(),
            starships: () => swapi.getStarships(),
            vehicles: () => swapi.getVehicles(),
            planets: () => swapi.getPlanets()
        }
        if(Object.keys(validTypes).includes(req.params.type)) {
            const resourceMethod = validTypes[req.params.type as keyof IValidResources]
            const resource = await resourceMethod();
            res.status(200).send(resource);
        }
    } else {
        return res.status(400).send('Bad request');
    } 
}

export const person = async (req: Request, res: Response) => {
    if(req.swapi_id) {
        const swapi = new Swapi(req.swapi_id);
        const person = await swapi.getPerson();
        res.status(200).send(person);
    } else {
        return res.status(400).send('Bad request');
    }
}
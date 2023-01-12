import fetch from "cross-fetch"
import { cache } from "./cache"
import * as config from "./config"
import { People, Film, Species, Vehicle, Planet, Starship } from "./types/types"

interface ISwapi {
    getPerson: () => Promise<People>;
    getFilms: () => Promise<Film[]>;
    getSpieces: () => Promise<Species[]>;
    getStarships: () => Promise<Starship[]>;
    getVehicles: () => Promise<Vehicle[]>;
    getPlanets: () => Promise<Planet[]>;
}

export class Swapi implements ISwapi{
    personId: number;
    
    constructor(swapiId: number) {
        this.personId = swapiId;
    }
    
    fetchData = async (key: string, url: string) => {
        const keyId = url.split('/').at(-2); // get the id from the url
        const redisKey = `swapi:${key}:${keyId}`;
        
        const cacheResponse = await cache.get(redisKey); // check if the data exists in cache
        if(typeof cacheResponse === 'string') {
            return JSON.parse(cacheResponse);
        }
        const apiResponse = await fetch(url).then(res => res.json());
        cache.set(redisKey, JSON.stringify(apiResponse), {EX: config.EXPIRE_TIME});
        return await apiResponse;
    }

    getDataFromKey = async (key: string) => {
        let personData = await this.getPerson(); // person data to get all needed links
        let data = personData[key as keyof object] as string | string[]; // get the data from the key ex. films, species, starships, vehicles, homeworld
        if(typeof data === 'string') data = [data]; // handles case of homeworld, which is string, and we need to convert it to array

        // get all the data from the links either from api or cache
        return Promise.all(data.map(async (url: string) => {
            return await this.fetchData(key, url);
        }));
    }

    // below functions are handle all the data which we want to pull from swapi

    getPerson = async (): Promise<People> => {
        return await this.fetchData('people', `https://swapi.dev/api/people/${this.personId}/`);
    }

    getFilms = async (): Promise<Film[]> => {
        return await this.getDataFromKey('films');
    }

    getSpieces = async (): Promise<Species[]> => {
        return await this.getDataFromKey('species');
    }

    getStarships = async (): Promise<Starship[]> => {
        return await this.getDataFromKey('starships');
    }

    getVehicles = async (): Promise<Vehicle[]> => {
        return await this.getDataFromKey('vehicles');
    }

    getPlanets = async (): Promise<Planet[]> => {
        return await this.getDataFromKey('homeworld');
    }

}

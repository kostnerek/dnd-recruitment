import fetch from "cross-fetch"
import { cache } from "../cache"
const swapiUrl = "https://swapi.dev/api"

interface SwapiPerson {
    [key: string]: any;
    name: string,
    height: string,
    mass: string,
    hair_color: string,
    skin_color: string,
    eye_color: string,
    birth_year: string,
    gender: string,
    homeworld: string,
    films: string[],
    species: string[],
    vehicles: string[],
    starships: string[],
    created: string,
    edited: string,
    url: string
}

interface ISwapi {
    getPerson: () => Promise<SwapiPerson>;
    getFilms: () => Promise<Array<object>>;
    getSpieces: () => Promise<Array<object>>;
    getStarships: () => Promise<Array<object>>;
    getVehicles: () => Promise<Array<object>>;
    getPlanets: () => Promise<Array<object>>;
}

export class Swapi implements ISwapi{
    personId: number;
    personData: Promise<SwapiPerson>;
    
    constructor(swapiId: number) {
        this.personId = swapiId;
        this.personData = Promise.resolve(this.getPerson());
    }

    fetchData = async (key: string): Promise<Array<object>> => {
        const dataToIterate = await this.personData;
        const data = dataToIterate[key];
        console.log('fetching key: ', key);
        if(data===undefined || data===null) return [];
        if(typeof data === 'string') {
            const keyId = data.split('/').at(-2);
            const redisKey = `swapi:${key}:${keyId}`;
            const cacheResponse = await cache.get(redisKey);
            if(typeof cacheResponse === 'string') {
                return JSON.parse(cacheResponse);
            }
            const apiResponse = await (await fetch(data)).json();
            cache.set(redisKey, JSON.stringify(apiResponse))
            return [apiResponse];
        }
        const allData = Promise.all(data.map(async (link: string) => {
            const keyId = link.split('/').at(-2);
            const redisKey = `swapi:${key}:${keyId}`;
            const cacheResponse = await cache.get(redisKey);
            if(typeof cacheResponse === 'string') {
                return JSON.parse(cacheResponse);
            }
            const apiResponse = await (await fetch(link)).json();
            cache.set(redisKey, JSON.stringify(apiResponse))
            return await apiResponse;
        }))
        return await allData;
    }

    getPerson = async (): Promise<SwapiPerson> => {
        const redisKey = `swapi:person:${this.personId}`;
        const cacheResponse = await cache.get(redisKey)
        if(typeof cacheResponse === 'string') {
            return JSON.parse(cacheResponse);
        }
        const apiResponse = await fetch(`${swapiUrl}/people/${this.personId}`)
        const data = await apiResponse.json()
        cache.set(redisKey, JSON.stringify(data));

        return data;
    }

    getFilms = async (): Promise<object[]> => {
        return await this.fetchData('films');
    }

    getSpieces = async (): Promise<object[]> => {
        return await this.fetchData('species');
    }

    getStarships = async (): Promise<object[]> => {
        return await this.fetchData('starships');
    }

    getVehicles = async (): Promise<object[]> => {
        return await this.fetchData('vehicles');
    }

    getPlanets = async (): Promise<object[]> => {
        return await this.fetchData('homeworld');
    }

}

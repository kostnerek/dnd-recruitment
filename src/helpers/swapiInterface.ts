import fetch from "cross-fetch"
import { cache } from "../cache"


interface ISwapi {
    getPerson: () => Promise<Array<object>>;
    getFilms: () => Promise<Array<object>>;
    getSpieces: () => Promise<Array<object>>;
    getStarships: () => Promise<Array<object>>;
    getVehicles: () => Promise<Array<object>>;
    getPlanets: () => Promise<Array<object>>;
}

export class Swapi implements ISwapi{
    personId: number;
    personData: Promise<Array<object>>;
    constructor(swapiId: number) {
        this.personId = swapiId;
        this.personData = Promise.resolve(this.getPerson());
    }

    fetchData = async (key: string, url: string): Promise<Array<object>> => {
        const keyId = url.split('/').at(-2);
        const redisKey = `swapi:${key}:${keyId}`;
        
        const cacheResponse = await cache.get(redisKey);
        if(typeof cacheResponse === 'string') {
            return JSON.parse(cacheResponse);
        }
        const apiResponse = await fetch(url).then(res => res.json());
        cache.set(redisKey, JSON.stringify(apiResponse))
        return await apiResponse;
    }

    getDataFromKey = async (key: string): Promise<Array<object>> => {
        let dataToIterate = await this.personData;
        let data = dataToIterate[key as keyof object] as string | string[];
        if(typeof data === 'string') {
            data = [data];
        }
        const allData = Promise.all(data.map(async (url: string) => {
            return await this.fetchData(key, url);
        }))
        return await allData;
    }

    getPerson = async (): Promise<Array<object>> => {
        return await this.fetchData('people', `https://swapi.dev/api/people/${this.personId}/`);
    }

    getFilms = async (): Promise<object[]> => {
        return await this.getDataFromKey('films');
    }

    getSpieces = async (): Promise<object[]> => {
        return await this.getDataFromKey('species');
    }

    getStarships = async (): Promise<object[]> => {
        return await this.getDataFromKey('starships');
    }

    getVehicles = async (): Promise<object[]> => {
        return await this.getDataFromKey('vehicles');
    }

    getPlanets = async (): Promise<object[]> => {
        return await this.getDataFromKey('homeworld');
    }

}

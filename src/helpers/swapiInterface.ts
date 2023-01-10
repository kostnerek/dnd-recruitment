import fetch from "cross-fetch"

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
            const response = await fetch(data);
            return [await response.json()];
        }
        const allData = Promise.all(data.map(async (link: string) => {
            const response = await fetch(link);
            return await response.json();
        }))
        return await allData;
    }

    getPerson = async (): Promise<SwapiPerson> => {
        const response = await fetch(`${swapiUrl}/people/${this.personId}`)
        const data = await response.json()
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

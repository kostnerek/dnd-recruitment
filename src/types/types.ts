type ResourceUrl = string;
export default interface Resource {
    url: ResourceUrl;
    id: string;
    /**
     * "2014-12-09T13:50:51.644000Z"
     */
    created: string;
    /**
     * "2014-12-20T21:17:56.891000Z"
     */
    edited: string;
}; // eslint-disable-line

export interface Film extends Resource {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: ResourceUrl[];
    planets: ResourceUrl[];
    starships: ResourceUrl[];
    vehicles: ResourceUrl[];
    species: ResourceUrl[];
}

export interface Species extends Resource {
    name: string;
    classification: string;
    designation: string;
    average_height: string;
    skin_colors: string;
    hair_colors: string;
    eye_colors: string;
    average_lifespan: string;
    homeworld: ResourceUrl;
    language: string;
    people: ResourceUrl[];
    films: ResourceUrl[];
}

export interface Starship extends Resource {
    name: string;
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    hyperdrive_rating: string;
    MGLT: string;
    starship_class: string;
    pilots: ResourceUrl[];
    films: ResourceUrl[];
}

export interface Vehicle extends Resource {
    name: string;
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    vehicle_class: string;
    pilots: ResourceUrl[];
    films: ResourceUrl[];
}

export interface Planet extends Resource {
    name: string;
    rotation_period: string;
    orbital_period: string;
    diameter: string;
    climate: string;
    gravity: string;
    terrain: string;
    surface_water: string;
    population: string;
    residents: ResourceUrl[];
    films: ResourceUrl[];
}

export interface People extends Resource {
    birth_year: string;
    eye_color: string;
    films: ResourceUrl[];
    gender: string;
    hair_color: string;
    height: string;
    homeworld: ResourceUrl;  
    mass: string;
    name: string;
    skin_color: string;
    species: ResourceUrl[];
    starships: ResourceUrl[];
    vehicles: ResourceUrl[];
};
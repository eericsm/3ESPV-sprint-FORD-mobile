import 'react-native-url-polyfill/auto';

export interface Car {
    id: number;
    make: string | null;
    model: string | null;
    variant: string | null;
    yearFrom: number | null;
    yearTo: number | null;
    engineFuelType: string | null;
    enginePowerBhp: number | null;
    enginePowerKw: number | null;
    gearboxType: string | null;
    gears: number | null;
    drivetrain: string | null;
    topSpeedKph: number | null;
    fuelTankLitres: number | null;
    lengthMm: number | null;
    widthMm: number | null;
    heightMm: number | null;
}

export interface CarRecommendation extends Car {
    similarity: number;
}

export interface CarList {
    total: number;
    skip: number;
    limit: number;
    items: Car[];
}

const baseUrl = 'https://api-ford-linux-dkh6bkatgzbndddg.southafricanorth-01.azurewebsites.net';

function buildQuery(params: Record<string, string | number | undefined>) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') searchParams.set(key, String(value));
    }
    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) {
        throw new Error(`Ford API request failed: ${response.status}`);
    }
    return (await response.json()) as T;
}

export async function listCars(filters: { make?: string; model?: string; skip?: number; limit?: number } = {}): Promise<CarList> {
    return request<CarList>(`/cars${buildQuery(filters)}`);
}

export async function getCar(carId: number): Promise<Car> {
    return request<Car>(`/cars/${carId}`);
}

export async function getRecomendacoes(carId: number, limit = 5): Promise<CarRecommendation[]> {
    return request<CarRecommendation[]>(`/cars/${carId}/recommendations${buildQuery({ limit })}`);
}

import type { Car } from '../lib/ford-api';

export type ModelCategory = 'suv' | 'picape' | 'esportivo' | 'comercial';
export type FuelType = 'combustion' | 'hybrid' | 'electric';

export interface FordModel {
    id: string;
    name: string;
    segment: string;
    category: ModelCategory;
    fuel: FuelType;
    price: number;
    rating: number;
    tags: string[];
    facts: string[];
}

export interface Dealership {
    id: string;
    name: string;
    address: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
    services: string[];
    hours: {
        weekday: string;
        saturday: string | null;
        sunday: string | null;
    };
}

export interface Appointment {
    id: string;
    type: string;
    model: string;
    dealership: string;
    date: string;
    time: string;
    note: string;
}

export const fordModels: FordModel[] = [
    {
        id: 'territory',
        name: 'Territory',
        segment: 'SUV medio',
        category: 'suv',
        fuel: 'combustion',
        price: 219900,
        rating: 94,
        tags: ['familia', 'viagem', 'estrada', 'cidade'],
        facts: ['1.5 turbo', '177 cv', '5 lugares'],
    },
    {
        id: 'bronco-sport',
        name: 'Bronco Sport',
        segment: 'SUV compacto',
        category: 'suv',
        fuel: 'combustion',
        price: 249900,
        rating: 81,
        tags: ['offroad', 'aventura', 'familia'],
        facts: ['1.5 EcoBoost', '182 cv', '4x4'],
    },
    {
        id: 'explorer',
        name: 'Explorer',
        segment: 'SUV grande',
        category: 'suv',
        fuel: 'combustion',
        price: 429900,
        rating: 78,
        tags: ['familia', 'viagem', 'estrada'],
        facts: ['2.3 EcoBoost', '300 cv', '7 lugares'],
    },
    {
        id: 'ranger',
        name: 'Ranger',
        segment: 'Picape media',
        category: 'picape',
        fuel: 'combustion',
        price: 259900,
        rating: 92,
        tags: ['trabalho', 'offroad', 'carga'],
        facts: ['3.0 V6 turbo diesel', '250 cv', '4x4'],
    },
    {
        id: 'ranger-raptor',
        name: 'Ranger Raptor',
        segment: 'Picape de performance',
        category: 'picape',
        fuel: 'combustion',
        price: 399900,
        rating: 88,
        tags: ['performance', 'offroad', 'aventura'],
        facts: ['3.0 V6 twin-turbo', '397 cv', '4x4'],
    },
    {
        id: 'maverick-hybrid',
        name: 'Maverick Hybrid',
        segment: 'Picape compacta',
        category: 'picape',
        fuel: 'hybrid',
        price: 219900,
        rating: 86,
        tags: ['cidade', 'economia', 'trabalho'],
        facts: ['2.5 hibrido', '191 cv', '5 lugares'],
    },
    {
        id: 'maverick-tremor',
        name: 'Maverick Tremor',
        segment: 'Picape off-road',
        category: 'picape',
        fuel: 'combustion',
        price: 249900,
        rating: 68,
        tags: ['offroad', 'aventura'],
        facts: ['2.0 EcoBoost', '250 cv', '4x4'],
    },
    {
        id: 'mustang-gt',
        name: 'Mustang GT',
        segment: 'Esportivo',
        category: 'esportivo',
        fuel: 'combustion',
        price: 549900,
        rating: 97,
        tags: ['performance'],
        facts: ['5.0 V8', '480 cv', 'tracao traseira'],
    },
    {
        id: 'mustang-mach-e',
        name: 'Mustang Mach-E',
        segment: 'SUV eletrico',
        category: 'suv',
        fuel: 'electric',
        price: 379900,
        rating: 91,
        tags: ['cidade', 'eletrico', 'familia'],
        facts: ['motor eletrico', '351 cv', 'autonomia alta'],
    },
    {
        id: 'f-150',
        name: 'F-150',
        segment: 'Picape grande',
        category: 'picape',
        fuel: 'combustion',
        price: 439900,
        rating: 89,
        tags: ['trabalho', 'carga', 'performance'],
        facts: ['3.5 V6 EcoBoost', '400 cv', '4x4'],
    },
    {
        id: 'f-150-lightning',
        name: 'F-150 Lightning',
        segment: 'Picape eletrica',
        category: 'picape',
        fuel: 'electric',
        price: 599900,
        rating: 95,
        tags: ['trabalho', 'eletrico'],
        facts: ['motor eletrico duplo', '580 cv', '4x4'],
    },
    {
        id: 'transit-furgao',
        name: 'Transit Furgao',
        segment: 'Van de carga',
        category: 'comercial',
        fuel: 'combustion',
        price: 219900,
        rating: 74,
        tags: ['trabalho', 'carga'],
        facts: ['2.2 turbo diesel', '125 cv', 'capacidade alta'],
    },
    {
        id: 'transit-minibus',
        name: 'Transit Minibus',
        segment: 'Van de passageiros',
        category: 'comercial',
        fuel: 'combustion',
        price: 239900,
        rating: 76,
        tags: ['trabalho', 'viagem'],
        facts: ['2.2 turbo diesel', '125 cv', 'ate 16 lugares'],
    },
];

export const dealerships: Dealership[] = [
    {
        id: 'caoa-ceasa',
        name: 'Ford CAOA - Ceasa - SP',
        address: 'Av. Dr. Gastao Vidigal, 1250',
        neighborhood: 'Vila Leopoldina',
        latitude: -23.5217,
        longitude: -46.7307,
        services: ['Vendas', 'Test-drive', 'Oficina'],
        hours: { weekday: '08:00 - 19:00', saturday: '08:00 - 13:00', sunday: null },
    },
    {
        id: 'caoa-ibirapuera',
        name: 'Ford CAOA - Ibirapuera - SP',
        address: 'Av. Ibirapuera, 2400',
        neighborhood: 'Moema',
        latitude: -23.6103,
        longitude: -46.6613,
        services: ['Vendas', 'Test-drive', 'Pecas'],
        hours: { weekday: '08:00 - 18:00', saturday: '08:00 - 13:00', sunday: null },
    },
    {
        id: 'caoa-jabaquara',
        name: 'Ford CAOA - Jabaquara - SP',
        address: 'Av. Jabaquara, 2207',
        neighborhood: 'Jabaquara / Sao Judas',
        latitude: -23.6272,
        longitude: -46.6407,
        services: ['Vendas', 'Oficina', 'Pecas'],
        hours: { weekday: '08:00 - 18:00', saturday: '08:00 - 13:00', sunday: null },
    },
    {
        id: 'sonnervig',
        name: 'Ford Sonnervig - SP',
        address: 'Rua dos Machados, 150',
        neighborhood: 'Vila Guilherme',
        latitude: -23.5093,
        longitude: -46.6058,
        services: ['Vendas', 'Test-drive', 'Oficina', 'Pecas'],
        hours: { weekday: '08:00 - 18:00', saturday: '08:00 - 13:00', sunday: null },
    },
    {
        id: 'ford-sao-paulo',
        name: 'Ford For Sao Paulo - SP',
        address: 'Av. das Nacoes Unidas, 21883',
        neighborhood: 'Zona Sul',
        latitude: -23.652,
        longitude: -46.71,
        services: ['Vendas', 'Test-drive'],
        hours: { weekday: '09:00 - 18:00', saturday: null, sunday: null },
    },
];

export const faqAnswers: Array<{ key: RegExp; answer: string }> = [
    { key: /agend/i, answer: 'Voce pode marcar, remarcar ou cancelar um atendimento na pagina de Agendamentos.' },
    { key: /model|pre[cç]o|carro|suv|picape/i, answer: 'A pagina de Modelos compara ficha tecnica, preco e compatibilidade.' },
    { key: /concession/i, answer: 'A pagina de Concessionarias mostra a loja mais perto e rota para chegar.' },
    { key: /hor[aá]ri|atend/i, answer: 'A central atende de segunda a sexta das 8h as 20h.' },
    { key: /obrigad|valeu/i, answer: 'Por nada. Se quiser, eu posso te ajudar com agendamento ou escolha do modelo.' },
];

export function detectTags(text: string): string[] {
    const normalized = text.toLowerCase();
    const tags = new Set<string>();
    if (/(famil|viag|estrad)/i.test(normalized)) tags.add('familia');
    if (/(trabalh|cidade|urban|econom)/i.test(normalized)) tags.add('trabalho');
    if (/(off[- ]?road|trilha|aventur)/i.test(normalized)) tags.add('offroad');
    if (/(performance|esport|potenc|veloc)/i.test(normalized)) tags.add('performance');
    if (/(eletric|hibrid)/i.test(normalized)) tags.add('eletrico');
    return [...tags];
}

export function detectBudget(text: string): number | null {
    const match = text.replace(/\./g, '').match(/R?\$?\s*(\d{2,6})/i);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
}

export function formatProfile(tags: string[], budget: number | null): string {
    const label = tags.length ? tags.join(' + ') : 'perfil livre';
    return budget ? `${label} - ate R$ ${budget.toLocaleString('pt-BR')}` : label;
}

export function calculateScore(tags: string[], modelTags: string[], price: number, budget: number | null): number {
    let score = 50;
    for (const tag of tags) {
        if (modelTags.includes(tag)) score += 18;
    }
    if (budget) {
        if (price <= budget) score += 10;
        else if (price > budget * 1.1) score -= 15;
    }
    return Math.max(10, Math.min(100, Math.round(score)));
}

export function recommendModels(text: string) {
    const tags = detectTags(text);
    const budget = detectBudget(text);
    const ranked = fordModels
        .map((model) => ({
            ...model,
            score: calculateScore(tags, model.tags, model.price, budget),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return {
        tags,
        budget,
        profile: formatProfile(tags, budget),
        ranked,
    };
}

export function carLabel(car: Car): string {
    return [car.model, car.variant].filter(Boolean).join(' ').trim() || `#${car.id}`;
}

export function carSubtitle(car: Car): string {
    const parts = [car.make, car.yearFrom && car.yearTo ? `${car.yearFrom}-${car.yearTo}` : car.yearFrom ? String(car.yearFrom) : null].filter(Boolean);
    return parts.length ? parts.join(' · ') : 'Ford API';
}

export function carFacts(car: Car): string[] {
    const facts = [
        car.engineFuelType ? String(car.engineFuelType) : null,
        car.enginePowerBhp ? `${car.enginePowerBhp} cv` : null,
        car.gearboxType ? String(car.gearboxType) : null,
        car.drivetrain ? String(car.drivetrain) : null,
    ].filter(Boolean) as string[];

    return facts.length ? facts : ['Dados da API'];
}

import type { Car } from '../lib/ford-api';

export type ModelCategory = 'suv' | 'picape' | 'esportivo' | 'comercial';
export type FuelType = 'combustion' | 'hybrid' | 'electric';
export type EngineType = 'combustao' | 'diesel' | 'hibrido' | 'eletrico';

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
    /** Tipo de motor usado no ranking do perfil (mesma info de `fuel`, granularidade do combustivel real). */
    motor: EngineType;
    /** Sinalizadores usados só para pontuar a prévia do perfil (mesmos do catálogo do site). */
    espacoBom: boolean;
    confortoBom: boolean;
    consumoBom: boolean;
    potenciaBoa: boolean;
}

export const GENERO_OPTIONS = ['Feminino', 'Masculino', 'Nao binario', 'Prefiro nao informar'];

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
        motor: 'combustao',
        espacoBom: true,
        confortoBom: true,
        consumoBom: false,
        potenciaBoa: false,
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
        motor: 'combustao',
        espacoBom: false,
        confortoBom: false,
        consumoBom: false,
        potenciaBoa: false,
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
        motor: 'combustao',
        espacoBom: true,
        confortoBom: true,
        consumoBom: false,
        potenciaBoa: false,
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
        motor: 'diesel',
        espacoBom: false,
        confortoBom: false,
        consumoBom: false,
        potenciaBoa: false,
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
        motor: 'combustao',
        espacoBom: false,
        confortoBom: false,
        consumoBom: false,
        potenciaBoa: true,
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
        motor: 'hibrido',
        espacoBom: false,
        confortoBom: true,
        consumoBom: true,
        potenciaBoa: false,
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
        motor: 'combustao',
        espacoBom: false,
        confortoBom: false,
        consumoBom: false,
        potenciaBoa: false,
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
        motor: 'combustao',
        espacoBom: false,
        confortoBom: false,
        consumoBom: false,
        potenciaBoa: true,
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
        motor: 'eletrico',
        espacoBom: true,
        confortoBom: true,
        consumoBom: true,
        potenciaBoa: false,
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
        motor: 'combustao',
        espacoBom: false,
        confortoBom: false,
        consumoBom: false,
        potenciaBoa: true,
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
        motor: 'eletrico',
        espacoBom: false,
        confortoBom: false,
        consumoBom: true,
        potenciaBoa: true,
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
        motor: 'diesel',
        espacoBom: false,
        confortoBom: false,
        consumoBom: false,
        potenciaBoa: false,
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
        motor: 'diesel',
        espacoBom: true,
        confortoBom: false,
        consumoBom: false,
        potenciaBoa: false,
    },
];

export const faqAnswers: Array<{ key: RegExp; answer: string }> = [
    { key: /model|pre[cç]o|carro|suv|picape/i, answer: 'A pagina de Modelos compara ficha tecnica, preco e compatibilidade.' },
    { key: /concession/i, answer: 'Fale com a concessionaria mais proxima para marcar um test-drive ou avaliacao.' },
    { key: /hor[aá]ri|atend/i, answer: 'A central atende de segunda a sexta das 8h as 20h.' },
    { key: /obrigad|valeu/i, answer: 'Por nada. Se quiser, eu posso te ajudar com a escolha do modelo.' },
];

const tagDictionary: Record<string, string[]> = {
    familia: ['família', 'familia', 'filhos', 'crianças', 'criancas', 'esposa', 'marido', 'casal', 'bebê', 'bebe', 'pais', 'cadeirinha'],
    viagem: ['viagem', 'viajo', 'viajar', 'longa distância', 'longa distancia', 'road trip', 'passeio', 'praia', 'litoral', 'interior'],
    estrada: ['estrada', 'rodovia', 'pista', 'asfalto', 'br-'],
    cidade: ['cidade', 'urbano', 'urbana', 'trânsito', 'transito', 'dia a dia', 'cotidiano', 'engarrafamento', 'garagem pequena'],
    offroad: ['off-road', 'offroad', 'trilha', 'terra', 'estrada de terra', '4x4', 'lama', 'fazenda', 'sítio', 'sitio'],
    aventura: ['aventura', 'fim de semana', 'camping', 'natureza', 'montanha', 'cachoeira', 'radical'],
    trabalho: ['trabalho', 'trabalhar', 'entrega', 'comercial', 'empresa', 'uso profissional', 'uber', 'motorista de app', 'vendas'],
    carga: ['carga', 'transportar', 'mudança', 'mudanca', 'material de construção', 'ferramentas', 'equipamentos', 'peso'],
    performance: ['performance', 'esportivo', 'esportiva', 'velocidade', 'potência', 'potencia', 'curva', 'acelerar'],
    economia: ['economia', 'econômico', 'economico', 'consumo', 'combustível', 'combustivel', 'gastar pouco', 'baixo consumo', 'poupar'],
    eletrico: ['elétrico', 'eletrico', 'elétrica', 'eletrica', 'híbrido', 'hibrido', 'híbrida', 'hibrida', 'carregar', 'tomada', 'sustentável'],
};

export function detectTags(text: string): string[] {
    const normalized = text.toLowerCase();
    return Object.entries(tagDictionary)
        .filter(([, words]) => words.some((word) => normalized.includes(word)))
        .map(([tag]) => tag);
}

export function detectBudget(text: string): number | null {
    const match = text.toLowerCase().match(/r?\$?\s*(\d+)\s*mil(?![a-z])/i);
    return match ? Number(match[1]) * 1000 : null;
}

export function formatProfile(tags: string[], budget: number | null): string {
    const label = tags.length ? tags.join(', ') : 'sem critérios claros no texto';
    return budget ? `${label}, até R$ ${(budget / 1000).toFixed(0)} mil` : label;
}

export function calculateScore(modelTags: string[], tags: string[], price: number, budget: number | null): number {
    const matches = tags.filter((tag) => modelTags.includes(tag)).length;
    let score = tags.length ? 45 + matches * 14 : 55;
    if (budget && price > budget) score -= 30;
    return Math.max(15, Math.min(97, score));
}

export function recommendModels(text: string) {
    const tags = detectTags(text);
    const budget = detectBudget(text);
    const ranked = fordModels
        .map((model) => ({
            ...model,
            score: calculateScore(model.tags, tags, model.price, budget),
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
    return parts.length ? parts.join(' · ') : 'Linha Ford';
}

export function carFacts(car: Car): string[] {
    const facts = [
        car.engineFuelType ? String(car.engineFuelType) : null,
        car.enginePowerBhp ? `${car.enginePowerBhp} cv` : null,
        car.gearboxType ? String(car.gearboxType) : null,
        car.drivetrain ? String(car.drivetrain) : null,
    ].filter(Boolean) as string[];

    return facts.length ? facts : ['Ficha técnica Ford'];
}

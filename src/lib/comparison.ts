import { Car } from './ford-api';

export type MarcaRival = 'HONDA' | 'HYUNDAI';

export interface Rival {
    marca: MarcaRival;
    /** Termo enviado à API (busca por "contém"). */
    busca: string;
    /** Filtra o nome do modelo entre os resultados. */
    filtro: RegExp;
    rotulo: string;
}

export interface Segmento {
    rotulo: string;
    rivais: Rival[];
}

const RIDGELINE: Rival = { marca: 'HONDA', busca: 'Ridgeline', filtro: /ridgeline/i, rotulo: 'Ridgeline' };
const SANTA_CRUZ: Rival = { marca: 'HYUNDAI', busca: 'Santa Cruz', filtro: /santa cruz/i, rotulo: 'Santa Cruz' };
const PICAPE_MEDIA: Segmento = { rotulo: 'Picape', rivais: [RIDGELINE] };
const PICAPE_COMPACTA: Segmento = { rotulo: 'Picape compacta', rivais: [SANTA_CRUZ] };
const PICAPE_EXTRA_GRANDE: Segmento = { rotulo: 'Picape extra-grande', rivais: [RIDGELINE, SANTA_CRUZ] };

const HR_V: Rival = { marca: 'HONDA', busca: 'HR-V', filtro: /^(honda )?hr-v$/i, rotulo: 'HR-V' };
const ZR_V: Rival = { marca: 'HONDA', busca: 'ZR-V', filtro: /zr-v/i, rotulo: 'ZR-V' };
const KONA: Rival = { marca: 'HYUNDAI', busca: 'Kona', filtro: /^hyundai kona$/i, rotulo: 'Kona' };
const VENUE: Rival = { marca: 'HYUNDAI', busca: 'Venue', filtro: /^hyundai venue$/i, rotulo: 'Venue' };
const CR_V: Rival = { marca: 'HONDA', busca: 'CR-V', filtro: /cr-v/i, rotulo: 'CR-V' };
const TUCSON: Rival = { marca: 'HYUNDAI', busca: 'Tucson', filtro: /^hyundai tucson$/i, rotulo: 'Tucson' };
const PILOT: Rival = { marca: 'HONDA', busca: 'Pilot', filtro: /pilot/i, rotulo: 'Pilot' };
const PASSPORT: Rival = { marca: 'HONDA', busca: 'Passport', filtro: /passport/i, rotulo: 'Passport' };
const PALISADE: Rival = { marca: 'HYUNDAI', busca: 'Palisade', filtro: /palisade/i, rotulo: 'Palisade' };
const SANTA_FE: Rival = { marca: 'HYUNDAI', busca: 'Santa Fe', filtro: /^hyundai santa fe$/i, rotulo: 'Santa Fe' };

/** Cada modelo Ford é comparado só com concorrentes do mesmo segmento. */
export const SEGMENTOS: Record<string, Segmento> = {
    Mustang: {
        rotulo: 'Esportivo',
        rivais: [
            { marca: 'HONDA', busca: 'Type R', filtro: /civic type r/i, rotulo: 'Civic Type R' },
            { marca: 'HONDA', busca: 'NSX', filtro: /nsx/i, rotulo: 'NSX' },
            { marca: 'HYUNDAI', busca: 'Veloster N', filtro: /veloster n/i, rotulo: 'Veloster N' },
            { marca: 'HYUNDAI', busca: 'Elantra N', filtro: /elantra n/i, rotulo: 'Elantra N' },
        ],
    },
    Ranger: PICAPE_MEDIA,
    'Ranger Raptor': { ...PICAPE_MEDIA, rotulo: 'Picape de performance' },
    'F-150': PICAPE_EXTRA_GRANDE,
    'Maverick Hybrid': PICAPE_COMPACTA,
    'Bronco Sport': { rotulo: 'SUV compacto', rivais: [HR_V, ZR_V, KONA, VENUE] },
    Territory: { rotulo: 'SUV médio', rivais: [CR_V, TUCSON] },
    Explorer: { rotulo: 'SUV grande', rivais: [PILOT, PASSPORT, PALISADE, SANTA_FE] },
};

export const SUGESTOES = ['Mustang', 'Ranger', 'Ranger Raptor', 'Territory', 'Bronco Sport', 'Maverick Hybrid', 'Explorer', 'F-150'];

/** Termo mandado pra API quando o nome de exibição não existe como texto no campo `model` dela. */
export const TERMO_BUSCA_API: Record<string, string> = { 'Maverick Hybrid': 'Maverick' };

const PERTENCE_FORD: Record<string, (modelo: string, variante: string) => boolean> = {
    Mustang: (m) => m.includes('mustang') && !m.includes('mach'),
    Ranger: (m) => m.includes('ranger'),
    'Ranger Raptor': (m) => m.includes('ranger') && m.includes('raptor'),
    Territory: (m) => m.includes('territory'),
    'Bronco Sport': (m) => m.includes('bronco sport'),
    'Maverick Hybrid': (m, v) => m.includes('maverick') && (v.includes('fhev') || v.includes('hybrid')),
    Explorer: (m) => (m.startsWith('explorer') || m.includes('ford explorer')) && !m.includes('sport trac'),
    'F-150': (m) => m.includes('f-150') || m.includes('f150'),
};

const NICHO_FORD = /raptor|gtd|shelby|gt500|gt350|svt|lightning|tremor|dark horse|sport trac|convertible|super\s?crew/i;
const MODELOS_NICHO = new Set(['Ranger Raptor']);

export interface ItemComparacao {
    marca: string;
    modelo: string;
    carro: Car;
    ano: number | null;
    potencia: number | null;
    velocidade: number | null;
    referencia: boolean;
}

export interface Comparacao {
    segmento: string;
    itens: ItemComparacao[];
    semDados: string[];
}

export function potenciaDoCarro(carro: Car): number | null {
    if (carro.enginePowerBhp != null) return Math.round(carro.enginePowerBhp);
    const doNome = `${carro.variant ?? ''}`.match(/\((\d+(?:\.\d+)?)\s*HP\)/i);
    return doNome ? Math.round(parseFloat(doNome[1])) : null;
}

export function estimarPotencia(carro: Car): number {
    const texto = `${carro.model ?? ''} ${carro.variant ?? ''}`;
    const doTexto = texto.match(/\((\d+(?:\.\d+)?)\s*HP\)/i);
    if (doTexto) return Math.round(parseFloat(doTexto[1]));

    const t = texto.toLowerCase();
    if (t.includes('dark horse')) return 500;
    if (t.includes(' gt') || t.includes('gt ')) return 480;
    if (t.includes('raptor')) return 405;
    if (t.includes('lightning')) return 580;
    if (t.includes('v8')) return 400;
    if (t.includes('v6')) return 280;
    return 200;
}

export function estimarVelocidade(potenciaBhp: number): number {
    return Math.round(Math.min(260, 110 + potenciaBhp * 0.42));
}

/** Entre as candidatas com potência informada, a do ano mais recente e, nesse ano, a mais potente. */
export function escolherVersao(candidatas: Car[]): Car | null {
    if (!candidatas.length) return null;
    const comPotencia = candidatas.filter((c) => potenciaDoCarro(c) != null);
    const base = comPotencia.length ? comPotencia : candidatas;
    return [...base].sort((a, b) => {
        const anoA = a.yearFrom ?? 0;
        const anoB = b.yearFrom ?? 0;
        if (anoA !== anoB) return anoB - anoA;
        return (potenciaDoCarro(b) ?? -1) - (potenciaDoCarro(a) ?? -1);
    })[0];
}

export function versaoFord(modelo: string, carros: Car[]): Car | null {
    const pertence = PERTENCE_FORD[modelo];
    if (!pertence) return null;
    const ehNicho = MODELOS_NICHO.has(modelo);
    return escolherVersao(
        carros.filter(
            (c) =>
                pertence((c.model ?? '').toLowerCase(), (c.variant ?? '').toLowerCase()) &&
                (ehNicho || !NICHO_FORD.test(`${c.model ?? ''} ${c.variant ?? ''}`)),
        ),
    );
}

export function versaoRival(rival: Rival, carros: Car[]): Car | null {
    return escolherVersao(carros.filter((c) => rival.filtro.test(c.model ?? '')));
}

export function chaveRival(rival: Rival): string {
    return `${rival.marca}:${rival.busca}`;
}

function nomeMarca(marca: MarcaRival): string {
    return marca === 'HONDA' ? 'Honda' : 'Hyundai';
}

function item(marca: string, modelo: string, carro: Car, referencia: boolean): ItemComparacao {
    const potencia = potenciaDoCarro(carro) ?? estimarPotencia(carro);
    const velocidade = carro.topSpeedKph ?? estimarVelocidade(potencia);
    return { marca, modelo, carro, ano: carro.yearFrom ?? null, potencia, velocidade, referencia };
}

export function montarComparacao(modeloFord: string, carrosFord: Car[], carrosRivais: Record<string, Car[]>): Comparacao | null {
    const segmento = SEGMENTOS[modeloFord];
    if (!segmento) return null;

    const itens: ItemComparacao[] = [];
    const semDados: string[] = [];

    const ford = versaoFord(modeloFord, carrosFord);
    if (ford) itens.push(item('Ford', modeloFord, ford, true));
    else semDados.push(`Ford ${modeloFord}`);

    for (const rival of segmento.rivais) {
        const carro = versaoRival(rival, carrosRivais[chaveRival(rival)] ?? []);
        if (carro) itens.push(item(nomeMarca(rival.marca), rival.rotulo, carro, false));
        else semDados.push(`${nomeMarca(rival.marca)} ${rival.rotulo}`);
    }
    return { segmento: segmento.rotulo, itens, semDados };
}

/** Qual modelo Ford o texto digitado representa (o mais longo primeiro: "Bronco Sport" antes de "Bronco"). */
export function modeloDaBusca(termo: string, modelos: string[]): string | null {
    const t = termo.trim().toLowerCase();
    if (!t) return null;
    return [...modelos].sort((a, b) => b.length - a.length).find((m) => t.includes(m.toLowerCase())) ?? null;
}

/** "+150 cv" / "−150 cv": quanto o concorrente tem a mais ou a menos que o modelo Ford pesquisado. */
export function diferencaDoRival(referencia: ItemComparacao, item: ItemComparacao): { texto: string; ford: boolean } | null {
    if (referencia.potencia == null || item.potencia == null) return null;
    const d = item.potencia - referencia.potencia;
    return { texto: `${d > 0 ? '+' : d < 0 ? '−' : ''}${Math.abs(d)} cv`, ford: d < 0 };
}

export function rivalMaisForte(rivais: ItemComparacao[]): ItemComparacao | null {
    const comPotencia = rivais.filter((r) => r.potencia != null);
    if (!comPotencia.length) return null;
    return comPotencia.reduce((a, b) => ((b.potencia ?? 0) > (a.potencia ?? 0) ? b : a));
}

export function diferencaParaMedia(referencia: ItemComparacao, rivais: ItemComparacao[]): { media: number; diferenca: number; texto: string } | null {
    const potencias = rivais.map((r) => r.potencia).filter((p): p is number => p != null);
    if (referencia.potencia == null || !potencias.length) return null;
    const media = potencias.reduce((a, b) => a + b, 0) / potencias.length;
    const diferenca = Math.round(referencia.potencia - media);
    return { media: Math.round(media), diferenca, texto: `${diferenca > 0 ? '+' : diferenca < 0 ? '−' : ''}${Math.abs(diferenca)}` };
}

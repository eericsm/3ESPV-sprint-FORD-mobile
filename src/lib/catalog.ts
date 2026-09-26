import { FordModel } from '../data/ford';

export interface CelulaComparacao {
    texto: string;
    selo?: string;
    /** true quando o selo é o cinza "Empate" (vários carros dividem o melhor valor). */
    empate?: boolean;
}

export interface LinhaComparacao {
    rotulo: string;
    celulas: CelulaComparacao[];
    /** Todos os carros têm o mesmo valor: a linha não diferencia e aparece esmaecida. */
    igual: boolean;
}

function preco(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function fuelLabel(fuel: FordModel['fuel']): string {
    return fuel === 'combustion' ? 'Combustão' : fuel === 'hybrid' ? 'Híbrido' : 'Elétrico';
}

function potenciaDe(m: FordModel): number | null {
    const match = m.facts.join(' ').match(/(\d+)\s*cv/i);
    return match ? Number(match[1]) : null;
}

function lugaresDe(m: FordModel): number | null {
    const match = m.facts.join(' ').match(/(\d+)\s*lugares/i);
    return match ? Number(match[1]) : null;
}

/** Índices do menor/maior valor, só quando há diferença de verdade entre os modelos comparados. */
function vencedores(valores: (number | null)[], menor: boolean): number[] {
    const validos = valores.filter((v): v is number => v !== null);
    if (validos.length < 2 || new Set(validos).size < 2) return [];
    const alvo = menor ? Math.min(...validos) : Math.max(...validos);
    return valores.flatMap((v, i) => (v === alvo ? [i] : []));
}

function linha(rotulo: string, textos: (string | null)[], melhor?: { indices: number[]; selo: string }): LinhaComparacao {
    const empate = (melhor?.indices.length ?? 0) > 1;
    const celulas: CelulaComparacao[] = textos.map((texto, i) => {
        const vence = !!melhor?.indices.includes(i);
        return { texto: texto ?? '—', selo: vence ? (empate ? 'Empate' : melhor?.selo) : undefined, empate: vence && empate ? true : undefined };
    });
    const igual = celulas.length > 1 && celulas[0].texto !== '—' && celulas.every((c) => c.texto === celulas[0].texto);
    return { rotulo, celulas, igual };
}

/**
 * Linhas da tabela de comparação, com o melhor de cada uma destacado (mesma lógica do site):
 * vencedor único ganha o selo verde, empatados ganham o selo cinza "Empate", e uma linha onde
 * todos são iguais fica esmaecida.
 */
export function buildComparisonRows(models: FordModel[]): LinhaComparacao[] {
    const potencias = models.map(potenciaDe);

    return [
        linha('Preço a partir de', models.map((m) => preco(m.price)), { indices: vencedores(models.map((m) => m.price), true), selo: 'Menor preço' }),
        linha('Motorização', models.map((m) => fuelLabel(m.fuel))),
        linha('Motor', models.map((m) => m.facts[0] ?? null)),
        linha('Potência', potencias.map((p) => (p !== null ? `${p} cv` : null)), { indices: vencedores(potencias, false), selo: 'Mais potente' }),
        linha('Lugares', models.map((m) => { const l = lugaresDe(m); return l ? `${l} lugares` : null; })),
    ];
}

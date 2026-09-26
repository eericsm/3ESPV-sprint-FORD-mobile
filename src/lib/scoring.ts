import { FordModel } from '../data/ford';

const TAG_POR_USO: Record<string, string> = {
    Cidade: 'cidade',
    Estrada: 'estrada',
    'Off-road': 'offroad',
    Trabalho: 'trabalho',
};

export interface PerfilUso {
    uso: string;
    passageiros: string;
    orcamento: string;
    prioridades: string[];
}

export interface ModeloRankeado {
    id: string;
    modelo: string;
    segmento: string;
    cobertura: number | null;
    falta: number;
    notaDeUso: number;
}

/** Quanto do preço "a partir de" o orçamento cobre, em %, com teto de 100. */
export function coberturaDoOrcamento(preco: number, orcamento: number): number {
    if (orcamento >= preco) return 100;
    return Math.floor((orcamento / preco) * 100);
}

/** Nota de orçamento (0-100), usada só para ORDENAR os carros pelo preço contra o teto. */
export function notaDeOrcamento(preco: number, teto: number): number {
    const excesso = (preco - teto) / teto;
    if (excesso <= 0) return 100;
    if (excesso <= 0.1) return 100 - (excesso / 0.1) * 50;
    if (excesso <= 0.3) return 50 - ((excesso - 0.1) / 0.2) * 50;
    return 0;
}

function orcamentoNumero(texto: string): number | null {
    const digitos = texto.replace(/\D/g, '');
    return digitos ? Number(digitos) : null;
}

/** Ranking completo do catálogo, recalculado a cada ajuste do perfil de uso (mesma fórmula do site). */
export function rankModels(models: FordModel[], perfil: PerfilUso): ModeloRankeado[] {
    const orcamento = orcamentoNumero(perfil.orcamento);
    const tagDeUso = TAG_POR_USO[perfil.uso];

    const pontuados = models.map((m) => {
        const combinaComUso = !!tagDeUso && m.tags.includes(tagDeUso);
        let nota = 50;

        if (combinaComUso) nota += 20;
        if (perfil.passageiros === '5 ou mais' && m.espacoBom) nota += 10;
        if (perfil.passageiros === '1 ou 2' && !m.espacoBom) nota += 6;

        for (const p of perfil.prioridades) {
            if (p === 'Consumo' && m.consumoBom) nota += 20;
            if (p === 'Espaço' && m.espacoBom) nota += 20;
            if (p === 'Conforto' && m.confortoBom) nota += 20;
            if (p === 'Potência' && m.potenciaBoa) nota += 20;
        }

        const notaDeUso = Math.max(15, Math.min(97, Math.round(nota)));

        let ordem = notaDeUso;
        if (orcamento) ordem = Math.min(ordem, notaDeOrcamento(m.price, orcamento));

        const cobertura = orcamento ? coberturaDoOrcamento(m.price, orcamento) : null;
        const falta = orcamento && orcamento < m.price ? m.price - orcamento : 0;

        return { id: m.id, modelo: m.name, segmento: m.segment, cobertura, falta, notaDeUso, ordem: Math.floor(ordem), preco: m.price };
    });

    pontuados.sort((a, b) => b.ordem - a.ordem || a.preco - b.preco);
    return pontuados.map(({ ordem, preco, ...resto }) => resto);
}

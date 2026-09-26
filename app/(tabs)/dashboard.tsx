import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { Tag } from '../../src/components/Tag';
import { Comparacao, ItemComparacao, SEGMENTOS, SUGESTOES, TERMO_BUSCA_API, chaveRival, diferencaDoRival, diferencaParaMedia, modeloDaBusca, montarComparacao, rivalMaisForte } from '../../src/lib/comparison';
import { listCars } from '../../src/lib/ford-api';

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
    return (
        <View style={styles.barBlock}>
            <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>{label}</Text>
                <Text style={styles.barValue}>{value}</Text>
            </View>
            <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.max(8, (value / max) * 100)}%`, backgroundColor: tone }]} />
            </View>
        </View>
    );
}

export default function DashboardScreen() {
    const params = useLocalSearchParams<{ model?: string }>();
    const [search, setSearch] = useState(String(params.model ?? ''));
    const [termoBuscado, setTermoBuscado] = useState('');
    const [comparacao, setComparacao] = useState<Comparacao | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [semSegmento, setSemSegmento] = useState(false);

    const referencia = useMemo(() => comparacao?.itens.find((i) => i.referencia) ?? null, [comparacao]);
    const rivais = useMemo(() => comparacao?.itens.filter((i) => !i.referencia) ?? [], [comparacao]);
    const maisForte = useMemo(() => (rivais.length ? rivalMaisForte(rivais) : null), [rivais]);
    const media = useMemo(() => (referencia && rivais.length ? diferencaParaMedia(referencia, rivais) : null), [referencia, rivais]);
    const maximo = useMemo(() => {
        const valores = [referencia, ...rivais].flatMap((i) => (i ? [i.potencia ?? 0, i.velocidade ?? 0] : []));
        return Math.max(1, ...valores);
    }, [referencia, rivais]);

    async function buscar(termo: string) {
        const nome = termo.trim();
        if (!nome) {
            setError('Digite o nome de um carro para buscar.');
            return;
        }

        const modeloFord = modeloDaBusca(nome, SUGESTOES);
        setLoading(true);
        setError(null);
        setComparacao(null);
        setSemSegmento(false);
        setTermoBuscado(nome);

        if (!modeloFord || !SEGMENTOS[modeloFord]) {
            setLoading(false);
            setSemSegmento(true);
            return;
        }

        try {
            const segmento = SEGMENTOS[modeloFord];
            const termoApi = TERMO_BUSCA_API[modeloFord] ?? modeloFord;

            const [fordResponse, ...rivaisResponses] = await Promise.all([
                listCars({ make: 'FORD', model: termoApi, limit: 100 }),
                ...segmento.rivais.map((rival) => listCars({ make: rival.marca, model: rival.busca, limit: 100 })),
            ]);

            const carrosRivais = Object.fromEntries(segmento.rivais.map((rival, i) => [chaveRival(rival), rivaisResponses[i].items]));
            const resultado = montarComparacao(modeloFord, fordResponse.items, carrosRivais);
            setComparacao(resultado);
            if (!resultado || (!resultado.itens.length)) {
                setError('Não foi possível encontrar dados para esse modelo.');
            }
        } catch {
            setError('Não foi possível se conectar à API da Ford. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (params.model) void buscar(String(params.model));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.model]);

    return (
        <Screen>
            <Section title="Ficha técnica" subtitle="Compare potência e velocidade máxima de cada modelo Ford com os concorrentes do mesmo segmento.">
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color="#9FB3C8" />
                    <TextInput value={search} onChangeText={setSearch} placeholder="Pesquisar modelo" placeholderTextColor="#6F8398" style={styles.input} onSubmitEditing={() => void buscar(search)} />
                </View>
                <View style={styles.actionRow}>
                    <PrimaryButton label="Gerar análise" onPress={() => void buscar(search)} />
                </View>
                <View style={styles.filterRow}>
                    {SUGESTOES.map((item) => (
                        <Tag key={item} label={item} active={termoBuscado === item} onPress={() => { setSearch(item); void buscar(item); }} />
                    ))}
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </Section>

            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator color="#9FD4FF" />
                    <Text style={styles.loadingText}>Carregando comparação...</Text>
                </View>
            ) : semSegmento ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>Sem dados para "{termoBuscado}"</Text>
                    <Text style={styles.emptyText}>Escolha um dos modelos sugeridos acima para ver a comparação com os concorrentes.</Text>
                </View>
            ) : !termoBuscado ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>Encontre seu modelo Ford</Text>
                    <Text style={styles.emptyText}>Digite um modelo como Ranger, Mustang ou Territory para consultar a ficha técnica.</Text>
                </View>
            ) : referencia ? (
                <Section title={`${referencia.modelo} vs. ${comparacao?.segmento}`} subtitle={`${rivais.length} concorrente(s) do mesmo segmento.`}>
                    <View style={styles.summaryCard}>
                        <View style={styles.metricRow}>
                            <View style={styles.metric}>
                                <Text style={styles.metricValue}>{referencia.potencia ?? '—'}</Text>
                                <Text style={styles.metricLabel}>Potência (cv)</Text>
                            </View>
                            <View style={styles.metric}>
                                <Text style={styles.metricValue}>{referencia.velocidade ?? '—'}</Text>
                                <Text style={styles.metricLabel}>Velocidade (km/h)</Text>
                            </View>
                            <View style={styles.metric}>
                                <Text style={styles.metricValue}>{referencia.ano ?? '—'}</Text>
                                <Text style={styles.metricLabel}>Ano</Text>
                            </View>
                        </View>
                        {media ? <Text style={styles.summaryText}>{`Ford está ${media.texto} cv em relação à média dos concorrentes (${media.media} cv).`}</Text> : null}
                        {maisForte ? <Text style={styles.summaryText}>{`Concorrente mais forte: ${maisForte.marca} ${maisForte.modelo} (${maisForte.potencia} cv).`}</Text> : null}
                    </View>

                    <Bar label={`Ford ${referencia.modelo} · Potência`} value={referencia.potencia ?? 0} max={maximo} tone="#2F74FF" />
                    <Bar label={`Ford ${referencia.modelo} · Velocidade`} value={referencia.velocidade ?? 0} max={maximo} tone="#51D0B1" />

                    {rivais.map((rival) => {
                        const diferenca = diferencaDoRival(referencia, rival);
                        return (
                            <View key={`${rival.marca}:${rival.modelo}`} style={styles.rivalBlock}>
                                <View style={styles.rivalHeader}>
                                    <Text style={styles.rivalName}>{rival.marca} {rival.modelo}</Text>
                                    {diferenca ? <Text style={[styles.rivalBadge, diferenca.ford && styles.rivalBadgeGood]}>{diferenca.texto}</Text> : null}
                                </View>
                                <Bar label="Potência" value={rival.potencia ?? 0} max={maximo} tone="#E59F2F" />
                                <Bar label="Velocidade" value={rival.velocidade ?? 0} max={maximo} tone="#B56C00" />
                            </View>
                        );
                    })}

                    {comparacao?.semDados.length ? <Text style={styles.notice}>Sem dados para: {comparacao.semDados.join(', ')}.</Text> : null}
                </Section>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>Sem dados para "{termoBuscado}"</Text>
                    <Text style={styles.emptyText}>A API não retornou informações para este modelo agora. Tente novamente mais tarde.</Text>
                </View>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#B8C9D8',
    },
    input: {
        flex: 1,
        color: '#102A43',
        fontSize: 15,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    error: {
        color: '#B42318',
        fontSize: 13,
    },
    notice: {
        color: '#8A6D1D',
        fontSize: 12,
    },
    loadingBox: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 20,
    },
    loadingText: {
        color: '#526B82',
        fontSize: 13,
    },
    summaryCard: {
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D7E1E8',
        padding: 16,
        gap: 10,
    },
    summaryText: {
        color: '#315B7D',
        fontSize: 13,
        lineHeight: 19,
    },
    metricRow: {
        flexDirection: 'row',
        gap: 12,
    },
    metric: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: '#F2F6F9',
        padding: 14,
        borderWidth: 1,
        borderColor: '#D7E1E8',
        gap: 4,
    },
    metricValue: {
        color: '#102A43',
        fontSize: 18,
        fontWeight: '800',
    },
    metricLabel: {
        color: '#526B82',
        fontSize: 12,
    },
    barBlock: {
        gap: 8,
    },
    barLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    barLabel: {
        color: '#315B7D',
        fontSize: 13,
        fontWeight: '700',
    },
    barValue: {
        color: '#9FD4FF',
        fontSize: 13,
        fontWeight: '700',
    },
    barTrack: {
        height: 12,
        borderRadius: 999,
        backgroundColor: '#E8F0F7',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 999,
    },
    rivalBlock: {
        gap: 8,
        paddingTop: 10,
        marginTop: 6,
        borderTopWidth: 1,
        borderTopColor: '#E5ECF1',
    },
    rivalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rivalName: {
        color: '#102A43',
        fontSize: 14,
        fontWeight: '800',
    },
    rivalBadge: {
        color: '#B42318',
        fontSize: 12,
        fontWeight: '800',
    },
    rivalBadgeGood: {
        color: '#1D8A4A',
    },
    emptyText: {
        color: '#526B82',
        fontSize: 13,
    },
    emptyState: {
        padding: 18,
        backgroundColor: '#E8F0F7',
        borderWidth: 1,
        borderColor: '#B8C9D8',
        gap: 6,
    },
    emptyTitle: {
        color: '#102A43',
        fontSize: 16,
        fontWeight: '800',
    },
});

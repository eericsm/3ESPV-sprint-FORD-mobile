import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { carFacts, carLabel, carSubtitle } from '../../src/data/ford';
import { Car, CarRecommendation, getRecomendacoes, listCars } from '../../src/lib/ford-api';

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

function scoreFromCar(car: Car): number {
    const power = car.enginePowerBhp ?? car.enginePowerKw ?? 0;
    const speed = car.topSpeedKph ?? 0;
    return Math.max(10, Math.min(100, Math.round(power * 0.18 + speed * 0.12)));
}

export default function DashboardScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ model?: string }>();
    const [search, setSearch] = useState(String(params.model ?? ''));
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [suggestions, setSuggestions] = useState<Car[]>([]);
    const [similarCars, setSimilarCars] = useState<CarRecommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedScore = useMemo(() => (selectedCar ? scoreFromCar(selectedCar) : 0), [selectedCar]);

    async function loadCars(term: string) {
        const query = term.trim();
        if (!query) {
            setError('Digite o nome de um carro para buscar.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await listCars({ model: query, limit: 8 });
            setSuggestions(response.items);

            const match = response.items.find((item) => carLabel(item).toLowerCase().includes(query.toLowerCase())) ?? response.items[0] ?? null;
            setSelectedCar(match);

            if (!match) {
                setSimilarCars([]);
            } else {
                try {
                    const recommendations = await getRecomendacoes(match.id, 5);
                    setSimilarCars(recommendations.filter((item) => item.id !== match.id));
                } catch {
                    setSimilarCars([]);
                }
            }
        } catch {
            setError('Não foi possível carregar os dados. Tente novamente.');
            setSuggestions([]);
            setSimilarCars([]);
            setSelectedCar(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (params.model) {
            void loadCars(String(params.model));
            return;
        }

        void loadCars(search || 'Ranger');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.model]);

    useEffect(() => {
        if (!selectedCar && suggestions.length > 0) {
            setSelectedCar(suggestions[0]);
        }
    }, [selectedCar, suggestions]);

    return (
        <Screen>
            <Section title="Ficha técnica" subtitle="Consulte potência, velocidade máxima, câmbio e versões de cada modelo Ford.">
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color="#9FB3C8" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Pesquisar modelo"
                        placeholderTextColor="#6F8398"
                        style={styles.input}
                        onSubmitEditing={() => void loadCars(search)}
                    />
                </View>
                <View style={styles.actionRow}>
                    <PrimaryButton label="Gerar análise" onPress={() => void loadCars(search)} />
                    <PrimaryButton label="Ver concessionarias" onPress={() => router.push('/concessionarias')} variant="secondary" />
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </Section>

            {!loading && !selectedCar && !error ? <View style={styles.emptyState}><Text style={styles.emptyTitle}>Encontre seu modelo Ford</Text><Text style={styles.emptyText}>Digite um modelo como Ranger, Mustang ou Territory para consultar a ficha técnica.</Text></View> : null}

            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator color="#9FD4FF" />
                    <Text style={styles.loadingText}>Carregando análise...</Text>
                </View>
            ) : selectedCar ? (
                <Section title={carLabel(selectedCar)} subtitle={carSubtitle(selectedCar)}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryText}>{carFacts(selectedCar).join(' · ')}</Text>
                        <View style={styles.metricRow}>
                            <View style={styles.metric}>
                                <Text style={styles.metricValue}>{selectedCar.enginePowerBhp ?? selectedCar.enginePowerKw ?? '—'}</Text>
                                <Text style={styles.metricLabel}>Potencia</Text>
                            </View>
                            <View style={styles.metric}>
                                <Text style={styles.metricValue}>{selectedCar.topSpeedKph ?? '—'}</Text>
                                <Text style={styles.metricLabel}>Velocidade</Text>
                            </View>
                            <View style={styles.metric}>
                                <Text style={styles.metricValue}>#{selectedCar.id}</Text>
                                <Text style={styles.metricLabel}>Código do modelo</Text>
                            </View>
                        </View>
                    </View>

                    <Bar label="Score estimado" value={selectedScore || 50} max={100} tone="#2F74FF" />
                    <Bar label="Peso da potencia" value={Math.min(100, Math.round(((selectedCar.enginePowerBhp ?? 0) / 600) * 100))} max={100} tone="#51D0B1" />
                    <Bar label="Peso no preco" value={Math.min(100, Math.round(((selectedCar.topSpeedKph ?? 0) / 300) * 100))} max={100} tone="#F2C94C" />
                </Section>
            ) : null}

            <Section title="Versões encontradas" subtitle={`${suggestions.length} opções encontradas para sua busca.`}>
                {suggestions.length > 0 ? <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Comparativo tecnico</Text>
                    <Text style={styles.chartLegend}>Potencia e velocidade maxima das versoes encontradas</Text>
                    {suggestions.slice(0, 6).map((item) => <View key={item.id} style={styles.chartRow}>
                        <Text style={styles.chartLabel} numberOfLines={1}>{carLabel(item)}</Text>
                        <View style={styles.chartBars}>
                            <View style={[styles.chartBar, styles.powerBar, { width: `${Math.min(100, ((item.enginePowerBhp ?? item.enginePowerKw ?? 0) / 600) * 100)}%` }]} />
                            <View style={[styles.chartBar, styles.speedBar, { width: `${Math.min(100, ((item.topSpeedKph ?? 0) / 300) * 100)}%` }]} />
                        </View>
                    </View>)}
                    <View style={styles.chartKey}><Text style={styles.keyPower}>Potencia</Text><Text style={styles.keySpeed}>Velocidade</Text></View>
                </View> : null}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                    {suggestions.map((item) => (
                        <Pressable
                            key={item.id}
                            style={[styles.compCard, selectedCar?.id === item.id && styles.compCardActive]}
                            onPress={() => setSelectedCar(item)}
                        >
                            <Text style={styles.compTitle}>{carLabel(item)}</Text>
                            <Text style={styles.compMeta}>{carSubtitle(item)}</Text>
                            <Text style={styles.compScore}>{item.enginePowerBhp ?? item.enginePowerKw ?? '—'}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </Section>

            <Section title="Modelos semelhantes" subtitle="Outros modelos que podem combinar com sua escolha.">
                <FlatRecommendationList items={similarCars} onPress={(item) => setSelectedCar(item)} />
            </Section>
        </Screen>
    );
}

function FlatRecommendationList({ items, onPress }: { items: CarRecommendation[]; onPress: (item: CarRecommendation) => void }) {
    if (!items.length) {
        return <Text style={styles.emptyText}>Sem recomendacoes ainda. Faça uma busca acima.</Text>;
    }

    return (
        <View style={styles.recList}>
            {items.map((item) => (
                <Pressable key={item.id} style={styles.recCard} onPress={() => onPress(item)}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.recTitle}>{carLabel(item)}</Text>
                        <Text style={styles.recMeta}>{carSubtitle(item)}</Text>
                    </View>
                    <View style={styles.scorePill}>
                        <Text style={styles.scoreText}>{Math.round(item.similarity)}</Text>
                    </View>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D7E1E8',
        padding: 16,
        gap: 10,
    },
    chartTitle: { color: '#102A43', fontSize: 16, fontWeight: '800' },
    chartLegend: { color: '#526B82', fontSize: 12 },
    chartRow: { gap: 5 },
    chartLabel: { color: '#315B7D', fontSize: 12 },
    chartBars: { gap: 3 },
    chartBar: { height: 7 },
    powerBar: { backgroundColor: '#1261A0' },
    speedBar: { backgroundColor: '#E59F2F' },
    chartKey: { flexDirection: 'row', gap: 18 },
    keyPower: { color: '#1261A0', fontSize: 11, fontWeight: '700' },
    keySpeed: { color: '#B56C00', fontSize: 11, fontWeight: '700' },
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
    error: {
        color: '#B42318',
        fontSize: 13,
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
        gap: 14,
    },
    summaryText: {
        color: '#315B7D',
        fontSize: 14,
        lineHeight: 20,
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
    horizontalList: {
        gap: 12,
        paddingRight: 4,
    },
    compCard: {
        width: 160,
        borderRadius: 18,
        backgroundColor: '#E8F0F7',
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 14,
        gap: 6,
    },
    compCardActive: {
        borderColor: '#2F74FF',
    },
    compTitle: {
        color: '#102A43',
        fontSize: 15,
        fontWeight: '800',
    },
    compMeta: {
        color: '#526B82',
        fontSize: 12,
    },
    compScore: {
        color: '#9FD4FF',
        fontSize: 26,
        fontWeight: '900',
        marginTop: 8,
    },
    recList: {
        gap: 10,
    },
    recCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#E8F0F7',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 14,
    },
    recTitle: {
        color: '#102A43',
        fontSize: 15,
        fontWeight: '800',
    },
    recMeta: {
        color: '#526B82',
        fontSize: 12,
        marginTop: 2,
    },
    scorePill: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#2F74FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
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

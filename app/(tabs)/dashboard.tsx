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

            if (match) {
                const recommendations = await getRecomendacoes(match.id, 5);
                setSimilarCars(recommendations.filter((item) => item.id !== match.id));
            } else {
                setSimilarCars([]);
            }
        } catch {
            setError('Nao foi possivel se conectar ao backend da Ford.');
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
            <Section title="Dashboard detalhado" subtitle="Os dados abaixo vem do mesmo backend Ford usado no site.">
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
                    <PrimaryButton label="Buscar no backend" onPress={() => void loadCars(search)} />
                    <PrimaryButton label="Ver concessionarias" onPress={() => router.push('/concessionarias')} variant="secondary" />
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </Section>

            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator color="#9FD4FF" />
                    <Text style={styles.loadingText}>Carregando dados da API...</Text>
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
                                <Text style={styles.metricLabel}>ID API</Text>
                            </View>
                        </View>
                    </View>

                    <Bar label="Score estimado" value={selectedScore || 50} max={100} tone="#2F74FF" />
                    <Bar label="Peso da potencia" value={Math.min(100, Math.round(((selectedCar.enginePowerBhp ?? 0) / 600) * 100))} max={100} tone="#51D0B1" />
                    <Bar label="Peso no preco" value={Math.min(100, Math.round(((selectedCar.topSpeedKph ?? 0) / 300) * 100))} max={100} tone="#F2C94C" />
                </Section>
            ) : null}

            <Section title="Resultados do backend" subtitle={`${suggestions.length} carros retornados na busca atual.`}>
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

            <Section title="Recomendacoes semelhantes" subtitle="Retornadas pela rota de recommendations do mesmo backend.">
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
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
    },
    input: {
        flex: 1,
        color: '#F5F8FC',
        fontSize: 15,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    error: {
        color: '#F3B1B1',
        fontSize: 13,
    },
    loadingBox: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 20,
    },
    loadingText: {
        color: '#9FB3C8',
        fontSize: 13,
    },
    summaryCard: {
        borderRadius: 20,
        backgroundColor: '#0D1A2C',
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 16,
        gap: 14,
    },
    summaryText: {
        color: '#DCE8F3',
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
        backgroundColor: '#13253C',
        padding: 14,
        borderWidth: 1,
        borderColor: '#22354A',
        gap: 4,
    },
    metricValue: {
        color: '#F5F8FC',
        fontSize: 18,
        fontWeight: '800',
    },
    metricLabel: {
        color: '#91A7BB',
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
        color: '#DCE8F3',
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
        backgroundColor: '#13253C',
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
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 14,
        gap: 6,
    },
    compCardActive: {
        borderColor: '#2F74FF',
    },
    compTitle: {
        color: '#F5F8FC',
        fontSize: 15,
        fontWeight: '800',
    },
    compMeta: {
        color: '#91A7BB',
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
        backgroundColor: '#13253C',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 14,
    },
    recTitle: {
        color: '#F5F8FC',
        fontSize: 15,
        fontWeight: '800',
    },
    recMeta: {
        color: '#91A7BB',
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
        color: '#9FB3C8',
        fontSize: 13,
    },
});

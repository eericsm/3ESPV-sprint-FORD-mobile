import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { Tag } from '../../src/components/Tag';
import { carLabel, carSubtitle } from '../../src/data/ford';
import { Car, listCars } from '../../src/lib/ford-api';

const quickPrompts = [
    'Uso o carro com a familia e viajo muito na estrada',
    'Quero algo para trabalho e economia na cidade',
    'Procuro aventura, off-road e performance',
];

function inferModelTerm(text: string): string {
    const normalized = text.toLowerCase();
    if (/(famil|viag|estrad)/i.test(normalized)) return 'Territory';
    if (/(off[- ]?road|aventur|trilha)/i.test(normalized)) return 'Bronco Sport';
    if (/(trabalh|cidade|econom)/i.test(normalized)) return 'Ranger';
    if (/(performance|esport|potenc|veloc)/i.test(normalized)) return 'Mustang';
    if (/(eletric|hibrid)/i.test(normalized)) return 'Mach-E';
    return 'Ford';
}

export default function PortalScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('Uso o carro com a familia e viajo muito na estrada');
    const [items, setItems] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const term = useMemo(() => inferModelTerm(query), [query]);

    async function loadRecommendations(text = query) {
        const modelTerm = inferModelTerm(text);
        setLoading(true);
        setError(null);

        try {
            const response = await listCars({ model: modelTerm, limit: 3 });
            setItems(response.items);
        } catch {
            setError('Nao foi possivel consultar o backend da Ford.');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadRecommendations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Screen>
            <Section title="Portal SEIA" subtitle="Digite sua rotina e veja uma busca inicial no mesmo backend Ford usado pelo site.">
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color="#9FB3C8" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Descreva seu uso..."
                        placeholderTextColor="#6F8398"
                        style={styles.input}
                        multiline
                    />
                </View>
                <View style={styles.promptRow}>
                    {quickPrompts.map((prompt) => (
                        <Tag key={prompt} label={prompt} onPress={() => setQuery(prompt)} />
                    ))}
                </View>
                <PrimaryButton label="Consultar backend" onPress={() => void loadRecommendations(query)} />
                <Text style={styles.helper}>Termo usado na busca: {term}</Text>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </Section>

            <Section title="Resultados do backend" subtitle={loading ? 'Carregando...' : `${items.length} carros retornados`}>
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator color="#9FD4FF" />
                    </View>
                ) : (
                    items.map((item) => (
                        <Pressable key={item.id} style={styles.card} onPress={() => router.push({ pathname: '/dashboard', params: { model: carLabel(item) } })}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.cardTitle}>{carLabel(item)}</Text>
                                    <Text style={styles.cardMeta}>{carSubtitle(item)}</Text>
                                </View>
                                <View style={styles.scorePill}>
                                    <Text style={styles.scoreText}>{item.enginePowerBhp ?? item.enginePowerKw ?? '—'}</Text>
                                </View>
                            </View>
                            <Text style={styles.cardFacts}>{[item.engineFuelType, item.gearboxType, item.drivetrain].filter(Boolean).join(' · ') || 'Dados do backend'}</Text>
                            <Text style={styles.cardPrice}>ID {item.id}</Text>
                        </Pressable>
                    ))
                )}
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
    },
    input: {
        flex: 1,
        minHeight: 80,
        color: '#F5F8FC',
        fontSize: 15,
        lineHeight: 22,
    },
    promptRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    helper: {
        color: '#9FB3C8',
        fontSize: 12,
    },
    error: {
        color: '#F3B1B1',
        fontSize: 13,
    },
    loadingBox: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#0D1A2C',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 16,
        gap: 10,
        marginBottom: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    cardTitle: {
        color: '#F5F8FC',
        fontSize: 17,
        fontWeight: '800',
    },
    cardMeta: {
        color: '#91A7BB',
        fontSize: 13,
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
    cardFacts: {
        color: '#D3DFEA',
        fontSize: 13,
    },
    cardPrice: {
        color: '#9FD4FF',
        fontSize: 15,
        fontWeight: '700',
    },
});

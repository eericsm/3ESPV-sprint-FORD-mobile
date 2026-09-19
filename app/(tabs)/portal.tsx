import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { Tag } from '../../src/components/Tag';
import { FordModel, formatProfile, recommendModels } from '../../src/data/ford';

const quickPrompts = [
    'Uso o carro com a familia e viajo muito na estrada',
    'Quero algo para trabalho e economia na cidade',
    'Procuro aventura, off-road e performance',
];

export default function PortalScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('Uso o carro com a familia e viajo muito na estrada');
    const [items, setItems] = useState<Array<FordModel & { score: number }>>([]);
    const [profile, setProfile] = useState('sem critérios claros no texto');
    const [loading, setLoading] = useState(false);

    async function loadRecommendations(text = query) {
        setLoading(true);
        const result = recommendModels(text);
        setItems(result.ranked);
        setProfile(formatProfile(result.tags, result.budget));
        setLoading(false);
    }

    useEffect(() => {
        void loadRecommendations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Screen>
            <Section title="Qual é o seu próximo Ford?" subtitle="Descreva como você usa o carro e descubra quais modelos combinam com você.">
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
                <PrimaryButton label="Encontrar meu Ford" onPress={() => void loadRecommendations(query)} />
                <Text style={styles.helper}>Perfil detectado: {profile}</Text>
            </Section>

            <Section title="Resultados da recomendacao" subtitle={loading ? 'Carregando...' : `${items.length} modelos ordenados por compatibilidade`}>
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator color="#9FD4FF" />
                    </View>
                ) : (
                    items.map((item) => (
                        <Pressable key={item.id} style={styles.card} onPress={() => router.push({ pathname: '/modelos', params: { tags: recommendModels(query).tags.join(','), orcamento: String(recommendModels(query).budget ?? '') } })}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                    <Text style={styles.cardMeta}>{item.segment}</Text>
                                </View>
                                <View style={styles.scorePill}>
                                    <Text style={styles.scoreText}>{item.score}%</Text>
                                </View>
                            </View>
                            <Text style={styles.cardReason}>{reasonFor(item, query)}</Text>
                            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${item.score}%` }]} /></View>
                            <Text style={styles.cardFacts}>{item.facts.join(' · ')}</Text>
                            <Text style={styles.cardPrice}>a partir de {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</Text>
                        </Pressable>
                    ))
                )}
            </Section>
        </Screen>
    );
}

function reasonFor(model: FordModel, text: string): string {
    const tags = recommendModels(text).tags.filter((tag) => model.tags.includes(tag));
    return tags.length ? `Combina com seu perfil: ${tags.join(', ')}` : 'Uma alternativa para explorar na linha Ford.';
}

const styles = StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#B8C9D8',
    },
    input: {
        flex: 1,
        minHeight: 80,
        color: '#102A43',
        fontSize: 15,
        lineHeight: 22,
    },
    promptRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    helper: {
        color: '#526B82',
        fontSize: 12,
    },
    error: {
        color: '#B42318',
        fontSize: 13,
    },
    loadingBox: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D7E1E8',
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
        color: '#102A43',
        fontSize: 17,
        fontWeight: '800',
    },
    cardMeta: {
        color: '#526B82',
        fontSize: 13,
        marginTop: 2,
    },
    scorePill: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#1261A0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    cardFacts: {
        color: '#315B7D',
        fontSize: 13,
    },
    cardPrice: {
        color: '#1261A0',
        fontSize: 15,
        fontWeight: '700',
    },
    cardReason: {
        color: '#315B7D',
        fontSize: 13,
        lineHeight: 18,
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#D7E1E8',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#2E7DD1',
    },
});

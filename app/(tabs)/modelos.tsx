import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { Tag } from '../../src/components/Tag';
import { carLabel, carSubtitle } from '../../src/data/ford';
import { Car, listCars } from '../../src/lib/ford-api';

const filters = ['Todos', 'Ford', 'Ranger', 'Mustang', 'Transit', 'Explorer'];

export default function ModelosScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('Ford');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [items, setItems] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem('seia-favorites')
                .then((value) => setFavorites(value ? (JSON.parse(value) as string[]) : []))
                .catch(() => setFavorites([]));
        }, []),
    );

    async function loadCars(term = query) {
        const trimmed = term.trim();
        setLoading(true);
        setError(null);

        try {
            const response = await listCars({ model: trimmed || undefined, limit: 20 });
            setItems(response.items);
        } catch {
            setError('Nao foi possivel carregar os modelos do backend da Ford.');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadCars('Ford');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function toggleFavorite(id: string) {
        const next = favorites.includes(String(id)) ? favorites.filter((item) => item !== String(id)) : [...favorites, String(id)];
        setFavorites(next);
        await AsyncStorage.setItem('seia-favorites', JSON.stringify(next));
    }

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term || term === 'ford') return items;
        return items.filter((item) => carLabel(item).toLowerCase().includes(term) || carSubtitle(item).toLowerCase().includes(term));
    }, [items, query]);

    return (
        <Screen>
            <Section title="Modelos Ford" subtitle="Lista carregada do mesmo backend usado no dashboard do site.">
                <View style={styles.searchBox}>
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Buscar por nome ou marca"
                        placeholderTextColor="#6F8398"
                        style={styles.input}
                        onSubmitEditing={() => void loadCars(query)}
                    />
                </View>
                <View style={styles.filterRow}>
                    {filters.map((item) => (
                        <Tag key={item} label={item} active={query === item || (item === 'Todos' && query === '')} onPress={() => {
                            if (item === 'Todos') {
                                setQuery('Ford');
                                void loadCars('Ford');
                                return;
                            }
                            setQuery(item);
                            void loadCars(item);
                        }} />
                    ))}
                </View>
                <PrimaryButton label="Atualizar do backend" onPress={() => void loadCars(query)} variant="secondary" />
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </Section>

            <Section title="Catalogo" subtitle={loading ? 'Carregando...' : `${visible.length} carros exibidos`}>
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator color="#9FD4FF" />
                    </View>
                ) : (
                    <FlatList
                        data={visible}
                        keyExtractor={(item) => String(item.id)}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item }) => {
                            const favorite = favorites.includes(String(item.id));
                            return (
                                <Pressable style={styles.card} onPress={() => router.push({ pathname: '/dashboard', params: { model: carLabel(item) } })}>
                                    <View style={styles.cardHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardTitle}>{carLabel(item)}</Text>
                                            <Text style={styles.cardMeta}>{carSubtitle(item)}</Text>
                                        </View>
                                        <Pressable onPress={() => void toggleFavorite(String(item.id))} hitSlop={10}>
                                            <Text style={[styles.favorite, favorite && styles.favoriteActive]}>{favorite ? 'Favorito' : 'Salvar'}</Text>
                                        </Pressable>
                                    </View>
                                    <Text style={styles.cardFacts}>{[item.engineFuelType, item.enginePowerBhp ? `${item.enginePowerBhp} cv` : null, item.gearboxType, item.drivetrain].filter(Boolean).join(' · ') || 'Dados da API'}</Text>
                                    <View style={styles.cardFooter}>
                                        <Text style={styles.cardPrice}>ID {item.id}</Text>
                                        <Text style={styles.cardRating}>Vel {item.topSpeedKph ?? '—'}</Text>
                                    </View>
                                </Pressable>
                            );
                        }}
                    />
                )}
            </Section>

            <PrimaryButton label={`Favoritos salvos: ${favorites.length}`} onPress={() => router.push('/perfil')} variant="secondary" />
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
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
    },
    input: {
        flex: 1,
        color: '#F5F8FC',
        fontSize: 15,
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
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
    separator: {
        height: 10,
    },
    card: {
        backgroundColor: '#0D1A2C',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 16,
        gap: 10,
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
    favorite: {
        color: '#9FB3C8',
        fontSize: 13,
        fontWeight: '700',
    },
    favoriteActive: {
        color: '#9FD4FF',
    },
    cardFacts: {
        color: '#D3DFEA',
        fontSize: 13,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardPrice: {
        color: '#9FD4FF',
        fontSize: 15,
        fontWeight: '700',
    },
    cardRating: {
        color: '#C9D6E2',
        fontSize: 13,
    },
});

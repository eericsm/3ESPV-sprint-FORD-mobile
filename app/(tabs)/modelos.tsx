import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { Tag } from '../../src/components/Tag';
import { calculateScore, detectBudget, detectTags, fordModels } from '../../src/data/ford';
import { Car, listCars } from '../../src/lib/ford-api';

const categories = ['Todos', 'SUVs', 'Picapes', 'Esportivos', 'Comerciais'];
const fuels = ['Todos', 'Combustao', 'Hibrido', 'Eletrico'];
type SortMode = 'compatibilidade' | 'preco' | 'nome';

function categoryKey(label: string) {
    return ({ SUVs: 'suv', Picapes: 'picape', Esportivos: 'esportivo', Comerciais: 'comercial' } as Record<string, string>)[label];
}

function fuelKey(label: string) {
    return ({ Combustao: 'combustion', Hibrido: 'hybrid', Eletrico: 'electric' } as Record<string, string>)[label];
}

const modelImages: Record<string, number> = {
    'bronco sport': require('../../assets/models/bronco-sport.jpeg'),
    explorer: require('../../assets/models/explorer.jpeg'),
    'f-150': require('../../assets/models/f150.jpg'),
    'mustang mach-e': require('../../assets/models/mach-e.jpg'),
    'maverick hybrid': require('../../assets/models/maverick-hybrid.jpg'),
    'maverick tremor': require('../../assets/models/maverick-tremor.jpg'),
    mustang: require('../../assets/models/mustang.jpeg'),
    ranger: require('../../assets/models/ranger.jpg'),
    'ranger raptor': require('../../assets/models/ranger-raptor.jpg'),
    territory: require('../../assets/models/territory.jpeg'),
    'transit furgão': require('../../assets/models/transit-furgao.jpeg'),
    'transit minibus': require('../../assets/models/transit-minibus.jpeg'),
};

function imageFor(modelName: string | null) {
    const normalized = (modelName ?? '').toLowerCase();
    return Object.entries(modelImages).find(([name]) => normalized.includes(name))?.[1];
}

export default function ModelosScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ tags?: string; orcamento?: string }>();
    const [query, setQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [category, setCategory] = useState('Todos');
    const [fuel, setFuel] = useState('Todos');
    const [maxPrice, setMaxPrice] = useState(600000);
    const [sortMode, setSortMode] = useState<SortMode>('compatibilidade');
    const [onlyCompatible, setOnlyCompatible] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
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
            setError('Não foi possível carregar os modelos. Tente novamente.');
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

    const profileTags = useMemo(() => String(params.tags ?? '').split(',').filter(Boolean), [params.tags]);
    const profileBudget = useMemo(() => Number(params.orcamento ?? 0) || null, [params.orcamento]);

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase();
        const mapped = items.map((item) => {
            const model = fordModels.find((candidate) => item.model?.toLowerCase().includes(candidate.name.toLowerCase().split(' ')[0]));
            const score = model ? calculateScore(model.tags, profileTags, model.price, profileBudget) : null;
            return { item, model, score };
        });
        return mapped
            .filter(({ item, model, score }) => {
                if (term && !`${item.model ?? ''} ${item.variant ?? ''}`.toLowerCase().includes(term)) return false;
                if (category !== 'Todos' && model && model.category !== categoryKey(category)) return false;
                if (fuel !== 'Todos' && model && model.fuel !== fuelKey(fuel)) return false;
                if (model && model.price > maxPrice) return false;
                if (onlyCompatible && (score ?? 0) < 70) return false;
                return true;
            })
            .sort((a, b) => sortMode === 'preco'
                ? (a.model?.price ?? 0) - (b.model?.price ?? 0)
                : sortMode === 'nome'
                    ? (a.item.model ?? '').localeCompare(b.item.model ?? '', 'pt-BR')
                    : (b.score ?? -1) - (a.score ?? -1));
    }, [items, query, category, fuel, maxPrice, sortMode, onlyCompatible, profileTags, profileBudget]);

    function toggleSelected(id: string) {
        setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
    }

    return (
        <Screen>
            <Section title="Modelos Ford" subtitle="Explore a linha Ford, filtre por categoria e compare suas opções.">
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
                <Text style={styles.filterLabel}>Categoria</Text>
                <View style={styles.filterRow}>{categories.map((item) => <Tag key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}</View>
                <Text style={styles.filterLabel}>Motorizacao</Text>
                <View style={styles.filterRow}>{fuels.map((item) => <Tag key={item} label={item} active={fuel === item} onPress={() => setFuel(item)} />)}</View>
                <View style={styles.filterRow}>
                    {(['compatibilidade', 'preco', 'nome'] as SortMode[]).map((item) => <Tag key={item} label={`Ordenar: ${item}`} active={sortMode === item} onPress={() => setSortMode(item)} />)}
                    <Tag label="So compativeis" active={onlyCompatible} onPress={() => setOnlyCompatible((current) => !current)} />
                </View>
                <Text style={styles.filterLabel}>Preco maximo: R$ {maxPrice.toLocaleString('pt-BR')}</Text>
                <View style={styles.filterRow}>{[250000, 400000, 600000].map((price) => <Tag key={price} label={`Ate ${price / 1000} mil`} active={maxPrice === price} onPress={() => setMaxPrice(price)} />)}</View>
                <PrimaryButton label="Atualizar modelos" onPress={() => void loadCars(query)} variant="secondary" />
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </Section>

            <Section title="Modelos Ford" subtitle={loading ? 'Carregando...' : `${visible.length} de ${items.length} modelos exibidos`}>
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator color="#9FD4FF" />
                    </View>
                ) : (
                    <FlatList
                        data={visible}
                        keyExtractor={({ item }) => String(item.id)}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item: result }) => {
                            const { item, model, score } = result;
                            const favorite = favorites.includes(String(item.id));
                            const isSelected = selected.includes(String(item.id));
                            return (
                                <Pressable style={[styles.card, isSelected && styles.cardSelected]} onPress={() => router.push({ pathname: '/dashboard', params: { model: [item.model, item.variant].filter(Boolean).join(' ') } })}>
                                    {imageFor(item.model) ? <Image source={imageFor(item.model)} style={styles.modelImage} resizeMode="cover" /> : null}
                                    <View style={styles.cardHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardTitle}>{[item.model, item.variant].filter(Boolean).join(' ') || `Modelo #${item.id}`}</Text>
                                            <Text style={styles.cardMeta}>{item.make ?? 'Ford'}{item.yearFrom ? ` · ${item.yearFrom}` : ''}</Text>
                                        </View>
                                        <Pressable onPress={() => void toggleFavorite(String(item.id))} hitSlop={10}>
                                            <Text style={[styles.favorite, favorite && styles.favoriteActive]}>{favorite ? 'Favorito' : 'Salvar'}</Text>
                                        </Pressable>
                                    </View>
                                    {score !== null ? <><Text style={styles.compatibility}>{score}% compativel</Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${score}%` }]} /></View></> : null}
                                    <Text style={styles.cardFacts}>{[item.engineFuelType, item.enginePowerBhp ? `${item.enginePowerBhp} cv` : null, item.gearboxType, item.drivetrain].filter(Boolean).join(' · ') || 'Ficha técnica em atualização'}</Text>
                                    <View style={styles.cardFooter}>
                                        <Text style={styles.cardPrice}>{model ? model.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : `ID ${item.id}`}</Text>
                                        <Text style={styles.cardRating}>Vel {item.topSpeedKph ?? '—'}</Text>
                                    </View>
                                    <Pressable style={[styles.compareButton, isSelected && styles.compareButtonActive]} onPress={() => toggleSelected(String(item.id))}><Text style={styles.compareButtonText}>{isSelected ? 'Selecionado' : 'Comparar'}</Text></Pressable>
                                </Pressable>
                            );
                        }}
                    />
                )}
            </Section>

            {selected.length > 0 ? <View style={styles.compareBar}><Text style={styles.compareCount}>{selected.length} de 3 modelos selecionados</Text><PrimaryButton label="Comparar lado a lado" onPress={() => router.push({ pathname: '/compare', params: { ids: selected.join(',') } })} /></View> : null}

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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#B8C9D8',
    },
    input: {
        flex: 1,
        color: '#102A43',
        fontSize: 15,
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterLabel: {
        color: '#315B7D',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D7E1E8',
        padding: 16,
        gap: 10,
    },
    modelImage: {
        width: '100%',
        height: 130,
    },
    cardSelected: {
        borderColor: '#1261A0',
        borderWidth: 2,
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
    favorite: {
        color: '#526B82',
        fontSize: 13,
        fontWeight: '700',
    },
    favoriteActive: {
        color: '#9FD4FF',
    },
    cardFacts: {
        color: '#315B7D',
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
        color: '#526B82',
        fontSize: 13,
    },
    compatibility: {
        color: '#1261A0',
        fontSize: 13,
        fontWeight: '800',
    },
    progressTrack: {
        height: 7,
        backgroundColor: '#D7E1E8',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#2E7DD1',
    },
    compareButton: {
        backgroundColor: '#E8F0F7',
        paddingVertical: 10,
        alignItems: 'center',
    },
    compareButtonActive: {
        backgroundColor: '#1261A0',
    },
    compareButtonText: {
        color: '#123B5D',
        fontSize: 13,
        fontWeight: '700',
    },
    compareBar: {
        gap: 10,
        padding: 14,
        backgroundColor: '#E8F0F7',
        borderWidth: 1,
        borderColor: '#B8C9D8',
    },
    compareCount: {
        color: '#102A43',
        fontSize: 14,
        fontWeight: '700',
    },
});

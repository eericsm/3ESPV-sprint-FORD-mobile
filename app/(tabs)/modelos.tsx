import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { Tag } from '../../src/components/Tag';
import { FordModel, calculateScore, fordModels } from '../../src/data/ford';
import { buildComparisonRows } from '../../src/lib/catalog';
import { loadProfile, registerEvent, saveFavorites } from '../../src/lib/profile-service';

const categories = ['Todos', 'SUVs', 'Picapes', 'Esportivos', 'Comerciais'];
const fuels = ['Todos', 'Combustao', 'Hibrido', 'Eletrico'];
type SortMode = 'compatibilidade' | 'preco' | 'nome';
const corteFraco = 70;
const maxComparar = 3;

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

function imageFor(modelName: string) {
    const normalized = modelName.toLowerCase();
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
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            loadProfile()
                .then((perfil) => active && setFavorites(perfil?.carros_favoritos ?? []))
                .catch(() => active && setFavorites([]));
            return () => {
                active = false;
            };
        }, []),
    );

    async function toggleFavorite(model: FordModel) {
        const adicionando = !favorites.includes(model.id);
        const next = adicionando ? [...favorites, model.id] : favorites.filter((item) => item !== model.id);
        setFavorites(next);
        registerEvent(model.id, adicionando ? 'favorite' : 'unfavorite', model.name).catch(() => undefined);
        saveFavorites(next).catch(() => undefined);
    }

    function abrirFicha(model: FordModel) {
        registerEvent(model.id, 'view', model.name).catch(() => undefined);
        router.push({ pathname: '/dashboard', params: { model: model.name } });
    }

    const profileTags = useMemo(() => String(params.tags ?? '').split(',').filter(Boolean), [params.tags]);
    const profileBudget = useMemo(() => Number(params.orcamento ?? 0) || null, [params.orcamento]);

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase();
        const mapped = fordModels.map((model) => ({ model, score: calculateScore(model.tags, profileTags, model.price, profileBudget) }));

        return mapped
            .filter(({ model, score }) => {
                if (category !== 'Todos' && model.category !== categoryKey(category)) return false;
                if (fuel !== 'Todos' && model.fuel !== fuelKey(fuel)) return false;
                if (model.price > maxPrice) return false;
                if (onlyCompatible && score < corteFraco) return false;
                if (onlyFavorites && !favorites.includes(model.id)) return false;
                if (term && !model.name.toLowerCase().includes(term) && !model.segment.toLowerCase().includes(term)) return false;
                return true;
            })
            .sort((a, b) =>
                sortMode === 'preco'
                    ? a.model.price - b.model.price
                    : sortMode === 'nome'
                        ? a.model.name.localeCompare(b.model.name, 'pt-BR')
                        : b.score - a.score,
            );
    }, [query, category, fuel, maxPrice, sortMode, onlyCompatible, onlyFavorites, favorites, profileTags, profileBudget]);

    function toggleSelected(id: string) {
        setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : current.length < maxComparar ? [...current, id] : current));
    }

    const comparisonRows = useMemo(() => {
        if (selected.length < 2) return [];
        const models = fordModels.filter((m) => selected.includes(m.id));
        return buildComparisonRows(models);
    }, [selected]);

    return (
        <Screen>
            <Section title="Modelos Ford" subtitle="Explore a linha Ford, filtre por categoria e compare suas opções.">
                <View style={styles.searchBox}>
                    <TextInput value={query} onChangeText={setQuery} placeholder="Buscar por nome ou segmento" placeholderTextColor="#6F8398" style={styles.input} />
                </View>
                <Text style={styles.filterLabel}>Categoria</Text>
                <View style={styles.filterRow}>{categories.map((item) => <Tag key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}</View>
                <Text style={styles.filterLabel}>Motorizacao</Text>
                <View style={styles.filterRow}>{fuels.map((item) => <Tag key={item} label={item} active={fuel === item} onPress={() => setFuel(item)} />)}</View>
                <View style={styles.filterRow}>
                    {(['compatibilidade', 'preco', 'nome'] as SortMode[]).map((item) => <Tag key={item} label={`Ordenar: ${item}`} active={sortMode === item} onPress={() => setSortMode(item)} />)}
                    <Tag label="So compativeis" active={onlyCompatible} onPress={() => setOnlyCompatible((current) => !current)} />
                    <Tag label="So favoritos" active={onlyFavorites} onPress={() => setOnlyFavorites((current) => !current)} />
                </View>
                <Text style={styles.filterLabel}>Preco maximo: R$ {maxPrice.toLocaleString('pt-BR')}</Text>
                <View style={styles.filterRow}>{[250000, 400000, 600000].map((price) => <Tag key={price} label={`Ate ${price / 1000} mil`} active={maxPrice === price} onPress={() => setMaxPrice(price)} />)}</View>
            </Section>

            <Section title="Modelos Ford" subtitle={`${visible.length} de ${fordModels.length} modelos exibidos`}>
                <FlatList
                    data={visible}
                    keyExtractor={({ model }) => model.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item: result }) => {
                        const { model, score } = result;
                        const favorite = favorites.includes(model.id);
                        const isSelected = selected.includes(model.id);
                        const image = imageFor(model.name);
                        return (
                            <Pressable style={[styles.card, isSelected && styles.cardSelected]} onPress={() => abrirFicha(model)}>
                                {image ? <Image source={image} style={styles.modelImage} resizeMode="cover" /> : null}
                                <View style={styles.cardHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cardTitle}>{model.name}</Text>
                                        <Text style={styles.cardMeta}>{model.segment}</Text>
                                    </View>
                                    <Pressable onPress={() => void toggleFavorite(model)} hitSlop={10}>
                                        <Text style={[styles.favorite, favorite && styles.favoriteActive]}>{favorite ? 'Favorito' : 'Salvar'}</Text>
                                    </Pressable>
                                </View>
                                <Text style={styles.compatibility}>{score}% compativel</Text>
                                <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${score}%` }]} /></View>
                                <Text style={styles.cardFacts}>{model.facts.join(' · ')}</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.cardPrice}>{model.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</Text>
                                </View>
                                <Pressable style={[styles.compareButton, isSelected && styles.compareButtonActive]} onPress={() => toggleSelected(model.id)}>
                                    <Text style={styles.compareButtonText}>{isSelected ? 'Selecionado' : 'Comparar'}</Text>
                                </Pressable>
                            </Pressable>
                        );
                    }}
                />
            </Section>

            {comparisonRows.length > 0 ? (
                <Section title="Comparacao rapida" subtitle="Melhor valor de cada linha destacado.">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View>
                            {comparisonRows.map((row) => (
                                <View key={row.rotulo} style={[styles.compareRow, row.igual && styles.compareRowDimmed]}>
                                    <Text style={styles.compareRowLabel}>{row.rotulo}</Text>
                                    <View style={styles.compareRowCells}>
                                        {row.celulas.map((cell, i) => (
                                            <View key={i} style={styles.compareCell}>
                                                <Text style={styles.compareCellText}>{cell.texto}</Text>
                                                {cell.selo ? <Text style={[styles.compareBadge, cell.empate && styles.compareBadgeTie]}>{cell.selo}</Text> : null}
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </Section>
            ) : null}

            {selected.length > 0 ? (
                <View style={styles.compareBar}>
                    <Text style={styles.compareCount}>{selected.length} de {maxComparar} modelos selecionados</Text>
                    <PrimaryButton
                        label="Comparar lado a lado"
                        onPress={() => {
                            for (const id of selected) {
                                const model = fordModels.find((m) => m.id === id);
                                if (model) registerEvent(model.id, 'compare', model.name).catch(() => undefined);
                            }
                            router.push({ pathname: '/compare', params: { ids: selected.join(',') } });
                        }}
                    />
                </View>
            ) : null}

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
    compareRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5ECF1',
    },
    compareRowDimmed: {
        opacity: 0.5,
    },
    compareRowLabel: {
        width: 130,
        color: '#526B82',
        fontSize: 12,
        fontWeight: '700',
    },
    compareRowCells: {
        flexDirection: 'row',
        gap: 12,
    },
    compareCell: {
        width: 130,
        gap: 2,
    },
    compareCellText: {
        color: '#102A43',
        fontSize: 13,
        fontWeight: '700',
    },
    compareBadge: {
        color: '#1D8A4A',
        fontSize: 11,
        fontWeight: '800',
    },
    compareBadgeTie: {
        color: '#7A8A99',
    },
});

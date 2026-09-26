import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';
import { fordModels } from '../src/data/ford';
import { buildComparisonRows } from '../src/lib/catalog';
import { registerEvent } from '../src/lib/profile-service';

export default function CompareScreen() {
    const router = useRouter();
    const { ids } = useLocalSearchParams<{ ids?: string }>();

    const models = useMemo(() => {
        const selectedIds = String(ids ?? '').split(',').filter(Boolean);
        return fordModels.filter((model) => selectedIds.includes(model.id));
    }, [ids]);

    const rows = useMemo(() => buildComparisonRows(models), [models]);

    useEffect(() => {
        if (models.length < 2) return;
        for (const model of models) {
            registerEvent(model.id, 'compare', model.name).catch(() => undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [models.map((m) => m.id).join(',')]);

    return (
        <Screen>
            <View style={styles.header}>
                <View>
                    <Text style={styles.eyebrow}>ANALISE SEIA</Text>
                    <Text style={styles.title}>Comparar modelos</Text>
                </View>
                <Pressable onPress={() => router.back()}><Text style={styles.back}>Voltar</Text></Pressable>
            </View>
            {models.length < 2 ? (
                <Text style={styles.empty}>Selecione pelo menos dois modelos no catalogo.</Text>
            ) : (
                <>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                        {models.map((model) => (
                            <View key={model.id} style={styles.card}>
                                <Text style={styles.segment}>{model.segment}</Text>
                                <Text style={styles.name}>{model.name}</Text>
                                <Text style={styles.price}>{model.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</Text>
                                <Text style={styles.facts}>{model.facts.join(' · ')}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <Section title="Ficha comparativa" subtitle="Melhor valor de cada linha destacado.">
                        {rows.map((row) => (
                            <View key={row.rotulo} style={[styles.tableRow, row.igual && styles.tableRowDimmed]}>
                                <Text style={styles.rowLabel}>{row.rotulo}</Text>
                                <View style={styles.rowCells}>
                                    {row.celulas.map((cell, i) => (
                                        <View key={i} style={styles.cell}>
                                            <Text style={styles.cellText}>{cell.texto}</Text>
                                            {cell.selo ? <Text style={[styles.badge, cell.empate && styles.badgeTie]}>{cell.selo}</Text> : null}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </Section>
                </>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    eyebrow: { color: '#2E7DD1', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    title: { color: '#102A43', fontSize: 28, fontWeight: '900', marginTop: 4 },
    back: { color: '#1261A0', fontWeight: '700' },
    empty: { color: '#526B82', fontSize: 15, lineHeight: 22 },
    row: { gap: 12, paddingRight: 18 },
    card: { width: 220, padding: 16, gap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7E1E8' },
    segment: { color: '#526B82', fontSize: 12, textTransform: 'uppercase', fontWeight: '700' },
    name: { color: '#102A43', fontSize: 20, fontWeight: '900' },
    price: { color: '#1261A0', fontWeight: '700' },
    facts: { color: '#315B7D', fontSize: 12, lineHeight: 18 },
    tableRow: {
        gap: 8,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5ECF1',
    },
    tableRowDimmed: {
        opacity: 0.5,
    },
    rowLabel: {
        color: '#526B82',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    rowCells: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    cell: {
        minWidth: 100,
        gap: 2,
    },
    cellText: {
        color: '#102A43',
        fontSize: 14,
        fontWeight: '800',
    },
    badge: {
        color: '#1D8A4A',
        fontSize: 11,
        fontWeight: '800',
    },
    badgeTie: {
        color: '#7A8A99',
    },
});

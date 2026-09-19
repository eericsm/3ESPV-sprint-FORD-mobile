import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';
import { carFacts, carLabel } from '../src/data/ford';
import { Car, getCar } from '../src/lib/ford-api';

export default function CompareScreen() {
    const router = useRouter();
    const { ids } = useLocalSearchParams<{ ids?: string }>();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carIds = String(ids ?? '').split(',').filter(Boolean).map(Number);
        Promise.all(carIds.map((id) => getCar(id)))
            .then(setCars)
            .catch(() => setCars([]))
            .finally(() => setLoading(false));
    }, [ids]);

    return (
        <Screen>
            <View style={styles.header}>
                <View>
                    <Text style={styles.eyebrow}>ANALISE SEIA</Text>
                    <Text style={styles.title}>Comparar modelos</Text>
                </View>
                <Pressable onPress={() => router.back()}><Text style={styles.back}>Voltar</Text></Pressable>
            </View>
            {loading ? <ActivityIndicator color="#1261A0" /> : cars.length < 2 ? <Text style={styles.empty}>Selecione pelo menos dois modelos no catalogo.</Text> : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    {cars.map((car) => <View key={car.id} style={styles.card}>
                        <Text style={styles.segment}>{car.make ?? 'Ford'}</Text>
                        <Text style={styles.name}>{carLabel(car)}</Text>
                        <Text style={styles.price}>ID {car.id}</Text>
                        <Section title="Ficha tecnica">
                            <Metric label="Potencia" value={`${car.enginePowerBhp ?? car.enginePowerKw ?? '—'} cv`} />
                            <Metric label="Velocidade maxima" value={`${car.topSpeedKph ?? '—'} km/h`} />
                            <Metric label="Combustivel" value={car.engineFuelType ?? '—'} />
                            <Metric label="Cambio" value={car.gearboxType ?? '—'} />
                            <Metric label="Tracao" value={car.drivetrain ?? '—'} />
                            <Text style={styles.facts}>{carFacts(car).join(' · ')}</Text>
                        </Section>
                    </View>)}
                </ScrollView>
            )}
        </Screen>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return <View style={styles.metric}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    eyebrow: { color: '#2E7DD1', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    title: { color: '#102A43', fontSize: 28, fontWeight: '900', marginTop: 4 },
    back: { color: '#1261A0', fontWeight: '700' },
    empty: { color: '#526B82', fontSize: 15, lineHeight: 22 },
    row: { gap: 12, paddingRight: 18 },
    card: { width: 270, padding: 16, gap: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7E1E8' },
    segment: { color: '#526B82', fontSize: 12, textTransform: 'uppercase', fontWeight: '700' },
    name: { color: '#102A43', fontSize: 22, fontWeight: '900' },
    price: { color: '#1261A0', fontWeight: '700' },
    metric: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5ECF1', paddingVertical: 9, gap: 8 },
    label: { color: '#526B82', fontSize: 12, flex: 1 },
    value: { color: '#102A43', fontSize: 13, fontWeight: '800', textAlign: 'right', flex: 1 },
    facts: { color: '#315B7D', fontSize: 12, lineHeight: 18 },
});
import * as Location from 'expo-location';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { Tag } from '../../src/components/Tag';
import { dealerships } from '../../src/data/ford';

function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
    const R = 6371;
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const h = sinLat * sinLat + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLng * sinLng;
    return 2 * R * Math.asin(Math.sqrt(h));
}

export default function ConcessionariasScreen() {
    const [origin, setOrigin] = useState<Location.LocationObjectCoords | null>(null);
    const [filter, setFilter] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const visible = useMemo(() => {
        const filtered = filter.length
            ? dealerships.filter((item) => filter.some((service) => item.services.includes(service)))
            : dealerships;

        return filtered
            .map((item) => ({
                ...item,
                distance: origin ? distanceKm({ latitude: origin.latitude, longitude: origin.longitude }, item) : null,
            }))
            .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
    }, [filter, origin]);

    async function useMyLocation() {
        setError(null);
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) {
            setError('Permissao de localizacao negada.');
            return;
        }

        try {
            const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setOrigin(position.coords);
        } catch {
            setError('Nao foi possivel obter a localizacao.');
        }
    }

    function toggleService(service: string) {
        setFilter((current) => (current.includes(service) ? current.filter((item) => item !== service) : [...current, service]));
    }

    return (
        <Screen>
            <Section title="Concessionarias" subtitle="Com geolocalizacao, filtros por servico e rota externa para o mapa.">
                <View style={styles.filterRow}>
                    {['Vendas', 'Test-drive', 'Oficina', 'Pecas'].map((service) => (
                        <Tag key={service} label={service} active={filter.includes(service)} onPress={() => toggleService(service)} />
                    ))}
                </View>
                <PrimaryButton label={origin ? 'Localizacao atual ativa' : 'Usar minha localizacao'} onPress={useMyLocation} variant="secondary" />
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </Section>

            <Section title="Lojas proximas" subtitle={`${visible.length} unidades encontradas`}>
                {visible.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardMeta}>{item.address}</Text>
                                <Text style={styles.cardMeta}>{item.neighborhood}</Text>
                            </View>
                            <View style={styles.distancePill}>
                                <Text style={styles.distanceValue}>{item.distance == null ? '—' : `${item.distance.toFixed(1)} km`}</Text>
                            </View>
                        </View>
                        <View style={styles.serviceRow}>
                            {item.services.map((service) => (
                                <Tag key={service} label={service} />
                            ))}
                        </View>
                        <Text style={styles.hours}>Seg a sex: {item.hours.weekday}</Text>
                        <Text style={styles.hours}>Sabado: {item.hours.saturday ?? 'Fechado'}</Text>
                        <Text style={styles.hours}>Domingo: {item.hours.sunday ?? 'Fechado'}</Text>
                        <Pressable
                            onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.address}, ${item.neighborhood}`)}`)}
                            style={styles.link}
                        >
                            <Text style={styles.linkText}>Abrir rota</Text>
                        </Pressable>
                    </View>
                ))}
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    error: {
        color: '#F3B1B1',
        fontSize: 13,
    },
    card: {
        backgroundColor: '#0D1A2C',
        borderWidth: 1,
        borderColor: '#22354A',
        borderRadius: 20,
        padding: 16,
        gap: 12,
        marginBottom: 10,
    },
    cardHeader: {
        flexDirection: 'row',
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
    distancePill: {
        minWidth: 80,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    distanceValue: {
        color: '#9FD4FF',
        fontWeight: '800',
    },
    serviceRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    hours: {
        color: '#D3DFEA',
        fontSize: 13,
    },
    link: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#2F74FF',
    },
    linkText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
});

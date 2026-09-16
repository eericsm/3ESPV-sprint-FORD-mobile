import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { StatCard } from '../../src/components/StatCard';

const profileKey = 'seia-profile';

const defaultProfile = {
    name: '',
    phone: '',
    email: 'anthonio@gmail.com',
    createdAt: new Date().toISOString().slice(0, 10),
    usage: 'Cidade',
    passengers: '3 ou 4',
    budget: '',
};

export default function PerfilScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState(defaultProfile);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [appointmentsCount, setAppointmentsCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem(profileKey)
                .then((value) => value && setProfile((current) => ({ ...current, ...JSON.parse(value) })))
                .catch(() => undefined);

            AsyncStorage.getItem('seia-favorites').then((value) => setFavoritesCount(value ? JSON.parse(value).length : 0));
            AsyncStorage.getItem('seia-agendamentos').then((value) => setAppointmentsCount(value ? JSON.parse(value).length : 0));
        }, []),
    );

    async function saveProfile() {
        await AsyncStorage.setItem(profileKey, JSON.stringify(profile));
    }

    const initials = useMemo(() => {
        return profile.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('');
    }, [profile.name]);

    useEffect(() => {
        saveProfile().catch(() => undefined);
    }, [profile]);

    return (
        <Screen>
            <Section title="Perfil" subtitle="Dados salvos localmente no dispositivo e resumo de favoritos e agendamentos.">
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials || 'SE'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{profile.name || 'Perfil nao preenchido'}</Text>
                        <Text style={styles.meta}>{profile.email}</Text>
                        <Text style={styles.meta}>Criado em {profile.createdAt}</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <StatCard label="Favoritos" value={String(favoritesCount)} />
                    <StatCard label="Agendamentos" value={String(appointmentsCount)} tone="teal" />
                </View>
            </Section>

            <Section title="Seus dados" subtitle="Edite o perfil e mantenha as preferencias sincronizadas.">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {['Cidade', 'Estrada', 'Off-road', 'Trabalho'].map((item) => (
                        <Text key={item} style={[styles.choice, profile.usage === item && styles.choiceActive]} onPress={() => setProfile((current) => ({ ...current, usage: item }))}>
                            {item}
                        </Text>
                    ))}
                </ScrollView>
                <View style={styles.row}>
                    {['1 ou 2', '3 ou 4', '5 ou mais'].map((item) => (
                        <Text key={item} style={[styles.choice, profile.passengers === item && styles.choiceActive]} onPress={() => setProfile((current) => ({ ...current, passengers: item }))}>
                            {item}
                        </Text>
                    ))}
                </View>
                <TextInput style={styles.input} value={profile.name} onChangeText={(name) => setProfile((current) => ({ ...current, name }))} placeholder="Nome" placeholderTextColor="#6F8398" />
                <TextInput style={styles.input} value={profile.phone} onChangeText={(phone) => setProfile((current) => ({ ...current, phone }))} placeholder="Telefone" placeholderTextColor="#6F8398" />
                <TextInput style={styles.input} value={profile.budget} onChangeText={(budget) => setProfile((current) => ({ ...current, budget }))} placeholder="Orcamento" placeholderTextColor="#6F8398" />
                <PrimaryButton label="Salvar perfil" onPress={saveProfile} />
            </Section>

            <Section title="Atalhos" subtitle="Leve o usuario para as areas que mais importam.">
                <View style={styles.shortcutRow}>
                    <PrimaryButton label="Modelos" onPress={() => router.push('/modelos')} variant="secondary" />
                    <PrimaryButton label="Agenda" onPress={() => router.push('/agendamentos')} variant="secondary" />
                    <PrimaryButton label="Lojas" onPress={() => router.push('/concessionarias')} variant="secondary" />
                </View>
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: 'row',
        gap: 14,
        alignItems: 'center',
        backgroundColor: '#0D1A2C',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 22,
        backgroundColor: '#2F74FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },
    name: {
        color: '#F5F8FC',
        fontSize: 18,
        fontWeight: '800',
    },
    meta: {
        color: '#91A7BB',
        fontSize: 13,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    chipRow: {
        gap: 10,
        paddingRight: 8,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    choice: {
        color: '#C9D6E2',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
        fontSize: 12,
        fontWeight: '700',
        overflow: 'hidden',
    },
    choiceActive: {
        backgroundColor: '#2F74FF',
        borderColor: '#2F74FF',
        color: '#FFFFFF',
    },
    input: {
        borderRadius: 16,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
        color: '#F5F8FC',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    shortcutRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { StatCard } from '../../src/components/StatCard';
import { Tag } from '../../src/components/Tag';
import { calculateScore, fordModels } from '../../src/data/ford';
import { supabase } from '../../src/lib/supabase';

const profileKey = 'seia-profile';

const defaultProfile = {
    name: '',
    phone: '',
    email: 'anthonio@gmail.com',
    createdAt: new Date().toISOString().slice(0, 10),
    usage: 'Cidade',
    passengers: '3 ou 4',
    budget: '',
    priorities: [] as string[],
    consent: false,
};

export default function PerfilScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState(defaultProfile);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [appointmentsCount, setAppointmentsCount] = useState(0);
    const recommended = useMemo(() => fordModels.map((model) => ({ model, score: calculateScore(model.tags, profile.usage.toLowerCase().split(/[, ]+/), model.price, Number(profile.budget) || null) })).sort((a, b) => b.score - a.score).slice(0, 3), [profile]);

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
                <Text style={styles.fieldLabel}>Prioridades</Text>
                <View style={styles.choiceRow}>{['Economia', 'Espaco', 'Performance', 'Tecnologia'].map((item) => <Tag key={item} label={item} active={profile.priorities.includes(item)} onPress={() => setProfile((current) => ({ ...current, priorities: current.priorities.includes(item) ? current.priorities.filter((priority) => priority !== item) : [...current.priorities, item] }))} />)}</View>
                <Tag label="Aceito receber recomendações personalizadas" active={profile.consent} onPress={() => setProfile((current) => ({ ...current, consent: !current.consent }))} />
                <PrimaryButton label="Salvar perfil" onPress={saveProfile} />
            </Section>

            <Section title="Sua recomendacao" subtitle="Uma prévia baseada nas preferências salvas.">
                {recommended.map(({ model, score }) => <View key={model.id} style={styles.recommendation}><Text style={styles.recommendationName}>{model.name}</Text><Text style={styles.recommendationScore}>{score}% compativel</Text></View>)}
            </Section>

            <Section title="Atalhos" subtitle="Leve o usuario para as areas que mais importam.">
                <View style={styles.shortcutRow}>
                    <PrimaryButton label="Modelos" onPress={() => router.push('/modelos')} variant="secondary" />
                    <PrimaryButton label="Agenda" onPress={() => router.push('/agendamentos')} variant="secondary" />
                    <PrimaryButton label="Lojas" onPress={() => router.push('/concessionarias')} variant="secondary" />
                    <PrimaryButton label="Suporte" onPress={() => router.push('/fale-conosco')} variant="secondary" />
                </View>
            </Section>
            <PrimaryButton label="Sair da conta" onPress={async () => { await supabase?.auth.signOut(); router.replace('/'); }} variant="ghost" />
        </Screen>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: 'row',
        gap: 14,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D7E1E8',
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
        color: '#102A43',
        fontSize: 18,
        fontWeight: '800',
    },
    meta: {
        color: '#526B82',
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
        color: '#315B7D',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#B8C9D8',
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#B8C9D8',
        color: '#102A43',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    shortcutRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    fieldLabel: { color: '#315B7D', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
    choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    recommendation: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#D7E1E8' },
    recommendationName: { color: '#102A43', fontSize: 15, fontWeight: '800' },
    recommendationScore: { color: '#1261A0', fontSize: 13, fontWeight: '800' },
});

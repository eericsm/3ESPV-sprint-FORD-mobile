import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';
import { StatCard } from '../src/components/StatCard';

export default function LandingScreen() {
    const router = useRouter();

    return (
        <Screen scroll={false}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.heroGlow} />
                    <View style={styles.brandRow}>
                        <View style={styles.brandMark}>
                            <Ionicons name="car-sport" size={22} color="#07111f" />
                        </View>
                        <Text style={styles.brand}>SEIA Mobile</Text>
                    </View>
                    <Text style={styles.title}>Inteligencia automotiva em um app nativo.</Text>
                    <Text style={styles.subtitle}>
                        Explore modelos Ford, gere recomendacoes, agende atendimentos e leve a plataforma para Android sem o peso de um wrapper web.
                    </Text>
                    <View style={styles.heroActions}>
                        <PrimaryButton label="Entrar" onPress={() => router.push('/login')} />
                        <PrimaryButton label="Criar conta" onPress={() => router.push('/cadastro')} variant="secondary" />
                    </View>
                    <Link href="/portal" asChild>
                        <Pressable style={styles.textLink}>
                            <Text style={styles.textLinkLabel}>Entrar direto no app</Text>
                        </Pressable>
                    </Link>
                </View>

                <View style={styles.statsRow}>
                    <StatCard label="Modelos prontos para comparar" value="13" />
                    <StatCard label="Concessionarias em rede" value="5" tone="teal" />
                    <StatCard label="Fluxos principais" value="6" tone="gold" />
                </View>

                <Section title="O que ja vem pronto" subtitle="Base funcional para evoluir para EAS, auth real e integracoes nativas.">
                    <View style={styles.featureList}>
                        {[
                            'Tela inicial e autenticacao',
                            'Portal com recomendacoes por texto',
                            'Catalogo de modelos com favoritos',
                            'Dashboard de comparacao',
                            'Concessionarias com geolocalizacao',
                            'Agendamentos e perfil com persistencia local',
                        ].map((item) => (
                            <View key={item} style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={18} color="#51D0B1" />
                                <Text style={styles.featureText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </Section>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        padding: 16,
        gap: 18,
    },
    hero: {
        backgroundColor: '#0D1A2C',
        borderWidth: 1,
        borderColor: '#22354A',
        borderRadius: 28,
        padding: 20,
        gap: 14,
        overflow: 'hidden',
    },
    heroGlow: {
        position: 'absolute',
        top: -40,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 999,
        backgroundColor: 'rgba(47, 116, 255, 0.24)',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    brandMark: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: '#9FD4FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brand: {
        color: '#DCE8F3',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    title: {
        color: '#F5F8FC',
        fontSize: 32,
        lineHeight: 38,
        fontWeight: '900',
    },
    subtitle: {
        color: '#B5C6D6',
        fontSize: 15,
        lineHeight: 22,
    },
    heroActions: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    textLink: {
        alignSelf: 'flex-start',
    },
    textLinkLabel: {
        color: '#9FD4FF',
        fontSize: 13,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    featureList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureText: {
        color: '#DCE8F3',
        fontSize: 14,
    },
});

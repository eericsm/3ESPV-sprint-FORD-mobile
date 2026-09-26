import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';

export default function LandingScreen() {
    const router = useRouter();

    return (
        <Screen scroll={false}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.heroGlow} />
                    <Image source={require('../assets/models/hero-truck.png')} style={styles.heroImage} resizeMode="cover" />
                    <View style={styles.brandRow}>
                        <View style={styles.brandMark}>
                            <Ionicons name="car-sport" size={22} color="#07111f" />
                        </View>
                        <Text style={styles.brand}>Ford · Squad SEIA</Text>
                    </View>
                    <Text style={styles.eyebrow}>RECOMENDAÇÃO DE VEÍCULOS COM IA</Text>
                    <Text style={styles.title}>Dados precisos, carro perfeito.</Text>
                    <Text style={styles.subtitle}>
                        Descreva como você usa o carro. O SEIA compara seu perfil com os modelos Ford e mostra quais combinam com você, e por quê.
                    </Text>
                    <View style={styles.heroActions}>
                        <PrimaryButton label="Entrar" onPress={() => router.push('/login')} />
                        <PrimaryButton label="Criar conta" onPress={() => router.push('/cadastro')} variant="secondary" />
                    </View>
                </View>

                <Section title="Como o SEIA ajuda" subtitle="Do seu jeito de usar o carro até a escolha do modelo.">
                    <View style={styles.featureList}>
                        {[
                            ['01', 'Descreva seu uso', 'Conte sua rotina, passageiros, estrada e orçamento.'],
                            ['02', 'Receba a recomendação', 'Veja os modelos que mais combinam com seu perfil.'],
                            ['03', 'Compare a ficha técnica', 'Compare potência, velocidade e concorrentes do segmento.'],
                        ].map(([number, title, description]) => (
                            <View key={number} style={styles.featureItem}>
                                <Text style={styles.featureNumber}>{number}</Text>
                                <View style={styles.featureCopy}>
                                    <Text style={styles.featureTitle}>{title}</Text>
                                    <Text style={styles.featureText}>{description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Section>

                <Section title="Uma plataforma para decidir" subtitle="Recomendação, ficha técnica, comparação e test-drive em um só lugar." />
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        padding: 16,
        gap: 20,
    },
    hero: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D7E1E8',
        borderRadius: 4,
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
        backgroundColor: '#E8F0F7',
    },
    heroImage: {
        width: '100%',
        height: 180,
        marginBottom: 4,
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
        backgroundColor: '#1261A0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brand: {
        color: '#123B5D',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    eyebrow: {
        color: '#2E7DD1',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    title: {
        color: '#102A43',
        fontSize: 32,
        lineHeight: 38,
        fontWeight: '900',
    },
    subtitle: {
        color: '#526B82',
        fontSize: 15,
        lineHeight: 22,
    },
    heroActions: {
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
        color: '#526B82',
        fontSize: 14,
        lineHeight: 19,
    },
    featureNumber: {
        color: '#2E7DD1',
        fontSize: 13,
        fontWeight: '800',
        width: 28,
    },
    featureCopy: {
        flex: 1,
        gap: 3,
    },
    featureTitle: {
        color: '#102A43',
        fontSize: 16,
        fontWeight: '800',
    },
});

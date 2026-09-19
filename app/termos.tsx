import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';

export default function TermsScreen() {
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);

    async function continueToApp() {
        await AsyncStorage.setItem('seia-terms-accepted', JSON.stringify({ accepted: true, date: new Date().toISOString() }));
        router.replace('/portal');
    }

    return (
        <Screen>
            <Section title="Termos e contratos" subtitle="Uma base simples para consentimento e continuidade da experiencia.">
                <View style={styles.card}>
                    <ScrollView style={styles.scroll} contentContainerStyle={{ gap: 12 }}>
                        <Text style={styles.body}>1. O usuario concorda em usar a plataforma para consultar modelos, concessionarias e servicos de agendamento.</Text>
                        <Text style={styles.body}>2. As informacoes de recomendacao sao ilustrativas e podem ser atualizadas em novas versoes do app.</Text>
                        <Text style={styles.body}>3. Você pode salvar favoritos, preferências e agendamentos para facilitar seu próximo acesso.</Text>
                        <Text style={styles.body}>4. As informações exibidas são destinadas a ajudar na escolha do modelo e no agendamento de uma visita.</Text>
                    </ScrollView>
                </View>
                <Pressable style={styles.checkRow} onPress={() => setAccepted((current) => !current)}>
                    <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
                        {accepted ? <Text style={styles.checkboxMark}>✓</Text> : null}
                    </View>
                    <Text style={styles.checkText}>Li e aceito os termos acima</Text>
                </Pressable>
                <PrimaryButton label="Continuar" onPress={continueToApp} />
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 16,
        maxHeight: 300,
    },
    scroll: {
        maxHeight: 300,
    },
    body: {
        color: '#315B7D',
        fontSize: 14,
        lineHeight: 21,
    },
    checkRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2B3F56',
        backgroundColor: '#F2F6F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#2F74FF',
        borderColor: '#2F74FF',
    },
    checkboxMark: {
        color: '#FFFFFF',
        fontWeight: '900',
    },
    checkText: {
        color: '#315B7D',
        fontSize: 14,
        fontWeight: '600',
    },
});

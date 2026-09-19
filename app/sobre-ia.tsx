import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';

const steps = [
    { n: '01', title: 'Informe sua rotina', text: 'O usuario descreve uso, estrada, familia e teto de preco.' },
    { n: '02', title: 'Analise de dados', text: 'O app cruza texto livre com catalogo, preco e tags de uso.' },
    { n: '03', title: 'Resultado inteligente', text: 'O ranking exibe os modelos mais aderentes e facilita a decisao.' },
];

export default function SobreIaScreen() {
    return (
        <Screen>
            <Section title="Como a IA decide" subtitle="No mobile, esta primeira versao usa regras locais e catalogo estruturado, com espaco para evoluir depois.">
                <View style={styles.timeline}>
                    {steps.map((step) => (
                        <View key={step.n} style={styles.step}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{step.n}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.stepTitle}>{step.title}</Text>
                                <Text style={styles.stepText}>{step.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    timeline: {
        gap: 14,
    },
    step: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#22354A',
    },
    badge: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#2F74FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontWeight: '900',
    },
    stepTitle: {
        color: '#102A43',
        fontSize: 16,
        fontWeight: '800',
    },
    stepText: {
        color: '#315B7D',
        fontSize: 13,
        lineHeight: 19,
        marginTop: 4,
    },
});

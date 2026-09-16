import { StyleSheet, Text, View } from 'react-native';

type Props = {
    label: string;
    value: string;
    tone?: 'blue' | 'teal' | 'gold';
};

export function StatCard({ label, value, tone = 'blue' }: Props) {
    return (
        <View style={[styles.card, styles[tone]]}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 105,
        borderRadius: 18,
        padding: 14,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
        gap: 6,
    },
    blue: {
        borderColor: '#2853A7',
    },
    teal: {
        borderColor: '#1D7F96',
    },
    gold: {
        borderColor: '#94661E',
    },
    value: {
        color: '#F5F8FC',
        fontSize: 22,
        fontWeight: '800',
    },
    label: {
        color: '#9FB3C8',
        fontSize: 12,
        lineHeight: 16,
    },
});

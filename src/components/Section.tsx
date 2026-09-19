import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    title: string;
    subtitle?: string;
    children?: ReactNode;
};

export function Section({ title, subtitle, children }: Props) {
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 12,
    },
    header: {
        gap: 4,
    },
    title: {
        color: '#102A43',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    subtitle: {
        color: '#526B82',
        fontSize: 13,
        lineHeight: 18,
    },
});

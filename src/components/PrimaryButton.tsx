import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
};

export function PrimaryButton({ label, onPress, variant = 'primary' }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed]}
        >
            <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary, variant === 'ghost' && styles.labelGhost]}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: '#2F74FF',
    },
    secondary: {
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#2B3F56',
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#2B3F56',
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
    label: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    labelSecondary: {
        color: '#E6EEF8',
    },
    labelGhost: {
        color: '#AFC1D4',
    },
});

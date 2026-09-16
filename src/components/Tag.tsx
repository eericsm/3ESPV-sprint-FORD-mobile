import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
    label: string;
    active?: boolean;
    onPress?: () => void;
};

export function Tag({ label, active = false, onPress }: Props) {
    const content = <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>;

    if (!onPress) {
        return <Text style={[styles.static, active && styles.staticActive]}>{label}</Text>;
    }

    return (
        <Pressable onPress={onPress} style={[styles.static, active && styles.staticActive]}>
            {content}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    static: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
    },
    staticActive: {
        backgroundColor: '#2F74FF',
        borderColor: '#2F74FF',
    },
    label: {
        color: '#C9D6E2',
        fontSize: 12,
        fontWeight: '600',
    },
    labelActive: {
        color: '#FFFFFF',
    },
});

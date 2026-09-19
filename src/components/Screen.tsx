import { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

type Props = {
    children: ReactNode;
    scroll?: boolean;
};

export function Screen({ children, scroll = true }: Props) {
    if (scroll) {
        return (
            <SafeAreaView style={styles.safe}>
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {children}
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.body}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F4F7FA',
    },
    scroll: {
        flexGrow: 1,
        padding: 18,
        gap: 20,
    },
    body: {
        flex: 1,
        padding: 16,
        gap: 16,
    },
});

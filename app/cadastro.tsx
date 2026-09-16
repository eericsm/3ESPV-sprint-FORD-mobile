import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';
import { hasSupabaseConfig, supabase } from '../src/lib/supabase';

export default function CadastroScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!hasSupabaseConfig || !supabase) {
            setMessage('Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY para ativar cadastro real.');
            return;
        }

        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        router.replace('/termos');
    }

    return (
        <Screen>
            <Section title="Criar conta" subtitle="Fluxo inicial com Supabase pronto para conectar depois ao backend oficial.">
                <View style={styles.form}>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#6F8398" autoCapitalize="none" keyboardType="email-address" />
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Senha" placeholderTextColor="#6F8398" secureTextEntry />
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    {loading ? <ActivityIndicator color="#9FD4FF" /> : <PrimaryButton label="Criar conta" onPress={handleRegister} />}
                </View>
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 12,
    },
    input: {
        borderRadius: 16,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
        color: '#F5F8FC',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    message: {
        color: '#F3B1B1',
        fontSize: 13,
        lineHeight: 18,
    },
});

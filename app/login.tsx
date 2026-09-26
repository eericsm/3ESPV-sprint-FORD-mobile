import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';
import { hasSupabaseConfig, supabase } from '../src/lib/supabase';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!hasSupabaseConfig || !supabase) {
            setMessage('Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY para ativar login real.');
            return;
        }

        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        router.replace('/portal');
    }

    return (
        <Screen>
            <Section title="Entrar" subtitle="Acesse sua conta para ver recomendações e comparar modelos.">
                <View style={styles.form}>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#6F8398" autoCapitalize="none" keyboardType="email-address" />
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Senha" placeholderTextColor="#6F8398" secureTextEntry />
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    {loading ? <ActivityIndicator color="#9FD4FF" /> : <PrimaryButton label="Entrar" onPress={handleLogin} />}
                    <Text style={styles.registerText}>Ainda não tem conta? <Link href="/cadastro" style={styles.registerLink}>Criar conta</Link></Text>
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#B8C9D8',
        color: '#102A43',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    message: {
        color: '#B42318',
        fontSize: 13,
        lineHeight: 18,
    },
    registerText: {
        color: '#526B82',
        fontSize: 13,
        textAlign: 'center',
    },
    registerLink: {
        color: '#1261A0',
        fontWeight: '800',
    },
});

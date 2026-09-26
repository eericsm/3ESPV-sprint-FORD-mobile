import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';
import { Tag } from '../src/components/Tag';
import { GENERO_OPTIONS } from '../src/data/ford';
import { hasSupabaseConfig, supabase } from '../src/lib/supabase';

export default function CadastroScreen() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [genero, setGenero] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!hasSupabaseConfig || !supabase) {
            setMessage('Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY para ativar cadastro real.');
            return;
        }

        const idadeNumero = Number(idade);
        if (nome.trim().length < 3) {
            setMessage('Informe seu nome completo.');
            return;
        }
        if (!idadeNumero || idadeNumero < 13 || idadeNumero > 120) {
            setMessage('Informe uma idade valida (13 a 120 anos).');
            return;
        }
        if (!genero) {
            setMessage('Selecione uma opcao de genero.');
            return;
        }

        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { nome: nome.trim(), idade: idadeNumero, genero } },
        });
        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        router.replace('/termos');
    }

    return (
        <Screen>
            <Section title="Criar conta" subtitle="Cadastre-se agora e encontre a versão ideal para a sua rotina.">
                <View style={styles.form}>
                    <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" placeholderTextColor="#6F8398" />
                    <TextInput style={styles.input} value={idade} onChangeText={(texto) => setIdade(texto.replace(/\D/g, ''))} placeholder="Idade" placeholderTextColor="#6F8398" keyboardType="number-pad" />
                    <Text style={styles.fieldLabel}>Gênero</Text>
                    <View style={styles.choiceRow}>
                        {GENERO_OPTIONS.map((item) => (
                            <Tag key={item} label={item} active={genero === item} onPress={() => setGenero(item)} />
                        ))}
                    </View>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#6F8398" autoCapitalize="none" keyboardType="email-address" />
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Senha" placeholderTextColor="#6F8398" secureTextEntry />
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    {loading ? <ActivityIndicator color="#9FD4FF" /> : <PrimaryButton label="Criar conta" onPress={handleRegister} />}
                    <Text style={styles.registerText}>Já tem uma conta? <Text style={styles.registerLink} onPress={() => router.push('/login')}>Fazer login</Text></Text>
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
    fieldLabel: { color: '#315B7D', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
    choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});

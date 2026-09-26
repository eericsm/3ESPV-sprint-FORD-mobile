import { useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';
import { faqAnswers } from '../src/data/ford';

type Message = { author: 'seia' | 'usuario'; text: string };

export default function FaleConoscoScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { author: 'seia', text: 'Oi, eu sou a SEIA. Posso ajudar com modelos e termos.' },
    ]);

    function send() {
        const text = query.trim();
        if (!text) return;

        setMessages((current) => [...current, { author: 'usuario', text }]);
        const found = faqAnswers.find((item) => item.key.test(text));
        setMessages((current) => [...current, { author: 'seia', text: found?.answer ?? 'Entendi. Para essa duvida, eu recomendo seguir para a pagina correspondente no menu.' }]);
        setQuery('');
    }

    return (
        <Screen>
            <Section title="Fale conosco" subtitle="Chat simples para FAQ e suporte de navegação.">
                <View style={styles.chat}>
                    <FlatList
                        data={messages}
                        keyExtractor={(_, index) => String(index)}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item }) => (
                            <View style={[styles.bubble, item.author === 'usuario' ? styles.userBubble : styles.botBubble]}>
                                <Text style={[styles.bubbleText, item.author === 'usuario' && styles.userText]}>{item.text}</Text>
                            </View>
                        )}
                    />
                </View>
                <View style={styles.inputRow}>
                    <TextInput value={query} onChangeText={setQuery} placeholder="Digite sua mensagem" placeholderTextColor="#6F8398" style={styles.input} />
                    <PrimaryButton label="Enviar" onPress={send} />
                </View>
            </Section>

            <Section title="Atalhos" subtitle="Abrindo as areas mais pedidas.">
                <View style={styles.shortcutRow}>
                    {[
                        ['Modelos', '/modelos'],
                        ['Perfil', '/perfil'],
                    ].map(([item, route]) => (
                        <Pressable key={item} onPress={() => router.push(route as '/perfil')}><Text style={styles.shortcut}>{item}</Text></Pressable>
                    ))}
                </View>
                <PrimaryButton label="Ligar para o atendimento" onPress={() => Linking.openURL('tel:+551140004000')} variant="secondary" />
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    chat: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D7E1E8',
        padding: 16,
        gap: 10,
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
        maxWidth: '92%',
    },
    botBubble: {
        backgroundColor: '#E8F0F7',
        alignSelf: 'flex-start',
    },
    userBubble: {
        backgroundColor: '#1261A0',
        alignSelf: 'flex-end',
    },
    bubbleText: {
        color: '#315B7D',
        fontSize: 14,
        lineHeight: 20,
    },
    userText: {
        color: '#FFFFFF',
    },
    separator: {
        height: 10,
    },
    inputRow: {
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
    shortcutRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    shortcut: {
        color: '#315B7D',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#22354A',
        fontSize: 12,
        fontWeight: '700',
    },
});

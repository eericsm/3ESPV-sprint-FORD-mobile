import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { Section } from '../src/components/Section';
import { faqAnswers } from '../src/data/ford';

type Message = { author: 'seia' | 'usuario'; text: string };

export default function FaleConoscoScreen() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { author: 'seia', text: 'Oi, eu sou a SEIA. Posso ajudar com agendamentos, modelos, concessionarias e termos.' },
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
                    {['Agendamentos', 'Modelos', 'Concessionarias', 'Perfil'].map((item) => (
                        <Text key={item} style={styles.shortcut}>{item}</Text>
                    ))}
                </View>
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    chat: {
        backgroundColor: '#0D1A2C',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#22354A',
        padding: 16,
        gap: 10,
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
        maxWidth: '92%',
    },
    botBubble: {
        backgroundColor: '#13253C',
        alignSelf: 'flex-start',
    },
    userBubble: {
        backgroundColor: '#2F74FF',
        alignSelf: 'flex-end',
    },
    bubbleText: {
        color: '#DCE8F3',
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
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
        color: '#F5F8FC',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    shortcutRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    shortcut: {
        color: '#C9D6E2',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#13253C',
        borderWidth: 1,
        borderColor: '#22354A',
        fontSize: 12,
        fontWeight: '700',
    },
});

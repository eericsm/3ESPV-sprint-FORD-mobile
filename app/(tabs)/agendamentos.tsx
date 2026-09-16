import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { Tag } from '../../src/components/Tag';
import { Appointment, dealerships, fordModels } from '../../src/data/ford';

const defaultAppointment: Appointment = {
    id: '',
    type: 'Test-drive',
    model: fordModels[0].name,
    dealership: dealerships[0].name,
    date: new Date().toISOString().slice(0, 10),
    time: '09:00',
    note: 'Levar documento e CNH',
};

export default function AgendamentosScreen() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [draft, setDraft] = useState(defaultAppointment);

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem('seia-agendamentos')
                .then((value) => setAppointments(value ? (JSON.parse(value) as Appointment[]) : []))
                .catch(() => setAppointments([]));
        }, []),
    );

    async function save(next: Appointment[]) {
        setAppointments(next);
        await AsyncStorage.setItem('seia-agendamentos', JSON.stringify(next));
    }

    async function addAppointment() {
        if (!draft.date || !draft.time) {
            Alert.alert('Preencha a data e o horario.');
            return;
        }

        const next: Appointment = {
            ...draft,
            id: `a-${Date.now()}`,
        };

        await save([next, ...appointments]);
        setDraft({ ...defaultAppointment, date: draft.date, time: draft.time });
    }

    async function removeAppointment(id: string) {
        Alert.alert('Cancelar agendamento', 'Deseja remover este item?', [
            { text: 'Manter', style: 'cancel' },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: () => save(appointments.filter((item) => item.id !== id)),
            },
        ]);
    }

    return (
        <Screen>
            <Section title="Agendamentos" subtitle="Cadastre test-drives, revisoes e avaliacoes com persistencia local no aparelho.">
                <View style={styles.form}>
                    <TextInput style={styles.input} value={draft.type} onChangeText={(type) => setDraft((current) => ({ ...current, type }))} placeholder="Tipo" placeholderTextColor="#6F8398" />
                    <TextInput style={styles.input} value={draft.model} onChangeText={(model) => setDraft((current) => ({ ...current, model }))} placeholder="Modelo" placeholderTextColor="#6F8398" />
                    <TextInput style={styles.input} value={draft.dealership} onChangeText={(dealership) => setDraft((current) => ({ ...current, dealership }))} placeholder="Concessionaria" placeholderTextColor="#6F8398" />
                    <View style={styles.row}>
                        <TextInput style={[styles.input, styles.flex]} value={draft.date} onChangeText={(date) => setDraft((current) => ({ ...current, date }))} placeholder="YYYY-MM-DD" placeholderTextColor="#6F8398" />
                        <TextInput style={[styles.input, styles.flex]} value={draft.time} onChangeText={(time) => setDraft((current) => ({ ...current, time }))} placeholder="HH:MM" placeholderTextColor="#6F8398" />
                    </View>
                    <TextInput style={styles.input} value={draft.note} onChangeText={(note) => setDraft((current) => ({ ...current, note }))} placeholder="Observacao" placeholderTextColor="#6F8398" />
                    <PrimaryButton label="Salvar agendamento" onPress={addAppointment} />
                </View>
            </Section>

            <Section title="Agenda salva" subtitle={`${appointments.length} compromissos no aparelho`}>
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardTitle}>{item.type}</Text>
                                    <Text style={styles.cardMeta}>{item.model}</Text>
                                    <Text style={styles.cardMeta}>{item.dealership}</Text>
                                </View>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                            <Text style={styles.cardNote}>{item.time} - {item.note}</Text>
                            <Tag label="Remover" onPress={() => removeAppointment(item.id)} />
                        </View>
                    )}
                />
            </Section>
        </Screen>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    flex: {
        flex: 1,
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
    separator: {
        height: 10,
    },
    card: {
        backgroundColor: '#0D1A2C',
        borderWidth: 1,
        borderColor: '#22354A',
        borderRadius: 20,
        padding: 16,
        gap: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 12,
    },
    cardTitle: {
        color: '#F5F8FC',
        fontSize: 17,
        fontWeight: '800',
    },
    cardMeta: {
        color: '#91A7BB',
        fontSize: 13,
        marginTop: 2,
    },
    date: {
        color: '#9FD4FF',
        fontSize: 13,
        fontWeight: '800',
    },
    cardNote: {
        color: '#DCE8F3',
        fontSize: 13,
    },
});

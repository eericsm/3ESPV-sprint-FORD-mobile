import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
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
    const params = useLocalSearchParams<{ dealership?: string }>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [draft, setDraft] = useState(defaultAppointment);

    useFocusEffect(
        useCallback(() => {
            if (params.dealership) setDraft((current) => ({ ...current, dealership: String(params.dealership) }));
        }, [params.dealership]),
    );

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
            <Section title="Agendamentos" subtitle="Escolha o atendimento, a concessionária e o melhor horário para você.">
                <View style={styles.form}>
                    <Text style={styles.fieldLabel}>Tipo de atendimento</Text>
                    <View style={styles.choiceRow}>{['Test-drive', 'Revisao', 'Avaliacao'].map((type) => <Tag key={type} label={type} active={draft.type === type} onPress={() => setDraft((current) => ({ ...current, type }))} />)}</View>
                    <Text style={styles.fieldLabel}>Modelo</Text>
                    <View style={styles.choiceRow}>{fordModels.slice(0, 6).map((model) => <Tag key={model.id} label={model.name} active={draft.model === model.name} onPress={() => setDraft((current) => ({ ...current, model: model.name }))} />)}</View>
                    <Text style={styles.fieldLabel}>Concessionaria</Text>
                    <View style={styles.choiceRow}>{dealerships.map((dealership) => <Tag key={dealership.id} label={dealership.name.replace('Ford ', '')} active={draft.dealership === dealership.name} onPress={() => setDraft((current) => ({ ...current, dealership: dealership.name }))} />)}</View>
                    <Text style={styles.fieldLabel}>Data e horario</Text>
                    <View style={styles.row}>
                        <TextInput style={[styles.input, styles.flex]} value={draft.date} onChangeText={(date) => setDraft((current) => ({ ...current, date }))} placeholder="YYYY-MM-DD" placeholderTextColor="#6F8398" />
                        <TextInput style={[styles.input, styles.flex]} value={draft.time} onChangeText={(time) => setDraft((current) => ({ ...current, time }))} placeholder="HH:MM" placeholderTextColor="#6F8398" />
                    </View>
                    <TextInput style={styles.input} value={draft.note} onChangeText={(note) => setDraft((current) => ({ ...current, note }))} placeholder="Observacao ou necessidade especial" placeholderTextColor="#6F8398" />
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
    fieldLabel: {
        color: '#315B7D',
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    choiceRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#B8C9D8',
        color: '#102A43',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    separator: {
        height: 10,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D7E1E8',
        borderRadius: 20,
        padding: 16,
        gap: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 12,
    },
    cardTitle: {
        color: '#102A43',
        fontSize: 17,
        fontWeight: '800',
    },
    cardMeta: {
        color: '#526B82',
        fontSize: 13,
        marginTop: 2,
    },
    date: {
        color: '#9FD4FF',
        fontSize: 13,
        fontWeight: '800',
    },
    cardNote: {
        color: '#315B7D',
        fontSize: 13,
    },
});

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { Section } from '../../src/components/Section';
import { StatCard } from '../../src/components/StatCard';
import { Tag } from '../../src/components/Tag';
import { GENERO_OPTIONS, fordModels } from '../../src/data/ford';
import { UserProfileChanges, loadProfile, saveProfile } from '../../src/lib/profile-service';
import { rankModels } from '../../src/lib/scoring';
import { supabase } from '../../src/lib/supabase';

const opcoesUso = ['Cidade', 'Estrada', 'Off-road', 'Trabalho'];
const opcoesPassageiros = ['1 ou 2', '3 ou 4', '5 ou mais'];
const opcoesPrioridade = ['Consumo', 'Espaço', 'Conforto', 'Potência'];

const emptyProfile: UserProfileChanges = {
    nome: '',
    email: '',
    idade: null,
    genero: '',
    telefone: '',
    uso_principal: '',
    passageiros: '',
    rodagem_mensal: '',
    orcamento: '',
    prioridades: [],
    carros_favoritos: [],
    carros_comparados: [],
    compartilha_com_concessionaria: false,
};

export default function PerfilScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfileChanges>(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let active = true;

            loadProfile()
                .then((perfil) => {
                    if (!active) return;
                    if (perfil) {
                        setProfile({
                            nome: perfil.nome ?? '',
                            email: perfil.email ?? '',
                            idade: perfil.idade,
                            genero: perfil.genero ?? '',
                            telefone: perfil.telefone ?? '',
                            uso_principal: perfil.uso_principal ?? '',
                            passageiros: perfil.passageiros ?? '',
                            rodagem_mensal: perfil.rodagem_mensal ?? '',
                            orcamento: perfil.orcamento ?? '',
                            prioridades: Array.isArray(perfil.prioridades) ? perfil.prioridades : [],
                            carros_favoritos: perfil.carros_favoritos ?? [],
                            carros_comparados: perfil.carros_comparados ?? [],
                            compartilha_com_concessionaria: perfil.compartilha_com_concessionaria ?? false,
                        });
                    }
                    setLoading(false);
                })
                .catch(() => {
                    if (!active) return;
                    setError('Não foi possível carregar o perfil salvo.');
                    setLoading(false);
                });

            supabase?.auth.getUser().then(({ data }) => {
                if (active && data.user?.email) setProfile((current) => ({ ...current, email: data.user!.email! }));
            });

            return () => {
                active = false;
            };
        }, []),
    );

    const ranking = useMemo(
        () =>
            profile.uso_principal
                ? rankModels(fordModels, {
                      uso: profile.uso_principal,
                      passageiros: profile.passageiros,
                      orcamento: profile.orcamento,
                      prioridades: profile.prioridades,
                  })
                : [],
        [profile.uso_principal, profile.passageiros, profile.orcamento, profile.prioridades],
    );

    async function handleSave() {
        setSaving(true);
        setError(null);

        try {
            const saved = await saveProfile(profile);
            setProfile((current) => ({ ...current, ...saved }));
        } catch {
            setError('Não foi possível salvar no banco. Confira sua conexão e tente novamente.');
        } finally {
            setSaving(false);
        }
    }

    const initials = useMemo(() => {
        const fromName = profile.nome
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('');
        return fromName || (profile.email?.[0]?.toUpperCase() ?? 'SE');
    }, [profile.nome, profile.email]);

    if (loading) {
        return (
            <Screen>
                <View style={styles.loadingBox}>
                    <ActivityIndicator color="#9FD4FF" />
                </View>
            </Screen>
        );
    }

    return (
        <Screen>
            <Section title="Perfil" subtitle="Dados sincronizados com sua conta e resumo de favoritos.">
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{profile.nome || 'Perfil nao preenchido'}</Text>
                        <Text style={styles.meta}>{profile.email}</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <StatCard label="Favoritos" value={String(profile.carros_favoritos.length)} />
                </View>
            </Section>

            <Section title="Seus dados" subtitle="Edite o perfil e mantenha as preferencias sincronizadas.">
                <Text style={styles.fieldLabel}>Uso principal</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {opcoesUso.map((item) => (
                        <Tag key={item} label={item} active={profile.uso_principal === item} onPress={() => setProfile((current) => ({ ...current, uso_principal: item }))} />
                    ))}
                </ScrollView>
                <Text style={styles.fieldLabel}>Passageiros</Text>
                <View style={styles.row}>
                    {opcoesPassageiros.map((item) => (
                        <Tag key={item} label={item} active={profile.passageiros === item} onPress={() => setProfile((current) => ({ ...current, passageiros: item }))} />
                    ))}
                </View>
                <Text style={styles.fieldLabel}>Gênero</Text>
                <View style={styles.row}>
                    {GENERO_OPTIONS.map((item) => (
                        <Tag key={item} label={item} active={profile.genero === item} onPress={() => setProfile((current) => ({ ...current, genero: item }))} />
                    ))}
                </View>
                <TextInput style={styles.input} value={profile.nome} onChangeText={(nome) => setProfile((current) => ({ ...current, nome }))} placeholder="Nome" placeholderTextColor="#6F8398" />
                <TextInput style={styles.input} value={profile.telefone} onChangeText={(telefone) => setProfile((current) => ({ ...current, telefone }))} placeholder="Telefone" placeholderTextColor="#6F8398" keyboardType="phone-pad" />
                <TextInput
                    style={styles.input}
                    value={profile.idade === null ? '' : String(profile.idade)}
                    onChangeText={(texto) => setProfile((current) => ({ ...current, idade: texto ? Number(texto.replace(/\D/g, '')) : null }))}
                    placeholder="Idade"
                    placeholderTextColor="#6F8398"
                    keyboardType="number-pad"
                />
                <TextInput
                    style={styles.input}
                    value={profile.rodagem_mensal}
                    onChangeText={(texto) => setProfile((current) => ({ ...current, rodagem_mensal: texto.replace(/\D/g, '') }))}
                    placeholder="Rodagem mensal (km)"
                    placeholderTextColor="#6F8398"
                    keyboardType="number-pad"
                />
                <TextInput
                    style={styles.input}
                    value={profile.orcamento}
                    onChangeText={(texto) => setProfile((current) => ({ ...current, orcamento: texto.replace(/\D/g, '') }))}
                    placeholder="Orcamento"
                    placeholderTextColor="#6F8398"
                    keyboardType="number-pad"
                />
                <Text style={styles.fieldLabel}>Prioridades</Text>
                <View style={styles.choiceRow}>
                    {opcoesPrioridade.map((item) => (
                        <Tag
                            key={item}
                            label={item}
                            active={profile.prioridades.includes(item)}
                            onPress={() =>
                                setProfile((current) => ({
                                    ...current,
                                    prioridades: current.prioridades.includes(item) ? current.prioridades.filter((p) => p !== item) : [...current.prioridades, item],
                                }))
                            }
                        />
                    ))}
                </View>
                <Tag
                    label="Aceito compartilhar meus dados com a concessionaria"
                    active={profile.compartilha_com_concessionaria}
                    onPress={() => setProfile((current) => ({ ...current, compartilha_com_concessionaria: !current.compartilha_com_concessionaria }))}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                {saving ? <ActivityIndicator color="#9FD4FF" /> : <PrimaryButton label="Salvar perfil" onPress={handleSave} />}
            </Section>

            {ranking.length > 0 ? (
                <Section title="Sua recomendacao" subtitle="Uma prévia baseada nas preferências salvas.">
                    {ranking.slice(0, 3).map((item) => (
                        <View key={item.id} style={styles.recommendation}>
                            <Text style={styles.recommendationName}>{item.modelo}</Text>
                            <Text style={styles.recommendationScore}>{item.cobertura !== null ? `${item.cobertura}% do orcamento coberto` : `${item.notaDeUso}% compativel`}</Text>
                        </View>
                    ))}
                </Section>
            ) : null}

            <Section title="Atalhos" subtitle="Leve o usuario para as areas que mais importam.">
                <View style={styles.shortcutRow}>
                    <PrimaryButton label="Modelos" onPress={() => router.push('/modelos')} variant="secondary" />
                    <PrimaryButton label="Suporte" onPress={() => router.push('/fale-conosco')} variant="secondary" />
                </View>
            </Section>
            <PrimaryButton label="Sair da conta" onPress={async () => { await supabase?.auth.signOut(); router.replace('/'); }} variant="ghost" />
        </Screen>
    );
}

const styles = StyleSheet.create({
    loadingBox: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    profileHeader: {
        flexDirection: 'row',
        gap: 14,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D7E1E8',
        padding: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 22,
        backgroundColor: '#2F74FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },
    name: {
        color: '#102A43',
        fontSize: 18,
        fontWeight: '800',
    },
    meta: {
        color: '#526B82',
        fontSize: 13,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    chipRow: {
        gap: 10,
        paddingRight: 8,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
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
        gap: 12,
        flexWrap: 'wrap',
    },
    fieldLabel: { color: '#315B7D', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
    choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    recommendation: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#D7E1E8' },
    recommendationName: { color: '#102A43', fontSize: 15, fontWeight: '800' },
    recommendationScore: { color: '#1261A0', fontSize: 13, fontWeight: '800' },
    error: { color: '#B42318', fontSize: 13 },
});

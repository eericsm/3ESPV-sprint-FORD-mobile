import { supabase } from './supabase';

export interface UserProfileRecord {
    id: string;
    nome: string;
    email: string;
    idade: number | null;
    genero: string;
    telefone: string;
    uso_principal: string;
    passageiros: string;
    rodagem_mensal: string;
    orcamento: string;
    prioridades: string[];
    carros_favoritos: string[];
    carros_comparados: string[];
    compartilha_com_concessionaria: boolean;
    created_at?: string;
    updated_at?: string;
}

export type UserProfileChanges = Omit<UserProfileRecord, 'id' | 'created_at' | 'updated_at'>;

export type VehicleEventType = 'view' | 'favorite' | 'unfavorite' | 'compare' | 'click' | 'contact';

const CAMPOS_RASTREADOS = ['nome', 'idade', 'genero', 'telefone', 'uso_principal', 'passageiros', 'rodagem_mensal', 'orcamento'] as const;

function profileChanged(current: UserProfileRecord, next: UserProfileChanges): boolean {
    return (
        CAMPOS_RASTREADOS.some((campo) => current[campo] !== next[campo]) ||
        JSON.stringify(current.prioridades ?? []) !== JSON.stringify(next.prioridades ?? []) ||
        current.compartilha_com_concessionaria !== next.compartilha_com_concessionaria
    );
}

export async function loadProfile(): Promise<UserProfileRecord | null> {
    if (!supabase) return null;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return null;

    const perfil = await supabase.from('profiles').select('*').eq('id', userData.user.id).maybeSingle();
    if (perfil.error) throw perfil.error;
    if (!perfil.data) return null;

    const favoritos = await supabase.from('user_favorites').select('vehicle_id').eq('user_id', userData.user.id);
    if (favoritos.error) throw favoritos.error;

    return {
        ...(perfil.data as UserProfileRecord),
        carros_favoritos: favoritos.data.map((item) => item.vehicle_id as string),
    };
}

export async function saveProfile(changes: UserProfileChanges): Promise<UserProfileRecord> {
    if (!supabase) throw new Error('Supabase nao configurado.');

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Sessao expirada. Faca login novamente.');

    const atual = await supabase.from('profiles').select('*').eq('id', userData.user.id).maybeSingle();
    if (atual.error) throw atual.error;

    const registro = {
        id: userData.user.id,
        ...changes,
        email: userData.user.email ?? changes.email,
        updated_at: new Date().toISOString(),
    };

    if (atual.data && profileChanged(atual.data as UserProfileRecord, changes)) {
        const historico = await supabase.from('user_profile_history').insert({
            user_id: userData.user.id,
            nome: changes.nome,
            email: registro.email,
            idade: changes.idade,
            genero: changes.genero,
            telefone: changes.telefone,
            uso_principal: changes.uso_principal,
            passageiros: changes.passageiros,
            rodagem_mensal: changes.rodagem_mensal,
            orcamento: changes.orcamento,
            prioridades: changes.prioridades,
            compartilha_com_concessionaria: changes.compartilha_com_concessionaria,
        });
        if (historico.error) throw historico.error;
    }

    const resposta = await supabase.from('profiles').upsert(registro, { onConflict: 'id' }).select().single();
    if (resposta.error) throw resposta.error;

    const limpar = await supabase.from('user_favorites').delete().eq('user_id', userData.user.id);
    if (limpar.error) throw limpar.error;

    if (changes.carros_favoritos.length) {
        const inserirFavoritos = await supabase
            .from('user_favorites')
            .insert(changes.carros_favoritos.map((vehicle_id) => ({ user_id: userData.user.id, vehicle_id })));
        if (inserirFavoritos.error) throw inserirFavoritos.error;
    }

    return resposta.data as UserProfileRecord;
}

export async function saveFavorites(vehicleIds: string[]): Promise<void> {
    if (!supabase) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return;

    const limpar = await supabase.from('user_favorites').delete().eq('user_id', userData.user.id);
    if (limpar.error) throw limpar.error;

    if (!vehicleIds.length) return;

    const inserir = await supabase
        .from('user_favorites')
        .insert(vehicleIds.map((vehicle_id) => ({ user_id: userData.user.id, vehicle_id })));
    if (inserir.error) throw inserir.error;
}

export async function registerEvent(
    vehicleId: string,
    eventType: VehicleEventType,
    vehicleName?: string,
    metadata?: Record<string, unknown>,
): Promise<void> {
    if (!supabase) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return;

    const resposta = await supabase.from('vehicle_events').insert({
        user_id: userData.user.id,
        vehicle_id: vehicleId,
        vehicle_name: vehicleName ?? vehicleId,
        event_type: eventType,
        metadata: metadata ?? {},
    });
    if (resposta.error) throw resposta.error;
}

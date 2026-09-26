## SEIA Mobile

Versão mobile do produto SEIA + Ford. O aplicativo leva para o Android os fluxos de recomendação, catálogo e comparação técnica do site Angular.

O aplicativo foi desenvolvido com React Native e Expo Router. Ele é uma implementação mobile nativa, não um WebView. A linguagem do produto, as regras de pontuação, a API da Ford e o projeto Supabase são compartilhados com o site sempre que possível.

Este projeto pode ser lido e executado de forma independente: não é necessário conhecer o site Angular antes para entender ou rodar o app.

## Funcionalidades

- Experiência inicial baseada no site SEIA
- Login, cadastro, restauração de sessão e logout com Supabase
- Portal de recomendação baseado em rotina, prioridades e orçamento
- Catálogo de modelos Ford com busca, filtros, ordenação, compatibilidade e favoritos
- Fotos dos veículos aproveitadas dos assets do site
- Dashboard técnico com dados da API Ford e comparação com os concorrentes do mesmo segmento
- Comparação lado a lado de até três modelos do catálogo
- Preferências do perfil e prévia de recomendações
- Chat de suporte SEIA, atalhos e contato telefônico

## Tecnologias

- Expo SDK 57
- React Native 0.86
- React 19
- Expo Router
- TypeScript
- Supabase Auth
- Supabase (`profiles`, `user_favorites`, `user_profile_history`, `vehicle_events`) para perfil, favoritos e analytics

## Requisitos

- Node.js 20 ou mais recente, recomendado
- npm
- Expo Go em um celular físico ou um development build do Expo
- Android Studio e Android SDK somente para usar um emulador Android

Não é necessário usar um emulador para testar normalmente no celular.

## Instalação

A partir desta pasta:

```bash
npm install
npm run typecheck
```

## Variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto, ao lado do `package.json`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
EXPO_PUBLIC_FORD_API_URL=https://api-ford-linux-dkh6bkatgzbndddg.southafricanorth-01.azurewebsites.net
```

Obtenha os valores do Supabase em **Supabase Dashboard -> Project Settings -> API**. Use a chave pública publishable/anon.

Para usar o mesmo backend do site, use os mesmos valores de Supabase e de API da Ford configurados lá.

O arquivo `.env` é ignorado pelo Git e não deve ser commitado.

O cliente da API Ford está em [src/lib/ford-api.ts](src/lib/ford-api.ts) e utiliza a mesma API do site Angular para carros, detalhes e recomendações. O cliente Supabase está em [src/lib/supabase.ts](src/lib/supabase.ts), e a sincronização de perfil/favoritos/eventos está em [src/lib/profile-service.ts](src/lib/profile-service.ts).

## Executar com Expo Go

Inicie o Metro a partir da pasta do projeto:

```bash
npx expo start --clear
```

Leia o QR code com o Expo Go. O computador e o celular devem estar na mesma rede Wi-Fi. Se o QR code não conectar, use:

```bash
npx expo start --tunnel
```

O script `npm run android` é destinado a um emulador ou dispositivo Android com `adb`; ele não é necessário ao usar o Expo Go no celular.

## Gerar o APK Android

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

`eas login` é interativo — precisa ser feito manualmente uma vez por máquina. O perfil `preview` gera um APK instalável direto no aparelho, sem precisar de conta na Play Store. Para uma versão pronta para a Play Store, use o profile `production` (gera `.aab`) e depois `eas submit` se for publicar por lá.

Teste os módulos nativos também em um APK/development build, além do Expo Go.

## Estrutura do projeto

- `app/` telas e navegação do Expo Router
- `app/(tabs)/` áreas autenticadas do produto
- `assets/models/` assets visuais da Ford e do SEIA
- `src/components/` componentes de UI compartilhados
- `src/data/ford.ts` catálogo de modelos, regras de pontuação e FAQ
- `src/lib/ford-api.ts` cliente da API Ford
- `src/lib/supabase.ts` cliente Supabase e persistência da sessão
- `src/lib/profile-service.ts` sincronização de perfil, favoritos e eventos com o Supabase
- `src/lib/scoring.ts` ranking de recomendação do perfil
- `src/lib/catalog.ts` tabela comparativa do catálogo local
- `src/lib/comparison.ts` comparação de segmento/concorrentes usada no dashboard

## Relação com o site Angular

O projeto Angular é a referência do produto. O aplicativo adapta o layout desktop para telas sensíveis ao toque, preservando a mesma marca, linguagem, conceitos de recomendação, regras de pontuação, catálogo, fluxo de comparação, autenticação e hierarquia do produto. O app mobile não é um WebView, é uma implementação nativa separada que usa os mesmos serviços de backend (API da Ford e Supabase).

Quando um comportamento ou texto mudar no site, atualize a tela mobile correspondente para que os dois aplicativos continuem parecendo o mesmo produto.

## Integrantes

- Joao Victor Oliveira dos Santos - RM557948
- Matheus Alcântara Estevão - RM558193
- Nicolle Pellegrino Jelinski - RM558610
- Pedro Pereira dos Santos - RM552047
- Eric Segawa Montagner - RM558224

## video

https://youtube.com/shorts/hua3S7qjJuo?feature=share

## build

https://expo.dev/accounts/eericorp/projects/seia-mobile/builds/9b727322-55ff-4ea1-8181-03571fa00000


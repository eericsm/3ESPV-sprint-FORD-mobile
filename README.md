## SEIA Mobile

Versão mobile do produto SEIA + Ford. O aplicativo leva para o Android os fluxos de recomendação, catálogo, comparação técnica, concessionárias e test-drive do site Angular.

O aplicativo foi desenvolvido com React Native e Expo Router. Ele é uma implementação mobile nativa, não um WebView. A linguagem do produto, as regras de pontuação, a API da Ford e o projeto Supabase são compartilhados com o site sempre que possível.

## Funcionalidades

- Experiência inicial baseada no site SEIA
- Login, cadastro, restauração de sessão e logout com Supabase
- Portal de recomendação baseado em rotina, prioridades e orçamento
- Catálogo de modelos Ford com busca, filtros, ordenação, compatibilidade e favoritos
- Fotos dos veículos aproveitadas dos assets do site
- Dashboard técnico com dados da API Ford, métricas, gráficos e modelos semelhantes
- Comparação lado a lado de até três veículos da API Ford
- Busca de concessionárias com filtros de serviço, localização, marcadores no mapa e rotas
- Agendamento guiado de test-drive, revisão e avaliação
- Preferências do perfil e prévia de recomendações
- Chat de suporte SEIA, atalhos e contato telefônico

## Tecnologias

- Expo SDK 57
- React Native 0.86
- React 19
- Expo Router
- TypeScript
- Supabase Auth
- AsyncStorage para favoritos, dados do perfil e agendamentos locais
- `react-native-maps` para localização das concessionárias

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
```

Obtenha esses valores em **Supabase Dashboard -> Project Settings -> API**. Use a chave pública publishable/anon. Nunca use a chave `service_role`.

O arquivo `.env` é ignorado pelo Git e não deve ser commitado.

O cliente da API Ford está em [src/lib/ford-api.ts](src/lib/ford-api.ts) e utiliza a mesma API do site Angular para carros, detalhes e recomendações.

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

## Checklist de testes

1. Abra o aplicativo e verifique a tela inicial e a imagem do veículo.
2. Crie uma conta ou entre usando o projeto Supabase utilizado pelo site.
3. Descreva uma rotina no portal e confira as notas de compatibilidade.
4. Teste os filtros, a ordenação, os favoritos e a comparação de veículos.
5. Abra uma análise técnica e verifique as métricas, o gráfico e os modelos semelhantes.
6. Abra Concessionárias, permita o acesso à localização, confira os marcadores e inicie um agendamento.
7. Crie e remova um agendamento.
8. Salve as preferências do perfil, confira as recomendações e teste o logout.
9. Abra o suporte e teste as respostas da FAQ, os atalhos e o contato telefônico.

## APK Android

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

Teste o mapa nativo e os demais módulos nativos também em um APK/development build, além do Expo Go.

## Estrutura do projeto

- `app/` telas e navegação do Expo Router
- `app/(tabs)/` áreas autenticadas do produto
- `assets/models/` assets visuais da Ford e do SEIA
- `src/components/` componentes de UI compartilhados
- `src/data/ford.ts` metadados dos modelos, regras de pontuação, concessionárias e FAQ
- `src/lib/ford-api.ts` cliente da API Ford
- `src/lib/supabase.ts` cliente Supabase e persistência da sessão

## Relação com o site Angular

O projeto Angular é a referência do produto. O aplicativo adapta o layout desktop para telas sensíveis ao toque, preservando a mesma marca, linguagem, conceitos de recomendação, regras de pontuação, catálogo, fluxo de comparação, jornada de concessionárias, autenticação e hierarquia do produto.

Quando um comportamento ou texto mudar no site, atualize a tela mobile correspondente para que os dois aplicativos continuem parecendo o mesmo produto.

SEIA Mobile is a standalone Expo + EAS Android app for exploring Ford models, getting recommendations, managing appointments, and saving profile data on a phone.

This folder is meant to be readable on its own. You do not need to know the Angular web app first to understand or run it.

## How it relates to the main product

This mobile app belongs to the same product family as the main SEIA website. The two apps share the same Ford backend API for car data and recommendations, and they can also point to the same Supabase project for authentication and session storage.

The difference is the interface:

- The website is a browser-based Angular app.
- This folder is a native React Native app built with Expo Router.

The mobile app is not a WebView wrapper. It is a separate native implementation that uses the same backend services.

## What you get here

- Landing screen
- Login and signup screens
- Portal with recommendation lookup
- Ford model catalog
- Detailed dashboard for car data
- Concessionary search and location support
- Appointments with local persistence
- Profile screen with local persistence
- Terms and FAQ/support screens

## Requirements

- Node.js 20+ recommended
- npm
- Android Studio or a physical Android device for local testing
- Expo Go or a development build

## Install

From inside this folder:

```bash
npm install
```

If this folder has been moved into its own repository, the install command stays the same.

## Environment

Create a file named `.env` next to `package.json` and add your Supabase values:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Those variables are read by [src/lib/supabase.ts](src/lib/supabase.ts).

If you want the mobile app to use the same Supabase project as the website, paste the same values here.

## Run

Start the Expo app:

```bash
npm run start
```

Run on Android:

```bash
npm run android
```

## Data sources

The mobile app uses the same Ford API backend as the website for car data and recommendations. The shared client lives in [src/lib/ford-api.ts](src/lib/ford-api.ts).

The app currently stores the following locally on the device:

- Favorites
- Profile data
- Appointments

## Project structure

- `app/` Expo Router screens
- `src/components/` shared UI pieces
- `src/data/` helper functions and formatting logic
- `src/lib/` API and Supabase clients

## Notes

- This project can be moved out and uploaded as its own repository later.
- The UI is designed for mobile, not a direct copy of the website layout.
- If you add new backend keys or API settings later, keep them in `.env` and in your EAS environment settings.

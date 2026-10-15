# DevPortal

Este repositório é a primeira versão funcional de uma ideia simples: pegar uma plataforma
corporativa que hoje é mantida por squads isoladas, sem navegação unificada nem reaproveitamento de
nada entre times, e transformar isso num portal único — sem forçar as squads a abrir mão da
autonomia que elas já tinham. Nenhuma squad precisa esperar a outra terminar o sprint para fazer
deploy, nenhum time precisa aprender a stack do time vizinho, e ainda assim o usuário final enxerga
uma coisa só: o DevPortal.

A forma que encontrei de resolver isso foi microfrontends com Module Federation. Tem um host (o
"portal" em si, com a navegação e o layout) e, por enquanto, dois remotes — um da squad Dashboard e
outro da squad Usuários — cada um rodando, buildando e fazendo deploy de forma completamente
independente. O host só sabe que esses módulos existem e onde buscá-los; o que acontece dentro de
cada um é problema de cada squad.

Não tem backend real aqui — tudo é mockado (JSON estático + um pouco de RxJS simulando latência e
erro de rede). O foco era provar a arquitetura, não construir um sistema de produção completo.

## Como rodar cada módulo

Cada pasta (`host/`, `remotes/mfe-dashboard/`, `remotes/mfe-users/`) é um projeto Angular
independente, com seu próprio `package.json` e `node_modules` — de propósito, para deixar claro que
não existe acoplamento de build entre eles.

### Requisitos

- **Node** `^20.19.0 || ^22.12.0 || >=24.0.0` (exigência do Angular CLI 21). Cada app já tem um
  `engines` no `package.json` + um `.npmrc` com `engine-strict=true`, então se a sua versão do Node
  não bater, o `npm install` recusa na hora com uma mensagem clara em vez de quebrar silenciosamente
  mais pra frente.
- Pra rodar via Docker, o **Docker Desktop precisa estar aberto na sua máquina** antes do
  `docker compose up` — isso roda inteiramente local, não depende de nenhum serviço externo.

### Localmente, sem Docker

Primeiro, instale as dependências de cada um (uma vez só). Em vez de `npm install` puro, use
`npx -y npm@11.21.0 install` — isso garante que a instalação roda com essa versão específica do npm,
sem precisar mudar nada na sua máquina (o `npx` baixa essa versão só pra esse comando, não instala
nada global). Isso evita um bug conhecido de versões do npm anteriores à 11, que trava a resolução
de dependências deste projeto com um erro genérico e difícil de rastrear:

```bash
cd host && npx -y npm@11.21.0 install
cd remotes/mfe-dashboard && npx -y npm@11.21.0 install
cd remotes/mfe-users && npx -y npm@11.21.0 install
```

Depois é só subir os três com `ng serve`, cada um no seu terminal. A ordem não importa muito na
prática, mas os remotes precisam estar no ar antes de você navegar até eles pelo host (o host só vai
buscar o `remoteEntry.json` deles quando a rota for acessada):

```bash
cd remotes/mfe-dashboard && npx ng serve   # http://localhost:4201
cd remotes/mfe-users && npx ng serve       # http://localhost:4202
cd host && npx ng serve                    # http://localhost:4200
```

Abra `http://localhost:4200`, navegue entre Início, Dashboard e Usuários e veja os remotes sendo
carregados sob demanda (dá pra confirmar isso pela aba de rede do navegador — o chunk do remote só
aparece depois que você clica no menu correspondente).

### Via Docker (simulando produção)

```bash
docker compose up -d --build
```

Isso builda as três imagens (cada uma com seu próprio `Dockerfile`, Node para build e Nginx para
servir o resultado) e sobe os três containers nas mesmas portas de antes. Pra provar que o build de
um serviço realmente não depende dos outros dois, dá pra rebuildar só um:

```bash
docker compose build mfe-dashboard
```

E pra derrubar tudo:

```bash
docker compose down
```

### Testes

Cada app tem um teste unitário básico (Vitest, via o builder novo do Angular):

```bash
cd host && npx ng test
cd remotes/mfe-dashboard && npx ng test
cd remotes/mfe-users && npx ng test
```

## Arquitetura da solução

```
devportal/
  host/                     portal: layout, navegação, usuário logado (mockado)
  remotes/
    mfe-dashboard/          squad Dashboard: métricas e histórico de deploys
    mfe-users/              squad Usuários: lista e detalhe de usuários
  design/                   tokens visuais e um mockup estático de referência
  docker-compose.yml
```

O host não sabe nada sobre o conteúdo dos remotes além de uma coisa: em que URL cada um expõe seu
`remoteEntry.json` (o "manifesto" que o Module Federation usa para descobrir o que um app expõe).
Quando o usuário navega para `/dashboard`, o host carrega esse manifesto, pega as rotas que o
`mfe-dashboard` expôs (`loadRemoteModule(...).then(m => m.routes)`) e as pluga como se fossem rotas
próprias, de forma totalmente lazy — nada do remote é baixado até esse momento.

Cada remote, por sua vez, tem rotas e páginas próprias de verdade (não é um componente isolado
chamado pelo host): o `mfe-dashboard` tem Overview e Detalhes de deploys; o `mfe-users` tem Lista e
Detalhe de usuário. Se você rodar qualquer um dos dois sozinho, com `ng serve`, ele funciona como uma
aplicação Angular completa e autossuficiente — é só assim que faz sentido uma squad trabalhar nele
sem depender do host pra nada durante o desenvolvimento.

A única coisa que os três apps compartilham de verdade é um conjunto pequeno de componentes visuais
(Button, Card, Badge, PageHeader) e uma paleta de cores/tipografia — e mesmo isso é compartilhado de
um jeito que não cria acoplamento de build (mais detalhes na seção de decisões técnicas, porque essa
foi uma escolha consciente, não preguiça).

## Tecnologias utilizadas

- **Angular 21** com componentes `standalone` — nada de `NgModule` no projeto inteiro.
- **`@angular-architects/native-federation`** para o Module Federation. É a variante do Module
  Federation pensada pro builder atual do Angular (baseado em esbuild, não em Webpack).
- **Signals** para estado de tela (dado carregado, loading, erro) e **RxJS** para os fluxos
  assíncronos de verdade (chamada HTTP mockada, `catchError`, `delay` simulando latência de rede).
- **RxJS Interop** (`toSignal`) para transformar o `ActivatedRoute.paramMap` em signal no detalhe de
  usuário, evitando misturar os dois mundos sem necessidade.
- **Docker + Nginx** para empacotar cada app como se fosse pra produção: build Angular numa etapa,
  Nginx servindo o resultado estático na outra.
- **Docker Compose** só pra orquestrar os três containers num comando só durante o desenvolvimento
  local — não é Kubernetes nem nada parecido, é deliberadamente simples.
- **Vitest**, via o novo builder de testes do Angular, para os testes unitários.

## Decisões técnicas (e alguns perrengues pelo caminho)

**Native Federation em vez do Module Federation clássico (Webpack).** O Angular, a partir de um
certo ponto, passou a usar esbuild como builder padrão, e o plugin clássico de Module Federation é
construído em cima do Webpack — não dá pra usar os dois ao mesmo tempo sem gambiarra. A Native
Federation resolve o mesmo problema (import maps, manifesto remoto, pacotes compartilhados como
singleton) sem depender do Webpack. Tecnicamente ainda é Module Federation — só muda a engine por
baixo.

**Angular 21 em vez do 22.** A máquina onde isso foi desenvolvido tinha Node 24.14, e o Angular CLI
22 passou a exigir Node 24.15 ou mais recente. Dava pra atualizar o Node, mas o gerenciador de
versões (nvm-windows) se mostrou instável nesse ambiente — comandos que simplesmente não devolviam
nada, sem erro, sem sucesso. Trocar a versão do Angular por uma que já funcionava direito (21.2.x, com
a Native Federation correspondente) resolveu o problema de um jeito muito mais barato do que ficar
brigando com o gerenciador de versões do Node.

**Signals + RxJS no lugar de NgRx.** Dava pra usar NgRx, mas pra esse escopo (três telas por remote,
no máximo) isso seria complexidade sem retorno — mais arquivos, mais conceitos pra explicar, e no
fim o ganho real do NgRx (um store centralizado, time-travel debugging, etc.) não compensa quando
cada remote já é isolado por natureza. Um service por domínio, com signals pro estado de tela e RxJS
pros efeitos colaterais assíncronos, já entrega tudo que era necessário aqui.

**Os componentes visuais são duplicados entre os três apps, não publicados numa lib compartilhada.**
Essa foi talvez a decisão mais discutível do projeto, então vale explicar o porquê: empacotar
Button/Card/Badge/PageHeader numa lib Angular própria criaria uma dependência de build entre os três
apps (o host e os remotes teriam que instalar essa lib, e qualquer mudança nela exigiria rebuild em
cascata). Isso vai exatamente contra o ponto principal da arquitetura, que é squads conseguirem
buildar e fazer deploy sem depender umas das outras. Como são só quatro componentes pequenos, sem
lógica de negócio, manter consistência visual copiando o código é mais barato do que resolver esse
acoplamento "direito". Efeito colateral visível: o Angular reclama no console (aviso `NG0912`,
colisão de ID de componente) quando dois apps com os mesmos componentes convivem na mesma página.
É só aviso de desenvolvimento — não quebra nada, mas é o preço dessa escolha.

**Um remote que roda sozinho não sabe que vai ser carregado dentro de outro app.** Isso gerou um bug
real: toda chamada HTTP relativa de um remote (tipo `assets/mock/users.json`) é resolvida contra a
origem do documento atual no navegador — que, uma vez que o remote está rodando dentro do host,
é a origem do host, não a do remote. Então o `mfe-users` tentava buscar `localhost:4200/assets/...`
em vez de `localhost:4202/assets/...`, e caía num 404 silencioso. A solução foi simples (um arquivo
`runtime-config.ts` em cada remote guardando a própria origem fixa, usado pra montar URLs absolutas),
mas o sintoma até aparecer foi confuso — tudo parecia estar funcionando até a tela de dados ficar
girando pra sempre.

**Outro perrengue parecido: `ngDevMode is not defined`.** Esse é um bug conhecido da Native
Federation quando o pacote `@angular/core` compartilhado é carregado sem que o Angular tenha
inicializado suas próprias variáveis globais de modo de desenvolvimento — qualquer uso de `signal()`
quebrava o bootstrap inteiro, de forma silenciosa (a tela ficava em branco, sem nenhum erro visível
óbvio). A correção é definir esse global manualmente antes de chamar `initFederation()` em cada
`main.ts`. Não é bonito, mas funciona, e é documentado onde o código está.

## Por que microfrontends fazem sentido aqui

Vale argumentar isso com cuidado, porque microfrontends não são a resposta certa pra todo projeto —
eles resolvem um problema específico, que é exatamente o da empresa descrita no enunciado: squads
diferentes, cada uma dona de um pedaço do produto, que precisam compor uma experiência única sem
ficar reféns do cronograma umas das outras.

O ganho mais concreto é a **independência de deploy**. Hoje, se a squad Dashboard quer lançar uma
mudança, ela builda e sobe só o `mfe-dashboard` — o host nem precisa saber que isso aconteceu, só vai
buscar a versão nova da próxima vez que alguém navegar até lá. Num monolito frontend, qualquer
mudança (por menor que seja) exige rebuildar e testar a aplicação inteira antes de liberar qualquer
coisa, e o risco de uma squad travar o deploy das outras é real — basta um conflito de merge ou um
teste quebrado em código que nem é da squad.

O segundo ganho é **escala organizacional**: dá pra crescer o número de squads sem que o time que
cuida do host vire gargalo. Adicionar um módulo novo (relatórios, notificações, o que for) significa
criar um projeto Angular novo, registrar a URL do manifesto dele no host e pronto — não precisa
mexer no código das outras squads nem entender a implementação interna delas.

O terceiro é **isolamento de falha**: um bug feio no `mfe-users` não derruba o Dashboard. Cada remote
roda no seu próprio bundle, com seu próprio ciclo de vida; na pior das hipóteses, uma seção do portal
fica indisponível enquanto o resto continua de pé.

O contraponto honesto é que isso tem custo: mais infraestrutura pra manter (três pipelines de deploy
em vez de um), duplicação deliberada de coisas pequenas (como os componentes visuais, discutido
acima), e uma superfície maior pra coisas darem errado de forma sutil (os dois bugs de federação
documentados ali em cima são exatamente esse tipo de problema). Pra uma plataforma pequena, mantida
por um time só, isso seria complexidade desnecessária. Pra uma empresa com múltiplas squads
trabalhando em paralelo — que é o cenário real aqui — o balanço pende pro lado dos microfrontends.

## Dados mockados

Não existe backend real neste projeto. Cada remote serve seus próprios mocks como arquivos JSON
estáticos (`public/assets/mock/*.json`), consumidos via `HttpClient` com uma latência simulada e um
botão "Simular erro" em cada tela — que busca de propósito um arquivo que não existe, pra disparar o
fluxo de erro de verdade (`catchError`, mensagem de erro na tela, botão de tentar de novo), não só o
caminho feliz.

# Desafio 2 NodeJS - REST API

<p align="center">
  <img src="https://img.shields.io/static/v1?label=api&message=rest&color=blueviolet&style=for-the-badge"/>
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/evertonvargas/ignite-nodejs-desafio2?color=blueviolet&logo=TypeScript&logoColor=white&style=for-the-badge">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/evertonvargas/ignite-nodejs-desafio2?color=blueviolet&style=for-the-badge">
</p>

## 🛠️ Regras da aplicação

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    
    *As refeições devem ser relacionadas a um usuário.*
    
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência por dia de refeições dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

## 🔗 Rotas

- POST `/meals` → cria uma refeição
- GET `/meals/:id` → pesquisa uma refeição especifíca pelo `id`
- GET `/meals` → lista todas as refeições já criadas
- GET `/meals/summary` → recupera as métricas do usuário 
- PUT  `/meals/:id` → atualiza a refeição pelo `id`
- DELETE `/meals/:id` → deleta uma refeição pelo `id`

As requisições para testar a API estão disponíveis no botão abaixo e o link para acessar a API no ar está na descrição do repositório:

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Desafio%202&uri=https%3A%2F%2Fgithub.com%2Fevertonvargas%2Fignite-nodejs-desafio2%2Fblob%2Fmain%2F.github%2Finsomnia.json)

## Instalação

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com) e [Node.js](https://nodejs.org/en/). Além disso é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).

### 🎲 Rodando o Back End (servidor)

```bash
# Clone este repositório
$ https://github.com/evertonvargas/ignite-nodejs-desafio2.git

# Acesse a pasta do projeto no terminal/cmd
$ cd ignite-nodejs-desafio2

# Instale as dependências
$ npm install
# Caso prefira usar o Yarn execute o comando abaixo
$ yarn

# Execute a aplicação em modo de desenvolvimento
$ npm run dev
# Caso prefira usar o Yarn execute o comando abaixo
$ yarn dev

# O servidor iniciará na porta 3333 ou na porta definida no arquivo .env na variável PORT - acesse <http://localhost:3333>
```

## Tecnologias

[![My Skills](https://skillicons.dev/icons?i=nodejs,ts,eslint&perline=10&theme=dark)](https://skillicons.dev)

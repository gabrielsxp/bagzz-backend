# Bagzz - Back End

O app dessa aplicação se encontra em [BAGZZ](https://github.com/gabrielsxp/bagzz)

App de uma loja virtual desenvolvida em React Native. Possui criação e integração de descontos e integração dos Correios para o cálculo do frete, já baseado no peso total e nas medidas do pacote dos produtos selecionados

## Tecnologias Utilizadas
- Node
- MongoDB

## Funcionalidades
- Um usuário poderá se cadastrar no sistema
- Um usuário poderá recuperar sua senha
- Um usuário poderá logar no sistema
- Ambos os sistemas de cadastro e login possuem verificação de informações para atestar que os dados são únicos no sistema
- Cadastro de produtos
- Cadastro de descontos
- Cadastro de endereços
- Cadastro de categorias
- Cadastro de banners de promoções
- Carrinho de compras
- Calculadora de frete integrado aos Correios
E vários outros endponints para a criação de recursos para a melhor customização da loja

## Todo
- API de pagamentos 
- Login com OAuth

## Instalação
1. Tenha o npm instalado.
2. Clone o repositório via terminal.
3. Acesse a pasta de destino
4. Execute sudo npm install
5. Configure as variáveis de ambiente *
6. Execute o processo do [MongoDB](https://docs.mongodb.com/manual/)
7. Execute sudo npm start 
8. Acesse a aplicação localmente em (http://127.0.0.1:3001/)

## Variáveis de ambiente*
1. Crie um arquivo .env na raíz do projeto
- Para a execução do sistema em produção, basta criar uma variável PRODUCTION com valor true e uma variavél PORT com a porta desejada
   Configure as variáveis do MongoDB
  - MONGOOSE_DB_USER
  - MONGOOSE_DB_PASSWORD
  - MONGOOSE_DB_URL
   Configure as variáveis do Cloudinary
  - CLOUD_NAME
  - CLOUD_API_KEY
  - CLOUD_API_SECRET

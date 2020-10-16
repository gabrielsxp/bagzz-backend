# Pay me Dude - Back End

<p align="center">
    <img src="https://github.com/gabrielsxp/paymedude-frontend/blob/master/paymedude.gif" alt="Pay me Dude Landing"></img> 
</p>

Esta aplicação foi de certa forma baseada no [Patreon](https://patreon.com). 

O Front End dessa aplicação se encontra em [Pay me Dude Front End](https://github.com/gabrielsxp/paymedude-frontend)

A ideia consiste em compra e venda de produtos muito baratos, por volta de $1 a $2. As entidades do sistema são basicamente os vendedores e os consumidores de contúdo, de modo que um usuário pode ser ambos ao mesmo tempo.

## Tecnologias Utilizadas
- HTML5
- CSS3
- Javascript
- React JS
- Redux

## Funcionalidades
- Um usuário poderá se cadastrar no sistema
- Um usuário poderá recuperar sua senha
- Um usuário poderá logar no sistema
- Ambos os sistemas de cadastro e login possuem verificação de informações para atestar que os dados são únicos no sistema
- Cada usuário possui uma Dashboard personalizada
- Cada usuário possui uma página pública personalizada
- Cada página personalizada pertence a somente um usuário
- O usuário poderá customizar as cores de fundo, as bordas e a cor da fonte de sua página
- Existe uma página principal para os usuários do sistema que são vendedores
- Na página de todos os vendedores é possível acessar a página exclusiva desse vendedor e se cadastrar para ver os items vendidos pelo mesmo
- É possível parar de seguir os items vendidos por cada vendedor
- Existe separação do nível da conta de cada vendedor por níveis, indicados por um plano específico (Em construção...)
- Na sessão de items a venda, é possível postar items gratuitos e monetizados
- É possível filtrar por categoria os items vendidos na página principal de items a venda
- Um usuário só poderá vender no sistema se possuir o nível da conta adequado para tal
- Cada venda abre o pop-up de checkout de cartões de créditos auditado pela BrainTree
- Cada venda poderá ser feita através de cartões de crédito e pelo próprio saldo da conta do usuário (Em contrução...)
- Cada venda é vista no sistema como uma transação. Após cada venda, uma transação é armazenada no banco de dados e é possível
visualizar todos os dados da mesma na Dashboard
- É possível gerar relatórios de todas as transações filtradas por intervalos de tempo na Dashboard
- Um usuário poderá a qualquer momento atualizar o nível da sua conta (Um comprador poderá se tornar vendedor a qualquer momento)
- Será possível interromper as vendas de cada item (Em construção...)
- Um vendedor poderá reunir vários items a venda e definir um pacote para a venda desses vários items ao mesmo tempo

## Instalação
1. Tenha o npm instalado.
2. Clone o repositório via terminal.
3. Acesse a pasta de destino via cd project-building-api
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
2. Tenha uma conta criada na [BrainTree](https://www.braintreepayments.com/) e extraia os seguintes dados da API
- BRAIN_TREE_MERCHANTID
- BRAIN_TREE_PUBLICKEY
- BRAIN_TREE_PRIVATEKEY
# begzz-api
# bagzz-backend

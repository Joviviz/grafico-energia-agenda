# Gerenciador de Blocos de Energia

Um aplicativo Web interativo construído com React para gerenciar e visualizar seus níveis de energia ao longo do dia.

A ideia baseia-se no gerenciamento do ritmo circadiano, permitindo planejar momentos de foco total ("Deep Work"), tarefas administrativas e descanso em blocos de 30 minutos.

É possível importar arquivos .csv com sua rotina e após editá-los, baixá-los.

## Funcionalidades

- Visualização Gráfica: Um gráfico de barras que mostra o fluxo de energia do seu dia.

- Edição Granular: Ajuste o nível de energia (1 a 10) para cada bloco de 30 minutos (00:00 às 23:30).

## Cores Dinâmicas:

🟣 1-3: Descanso / Sono

🔵 4-6: Manutenção / Rotina

🟠 7-8: Foco Alto

🔴 9-10: Pico de Produtividade

Importação e Exportação:



## Como Rodar o Projeto

Pré-requisitos

Você precisa ter o Node.js instalado no seu computador.

Passo a Passo

Clone o repositório

git clone [https://github.com/Joviviz/grafico-energia-agenda.git](https://github.com/Joviviz/grafico-energia-agenda.git)
cd agenda-energia


Instale as dependências

npm install


Inicie o servidor de desenvolvimento

npm run dev


Acesse no navegador
O terminal mostrará um link, geralmente: http://localhost:5173

🛠️ Tecnologias Utilizadas

React: Biblioteca para construção da interface.

Vite: Ferramenta de build rápida.

Tailwind CSS: Framework de estilização utilitária.

Lucide React: Biblioteca de ícones leves e modernos.

## Formato do Arquivo CSV

O aplicativo aceita e gera arquivos CSV simples. Se você quiser criar um arquivo manualmente no Excel ou Bloco de Notas para importar, siga este padrão:

Horario,Nivel_Energia
07:00,8
07:30,9
08:00,10
...


Nota: O importador ignora a linha de cabeçalho se ela começar com "Horario" e foca nas duas primeiras colunas (Tempo e Nível).

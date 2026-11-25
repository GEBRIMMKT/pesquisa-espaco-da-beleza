/* Roteiro de fala — fonte única do painel de notas (tecla N), da janela da
   apresentadora e do arquivo ROTEIRO-DE-APRESENTACAO.md.
   Versão enxuta: 14 slides em cerca de 8 min 40 s (limite da turma: 10 min).
   A divisão entre as integrantes é uma SUGESTÃO: ajustem como preferirem. */
window.ROTEIRO = {
  total: "8 min 40 s",
  divisao: [
    { quem: "Agatha", slides: "01 a 04", bloco: "Abertura, cliente e desafio, objetivos e hipóteses, mercado", tempo: "2 min" },
    { quem: "Alice", slides: "05 a 07", bloco: "Metodologia, quem respondeu e o que influencia a compra", tempo: "2 min 5 s" },
    { quem: "Laila", slides: "08 a 10", bloco: "Especialista, Instagram e avaliações do Google", tempo: "1 min 55 s" },
    { quem: "Valentina", slides: "11 a 13", bloco: "Grande insight, hipóteses e recomendações", tempo: "2 min 15 s" },
    { quem: "Agatha + todas", slides: "14", bloco: "Limitações, próximo passo e agradecimento", tempo: "25 s" }
  ],
  slides: [
    {
      id: "capa", n: 1, titulo: "Capa", quem: "Agatha", tempo: "10 s",
      objetivo: "Apresentar o grupo e o tema.",
      fala: "Oi, gente! A gente é a Agatha, a Alice, a Laila e a Valentina, e vamos apresentar a nossa pesquisa de mercado sobre o Espaço da Beleza.",
      lembrar: ["Só os nomes e o tema: o resto vem no próximo slide."],
      transicao: "Pode já avançar enquanto fala a última frase."
    },
    {
      id: "cliente-desafio", n: 2, titulo: "O cliente e o desafio", quem: "Agatha", tempo: "45 s",
      objetivo: "Despertar a curiosidade, apresentar a loja e o problema gerencial.",
      fala: "Pensem rápido: se comprar cosméticos pela internet é tão fácil, por que alguém voltaria a uma loja física? Essa pergunta guiou o nosso trabalho. O Espaço da Beleza é uma loja de cosméticos e salão aqui de Brasília, com unidades em Águas Claras e no Guará II, além da Estação dos Cosméticos, na 210 Sul. Vende produtos nacionais, importados e profissionais, principalmente para cabelo. E o problema gerencial é este: como fazer mais clientes voltarem a comprar na loja física, se na internet é fácil e muitas vezes mais barato?",
      lembrar: ["Dar play no trecho de 10 segundos do vídeo enquanto fala. Ele começa sem som.", "O botão “Vídeo completo” mostra os 18 segundos, se alguém pedir.", "A aposta da marca é o atendimento e a orientação na escolha."],
      transicao: "Para responder, a gente definiu o que precisava descobrir."
    },
    {
      id: "objetivos-hipoteses", n: 3, titulo: "Objetivos e hipóteses", quem: "Agatha", tempo: "35 s",
      objetivo: "Mostrar o problema de pesquisa, os objetivos e as três hipóteses.",
      fala: "Transformamos isso num problema de pesquisa: entender o que leva as consumidoras a escolher a loja e a voltar, e como o Instagram e as avaliações online entram nessa decisão. Daí saíram cinco objetivos, do perfil das clientes até propor ações. E a gente tinha três hipóteses, tiradas do plano da empresa: o preço é o que mais pesa; o atendimento é o diferencial da loja física; e o Instagram aproxima as clientes e leva até a loja.",
      lembrar: ["As hipóteses aparecem sozinhas, sem clique.", "Objetivo geral e objetivos completos: botão “+ Objetivos completos”."],
      transicao: "Antes de ir a campo, olhamos o mercado."
    },
    {
      id: "mercado", n: 4, titulo: "O mercado e suas oportunidades", quem: "Agatha", tempo: "30 s",
      objetivo: "Contextualizar com os dados secundários mais fortes.",
      fala: "O Brasil é o 3º maior mercado de beleza do mundo, com 37,4 bilhões de dólares em vendas em 2024. Cabelo, que é o forte da loja, cresceu 9% em 2025, e abriram mais de 235 mil estabelecimentos de beleza: a concorrência é grande. E no Guará e em Águas Claras, mais de 80% dos moradores compram os itens do dia a dia no próprio bairro, um hábito que favorece a loja física.",
      lembrar: ["O dado da PDAD é sobre alimentação, higiene e limpeza, não sobre cosméticos.", "Fontes: Euromonitor e g1 via ABIHPEC; PDAD-A 2024."],
      transicao: "Agora a Alice explica como a gente fez a pesquisa."
    },
    {
      id: "metodo", n: 5, titulo: "Como fizemos a pesquisa", quem: "Alice", tempo: "40 s",
      objetivo: "Explicar os três métodos, a coleta e a amostragem.",
      fala: "Usamos três métodos que se completam. Um questionário, que é quantitativo: 13 respostas, 14 perguntas, aberto de 3 a 18 de novembro e divulgado pelo WhatsApp, nos nossos contatos, no WhatsApp da loja e num grupo de clientes. A amostra foi por conveniência, sem sorteio. Uma entrevista em profundidade com a Glenda Oliveira, personal shopper de cosméticos. E a netnografia, que é observar o que as pessoas dizem e fazem na internet: cinco publicações e 29 comentários no Instagram e 22 avaliações no Google.",
      lembrar: ["Quantitativa gera números; qualitativa mostra opiniões e motivos.", "Os dois prints no alto ampliam com um clique."],
      transicao: "Então, quem respondeu e como essas pessoas compram?"
    },
    {
      id: "perfil-habitos", n: 6, titulo: "Quem respondeu e como compra", quem: "Alice", tempo: "45 s",
      objetivo: "Mostrar o perfil e os hábitos principais, sem excesso de números.",
      fala: "Foram 13 pessoas, e 12 já compraram na loja. Oito compram cosméticos uma vez por mês; somando quem compra com mais frequência, são 11. Oito preferem a loja física. Sete preferem produtos para cabelo, e sete gastam de 50 a 100 reais por compra. E as ofertas chamam muita atenção: 12 se interessam por descontos e 9 querem mais promoções. Como a amostra é pequena e quase toda de clientes, esses números valem para quem respondeu.",
      lembrar: ["Se perguntarem sobre idade: botão “Comparar por idade”.", "Wella (11 de 13) e kits estão em “+ Marcas e ofertas”."],
      transicao: "E o que mais pesa na hora de comprar?"
    },
    {
      id: "fatores", n: 7, titulo: "O que influencia a compra", quem: "Alice", tempo: "40 s",
      objetivo: "Mostrar que o preço domina e o atendimento quase não aparece.",
      fala: "Esse é o dado mais importante do questionário. Perguntamos o que mais influencia a compra, e dava para marcar mais de uma opção, por isso não soma 100%. O preço ganhou com folga: 61,5%, ou 8 pessoas. Somando preço ou promoções, são 10 de 13. E o atendimento, que é justamente o diferencial que a loja quer reforçar, apareceu só duas vezes.",
      lembrar: ["O gráfico original do relatório (p. 4) amplia com um clique."],
      transicao: "Para entender o porquê, a Laila conta o que ouvimos de uma especialista."
    },
    {
      id: "especialista", n: 8, titulo: "O olhar da especialista", quem: "Laila", tempo: "35 s",
      objetivo: "Resumir a entrevista em três ideias.",
      fala: "Conversamos com a Glenda, personal shopper de cosméticos, sem vínculo com a loja. O que ela contou cabe em três palavras. Confiança: preço, exclusividade e confiança pesam juntos, e a cliente quer saber se o produto é original e se serve para ela. Experiência: na loja física dá para testar, ser orientada e levar na hora. E fidelização: acompanhar a cliente do início ao fim, com pós-venda.",
      lembrar: ["É uma síntese, não são frases literais dela.", "Kits e conteúdo com gente real estão em “Outros aprendizados +”."],
      transicao: "E o que a própria loja mostra na internet?"
    },
    {
      id: "instagram", n: 9, titulo: "O Espaço da Beleza no Instagram", quem: "Laila", tempo: "45 s",
      objetivo: "Mostrar o perfil, o conteúdo e o que os comentários revelam.",
      fala: "No Instagram, a loja tinha 7.260 seguidores no momento da pesquisa. O tom é próximo e bem-humorado, com vídeos gravados na loja e gente da equipe, como esse do cartão fidelidade. Classificamos 29 comentários: o que mais aparece é humor, 9; depois elogios e vontade de comprar, 6 cada. O padrão é claro: o humor gera conversa, e os posts com produto e preço geram os “eu quero”. Mas vontade de comprar não é venda, e isso a pesquisa não mediu.",
      lembrar: ["Não precisa tocar o vídeo: ele é opcional.", "Bio, link e destaques: “+ Perfil, bio e destaques”.", "O cartão fidelidade não foi analisado no relatório."],
      transicao: "E no Google?"
    },
    {
      id: "google", n: 10, titulo: "O que dizem as avaliações do Google", quem: "Laila", tempo: "35 s",
      objetivo: "Mostrar a boa reputação e as avaliações antigas.",
      fala: "No Google, a loja tem nota 4,6 em 22 avaliações, 17 delas com cinco estrelas. Das 9 avaliações com texto, 8 elogiam o atendimento ou os profissionais, e três juntam atendimento e preço, como em “bom atendimento e preço justo”. O ponto fraco é que 20 das 22 têm três anos ou mais. A reputação é boa, mas antiga.",
      lembrar: ["Não mostramos prints das avaliações para preservar quem avaliou."],
      transicao: "Agora a Valentina junta tudo isso."
    },
    {
      id: "insight", n: 11, titulo: "O grande insight", quem: "Valentina", tempo: "45 s",
      objetivo: "Mostrar o contraste e revelar a frase principal.",
      fala: "Aqui está a tensão que a pesquisa mostrou. Quando a gente pergunta, 77% falam de preço ou promoções e só 15% de atendimento. Quando as pessoas falam por conta própria, no Google, 89% elogiam o atendimento e 33% falam de preço. As bases são diferentes, então não é uma comparação estatística, mas o contraste diz muito. [clique] E foi assim que a gente resumiu: o preço atrai, a confiança faz voltar. É uma interpretação das três frentes, não uma relação de causa comprovada.",
      lembrar: ["Este é o único slide com clique interno: ele revela a frase.", "Fazer uma pausa depois da frase."],
      transicao: "Com isso, dá para voltar nas hipóteses."
    },
    {
      id: "hipoteses-resultado", n: 12, titulo: "E as nossas hipóteses?", quem: "Valentina", tempo: "30 s",
      objetivo: "Mostrar com honestidade o resultado de cada hipótese.",
      fala: "A hipótese do preço se confirmou entre os respondentes. A do atendimento ficou em aberto: ela aparece forte nas avaliações e na entrevista, mas o questionário não mediu a satisfação com o atendimento. E a do Instagram tem sinais positivos, mas não medimos se ele leva à compra.",
      lembrar: ["Os resultados aparecem sozinhos, em sequência.", "Não dizer que as três foram confirmadas."],
      transicao: "E o que a loja pode fazer com isso?"
    },
    {
      id: "recomendacoes", n: 13, titulo: "Da pesquisa à prática", quem: "Valentina", tempo: "60 s",
      objetivo: "Apresentar as cinco recomendações em três pilares.",
      fala: "Organizamos as cinco recomendações em três pilares. Para atrair: kits por necessidade, como ressecamento, transição capilar e coloração, com preço até 200 reais e mostrando a economia em relação aos produtos avulsos. Para construir confiança: vídeos curtos com a equipe, mostrando o problema, o produto, como usar e o preço; e um Instagram mais funcional, com uma bio que diga por que escolher a loja, WhatsApp direto e destaques de ofertas, marcas e depoimentos. E para fazer voltar: uma lista de transmissão no WhatsApp, só com quem autorizar, para avisar promoções e lembrar da reposição; e pedir avaliações no Google com um QR code no caixa.",
      lembrar: ["Clicar nos cartões é opcional: abre a proposta completa. Feche com Esc.", "Os mockups são propostas, não ações já feitas pela loja.", "Não citar preços de produtos."],
      transicao: "Para fechar, a Agatha."
    },
    {
      id: "encerramento", n: 14, titulo: "Limitações e encerramento", quem: "Agatha + todas", tempo: "25 s",
      objetivo: "Mostrar as limitações, o próximo passo e agradecer.",
      fala: "Com transparência: foram só 13 respostas, por conveniência, e uma única entrevista. Por isso, o próximo passo seria entrevistar diretamente as clientes da loja. Mais do que vender cosméticos, o Espaço da Beleza pode construir motivos para voltar. Obrigada!",
      lembrar: ["Todas agradecem juntas.", "Botões na tela: Referências, Relatório, Dados e evidências e Reiniciar."],
      transicao: "Abrir para perguntas."
    }
  ],
  perguntas: [
    { p: "Por que só 13 respostas?", r: "O questionário ficou aberto de 3 a 18 de novembro e foi divulgado pelo WhatsApp. É uma amostra por conveniência e pequena, então tratamos os resultados como válidos para quem respondeu. Detalhes em Dados e evidências › Coleta e amostragem." },
    { p: "Por que entrevistar uma personal shopper e não uma cliente?", r: "Escolhemos uma especialista pela experiência com consumidoras de cosméticos (amostragem intencional). Entrevistar clientes da loja é justamente o próximo passo que sugerimos." },
    { p: "Dá para comparar 77% com 89%?", r: "Não estatisticamente: as bases são diferentes (13 pessoas no questionário e 9 avaliações com texto). O gráfico mostra um contraste entre o que aparece quando perguntamos e o que aparece de forma espontânea." },
    { p: "O Instagram aumenta as vendas?", r: "A pesquisa não mediu isso. Há sinais, como comentários de vontade de comprar, mas não sabemos se viraram compra. Por isso a H3 ficou como “sinais positivos”." },
    { p: "Quais eram as perguntas do questionário e da entrevista?", r: "Estão em Dados e evidências › Instrumentos de pesquisa (as 14 perguntas do formulário e o roteiro da entrevista)." },
    { p: "Por que os números do Instagram no print são diferentes?", r: "Os prints foram feitos em 25/11. Na coleta, o perfil tinha 7.260 seguidores e 212 publicações; os números mudam com o tempo." },
    { p: "A loja já tem algum programa de fidelidade?", r: "O vídeo do perfil mostra um cartão fidelidade (a cada R$ 100, uma assinatura; com 10, R$ 100 em produtos). O relatório não analisou esse programa, mas ele conversa com as recomendações de WhatsApp e reposição." }
  ]
};

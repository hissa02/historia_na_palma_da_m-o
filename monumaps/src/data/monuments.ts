import type { Monument } from "../types/Monument";

export const monuments: Monument[] = [
  {
    id: "obelisco-memoria",
    nome: "Obelisco da Memória",
    descricao:
      "Erguido em 1831 em homenagem à Independência do Brasil, o Obelisco da Memória é um dos marcos históricos mais significativos do centro histórico de São Luís.",
    historia:
      "Construído durante o período regencial, o obelisco foi idealizado como símbolo da adesão do Maranhão à Independência do Brasil. É o único exemplar do gênero no estado. Sua pedra de granito foi trazida de Lisboa, o que reforça o paradoxo de um monumento à independência erguido com materiais portugueses.",
    curiosidade:
      "O obelisco foi construído durante o período regencial e é o único exemplar do gênero no Maranhão. Sua pedra de granito foi trazida de Lisboa.",
    localizacao: "Praça Pedro II, Centro — São Luís, MA",
    periodo: "Século XIX",
    categoria: "Colonial",
    imagem: "obelisco",
    audioUrl: "",
    duracao: "2:45",
    tags: ["Colonial", "Século XIX"],
    coordenadas: { lat: -2.5306, lng: -44.3022 },
    capitulos: [
      { id: 1, title: "Contexto histórico", time: "0:00", startSeconds: 0 },
      { id: 2, title: "Construção e arquitetura", time: "0:48", startSeconds: 48 },
      { id: 3, title: "Restaurações e tombamento", time: "1:32", startSeconds: 92 },
      { id: 4, title: "O obelisco hoje", time: "2:10", startSeconds: 130 },
    ],
  },
  {
    id: "palacio-leoes",
    nome: "Palácio dos Leões",
    descricao:
      "Sede do governo do Maranhão desde o século XVIII, o Palácio dos Leões é um dos edifícios coloniais mais bem preservados do Brasil.",
    historia:
      "Construído pelos franceses no início do século XVII e ampliado pelos portugueses, o palácio funcionou como residência de capitães-generais e governadores. Seu nome vem das duas estátuas de leões que guardam a entrada principal, fundidas em bronze em Portugal.",
    curiosidade:
      "As duas estátuas de leões que dão nome ao palácio foram trazidas de Portugal no século XVIII e são consideradas obras de arte únicas no Brasil.",
    localizacao: "Av. Dom Pedro II, s/n — Centro, São Luís, MA",
    periodo: "Século XVII",
    categoria: "Colonial",
    imagem: "palacio",
    audioUrl: "",
    duracao: "3:10",
    tags: ["Colonial", "Século XVII"],
    coordenadas: { lat: -2.5275, lng: -44.3014 },
    capitulos: [
      { id: 1, title: "Origem francesa", time: "0:00", startSeconds: 0 },
      { id: 2, title: "Domínio português", time: "0:55", startSeconds: 55 },
      { id: 3, title: "Arquitetura e reformas", time: "1:45", startSeconds: 105 },
      { id: 4, title: "Sede do governo", time: "2:30", startSeconds: 150 },
    ],
  },
  {
    id: "catedral-se",
    nome: "Catedral da Sé",
    descricao:
      "A Catedral de Nossa Senhora da Vitória é a mais antiga da cidade, com sua imponente fachada neoclássica dominando a Praça Dom Pedro II.",
    historia:
      "Fundada pelos jesuítas em 1699, a catedral passou por diversas reformas ao longo dos séculos. A fachada atual data do século XIX, quando foi reformada no estilo neoclássico. Seu interior guarda obras de arte sacra de grande valor histórico e artístico.",
    curiosidade:
      "A catedral possui um órgão tubular do século XIX, um dos poucos ainda em funcionamento no Brasil, restaurado por especialistas alemães na década de 1990.",
    localizacao: "Praça Dom Pedro II — Centro, São Luís, MA",
    periodo: "Século XVII",
    categoria: "Religioso",
    imagem: "catedral",
    audioUrl: "",
    duracao: "3:30",
    tags: ["Religioso", "Século XVII"],
    coordenadas: { lat: -2.529, lng: -44.302 },
    capitulos: [
      { id: 1, title: "Fundação jesuíta", time: "0:00", startSeconds: 0 },
      { id: 2, title: "Reformas coloniais", time: "1:00", startSeconds: 60 },
      { id: 3, title: "Arte sacra e órgão", time: "2:00", startSeconds: 120 },
      { id: 4, title: "A catedral hoje", time: "2:55", startSeconds: 175 },
    ],
  },
  {
    id: "teatro-artur-azevedo",
    nome: "Teatro Arthur Azevedo",
    descricao:
      "Um dos mais antigos teatros em funcionamento do Brasil, o Teatro Arthur Azevedo é um símbolo da efervescência cultural de São Luís no século XIX.",
    historia:
      "Inaugurado em 1817 como Teatro União, foi rebatizado em homenagem ao dramaturgo maranhense Arthur Azevedo. Sua arquitetura neoclássica e seu interior em formato de ferradura, com três andares de camarotes, são considerados excepcionais para a época.",
    curiosidade:
      "O teatro foi palco de récitas de ópera italiana no século XIX, quando São Luís era chamada de 'Atenas Brasileira' pelo alto nível cultural de sua elite.",
    localizacao: "Rua do Sol, 180 — Centro, São Luís, MA",
    periodo: "Século XIX",
    categoria: "Cultural",
    imagem: "teatro",
    audioUrl: "",
    duracao: "2:55",
    tags: ["Cultural", "Século XIX"],
    coordenadas: { lat: -2.5315, lng: -44.299 },
    capitulos: [
      { id: 1, title: "A Atenas Brasileira", time: "0:00", startSeconds: 0 },
      { id: 2, title: "Inauguração e ópera", time: "0:45", startSeconds: 45 },
      { id: 3, title: "Arthur Azevedo", time: "1:40", startSeconds: 100 },
      { id: 4, title: "Restauração e hoje", time: "2:20", startSeconds: 140 },
    ],
  },
  {
    id: "fonte-ribeirão",
    nome: "Fonte do Ribeirão",
    descricao:
      "Construída no século XVIII para abastecer a cidade de água potável, a Fonte do Ribeirão é uma das mais antigas obras de infraestrutura urbana do Brasil.",
    historia:
      "Inaugurada em 1796, a fonte foi o principal abastecimento de água de São Luís por mais de um século. Sua arquitetura combina elementos utilitários com ornamentação barroca típica do período colonial português.",
    curiosidade:
      "Escravizados percorriam diariamente o trajeto da fonte até os casarões do centro histórico carregando barris de água, numa prática que durou até o início do século XX.",
    localizacao: "Largo do Ribeirão — Centro Histórico, São Luís, MA",
    periodo: "Século XVIII",
    categoria: "Colonial",
    imagem: "fonte",
    audioUrl: "",
    duracao: "2:20",
    tags: ["Colonial", "Século XVIII"],
    coordenadas: { lat: -2.526, lng: -44.3035 },
    capitulos: [
      { id: 1, title: "Abastecimento colonial", time: "0:00", startSeconds: 0 },
      { id: 2, title: "Construção e arquitetura", time: "0:40", startSeconds: 40 },
      { id: 3, title: "Vida urbana na fonte", time: "1:20", startSeconds: 80 },
      { id: 4, title: "Patrimônio tombado", time: "1:55", startSeconds: 115 },
    ],
  },
];

export function getMonumentById(id: string): Monument | undefined {
  return monuments.find((m) => m.id === id);
}

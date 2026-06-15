export interface MonumentChapter {
  id: number;
  title: string;
  time: string;
  startSeconds: number;
}

export interface Monument {
  id: string;
  nome: string;
  descricao: string;
  historia: string;
  curiosidade: string;
  localizacao: string;
  periodo: string;
  categoria: string;
  imagem: string;
  audioUrl?: string;
  duracao?: string;
  capitulos?: MonumentChapter[];
  tags: string[];
  coordenadas?: { lat: number; lng: number };
}

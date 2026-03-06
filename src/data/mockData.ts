import course1 from "@/assets/course-1.jpg";
import course2 from "@/assets/course-2.jpg";
import course3 from "@/assets/course-3.jpg";

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
  duration: string;
  completed: boolean;
  attachments?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  image: string;
  category: string;
  featured: boolean;
  modules: Module[];
  enrolledStudents: number;
  rating: number;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Despertar Energético",
    description: "Aprenda a ativar e equilibrar seus centros de energia. Um curso completo sobre chakras, meditação e práticas energéticas para transformação interior.",
    instructor: "Ana Luz",
    duration: "12h",
    image: course1,
    category: "Energia",
    featured: true,
    enrolledStudents: 342,
    rating: 4.9,
    modules: [
      {
        id: "m1",
        title: "Fundamentos da Energia",
        description: "Entenda os princípios básicos da energia vital",
        lessons: [
          { id: "l1", title: "O que é energia vital?", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Nesta aula introdutória, vamos explorar o conceito de energia vital e como ela permeia todas as áreas da nossa vida.", duration: "15min", completed: false },
          { id: "l2", title: "Os 7 Chakras principais", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Conheça os sete centros energéticos do corpo e suas funções específicas.", duration: "22min", completed: false },
          { id: "l3", title: "Meditação de aterramento", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Pratique a técnica de aterramento para estabilizar sua energia.", duration: "18min", completed: false },
        ],
      },
      {
        id: "m2",
        title: "Práticas de Ativação",
        description: "Técnicas avançadas para ativar sua energia",
        lessons: [
          { id: "l4", title: "Respiração prânica", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Aprenda técnicas de respiração para amplificar sua energia vital.", duration: "20min", completed: false },
          { id: "l5", title: "Visualização criativa", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Use o poder da mente para direcionar energia consciente.", duration: "25min", completed: false },
        ],
      },
      {
        id: "m3",
        title: "Equilíbrio e Cura",
        description: "Harmonize seus centros de energia",
        lessons: [
          { id: "l6", title: "Auto-cura energética", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Técnicas de autocura para restaurar o equilíbrio.", duration: "30min", completed: false },
          { id: "l7", title: "Proteção energética", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Aprenda a proteger seu campo energético.", duration: "20min", completed: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Cristaloterapia Avançada",
    description: "Domine a arte da cura com cristais. Aprenda a selecionar, programar e utilizar cristais para equilíbrio emocional e espiritual.",
    instructor: "Maria Cristal",
    duration: "8h",
    image: course2,
    category: "Cristais",
    featured: true,
    enrolledStudents: 218,
    rating: 4.8,
    modules: [
      {
        id: "m4",
        title: "Introdução aos Cristais",
        description: "Conheça o mundo dos cristais e suas propriedades",
        lessons: [
          { id: "l8", title: "Tipos de cristais", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Explore os principais tipos de cristais e suas propriedades únicas.", duration: "20min", completed: false },
          { id: "l9", title: "Como limpar cristais", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Métodos eficazes para limpar e purificar seus cristais.", duration: "15min", completed: false },
        ],
      },
      {
        id: "m5",
        title: "Aplicações Terapêuticas",
        description: "Uso prático de cristais na cura",
        lessons: [
          { id: "l10", title: "Layouts de cristais", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Aprenda layouts poderosos para sessões de cristaloterapia.", duration: "25min", completed: false },
          { id: "l11", title: "Cristais e chakras", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Associe cristais específicos a cada centro energético.", duration: "22min", completed: false },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Expansão da Consciência",
    description: "Uma jornada profunda de autoconhecimento e expansão mental. Técnicas de meditação avançada e práticas contemplativas.",
    instructor: "Pedro Cosmos",
    duration: "15h",
    image: course3,
    category: "Consciência",
    featured: true,
    enrolledStudents: 456,
    rating: 4.95,
    modules: [
      {
        id: "m6",
        title: "Consciência e Percepção",
        description: "Fundamentos da consciência expandida",
        lessons: [
          { id: "l12", title: "Níveis de consciência", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Explore os diferentes estados de consciência humana.", duration: "25min", completed: false },
          { id: "l13", title: "Meditação transcendental", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Pratique a meditação transcendental passo a passo.", duration: "30min", completed: false },
        ],
      },
      {
        id: "m7",
        title: "Práticas Avançadas",
        description: "Técnicas profundas de expansão",
        lessons: [
          { id: "l14", title: "Jornada interior", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Guia completo para uma jornada interior transformadora.", duration: "35min", completed: false },
          { id: "l15", title: "Integração e propósito", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Integre os aprendizados à sua vida cotidiana.", duration: "28min", completed: false },
        ],
      },
    ],
  },
];

export const categories = ["Todos", "Energia", "Cristais", "Consciência", "Meditação", "Desenvolvimento Pessoal"];

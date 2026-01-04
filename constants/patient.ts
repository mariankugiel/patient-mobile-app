export const patientData = {
  name: "Maria Silva",
  age: 35,
  weight: 54,
  height: 163,
  city: "Porto",
  bloodType: "A+",
  gender: "female", // Added gender for metabolic age calculation
  profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  healthScore: 82,
  progressScore: 76,
};

export const healthMetrics = [
  {
    id: 1,
    name: "Frequência Cardíaca",
    value: 72,
    unit: "bpm",
    reference: "60-100",
    status: "normal",
    date: "2023-11-15",
    icon: "heart",
    trend: "stable",
  },
  {
    id: 2,
    name: "Glicose",
    value: 110,
    unit: "mg/dL",
    reference: "70-99",
    status: "warning",
    date: "2023-11-14",
    icon: "droplet",
    trend: "up",
  },
  {
    id: 3,
    name: "Pressão Arterial",
    value: "120/80",
    unit: "mmHg",
    reference: "120/80",
    status: "normal",
    date: "2023-11-13",
    icon: "activity",
    trend: "stable",
  },
  {
    id: 4,
    name: "Massa Gorda",
    value: 24,
    unit: "%",
    reference: "21-33",
    status: "normal",
    date: "2023-11-10",
    icon: "percent",
    trend: "down",
  },
  {
    id: 5,
    name: "Passos",
    value: 8500,
    unit: "passos",
    reference: "10000",
    status: "warning",
    date: "2023-11-15",
    icon: "footprints",
    trend: "up",
  },
  {
    id: 6,
    name: "Horas de Sono",
    value: 7.5,
    unit: "h",
    reference: "7-9",
    status: "normal",
    date: "2023-11-15",
    icon: "moon",
    trend: "up",
  },
  {
    id: 7,
    name: "Colesterol",
    value: 185,
    unit: "mg/dL",
    reference: "< 200",
    status: "normal",
    date: "2023-11-14",
    icon: "droplet",
    trend: "down",
  },
  {
    id: 8,
    name: "Temperatura",
    value: 36.5,
    unit: "°C",
    reference: "36.1-37.2",
    status: "normal",
    date: "2023-11-15",
    icon: "activity",
    trend: "stable",
  },
  {
    id: 9,
    name: "Saturação O₂",
    value: 98,
    unit: "%",
    reference: "95-100",
    status: "normal",
    date: "2023-11-15",
    icon: "activity",
    trend: "stable",
  },
  {
    id: 10,
    name: "Idade Metabólica",
    value: 32,
    unit: "anos",
    reference: "< 35",
    status: "good",
    date: "2023-11-15",
    icon: "clock",
    trend: "down",
  },
];

export const medicalConditions = {
  current: [
    "Hipertensão Leve",
    "Alergias Sazonais",
  ],
  previous: [
    "Apendicite (2010)",
    "Fratura no Pulso (2015)",
  ],
  family: [
    "Diabetes Tipo 2 (Pai)",
    "Hipertensão (Mãe)",
    "Doença Cardíaca (Avô Paterno)",
  ],
};

export const vaccinations = [
  {
    name: "Gripe",
    date: "2023-10-05",
    nextDose: "2024-10",
    location: "Centro de Saúde do Porto",
    dose: "1ª dose",
  },
  {
    name: "Tétano",
    date: "2020-03-15",
    nextDose: "2030-03",
    location: "Hospital Privado, Porto",
    dose: "Reforço",
  },
  {
    name: "COVID-19",
    date: "2022-01-20",
    nextDose: null,
    location: "Centro de Vacinação, Porto",
    dose: "3ª dose",
  },
  {
    name: "Hepatite B",
    date: "2019-05-15",
    nextDose: null,
    location: "Hospital Privado, Porto",
    dose: "Reforço",
  },
  {
    name: "HPV",
    date: "2018-06-10",
    nextDose: null,
    location: "Centro de Saúde do Porto",
    dose: "2ª dose",
  },
];

export interface Reminder {
  time: string;
  days: string[];
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string | null;
  startDate: string | null;
  endDate: string | null;
  instructions: string;
  purpose: string;
  prescribedBy: string;
  prescriptionDate: string;
  prescriptionId: string;
  reminders: Reminder[];
}

export const medications: Medication[] = [
  {
    id: 1,
    name: "Loratadina",
    dosage: "10mg",
    frequency: "1x ao dia",
    time: "08:00",
    startDate: "2023-10-01",
    endDate: "2023-12-01",
    instructions: "Tomar em jejum",
    purpose: "Tratamento de alergias sazonais",
    prescribedBy: "Dra. Ana Ferreira",
    prescriptionDate: "2023-09-28",
    prescriptionId: "RX-2023-1245",
    reminders: [
      { time: "08:00", days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] }
    ]
  },
  {
    id: 2,
    name: "Vitamina D",
    dosage: "2000 UI",
    frequency: "1x ao dia",
    time: "08:00",
    startDate: "2023-09-15",
    endDate: null,
    instructions: "Tomar com alimentos",
    purpose: "Suplementação de vitamina D",
    prescribedBy: "Dr. João Santos",
    prescriptionDate: "2023-09-10",
    prescriptionId: "RX-2023-1198",
    reminders: [
      { time: "08:00", days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] }
    ]
  },
  {
    id: 3,
    name: "Ibuprofeno",
    dosage: "400mg",
    frequency: "Quando necessário",
    time: null,
    startDate: null,
    endDate: null,
    instructions: "Tomar em caso de dor ou febre",
    purpose: "Alívio de dores e febre",
    prescribedBy: "Dra. Ana Ferreira",
    prescriptionDate: "2023-08-15",
    prescriptionId: "RX-2023-1056",
    reminders: []
  },
];

export interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  type: 'virtual' | 'telefone' | 'presencial';
  status: 'upcoming' | 'past' | 'cancelled';
  doctorImage: string;
}

export const appointments: Appointment[] = [
  {
    id: 1,
    doctor: "Dra. Ana Ferreira",
    specialty: "Clínica Geral",
    date: "2023-11-25",
    time: "14:30",
    location: "Clínica da Saúde, Porto",
    notes: "Consulta de rotina anual",
    type: "presencial",
    status: "upcoming",
    doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    doctor: "Dr. João Santos",
    specialty: "Dermatologia",
    date: "2023-12-10",
    time: "10:00",
    location: "Hospital Privado, Porto",
    notes: "Avaliação de sinais",
    type: "virtual",
    status: "upcoming",
    doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    doctor: "Dra. Marta Costa",
    specialty: "Nutrição",
    date: "2023-12-05",
    time: "16:00",
    location: "Centro de Nutrição, Porto",
    notes: "Acompanhamento trimestral",
    type: "telefone",
    status: "upcoming",
    doctorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    doctor: "Dr. Ricardo Oliveira",
    specialty: "Cardiologia",
    date: "2023-10-15",
    time: "11:30",
    location: "Hospital Privado, Porto",
    notes: "Avaliação cardíaca anual",
    type: "presencial",
    status: "past",
    doctorImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    doctor: "Dra. Sofia Mendes",
    specialty: "Oftalmologia",
    date: "2023-09-20",
    time: "15:00",
    location: "Clínica Oftalmológica, Porto",
    notes: "Exame visual anual",
    type: "presencial",
    status: "past",
    doctorImage: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 6,
    doctor: "Dr. Miguel Pereira",
    specialty: "Ortopedia",
    date: "2023-11-05",
    time: "09:30",
    location: "Hospital Central, Porto",
    notes: "Avaliação de dor no pulso",
    type: "virtual",
    status: "cancelled",
    doctorImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
];

export interface Message {
  id: number;
  sender: string;
  content: string;
  date: string;
  time: string;
  read: boolean;
  isUser: boolean;
  senderImage?: string;
}

export const messages: Message[] = [
  {
    id: 1,
    sender: "Dra. Ana Ferreira",
    content: "Olá Maria, os seus resultados de análises estão normais. Continuamos com o mesmo plano.",
    date: "2023-11-10",
    time: "14:22",
    read: true,
    isUser: false,
    senderImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    sender: "Maria Silva",
    content: "Obrigada, Dra. Ana. Tenho-me sentido bem e seguido todas as recomendações.",
    date: "2023-11-10",
    time: "14:30",
    read: true,
    isUser: true,
  },
  {
    id: 3,
    sender: "Dr. João Santos",
    content: "Por favor, traga as fotografias dos sinais que mencionou na consulta anterior.",
    date: "2023-11-14",
    time: "09:45",
    read: false,
    isUser: false,
    senderImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    sender: "Farmácia Central",
    content: "A sua medicação está pronta para levantamento.",
    date: "2023-11-15",
    time: "11:30",
    read: false,
    isUser: false,
    senderImage: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
];

export interface Goal {
  id: number;
  goal: string;
  target: string;
  current: string;
  progress: number;
}

export const healthPlanProgress: Goal[] = [
  {
    id: 1,
    goal: "Aumentar atividade física",
    target: "10.000 passos diários",
    current: "8.500 passos diários",
    progress: 85,
  },
  {
    id: 2,
    goal: "Reduzir níveis de glicose",
    target: "< 100 mg/dL",
    current: "110 mg/dL",
    progress: 70,
  },
  {
    id: 3,
    goal: "Melhorar qualidade do sono",
    target: "8 horas por noite",
    current: "7.5 horas por noite",
    progress: 94,
  },
];

export interface Task {
  id: number;
  title: string;
  description: string;
  frequency: string;
  completed: boolean;
  dueDate: string;
  category: string;
}

export const healthPlanTasks: Task[] = [
  {
    id: 1,
    title: "Caminhada diária",
    description: "30 minutos de caminhada ao ar livre",
    frequency: "Diária",
    completed: false,
    dueDate: "2023-11-20",
    category: "Atividade Física",
  },
  {
    id: 2,
    title: "Reduzir açúcares",
    description: "Evitar doces e refrigerantes",
    frequency: "Diária",
    completed: true,
    dueDate: "2023-11-20",
    category: "Alimentação",
  },
  {
    id: 3,
    title: "Meditação",
    description: "10 minutos de meditação antes de dormir",
    frequency: "Diária",
    completed: false,
    dueDate: "2023-11-20",
    category: "Bem-estar",
  },
  {
    id: 4,
    title: "Consulta de nutrição",
    description: "Acompanhamento com Dra. Marta Costa",
    frequency: "Única",
    completed: false,
    dueDate: "2023-12-05",
    category: "Consultas",
  },
  {
    id: 5,
    title: "Análises de sangue",
    description: "Jejum de 12 horas",
    frequency: "Única",
    completed: false,
    dueDate: "2023-12-01",
    category: "Exames",
  },
];

export const aiHealthInsight = {
  title: "Análise de Saúde",
  content: "Saúde geral boa (82/100). Pontos de atenção: glicose ligeiramente elevada e atividade física abaixo da meta. Recomendações: reduzir açúcares e aumentar caminhadas diárias.",
  date: "2023-11-15",
  concerns: [
    "Níveis de glicose ligeiramente elevados (110 mg/dL)",
    "Atividade física abaixo da meta (8.500 passos vs. 10.000)"
  ],
  improvements: [
    "Pressão arterial dentro dos valores normais",
    "Qualidade do sono melhorou",
    "Níveis de colesterol estáveis"
  ],
  recommendations: [
    "Reduzir o consumo de açúcares refinados",
    "Aumentar caminhadas diárias para atingir 10.000 passos",
    "Manter a rotina de sono regular"
  ]
};

export const healthPlanInsight = {
  title: "Avaliação do Plano",
  content: "Seu plano de saúde está progredindo bem. Continue com o regime de medicação e aumente ligeiramente a atividade física para atingir suas metas.",
  date: "2023-11-15",
  concerns: [
    "Controle da pressão arterial precisa de atenção",
    "Atividade física diária abaixo da meta"
  ],
  improvements: [
    "Adesão à medicação excelente",
    "Controle do colesterol eficaz"
  ],
  recommendations: [
    "Continue com o regime de medicação atual",
    "Aumente caminhadas diárias para 30 minutos",
    "Monitore a pressão arterial duas vezes por semana"
  ]
};

interface TestData {
  date: string;
  value: number;
}

interface BloodTest {
  id: number;
  name: string;
  value: number;
  unit: string;
  reference: string;
  status: string;
  data: TestData[];
}

// Mock data for blood test results
export const bloodTestResults = {
  hematology: [
    {
      id: 1,
      name: "Hemoglobina",
      value: 13.5,
      unit: "g/dL",
      reference: "12-16",
      status: "normal",
      data: [
        { date: "2023-01-15", value: 13.2 },
        { date: "2023-04-20", value: 13.4 },
        { date: "2023-07-10", value: 13.3 },
        { date: "2023-10-15", value: 13.5 },
      ]
    },
    {
      id: 2,
      name: "Leucócitos",
      value: 6.8,
      unit: "10³/µL",
      reference: "4.5-11",
      status: "normal",
      data: [
        { date: "2023-01-15", value: 7.2 },
        { date: "2023-04-20", value: 6.9 },
        { date: "2023-07-10", value: 7.0 },
        { date: "2023-10-15", value: 6.8 },
      ]
    },
    {
      id: 3,
      name: "Plaquetas",
      value: 250,
      unit: "10³/µL",
      reference: "150-450",
      status: "normal",
      data: [
        { date: "2023-01-15", value: 240 },
        { date: "2023-04-20", value: 245 },
        { date: "2023-07-10", value: 255 },
        { date: "2023-10-15", value: 250 },
      ]
    },
    {
      id: 4,
      name: "Hematócrito",
      value: 41,
      unit: "%",
      reference: "36-46",
      status: "normal",
      data: [
        { date: "2023-01-15", value: 40 },
        { date: "2023-04-20", value: 40.5 },
        { date: "2023-07-10", value: 41.2 },
        { date: "2023-10-15", value: 41 },
      ]
    },
  ],
  biochemistry: [
    {
      id: 5,
      name: "Glicose",
      value: 110,
      unit: "mg/dL",
      reference: "70-99",
      status: "warning",
      data: [
        { date: "2023-01-15", value: 95 },
        { date: "2023-04-20", value: 102 },
        { date: "2023-07-10", value: 108 },
        { date: "2023-10-15", value: 110 },
      ]
    },
    {
      id: 6,
      name: "Colesterol Total",
      value: 185,
      unit: "mg/dL",
      reference: "< 200",
      status: "normal",
      data: [
        { date: "2023-01-15", value: 190 },
        { date: "2023-04-20", value: 188 },
        { date: "2023-07-10", value: 186 },
        { date: "2023-10-15", value: 185 },
      ]
    },
    {
      id: 7,
      name: "HDL",
      value: 65,
      unit: "mg/dL",
      reference: "> 50",
      status: "normal",
      data: [
        { date: "2023-01-15", value: 62 },
        { date: "2023-04-20", value: 63 },
        { date: "2023-07-10", value: 64 },
        { date: "2023-10-15", value: 65 },
      ]
    },
    {
      id: 8,
      name: "LDL",
      value: 100,
      unit: "mg/dL",
      reference: "< 130",
      status: "normal",
      data: [
        { date: "2023-01-15", value: 108 },
        { date: "2023-04-20", value: 105 },
        { date: "2023-07-10", value: 102 },
        { date: "2023-10-15", value: 100 },
      ]
    },
  ]
};

// Mock data for medical documents
export const medicalDocuments = [
  {
    id: 1,
    title: "Análises Sanguíneas Completas",
    date: "2023-10-15",
    type: "Análises",
    location: "Laboratório Central, Porto",
    doctor: "Dra. Ana Ferreira",
    fileUrl: "https://example.com/documents/blood_test_oct2023.pdf",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    title: "Raio-X ao Tórax",
    date: "2023-09-05",
    type: "Imagem",
    location: "Hospital Privado, Porto",
    doctor: "Dr. Ricardo Oliveira",
    fileUrl: "https://example.com/documents/chest_xray_sep2023.pdf",
    thumbnail: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    title: "Análise à Urina",
    date: "2023-08-20",
    type: "Análises",
    location: "Laboratório Central, Porto",
    doctor: "Dra. Ana Ferreira",
    fileUrl: "https://example.com/documents/urine_test_aug2023.pdf",
    thumbnail: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    title: "Eletrocardiograma",
    date: "2023-07-10",
    type: "Exame",
    location: "Hospital Privado, Porto",
    doctor: "Dr. Ricardo Oliveira",
    fileUrl: "https://example.com/documents/ecg_jul2023.pdf",
    thumbnail: "https://images.unsplash.com/photo-1559757175-7b21e5afae2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    title: "Análises Sanguíneas Completas",
    date: "2023-04-20",
    type: "Análises",
    location: "Laboratório Central, Porto",
    doctor: "Dra. Ana Ferreira",
    fileUrl: "https://example.com/documents/blood_test_apr2023.pdf",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 6,
    title: "Densitometria Óssea",
    date: "2023-03-15",
    type: "Exame",
    location: "Clínica de Diagnóstico, Porto",
    doctor: "Dra. Sofia Mendes",
    fileUrl: "https://example.com/documents/bone_density_mar2023.pdf",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 7,
    title: "Análises Sanguíneas Completas",
    date: "2023-01-15",
    type: "Análises",
    location: "Laboratório Central, Porto",
    doctor: "Dra. Ana Ferreira",
    fileUrl: "https://example.com/documents/blood_test_jan2023.pdf",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
];

interface VitalSign {
  id: number;
  name: string;
  value: string | number;
  unit: string;
  reference: string;
  status: string;
  data: Array<{ date: string; value: number | number[] }>;
}

// Mock data for vital signs
export const vitalSigns: VitalSign[] = [
  {
    id: 1,
    name: "Frequência Cardíaca",
    value: 72,
    unit: "bpm",
    reference: "60-100",
    status: "normal",
    data: [
      { date: "2023-10-01", value: 75 },
      { date: "2023-10-08", value: 73 },
      { date: "2023-10-15", value: 74 },
      { date: "2023-10-22", value: 72 },
      { date: "2023-10-29", value: 72 },
      { date: "2023-11-05", value: 71 },
      { date: "2023-11-12", value: 72 },
    ]
  },
  {
    id: 2,
    name: "Pressão Arterial",
    value: "120/80",
    unit: "mmHg",
    reference: "120/80",
    status: "normal",
    data: [
      { date: "2023-10-01", value: [122, 82] },
      { date: "2023-10-08", value: [121, 81] },
      { date: "2023-10-15", value: [120, 80] },
      { date: "2023-10-22", value: [119, 79] },
      { date: "2023-10-29", value: [120, 80] },
      { date: "2023-11-05", value: [121, 81] },
      { date: "2023-11-12", value: [120, 80] },
    ]
  },
  {
    id: 3,
    name: "Saturação O₂",
    value: 98,
    unit: "%",
    reference: "95-100",
    status: "normal",
    data: [
      { date: "2023-10-01", value: 98 },
      { date: "2023-10-08", value: 99 },
      { date: "2023-10-15", value: 98 },
      { date: "2023-10-22", value: 98 },
      { date: "2023-10-29", value: 97 },
      { date: "2023-11-05", value: 98 },
      { date: "2023-11-12", value: 98 },
    ]
  },
  {
    id: 4,
    name: "Temperatura",
    value: 36.5,
    unit: "°C",
    reference: "36.1-37.2",
    status: "normal",
    data: [
      { date: "2023-10-01", value: 36.6 },
      { date: "2023-10-08", value: 36.5 },
      { date: "2023-10-15", value: 36.7 },
      { date: "2023-10-22", value: 36.4 },
      { date: "2023-10-29", value: 36.5 },
      { date: "2023-11-05", value: 36.6 },
      { date: "2023-11-12", value: 36.5 },
    ]
  },
];

interface BodyMetric {
  id: number;
  name: string;
  value: number;
  unit: string;
  reference: string | null;
  status: string;
  data: Array<{ date: string; value: number }>;
}

// Mock data for body metrics
export const bodyMetrics: BodyMetric[] = [
  {
    id: 1,
    name: "Peso",
    value: 54,
    unit: "kg",
    reference: "50-65",
    status: "normal",
    data: [
      { date: "2023-06-01", value: 55 },
      { date: "2023-07-01", value: 54.5 },
      { date: "2023-08-01", value: 54.2 },
      { date: "2023-09-01", value: 54 },
      { date: "2023-10-01", value: 54 },
      { date: "2023-11-01", value: 54 },
    ]
  },
  {
    id: 2,
    name: "Altura",
    value: 163,
    unit: "cm",
    reference: null,
    status: "normal",
    data: []
  },
  {
    id: 3,
    name: "IMC",
    value: 20.3,
    unit: "kg/m²",
    reference: "18.5-24.9",
    status: "normal",
    data: [
      { date: "2023-06-01", value: 20.7 },
      { date: "2023-07-01", value: 20.5 },
      { date: "2023-08-01", value: 20.4 },
      { date: "2023-09-01", value: 20.3 },
      { date: "2023-10-01", value: 20.3 },
      { date: "2023-11-01", value: 20.3 },
    ]
  },
  {
    id: 4,
    name: "Massa Gorda",
    value: 24,
    unit: "%",
    reference: "21-33",
    status: "normal",
    data: [
      { date: "2023-06-01", value: 25 },
      { date: "2023-07-01", value: 24.5 },
      { date: "2023-08-01", value: 24.2 },
      { date: "2023-09-01", value: 24 },
      { date: "2023-10-01", value: 24 },
      { date: "2023-11-01", value: 24 },
    ]
  },
  {
    id: 5,
    name: "Massa Muscular",
    value: 38,
    unit: "%",
    reference: "35-45",
    status: "normal",
    data: [
      { date: "2023-06-01", value: 37 },
      { date: "2023-07-01", value: 37.5 },
      { date: "2023-08-01", value: 37.8 },
      { date: "2023-09-01", value: 38 },
      { date: "2023-10-01", value: 38 },
      { date: "2023-11-01", value: 38 },
    ]
  },
  {
    id: 6,
    name: "Cintura",
    value: 68,
    unit: "cm",
    reference: "< 80",
    status: "normal",
    data: [
      { date: "2023-06-01", value: 69 },
      { date: "2023-07-01", value: 68.5 },
      { date: "2023-08-01", value: 68 },
      { date: "2023-09-01", value: 68 },
      { date: "2023-10-01", value: 68 },
      { date: "2023-11-01", value: 68 },
    ]
  },
];

interface LifestyleMetric {
  id: number;
  name: string;
  value: number | string;
  unit: string;
  reference: string | null;
  status: string;
  chartType: string;
  data: Array<{ date: string; value: number }>;
}

// Mock data for lifestyle metrics
export const lifestyleMetrics: LifestyleMetric[] = [
  {
    id: 1,
    name: "Passos",
    value: 8500,
    unit: "passos",
    reference: "10000",
    status: "warning",
    chartType: "line",
    data: [
      { date: "2023-11-06", value: 7800 },
      { date: "2023-11-07", value: 8200 },
      { date: "2023-11-08", value: 9100 },
      { date: "2023-11-09", value: 8400 },
      { date: "2023-11-10", value: 7900 },
      { date: "2023-11-11", value: 9500 },
      { date: "2023-11-12", value: 8500 },
    ]
  },
  {
    id: 2,
    name: "Horas de Sono",
    value: 7.5,
    unit: "h",
    reference: "7-9",
    status: "normal",
    chartType: "bar",
    data: [
      { date: "2023-11-06", value: 7.2 },
      { date: "2023-11-07", value: 7.5 },
      { date: "2023-11-08", value: 8.0 },
      { date: "2023-11-09", value: 7.3 },
      { date: "2023-11-10", value: 7.5 },
      { date: "2023-11-11", value: 8.2 },
      { date: "2023-11-12", value: 7.5 },
    ]
  },
  {
    id: 3,
    name: "Atividade Física",
    value: 150,
    unit: "min/sem",
    reference: "150",
    status: "normal",
    chartType: "bar",
    data: [
      { date: "2023-11-06", value: 30 },
      { date: "2023-11-07", value: 0 },
      { date: "2023-11-08", value: 45 },
      { date: "2023-11-09", value: 0 },
      { date: "2023-11-10", value: 30 },
      { date: "2023-11-11", value: 0 },
      { date: "2023-11-12", value: 45 },
    ]
  },
  {
    id: 4,
    name: "Tempo de Ecrã",
    value: 3.5,
    unit: "h/dia",
    reference: "< 4",
    status: "normal",
    chartType: "line",
    data: [
      { date: "2023-11-06", value: 3.2 },
      { date: "2023-11-07", value: 3.8 },
      { date: "2023-11-08", value: 3.5 },
      { date: "2023-11-09", value: 4.1 },
      { date: "2023-11-10", value: 3.7 },
      { date: "2023-11-11", value: 2.9 },
      { date: "2023-11-12", value: 3.5 },
    ]
  },
  {
    id: 5,
    name: "Nível de Stress",
    value: "Baixo",
    unit: "",
    reference: "Baixo-Médio",
    status: "normal",
    chartType: "line",
    data: [
      { date: "2023-11-06", value: 25 },
      { date: "2023-11-07", value: 30 },
      { date: "2023-11-08", value: 28 },
      { date: "2023-11-09", value: 35 },
      { date: "2023-11-10", value: 32 },
      { date: "2023-11-11", value: 20 },
      { date: "2023-11-12", value: 25 },
    ]
  },
];

export const dataAccessPermissions = {
  current: [
    {
      id: 1,
      name: "Dra. Ana Ferreira",
      role: "Médica",
      specialty: "Clínica Geral",
      accessLevel: "Completo",
      grantedDate: "2023-01-15",
      expiryDate: "2024-01-15",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "Dr. João Santos",
      role: "Médico",
      specialty: "Dermatologia",
      accessLevel: "Parcial",
      grantedDate: "2023-03-10",
      expiryDate: "2023-12-10",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "Carlos Silva",
      role: "Familiar",
      specialty: "Marido",
      accessLevel: "Limitado",
      grantedDate: "2023-02-20",
      expiryDate: null,
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ],
  revoked: [
    {
      id: 4,
      name: "Dr. Miguel Pereira",
      role: "Médico",
      specialty: "Ortopedia",
      accessLevel: "Parcial",
      grantedDate: "2022-05-15",
      revokedDate: "2023-01-10",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 5,
      name: "Farmácia Central",
      role: "Instituição",
      specialty: "Farmácia",
      accessLevel: "Limitado",
      grantedDate: "2022-11-20",
      revokedDate: "2023-05-20",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ],
  accessLogs: [
    {
      id: 1,
      name: "Dra. Ana Ferreira",
      action: "Visualizou análises de sangue",
      date: "2023-11-12",
      time: "14:30",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      name: "Dr. João Santos",
      action: "Adicionou prescrição médica",
      date: "2023-11-10",
      time: "10:15",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      name: "Carlos Silva",
      action: "Visualizou consultas agendadas",
      date: "2023-11-08",
      time: "19:45",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      name: "Dra. Ana Ferreira",
      action: "Atualizou plano de saúde",
      date: "2023-11-05",
      time: "11:20",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ],
  sharingOptions: [
    {
      id: 1,
      category: "Dados Pessoais",
      options: [
        { id: 101, name: "Nome e Contacto", enabled: true },
        { id: 102, name: "Morada", enabled: false },
        { id: 103, name: "Data de Nascimento", enabled: true }
      ]
    },
    {
      id: 2,
      category: "Histórico Médico",
      options: [
        { id: 201, name: "Condições Atuais", enabled: true },
        { id: 202, name: "Condições Anteriores", enabled: true },
        { id: 203, name: "Histórico Familiar", enabled: false }
      ]
    },
    {
      id: 3,
      category: "Medicação",
      options: [
        { id: 301, name: "Medicação Atual", enabled: true },
        { id: 302, name: "Histórico de Medicação", enabled: false }
      ]
    },
    {
      id: 4,
      category: "Análises e Exames",
      options: [
        { id: 401, name: "Resultados de Análises", enabled: true },
        { id: 402, name: "Relatórios de Exames", enabled: true }
      ]
    }
  ]
};

export interface MedicalExam {
  id: number;
  type: string;
  date: string;
  region: string;
  conclusion: string;
  fileName: string;
  risk: 'low' | 'moderate' | 'high';
  fileUrl?: string;
}

export const medicalExams: MedicalExam[] = [
  {
    id: 1,
    type: "Ultrasound",
    date: "9/27/2024",
    region: "Upper abdomen",
    conclusion: "Avaliação estável comparativamente a estudo prévio, mantendo-se lesão",
    fileName: "Ecografia 2024.pdf",
    risk: "low",
    fileUrl: "https://example.com/exams/ultrasound_2024.pdf"
  },
  {
    id: 2,
    type: "CT Scan",
    date: "7/15/2024",
    region: "Brain",
    conclusion: "Sem alterações significativas. Estruturas cerebrais dentro da normalidade",
    fileName: "TC Cerebral 2024.pdf",
    risk: "low",
    fileUrl: "https://example.com/exams/ct_brain_2024.pdf"
  },
  {
    id: 3,
    type: "MRI",
    date: "5/10/2024",
    region: "Lumbar spine",
    conclusion: "Ligeira discopatia em L4-L5 sem compressão nervosa. Recomendar fisioterapia",
    fileName: "Ressonância Lombar 2024.pdf",
    risk: "moderate",
    fileUrl: "https://example.com/exams/mri_lumbar_2024.pdf"
  },
  {
    id: 4,
    type: "Mammography",
    date: "3/22/2024",
    region: "Bilateral breasts",
    conclusion: "Tecido mamográfico normal. Não foram detetadas lesões suspeitas",
    fileName: "Mamografia 2024.pdf",
    risk: "low",
    fileUrl: "https://example.com/exams/mammography_2024.pdf"
  },
  {
    id: 5,
    type: "Echocardiogram",
    date: "1/18/2024",
    region: "Heart",
    conclusion: "Função cardíaca preservada. Fração de ejeção normal (60%)",
    fileName: "Ecocardiograma 2024.pdf",
    risk: "low",
    fileUrl: "https://example.com/exams/echo_2024.pdf"
  },
];

export const examsAiInsight = {
  title: "Análise de Exames Médicos",
  date: new Date().toISOString(),
  concerns: [
    "Ligeira discopatia em L4-L5 detetada na Ressonância Lombar",
    "Recomendado acompanhamento periódico da lesão abdominal"
  ],
  improvements: [
    "Mamografia sem alterações, mantendo padrão de normalidade",
    "Função cardíaca excelente no ecocardiograma",
    "TC cerebral sem alterações significativas"
  ],
  recommendations: [
    "Iniciar programa de fisioterapia para fortalecer região lombar",
    "Manter prática regular de exercício físico moderado",
    "Repetir ecografia abdominal em 6 meses para acompanhamento",
    "Continuar rastreio mamográfico anual"
  ]
};
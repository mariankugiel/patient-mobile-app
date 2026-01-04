// Doctor specialties
export const specialties = [
  { id: 'all', name: 'Todas as especialidades' },
  { id: 'cardiologia', name: 'Cardiologia' },
  { id: 'neurologia', name: 'Neurologia' },
  { id: 'dermatologia', name: 'Dermatologia' },
  { id: 'ortopedia', name: 'Ortopedia' },
  { id: 'clinica_geral', name: 'Clínica Geral' },
  { id: 'pediatria', name: 'Pediatria' },
  { id: 'ginecologia', name: 'Ginecologia' },
  { id: 'oftalmologia', name: 'Oftalmologia' },
];

// Insurance providers
export const insuranceProviders = [
  { id: 'all', name: 'Todos os seguros' },
  { id: 'medis', name: 'Médis' },
  { id: 'multicare', name: 'Multicare' },
  { id: 'advancecare', name: 'AdvanceCare' },
  { id: 'allianz', name: 'Allianz Saúde' },
  { id: 'particular', name: 'Particular' },
];

// Appointment types
export const appointmentTypes = [
  { id: 'all', name: 'Todos os tipos', icon: null },
  { id: 'presencial', name: 'Presencial', icon: 'map-pin' },
  { id: 'video', name: 'Videochamada', icon: 'video' },
  { id: 'telefone', name: 'Telefone', icon: 'phone' },
];

// Locations
export const locations = [
  { id: 'all', name: 'Todas as localizações' },
  { id: 'porto', name: 'Porto' },
  { id: 'lisboa', name: 'Lisboa' },
  { id: 'coimbra', name: 'Coimbra' },
  { id: 'braga', name: 'Braga' },
  { id: 'faro', name: 'Faro' },
];

// Time slots
export const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
  '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', 
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

// Doctor data with availability
export const doctors = [
  { 
    id: 1, 
    name: "Dra. Ana Silva", 
    specialty: "cardiologia", 
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop",
    acceptedInsurance: ['medis', 'multicare', 'advancecare'],
    consultationTypes: ['presencial', 'video'],
    locations: [
      { 
        city: 'Porto',
        address: "Hospital Privado, Rua Central 123, Porto"
      },
      {
        city: 'Lisboa',
        address: "Centro Médico de Lisboa, Avenida da Liberdade 45, Lisboa"
      }
    ],
    bio: "Cardiologista com mais de 15 anos de experiência. Especializada em cardiologia preventiva e tratamento de doenças cardiovasculares. Abordagem centrada no paciente com foco em prevenção e estilo de vida saudável.",
    education: [
      "Doutorado em Cardiologia, Universidade do Porto",
      "Especialização em Cardiologia Intervencionista, Hospital São João",
      "Licenciatura em Medicina, Universidade de Lisboa"
    ],
    languages: ["Português", "Inglês", "Espanhol"],
    availability: [
      { 
        date: '2023-12-15', 
        slots: ['09:00', '09:30', '14:00', '14:30', '15:00'],
        locationIndex: 0 // Porto
      },
      { 
        date: '2023-12-16', 
        slots: ['10:00', '10:30', '11:00', '15:30', '16:00'],
        locationIndex: 0 // Porto
      },
      { 
        date: '2023-12-18', 
        slots: ['08:30', '09:00', '14:30', '15:00'],
        locationIndex: 1 // Lisboa
      }
    ]
  },
  { 
    id: 2, 
    name: "Dr. João Martins", 
    specialty: "neurologia", 
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop",
    acceptedInsurance: ['multicare', 'allianz', 'particular'],
    consultationTypes: ['presencial', 'telefone'],
    locations: [
      {
        city: 'Porto',
        address: "Clínica Neurológica, Avenida da Boavista 456, Porto"
      }
    ],
    bio: "Neurologista especializado em distúrbios do movimento e doenças neurodegenerativas. Dedica-se à investigação clínica e ao tratamento personalizado de pacientes com condições neurológicas complexas.",
    education: [
      "Especialização em Neurologia, Hospital Santa Maria",
      "Mestrado em Neurociências, Universidade de Coimbra",
      "Licenciatura em Medicina, Universidade do Porto"
    ],
    languages: ["Português", "Inglês", "Francês"],
    availability: [
      { 
        date: '2023-12-14', 
        slots: ['08:00', '08:30', '09:00', '16:30', '17:00'],
        locationIndex: 0 // Porto
      },
      { 
        date: '2023-12-17', 
        slots: ['11:00', '11:30', '14:00', '14:30'],
        locationIndex: 0 // Porto
      },
      { 
        date: '2023-12-19', 
        slots: ['15:00', '15:30', '16:00', '16:30'],
        locationIndex: 0 // Porto
      }
    ]
  },
  { 
    id: 3, 
    name: "Dra. Maria Costa", 
    specialty: "dermatologia", 
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop",
    acceptedInsurance: ['medis', 'advancecare', 'particular'],
    consultationTypes: ['presencial', 'video', 'telefone'],
    locations: [
      {
        city: 'Porto',
        address: "Centro Dermatológico, Praça da Liberdade 78, Porto"
      },
      {
        city: 'Coimbra',
        address: "Hospital Universitário, Avenida Sá da Bandeira 23, Coimbra"
      }
    ],
    bio: "Dermatologista com foco em dermatologia estética e tratamento de doenças de pele. Utiliza técnicas avançadas e abordagens inovadoras para proporcionar os melhores resultados aos seus pacientes.",
    education: [
      "Pós-graduação em Dermatologia Estética, Barcelona",
      "Especialização em Dermatologia, Hospital São João",
      "Licenciatura em Medicina, Universidade Nova de Lisboa"
    ],
    languages: ["Português", "Inglês"],
    availability: [
      { 
        date: '2023-12-13', 
        slots: ['10:00', '10:30', '11:00', '11:30'],
        locationIndex: 0 // Porto
      },
      { 
        date: '2023-12-15', 
        slots: ['14:00', '14:30', '15:00', '15:30'],
        locationIndex: 0 // Porto
      },
      { 
        date: '2023-12-20', 
        slots: ['09:00', '09:30', '16:00', '16:30'],
        locationIndex: 1 // Coimbra
      }
    ]
  },
  { 
    id: 4, 
    name: "Dr. Pedro Santos", 
    specialty: "ortopedia", 
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop",
    acceptedInsurance: ['medis', 'multicare', 'allianz'],
    consultationTypes: ['presencial', 'video'],
    locations: [
      {
        city: 'Lisboa',
        address: "Hospital Ortopédico, Rua da Constituição 345, Lisboa"
      },
      {
        city: 'Braga',
        address: "Clínica Ortopédica de Braga, Avenida Central 78, Braga"
      }
    ],
    bio: "Ortopedista especializado em medicina desportiva e lesões articulares. Trabalha com atletas profissionais e amadores, oferecendo tratamentos personalizados para recuperação e prevenção de lesões.",
    education: [
      "Fellowship em Medicina Desportiva, Estados Unidos",
      "Especialização em Ortopedia, Hospital de São João",
      "Licenciatura em Medicina, Universidade do Porto"
    ],
    languages: ["Português", "Inglês"],
    availability: [
      { 
        date: '2023-12-14', 
        slots: ['14:00', '14:30', '15:00', '15:30'],
        locationIndex: 0 // Lisboa
      },
      { 
        date: '2023-12-16', 
        slots: ['09:00', '09:30', '10:00', '10:30'],
        locationIndex: 0 // Lisboa
      },
      { 
        date: '2023-12-19', 
        slots: ['11:00', '11:30', '16:00', '16:30'],
        locationIndex: 1 // Braga
      }
    ]
  },
  { 
    id: 5, 
    name: "Dra. Sofia Mendes", 
    specialty: "oftalmologia", 
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=200&auto=format&fit=crop",
    acceptedInsurance: ['advancecare', 'allianz', 'particular'],
    consultationTypes: ['presencial'],
    locations: [
      {
        city: 'Lisboa',
        address: "Clínica Oftalmológica, Rua Santa Catarina 567, Lisboa"
      }
    ],
    bio: "Oftalmologista com especialização em cirurgia refrativa e tratamento de doenças da retina. Comprometida com a excelência no atendimento e na aplicação das mais recentes tecnologias em oftalmologia.",
    education: [
      "Especialização em Cirurgia Refrativa, Espanha",
      "Doutorado em Oftalmologia, Universidade de Coimbra",
      "Licenciatura em Medicina, Universidade do Porto"
    ],
    languages: ["Português", "Inglês", "Alemão"],
    availability: [
      { 
        date: '2023-12-13', 
        slots: ['08:00', '08:30', '09:00', '09:30'],
        locationIndex: 0 // Lisboa
      },
      { 
        date: '2023-12-18', 
        slots: ['14:00', '14:30', '15:00', '15:30'],
        locationIndex: 0 // Lisboa
      },
      { 
        date: '2023-12-21', 
        slots: ['10:00', '10:30', '11:00', '11:30'],
        locationIndex: 0 // Lisboa
      }
    ]
  },
  { 
    id: 6, 
    name: "Dr. Miguel Pereira", 
    specialty: "clinica_geral", 
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop",
    acceptedInsurance: ['medis', 'multicare', 'advancecare', 'allianz', 'particular'],
    consultationTypes: ['presencial', 'video', 'telefone'],
    locations: [
      {
        city: 'Porto',
        address: "Centro Médico Central, Avenida dos Aliados 890, Porto"
      },
      {
        city: 'Faro',
        address: "Clínica do Algarve, Rua do Sol 45, Faro"
      }
    ],
    bio: "Médico de família dedicado à medicina preventiva e ao acompanhamento contínuo dos pacientes. Acredita na importância da relação médico-paciente e na abordagem holística da saúde.",
    education: [
      "Especialização em Medicina Geral e Familiar, USF Porto Centro",
      "Mestrado em Saúde Pública, Universidade do Porto",
      "Licenciatura em Medicina, Universidade de Lisboa"
    ],
    languages: ["Português", "Inglês", "Italiano"],
    availability: [
      { 
        date: '2023-12-13', 
        slots: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
        locationIndex: 0 // Porto
      },
      { 
        date: '2023-12-15', 
        slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'],
        locationIndex: 0 // Porto
      },
      { 
        date: '2023-12-17', 
        slots: ['11:00', '11:30', '14:00', '14:30', '15:00', '15:30'],
        locationIndex: 1 // Faro
      },
      { 
        date: '2023-12-20', 
        slots: ['08:30', '09:00', '09:30', '16:00', '16:30', '17:00'],
        locationIndex: 1 // Faro
      }
    ]
  },
];
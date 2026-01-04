export type Language = 'pt-PT' | 'es-ES' | 'en-US';

export interface Translations {
  // Tab names
  tabPanel: string;
  tabRecords: string;
  tabPlans: string;
  tabMedications: string;
  tabAppointments: string;

  // Profile tabs
  profileTitle: string;
  profilePersonalData: string;
  profileEmergency: string;
  profileSecurity: string;
  profilePermissions: string;
  profileIntegrations: string;
  profileNotifications: string;
  profilePreferences: string;

  // Common
  edit: string;
  add: string;
  remove: string;
  save: string;
  cancel: string;
  yes: string;
  no: string;
  delete: string;
  confirm: string;
  back: string;
  loading: string;
  notDefined: string;
  none: string;
  validationError: string;
  fieldRequired: string;
  invalidEmail: string;
  uploadFailed: string;
  failedToUpdate: string;
  permissionRequired: string;
  
  // Auth
  login: string;
  signIn: string;
  signUp: string;
  register: string;
  createAccount: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  forgotPassword: string;
  continueWithGoogle: string;
  or: string;
  enterEmail: string;
  enterPassword: string;
  enterName: string;
  confirmPassword: string;
  createPassword: string;
  yourHealthOnePlace: string;
  joinSaluso: string;
  fillAllFields: string;
  password: string;
  
  // Dashboard
  healthSummary: string;
  generalHealth: string;
  weekStatus: string;
  thisWeek: string;
  activities: string;
  lifestyle: string;
  latestMeasurements: string;
  healthPlan: string;
  metabolicAge: string;
  metabolicAgeGood: string;
  metabolicAgeWarning: string;
  metabolicAgeRecommendations: string;
  dailyActivities: string;
  noActivitiesScheduled: string;
  medications: string;
  appointments: string;
  vsPreviousWeek: string;
  planned: string;
  
  // Personal Data
  fullName: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  mobileNumber: string;
  address: string;
  location: string;
  postalCode: string;
  city: string;
  gender: string;
  height: string;
  weight: string;
  waistDiameter: string;
  timezone: string;
  
  // Emergency
  emergencyContacts: string;
  addContact: string;
  editContact: string;
  name: string;
  relationship: string;
  relationshipSpouse: string;
  relationshipParent: string;
  relationshipSibling: string;
  relationshipChild: string;
  relationshipFriend: string;
  relationshipOther: string;
  selectRelationship: string;
  mobilePhone: string;
  emailOptional: string;
  nameRequired: string;
  relationshipRequired: string;
  phoneRequired: string;
  failedToSave: string;
  spouse: string;
  son: string;
  daughter: string;
  emergencyMedicalInfo: string;
  bloodType: string;
  allergies: string;
  conditions: string;
  healthProblems: string;
  currentMedications: string;
  pregnancyStatus: string;
  organDonor: string;
  willingToDonate: string;
  notPregnant: string;
  pregnant: string;
  unknown: string;
  notApplicable: string;
  pregnancyNotPregnant: string;
  pregnancyPregnant: string;
  pregnancyUnknown: string;
  pregnancyNotApplicable: string;
  selectStatus: string;
  
  // Security
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  currentPasswordRequired: string;
  newPasswordRequired: string;
  passwordMinLength: string;
  passwordsDoNotMatch: string;
  passwordChangedSuccessfully: string;
  failedToChangePassword: string;
  lastChanged: string;
  twoFactorAuth: string;
  twoFactorDescription: string;
  twoFactorEnabledInfo: string;
  disableTwoFactorConfirm: string;
  enableTwoFactorInfo: string;
  twoFactorSetupComingSoon: string;
  twoFactorDisabled: string;
  twoFactorComingSoonDescription: string;
  twoFactorFeature1: string;
  twoFactorFeature2: string;
  twoFactorFeature3: string;
  understood: string;
  comingSoon: string;
  continue: string;
  disable: string;
  enable: string;
  enabled: string;
  disabled: string;
  connectedDevices: string;
  activeDevices: string;
  success: string;
  error: string;
  ok: string;
  
  // Permissions
  currentAccess: string;
  revokedAccess: string;
  accessLogs: string;
  healthProfessionals: string;
  familyFriends: string;
  accessGranted: string;
  accessExpires: string;
  revoked: string;
  revoke: string;
  restoreAccess: string;
  addNewAccess: string;
  sharingOptions: string;
  
  // Integrations
  connected: string;
  notConnected: string;
  healthConnect: string;
  appleHealth: string;
  fitbit: string;
  garmin: string;
  polar: string;
  samsungHealth: string;
  withings: string;
  strava: string;
  googleFit: string;
  omronConnect: string;
  suunto: string;
  oura: string;
  iHealth: string;
  beurer: string;
  huaweiHealth: string;
  dexcom: string;
  whoop: string;
  decathlon: string;
  androidOnly: string;
  iosOnly: string;
  
  // Notifications
  emailNotifications: string;
  pushNotifications: string;
  appointmentReminders: string;
  appointmentRemindersDesc: string;
  medicationReminders: string;
  medicationRemindersDesc: string;
  messages: string;
  messagesDesc: string;
  healthRecommendations: string;
  healthRecommendationsDesc: string;
  
  // Preferences
  language: string;
  portuguesePortugal: string;
  spanishSpain: string;
  englishUsa: string;
  theme: string;
  light: string;
  dark: string;
  system: string;
  accessibility: string;
  textSize: string;
  small: string;
  normal: string;
  large: string;
  higherContrast: string;
  higherContrastDesc: string;
  reduceMotion: string;
  reduceMotionDesc: string;
  
  // Logout
  logout: string;
  endSession: string;
  endSessionConfirm: string;
  areYouSure: string;
  
  // Days
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  
  // Months
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;

  // Records page
  healthRecords: string;
  summary: string;
  history: string;
  analyses: string;
  vitals: string;
  body: string;
  vaccines: string;
  assessment: string;
  areasOfConcern: string;
  positiveProgress: string;
  recommendations: string;
  noDataAvailable: string;
  recommendedForYou: string;
  recentlyUpdated: string;
  medicalData: string;
  wellbeing: string;
  wellness: string;
  wellnessDescription: string;
  analysis: string;
  analysisDescription: string;
  currentMedicalConditions: string;
  previousMedicalConditions: string;
  familyHistory: string;
  additionalInfo: string;
  surgeries: string;
  regularMedication: string;
  hematology: string;
  biochemistry: string;
  documents: string;
  addMetric: string;
  uploadDocument: string;
  addMeasurement: string;
  addMetricTitle: string;
  measurementType: string;
  enterValue: string;
  notesOptional: string;
  addNotes: string;
  saveMeasurement: string;
  heartRate: string;
  bloodPressure: string;
  glucose: string;
  bodyFat: string;
  steps: string;
  sleep: string;
  uploadDocumentTitle: string;
  documentType: string;
  documentDetails: string;
  documentName: string;
  documentNamePlaceholder: string;
  documentDate: string;
  documentDatePlaceholder: string;
  doctorInstitution: string;
  doctorPlaceholder: string;
  selectFile: string;
  supportedFormats: string;
  saveDocument: string;
  measurementSaved: string;
  documentSaved: string;
  failedToSave: string;
  selectHealthRecordType: string;
  selectSection: string;
  selectSectionPlaceholder: string;
  searchSections: string;
  noSectionsFound: string;
  createNewSection: string;
  sectionName: string;
  sectionNamePlaceholder: string;
  sectionDescription: string;
  sectionDescriptionPlaceholder: string;
  selectMetric: string;
  selectMetricPlaceholder: string;
  searchMetrics: string;
  noMetricsFound: string;
  createCustomMetric: string;
  metricName: string;
  metricNamePlaceholder: string;
  metricDisplayName: string;
  metricDisplayNamePlaceholder: string;
  metricUnit: string;
  metricUnitPlaceholder: string;
  referenceRange: string;
  referenceRangeMin: string;
  referenceRangeMax: string;
  referenceRangeMinPlaceholder: string;
  referenceRangeMaxPlaceholder: string;
  metricDescription: string;
  metricDescriptionPlaceholder: string;
  createSection: string;
  createMetric: string;
  creating: string;
  sectionCreated: string;
  metricCreated: string;
  failedToCreateSection: string;
  failedToCreateMetric: string;
  pleaseSelectSection: string;
  pleaseEnterMetricName: string;
  pleaseEnterValidNumbers: string;
  minMustBeLessThanMax: string;
  fromTemplate: string;
  custom: string;
  existing: string;
  addActivity: string;
  nextVaccines: string;
  administeredVaccines: string;
  addVaccine: string;
  annual: string;
  every10Years: string;
  dose: string;
  statusNormal: string;
  statusAbnormal: string;
  reference: string;
  lastMeasurement: string;
  height: string;
  weight: string;
  bmi: string;
  bodyFat: string;
  muscleMass: string;
  waterPercentage: string;
  steps: string;
  sleepQuality: string;
  stressLevel: string;
  screenTime: string;
  exerciseMinutes: string;
  
  // Exams
  exams: string;
  medicalExams: string;
  aiMedicalExamsAnalysis: string;
  examType: string;
  examDate: string;
  examRegion: string;
  conclusion: string;
  risk: string;
  lowRiskFindings: string;
  moderateRiskFindings: string;
  highRiskFindings: string;
  viewExam: string;
  editExam: string;
  uploadExam: string;
  aiExamsDisclaimer: string;
  
  // Appointments page
  upcoming: string;
  past: string;
  cancelled: string;
  addAppointment: string;
  inPerson: string;
  byVideo: string;
  byPhone: string;
  noAppointments: string;
  cancelAppointment: string;
  rescheduleAppointment: string;
  
  // Metabolic Age
  good: string;
  attention: string;
  
  // AI Insights
  aiEvaluation: string;
  bloodAnalysis: string;
  vitalSigns: string;
  bodyComposition: string;
  lifestyleInsight: string;
  slightlyElevatedGlucose: string;
  activityBelowTarget: string;
  bloodPressureNormal: string;
  sleepQualityImproved: string;
  cholesterolStable: string;
  reduceRefinedSugars: string;
  increaseDailyWalks: string;
  maintainSleepRoutine: string;
  glucoseTrending: string;
  hdlPositive: string;
  ldlDecreasing: string;
  increaseFiber: string;
  improveInsulinSensitivity: string;
  repeatGlucoseTest: string;
  bloodPressureVariations: string;
  heartRateStable: string;
  oxygenSaturationExcellent: string;
  bodyTempConsistent: string;
  monitorBloodPressure: string;
  moderateExercise: string;
  avoidExcessSalt: string;
  bmiIdeal: string;
  bodyFatAdequate: string;
  waistHeightHealthy: string;
  maintainActivity: string;
  adequateProtein: string;
  balancedDiet: string;
  activityBelowGoal: string;
  screenTimeHigh: string;
  sleepImproved: string;
  stressLow: string;
  exerciseConsistent: string;
  includeMoreWalking: string;
  regularBreaks: string;
  
  // Health plan
  dailyWalk: string;
  reduceSaturatedFat: string;
  increaseFiberIntake: string;
  reduceSalt: string;
  relaxationTechniques: string;
  daily: string;
  weekly: string;
  minutes: string;
  duringDay: string;
  atMeals: string;
  completed: string;
  notCompleted: string;
  in: string;
  
  // Medication
  medicationName: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
  addMedication: string;
  takeMedication: string;
  
  // Common time related
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
}

export const translations: Record<Language, Translations> = {
  'pt-PT': {
    // Tab names
    tabPanel: 'Painel',
    tabRecords: 'Registos',
    tabPlans: 'Plano',
    tabMedications: 'Medicação',
    tabAppointments: 'Consultas',

    // Profile tabs
    profileTitle: 'Perfil e Definições',
    profilePersonalData: 'Dados Pessoais',
    profileEmergency: 'Emergência',
    profileSecurity: 'Segurança',
    profilePermissions: 'Permissões',
    profileIntegrations: 'Integrações',
    profileNotifications: 'Notificações',
    profilePreferences: 'Preferências',

    // Common
    edit: 'Editar',
    add: 'Adicionar',
    remove: 'Remover',
    save: 'Guardar',
    cancel: 'Cancelar',
    yes: 'Sim',
    no: 'Não',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    back: 'Voltar',
    loading: 'A carregar dados...',
    notDefined: 'Não definido',
    none: 'Nenhuma',
    validationError: 'Erro de Validação',
    fieldRequired: 'Este campo é obrigatório',
    invalidEmail: 'Por favor, insira um endereço de email válido',
    uploadFailed: 'Falha no Upload',
    failedToUpdate: 'Falha ao atualizar perfil',
    permissionRequired: 'Por favor, conceda permissão para aceder às suas fotos para fazer upload de uma foto de perfil.',
    
    // Auth
    login: 'Entrar',
    signIn: 'Entrar',
    signUp: 'Registar',
    register: 'Registar',
    createAccount: 'Criar Conta',
    dontHaveAccount: 'Não tem conta?',
    alreadyHaveAccount: 'Já tem conta?',
    forgotPassword: 'Esqueceu a palavra-passe?',
    continueWithGoogle: 'Continuar com Google',
    or: 'ou',
    enterEmail: 'Introduza o seu email',
    enterPassword: 'Introduza a sua palavra-passe',
    enterName: 'Introduza o seu nome',
    confirmPassword: 'Confirmar Palavra-passe',
    createPassword: 'Crie uma palavra-passe',
    yourHealthOnePlace: 'A Sua Saúde, Num Só Lugar',
    joinSaluso: 'Junte-se à Saluso para gerir a sua saúde',
    fillAllFields: 'Por favor, preencha todos os campos',
    password: 'Palavra-passe',
    
    // Dashboard
    healthSummary: 'Resumo de saúde - estado atual e progresso',
    generalHealth: 'Saúde Geral',
    weekStatus: 'Status semana',
    thisWeek: 'Esta semana',
    activities: 'Atividades',
    lifestyle: 'Lifestyle',
    latestMeasurements: 'Últimas Medições',
    healthPlan: 'Plano de Saúde',
    metabolicAge: 'Idade Metabólica',
    metabolicAgeGood: 'Sua idade metabólica está {diff} anos abaixo da sua idade real. Excelente!',
    metabolicAgeWarning: 'Sua idade metabólica está {diff} anos acima da sua idade real. Foco em melhorar!',
    metabolicAgeRecommendations: 'Recomendações para Melhorar Idade Metabólica',
    dailyActivities: 'Atividades do dia',
    noActivitiesScheduled: 'Não há atividades programadas para este dia.',
    medications: 'Medicações',
    appointments: 'Consultas',
    vsPreviousWeek: 'vs semana anterior',
    planned: 'planeadas',
    
    // Personal Data
    fullName: 'Nome Completo',
    firstName: 'Primeiro Nome',
    lastName: 'Último Nome',
    birthDate: 'Data de Nascimento',
    email: 'Email',
    phone: 'Telefone',
    mobileNumber: 'Número de Telemóvel',
    address: 'Morada',
    location: 'Localização',
    postalCode: 'Código Postal',
    city: 'Localidade',
    gender: 'Género',
    height: 'Altura',
    weight: 'Peso',
    waistDiameter: 'Diâmetro da Cintura',
    timezone: 'Fuso Horário',
    
    // Emergency
    emergencyContacts: 'Contactos de Emergência',
    addContact: 'Adicionar',
    editContact: 'Editar Contacto',
    name: 'Nome',
    relationship: 'Relação',
    relationshipSpouse: 'Cônjuge/Parceiro',
    relationshipParent: 'Pai/Mãe',
    relationshipSibling: 'Irmão/Irmã',
    relationshipChild: 'Filho/Filha',
    relationshipFriend: 'Amigo',
    relationshipOther: 'Outro',
    selectRelationship: 'Selecionar relação',
    mobilePhone: 'Telemóvel',
    emailOptional: 'Email (Opcional)',
    nameRequired: 'O nome é obrigatório',
    relationshipRequired: 'A relação é obrigatória',
    phoneRequired: 'O número de telemóvel é obrigatório',
    failedToSave: 'Falha ao guardar',
    spouse: 'Cônjuge',
    son: 'Filho',
    daughter: 'Filha',
    emergencyMedicalInfo: 'Informação Médica para Emergência',
    bloodType: 'Tipo Sanguíneo',
    allergies: 'Alergias',
    conditions: 'Condições Clínicas',
    healthProblems: 'Problemas de Saúde',
    currentMedications: 'Medicações Atuais',
    pregnancyStatus: 'Estado de Gravidez',
    organDonor: 'Dador de Órgãos',
    willingToDonate: 'Disposto a doar',
    notPregnant: 'Não Grávida',
    pregnant: 'Grávida',
    unknown: 'Desconhecido',
    notApplicable: 'Não Aplicável',
    pregnancyNotPregnant: 'Não Grávida',
    pregnancyPregnant: 'Grávida',
    pregnancyUnknown: 'Desconhecido',
    pregnancyNotApplicable: 'Não Aplicável',
    selectStatus: 'Selecionar estado',
    
    // Security
    changePassword: 'Alterar Palavra-passe',
    currentPassword: 'Palavra-passe Atual',
    newPassword: 'Nova Palavra-passe',
    confirmNewPassword: 'Confirmar Nova Palavra-passe',
    currentPasswordRequired: 'A palavra-passe atual é obrigatória',
    newPasswordRequired: 'A nova palavra-passe é obrigatória',
    passwordMinLength: 'A palavra-passe deve ter pelo menos 8 caracteres',
    passwordsDoNotMatch: 'As palavras-passe não coincidem',
    passwordChangedSuccessfully: 'Palavra-passe alterada com sucesso',
    failedToChangePassword: 'Falha ao alterar a palavra-passe',
    lastChanged: 'Última alteração',
    twoFactorAuth: 'Autenticação de Dois Fatores',
    twoFactorDescription: 'A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta, exigindo um código de verificação além da sua palavra-passe.',
    twoFactorEnabledInfo: 'A autenticação de dois fatores está atualmente ativada. Será solicitado um código de verificação ao iniciar sessão.',
    disableTwoFactorConfirm: 'Tem a certeza de que deseja desativar a autenticação de dois fatores?',
    enableTwoFactorInfo: 'Para ativar a autenticação de dois fatores, precisará de digitalizar um código QR com uma aplicação autenticadora.',
    twoFactorSetupComingSoon: 'A configuração da autenticação de dois fatores estará disponível em breve',
    twoFactorDisabled: 'A autenticação de dois fatores foi desativada',
    twoFactorComingSoonDescription: 'A autenticação de dois fatores está atualmente em desenvolvimento. Esta funcionalidade estará disponível numa atualização futura para ajudar a manter a sua conta ainda mais segura.',
    twoFactorFeature1: 'Suporte para aplicações autenticadoras (Google Authenticator, Authy, etc.)',
    twoFactorFeature2: 'Códigos de backup por SMS para recuperação de conta',
    twoFactorFeature3: 'Segurança melhorada para os seus dados de saúde',
    understood: 'Compreendido',
    comingSoon: 'Em breve',
    continue: 'Continuar',
    disable: 'Desativar',
    enable: 'Ativar',
    enabled: 'Ativada',
    disabled: 'Desativada',
    connectedDevices: 'Dispositivos Conectados',
    activeDevices: 'dispositivos ativos',
    success: 'Sucesso',
    error: 'Erro',
    ok: 'OK',
    
    // Permissions
    currentAccess: 'Acessos Atuais',
    revokedAccess: 'Acessos Revogados',
    accessLogs: 'Registos de Acesso',
    healthProfessionals: 'Profissionais de Saúde',
    familyFriends: 'Família & Amigos',
    accessGranted: 'Acesso concedido em',
    accessExpires: 'Expira em',
    revoked: 'Revogado',
    revoke: 'Revogar',
    restoreAccess: 'Restaurar Acesso',
    addNewAccess: 'Adicionar Novo Acesso',
    sharingOptions: 'Opções de Partilha',
    
    // Integrations
    connected: 'Conectado',
    notConnected: 'Não conectado',
    healthConnect: 'Health Connect',
    appleHealth: 'Apple Health',
    fitbit: 'Fitbit',
    garmin: 'Garmin',
    polar: 'Polar',
    samsungHealth: 'Samsung Health',
    withings: 'Withings',
    strava: 'Strava',
    googleFit: 'Google Fit',
    omronConnect: 'Omron Connect',
    suunto: 'Suunto',
    oura: 'Oura',
    iHealth: 'iHealth',
    beurer: 'Beurer',
    huaweiHealth: 'Huawei Health',
    dexcom: 'Dexcom',
    whoop: 'Whoop',
    decathlon: 'Decathlon',
    androidOnly: 'Apenas Android',
    iosOnly: 'Apenas iOS',
    
    // Notifications
    emailNotifications: 'Email',
    pushNotifications: 'Push',
    appointmentReminders: 'Lembretes de Consultas',
    appointmentRemindersDesc: 'Receba lembretes 24h antes das suas consultas',
    medicationReminders: 'Lembretes de Medicamentos',
    medicationRemindersDesc: 'Receba lembretes para tomar os seus medicamentos',
    messages: 'Mensagens',
    messagesDesc: 'Receba notificações de novas mensagens',
    healthRecommendations: 'Recomendações de Saúde',
    healthRecommendationsDesc: 'Receba dicas e recomendações personalizadas',
    
    // Preferences
    language: 'Idioma',
    portuguesePortugal: 'Português (Portugal)',
    spanishSpain: 'Español (España)',
    englishUsa: 'English (USA)',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Escuro',
    system: 'Sistema',
    accessibility: 'Acessibilidade',
    textSize: 'Tamanho do Texto',
    small: 'Pequeno',
    normal: 'Normal',
    large: 'Grande',
    higherContrast: 'Maior Contraste',
    higherContrastDesc: 'Aumenta o contraste para melhor visibilidade',
    reduceMotion: 'Reduzir Movimento',
    reduceMotionDesc: 'Reduz animações e efeitos visuais',
    
    // Logout
    logout: 'Terminar Sessão',
    endSession: 'Terminar Sessão',
    endSessionConfirm: 'Tem a certeza que deseja terminar sessão?',
    areYouSure: 'Tem a certeza?',
    
    // Days
    sunday: 'Domingo',
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    
    // Months
    january: 'Janeiro',
    february: 'Fevereiro',
    march: 'Março',
    april: 'Abril',
    may: 'Maio',
    june: 'Junho',
    july: 'Julho',
    august: 'Agosto',
    september: 'Setembro',
    october: 'Outubro',
    november: 'Novembro',
    december: 'Dezembro',

    // Records page
    healthRecords: 'Registos de Saúde',
    summary: 'Sumário',
    history: 'Historial',
    analyses: 'Análises',
    vitals: 'Vitais',
    body: 'Corpo',
    vaccines: 'Vacinas',
    assessment: 'Avaliação Geral',
    areasOfConcern: 'Áreas de Preocupação',
    positiveProgress: 'Evolução Positiva',
    recommendations: 'Recomendações',
    noDataAvailable: 'Não há dados disponíveis',
    recommendedForYou: 'Recomendado para Ti',
    recentlyUpdated: 'Atualizado Recentemente',
    medicalData: 'Dados Médicos',
    wellbeing: 'Bem-Estar',
    wellness: 'Bem-Estar',
    wellnessDescription: 'Corpo, Sinais Vitais e Estilo de Vida',
    analysis: 'Análises',
    analysisDescription: 'Análise de saúde e insights',
    currentMedicalConditions: 'Condições Médicas Atuais',
    previousMedicalConditions: 'Condições Médicas Anteriores',
    familyHistory: 'Historial Familiar',
    additionalInfo: 'Informações Adicionais',
    surgeries: 'Cirurgias',
    regularMedication: 'Medicação Regular',
    hematology: 'Hematologia',
    biochemistry: 'Bioquímica',
    documents: 'Documentos',
    addMetric: 'Adicionar Métrica',
    uploadDocument: 'Carregar Documento',
    addMeasurement: 'Adicionar Medição',
    addActivity: 'Adicionar Atividade',
    nextVaccines: 'Próximas Vacinas',
    administeredVaccines: 'Vacinas Administradas',
    addVaccine: 'Adicionar Vacina',
    annual: 'Anual',
    every10Years: 'A cada 10 anos',
    dose: 'Dose',
    statusNormal: 'Normal',
    statusAbnormal: 'Anormal',
    reference: 'Ref',
    lastMeasurement: 'Última medição',
    height: 'Altura',
    weight: 'Peso',
    bmi: 'IMC',
    bodyFat: 'Massa Gorda',
    muscleMass: 'Massa Muscular',
    waterPercentage: 'Percentagem de Água',
    steps: 'Passos',
    sleepQuality: 'Qualidade do Sono',
    stressLevel: 'Nível de Stress',
    screenTime: 'Tempo de Ecrã',
    exerciseMinutes: 'Minutos de Exercício',
    
    // Exams
    exams: 'Exames',
    medicalExams: 'Exames Médicos',
    aiMedicalExamsAnalysis: 'Análise de Exames Médicos por IA',
    examType: 'Tipo de Exame',
    examDate: 'Data',
    examRegion: 'Região',
    conclusion: 'Conclusão',
    risk: 'Risco',
    lowRiskFindings: 'Achados de Baixo Risco',
    moderateRiskFindings: 'Achados de Risco Moderado',
    highRiskFindings: 'Achados de Alto Risco',
    viewExam: 'Ver',
    editExam: 'Editar',
    uploadExam: 'Carregar Exame',
    aiExamsDisclaimer: 'Os resumos de saúde gerados por IA têm um carácter meramente informativo e não substituem o aconselhamento, diagnóstico ou tratamento médico. Consulte sempre um profissional de saúde qualificado para obter aconselhamento médico personalizado.',
    
    // Appointments page
    upcoming: 'Agendadas',
    past: 'Anteriores',
    cancelled: 'Canceladas',
    addAppointment: 'Agendar Consulta',
    inPerson: 'Presencial',
    byVideo: 'Vídeo',
    byPhone: 'Telefone',
    noAppointments: 'Não há consultas',
    cancelAppointment: 'Cancelar Consulta',
    rescheduleAppointment: 'Reagendar',
    
    // Metabolic Age
    good: 'BOM',
    attention: 'ATENÇÃO',
    
    // AI Insights
    aiEvaluation: 'Avaliação Geral',
    bloodAnalysis: 'Análises Sanguíneas',
    vitalSigns: 'Sinais Vitais',
    bodyComposition: 'Composição Corporal',
    lifestyleInsight: 'Estilo de Vida',
    slightlyElevatedGlucose: 'Níveis de glicose ligeiramente elevados',
    activityBelowTarget: 'Atividade física abaixo da meta',
    bloodPressureNormal: 'Pressão arterial dentro dos valores normais',
    sleepQualityImproved: 'Qualidade do sono melhorou',
    cholesterolStable: 'Níveis de colesterol estáveis',
    reduceRefinedSugars: 'Reduzir o consumo de açúcares refinados',
    increaseDailyWalks: 'Aumentar caminhadas diárias',
    maintainSleepRoutine: 'Manter a rotina de sono regular',
    glucoseTrending: 'Tendência de aumento nos últimos 3 meses',
    hdlPositive: 'HDL (colesterol bom) com tendência positiva',
    ldlDecreasing: 'LDL (colesterol mau) com tendência de redução',
    increaseFiber: 'Aumentar a atividade física',
    improveInsulinSensitivity: 'Melhorar a sensibilidade à insulina',
    repeatGlucoseTest: 'Repetir análise de glicose em 3 meses',
    bloodPressureVariations: 'Ligeiras variações na pressão arterial durante o dia',
    heartRateStable: 'Frequência cardíaca estável e dentro dos valores normais',
    oxygenSaturationExcellent: 'Saturação de oxigênio excelente',
    bodyTempConsistent: 'Temperatura corporal consistentemente normal',
    monitorBloodPressure: 'Continuar a monitorizar a pressão arterial regularmente',
    moderateExercise: 'Manter a prática de exercício físico moderado',
    avoidExcessSalt: 'Evitar consumo excessivo de sal',
    bmiIdeal: 'IMC dentro da faixa ideal',
    bodyFatAdequate: 'Percentagem de massa gorda adequada',
    waistHeightHealthy: 'Relação cintura-altura saudável',
    maintainActivity: 'Manter a atividade física regular',
    adequateProtein: 'Garantir ingestão adequada de proteínas',
    balancedDiet: 'Continuar com alimentação equilibrada',
    activityBelowGoal: 'Atividade física abaixo da meta (8.500 passos vs. 10.000)',
    screenTimeHigh: 'Tempo de ecrã ocasionalmente acima do recomendado',
    sleepImproved: 'Qualidade do sono melhorou nas últimas semanas',
    stressLow: 'Níveis de stress geralmente baixos',
    exerciseConsistent: 'Boa consistência na prática de exercícios',
    includeMoreWalking: 'Incluir mais caminhadas no dia-a-dia',
    regularBreaks: 'Implementar pausas regulares durante o uso de dispositivos eletrônicos',
    
    // Health plan
    dailyWalk: 'Caminhada diária',
    reduceSaturatedFat: 'Reduzir consumo de gorduras saturadas',
    increaseFiberIntake: 'Aumentar consumo de fibras',
    reduceSalt: 'Reduzir consumo de sal',
    relaxationTechniques: 'Praticar técnicas de relaxamento',
    daily: 'Diariamente',
    weekly: 'Semanalmente',
    minutes: 'minutos',
    duringDay: 'Durante o dia',
    atMeals: 'Refeições',
    completed: 'Completo',
    notCompleted: 'Não completo',
    in: 'em',
    
    // Medication
    medicationName: 'Nome do Medicamento',
    dosage: 'Dosagem',
    frequency: 'Frequência',
    time: 'Hora',
    instructions: 'Instruções',
    addMedication: 'Adicionar Medicamento',
    takeMedication: 'Tomar Medicamento',
    
    // Common time related
    morning: 'Manhã',
    afternoon: 'Tarde',
    evening: 'Fim de tarde',
    night: 'Noite',
  },
  'es-ES': {
    // Tab names
    tabPanel: 'Panel',
    tabRecords: 'Registros',
    tabPlans: 'Plan',
    tabMedications: 'Medicación',
    tabAppointments: 'Citas',

    // Profile tabs
    profileTitle: 'Perfil y Configuración',
    profilePersonalData: 'Datos Personales',
    profileEmergency: 'Emergencia',
    profileSecurity: 'Seguridad',
    profilePermissions: 'Permisos',
    profileIntegrations: 'Integraciones',
    profileNotifications: 'Notificaciones',
    profilePreferences: 'Preferencias',

    // Common
    edit: 'Editar',
    add: 'Añadir',
    remove: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    yes: 'Sí',
    no: 'No',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    back: 'Volver',
    loading: 'Cargando datos...',
    notDefined: 'No definido',
    none: 'Ninguna',
    validationError: 'Error de Validación',
    fieldRequired: 'Este campo es obligatorio',
    invalidEmail: 'Por favor, ingrese una dirección de correo electrónico válida',
    uploadFailed: 'Error de Carga',
    failedToUpdate: 'Error al actualizar el perfil',
    permissionRequired: 'Por favor, otorgue permiso para acceder a sus fotos para subir una foto de perfil.',
    
    // Auth
    login: 'Iniciar Sesión',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    register: 'Registrarse',
    createAccount: 'Crear Cuenta',
    dontHaveAccount: '¿No tiene cuenta?',
    alreadyHaveAccount: '¿Ya tiene cuenta?',
    forgotPassword: '¿Olvidó su contraseña?',
    continueWithGoogle: 'Continuar con Google',
    or: 'o',
    enterEmail: 'Introduzca su email',
    enterPassword: 'Introduzca su contraseña',
    enterName: 'Introduzca su nombre',
    confirmPassword: 'Confirmar Contraseña',
    createPassword: 'Cree una contraseña',
    yourHealthOnePlace: 'Su Salud, En Un Solo Lugar',
    joinSaluso: 'Únase a Saluso para gestionar su salud',
    fillAllFields: 'Por favor, complete todos los campos',
    
    // Dashboard
    healthSummary: 'Resumen de salud - estado actual y progreso',
    generalHealth: 'Salud General',
    weekStatus: 'Estado semanal',
    thisWeek: 'Esta semana',
    activities: 'Actividades',
    lifestyle: 'Estilo de vida',
    latestMeasurements: 'Últimas Mediciones',
    healthPlan: 'Plan de Salud',
    metabolicAge: 'Edad Metabólica',
    metabolicAgeGood: 'Su edad metabólica está {diff} años por debajo de su edad real. ¡Excelente!',
    metabolicAgeWarning: 'Su edad metabólica está {diff} años por encima de su edad real. ¡Enfoque en mejorar!',
    metabolicAgeRecommendations: 'Recomendaciones para Mejorar la Edad Metabólica',
    dailyActivities: 'Actividades del día',
    noActivitiesScheduled: 'No hay actividades programadas para este día.',
    medications: 'Medicamentos',
    appointments: 'Citas',
    vsPreviousWeek: 'vs semana anterior',
    planned: 'planificadas',
    
    // Personal Data
    fullName: 'Nombre Completo',
    firstName: 'Nombre',
    lastName: 'Apellido',
    birthDate: 'Fecha de Nacimiento',
    email: 'Email',
    phone: 'Teléfono',
    mobileNumber: 'Número de Móvil',
    address: 'Dirección',
    location: 'Ubicación',
    postalCode: 'Código Postal',
    city: 'Ciudad',
    gender: 'Género',
    height: 'Altura',
    weight: 'Peso',
    waistDiameter: 'Diámetro de Cintura',
    timezone: 'Zona Horaria',
    
    // Emergency
    emergencyContacts: 'Contactos de Emergencia',
    addContact: 'Añadir',
    editContact: 'Editar Contacto',
    name: 'Nombre',
    relationship: 'Relación',
    relationshipSpouse: 'Cónyuge/Pareja',
    relationshipParent: 'Padre/Madre',
    relationshipSibling: 'Hermano/Hermana',
    relationshipChild: 'Hijo/Hija',
    relationshipFriend: 'Amigo',
    relationshipOther: 'Otro',
    selectRelationship: 'Seleccionar relación',
    mobilePhone: 'Teléfono Móvil',
    emailOptional: 'Email (Opcional)',
    nameRequired: 'El nombre es obligatorio',
    relationshipRequired: 'La relación es obligatoria',
    phoneRequired: 'El número de teléfono es obligatorio',
    failedToSave: 'Error al guardar',
    spouse: 'Cónyuge',
    son: 'Hijo',
    daughter: 'Hija',
    emergencyMedicalInfo: 'Información Médica de Emergencia',
    bloodType: 'Tipo de Sangre',
    allergies: 'Alergias',
    conditions: 'Condiciones Clínicas',
    healthProblems: 'Problemas de Salud',
    currentMedications: 'Medicamentos Actuales',
    pregnancyStatus: 'Estado de Embarazo',
    organDonor: 'Donante de Órganos',
    willingToDonate: 'Dispuesto a donar',
    notPregnant: 'No Embarazada',
    pregnant: 'Embarazada',
    unknown: 'Desconocido',
    notApplicable: 'No Aplicable',
    pregnancyNotPregnant: 'No Embarazada',
    pregnancyPregnant: 'Embarazada',
    pregnancyUnknown: 'Desconocido',
    pregnancyNotApplicable: 'No Aplicable',
    selectStatus: 'Seleccionar estado',
    
    // Security
    changePassword: 'Cambiar Contraseña',
    currentPassword: 'Contraseña Actual',
    newPassword: 'Nueva Contraseña',
    confirmNewPassword: 'Confirmar Nueva Contraseña',
    currentPasswordRequired: 'La contraseña actual es obligatoria',
    newPasswordRequired: 'La nueva contraseña es obligatoria',
    passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    passwordChangedSuccessfully: 'Contraseña cambiada con éxito',
    failedToChangePassword: 'Error al cambiar la contraseña',
    lastChanged: 'Último cambio',
    twoFactorAuth: 'Autenticación de Dos Factores',
    twoFactorDescription: 'La autenticación de dos factores añade una capa adicional de seguridad a su cuenta al requerir un código de verificación además de su contraseña.',
    twoFactorEnabledInfo: 'La autenticación de dos factores está actualmente habilitada. Se le pedirá un código de verificación al iniciar sesión.',
    disableTwoFactorConfirm: '¿Está seguro de que desea desactivar la autenticación de dos factores?',
    enableTwoFactorInfo: 'Para habilitar la autenticación de dos factores, necesitará escanear un código QR con una aplicación autenticadora.',
    twoFactorSetupComingSoon: 'La configuración de autenticación de dos factores estará disponible pronto',
    twoFactorDisabled: 'La autenticación de dos factores ha sido desactivada',
    twoFactorComingSoonDescription: 'La autenticación de dos factores está actualmente en desarrollo. Esta función estará disponible en una actualización futura para ayudar a mantener su cuenta aún más segura.',
    twoFactorFeature1: 'Soporte para aplicaciones autenticadoras (Google Authenticator, Authy, etc.)',
    twoFactorFeature2: 'Códigos de respaldo por SMS para recuperación de cuenta',
    twoFactorFeature3: 'Seguridad mejorada para sus datos de salud',
    understood: 'Entendido',
    comingSoon: 'Próximamente',
    continue: 'Continuar',
    disable: 'Desactivar',
    enable: 'Habilitar',
    enabled: 'Activada',
    disabled: 'Desactivada',
    connectedDevices: 'Dispositivos Conectados',
    activeDevices: 'dispositivos activos',
    success: 'Éxito',
    error: 'Error',
    ok: 'OK',
    
    // Permissions
    currentAccess: 'Accesos Actuales',
    revokedAccess: 'Accesos Revocados',
    accessLogs: 'Registros de Acceso',
    healthProfessionals: 'Profesionales de Salud',
    familyFriends: 'Familia y Amigos',
    accessGranted: 'Acceso concedido en',
    accessExpires: 'Expira en',
    revoked: 'Revocado',
    revoke: 'Revocar',
    restoreAccess: 'Restaurar Acceso',
    addNewAccess: 'Añadir Nuevo Acceso',
    sharingOptions: 'Opciones de Compartir',
    
    // Integrations
    connected: 'Conectado',
    notConnected: 'No conectado',
    healthConnect: 'Health Connect',
    appleHealth: 'Apple Health',
    fitbit: 'Fitbit',
    garmin: 'Garmin',
    polar: 'Polar',
    samsungHealth: 'Samsung Health',
    withings: 'Withings',
    strava: 'Strava',
    googleFit: 'Google Fit',
    omronConnect: 'Omron Connect',
    suunto: 'Suunto',
    oura: 'Oura',
    iHealth: 'iHealth',
    beurer: 'Beurer',
    huaweiHealth: 'Huawei Health',
    dexcom: 'Dexcom',
    whoop: 'Whoop',
    decathlon: 'Decathlon',
    androidOnly: 'Solo Android',
    iosOnly: 'Solo iOS',
    
    // Notifications
    emailNotifications: 'Email',
    pushNotifications: 'Push',
    appointmentReminders: 'Recordatorios de Citas',
    appointmentRemindersDesc: 'Reciba recordatorios 24h antes de sus citas',
    medicationReminders: 'Recordatorios de Medicamentos',
    medicationRemindersDesc: 'Reciba recordatorios para tomar sus medicamentos',
    messages: 'Mensajes',
    messagesDesc: 'Reciba notificaciones de nuevos mensajes',
    healthRecommendations: 'Recomendaciones de Salud',
    healthRecommendationsDesc: 'Reciba consejos y recomendaciones personalizadas',
    
    // Preferences
    language: 'Idioma',
    portuguesePortugal: 'Português (Portugal)',
    spanishSpain: 'Español (España)',
    englishUsa: 'English (USA)',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    accessibility: 'Accesibilidad',
    textSize: 'Tamaño del Texto',
    small: 'Pequeño',
    normal: 'Normal',
    large: 'Grande',
    higherContrast: 'Mayor Contraste',
    higherContrastDesc: 'Aumenta el contraste para mejor visibilidad',
    reduceMotion: 'Reducir Movimiento',
    reduceMotionDesc: 'Reduce animaciones y efectos visuales',
    
    // Logout
    logout: 'Cerrar Sesión',
    endSession: 'Cerrar Sesión',
    endSessionConfirm: '¿Está seguro de que desea cerrar sesión?',
    areYouSure: '¿Está seguro?',
    
    // Days
    sunday: 'Domingo',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    
    // Months
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre',

    // Records page
    healthRecords: 'Registros de Salud',
    summary: 'Resumen',
    history: 'Historia',
    analyses: 'Análisis',
    vitals: 'Signos Vitales',
    body: 'Cuerpo',
    vaccines: 'Vacunas',
    assessment: 'Evaluación General',
    areasOfConcern: 'Áreas de Preocupación',
    positiveProgress: 'Progreso Positivo',
    recommendations: 'Recomendaciones',
    noDataAvailable: 'No hay datos disponibles',
    recommendedForYou: 'Recomendado para Ti',
    recentlyUpdated: 'Actualizado Recientemente',
    medicalData: 'Datos Médicos',
    wellbeing: 'Bienestar',
    wellness: 'Bienestar',
    wellnessDescription: 'Cuerpo, Signos Vitales y Estilo de Vida',
    analysis: 'Análisis',
    analysisDescription: 'Análisis de salud e insights',
    currentMedicalConditions: 'Condiciones Médicas Actuales',
    previousMedicalConditions: 'Condiciones Médicas Anteriores',
    familyHistory: 'Historia Familiar',
    additionalInfo: 'Información Adicional',
    surgeries: 'Cirugías',
    regularMedication: 'Medicación Regular',
    hematology: 'Hematología',
    biochemistry: 'Bioquímica',
    documents: 'Documentos',
    addMetric: 'Añadir Métrica',
    uploadDocument: 'Cargar Documento',
    addMeasurement: 'Añadir Medición',
    addMetricTitle: 'Añadir Medición',
    measurementType: 'Tipo de Medición',
    enterValue: 'Introduzca el valor',
    notesOptional: 'Notas (opcional)',
    addNotes: 'Añada notas u observaciones',
    saveMeasurement: 'Guardar',
    heartRate: 'Frecuencia Cardíaca',
    bloodPressure: 'Presión Arterial',
    glucose: 'Glucosa',
    bodyFat: 'Masa Grasa',
    steps: 'Pasos',
    sleep: 'Sueño',
    uploadDocumentTitle: 'Subir Documento',
    documentType: 'Tipo de Documento',
    documentDetails: 'Detalles del Documento',
    documentName: 'Nombre del Documento',
    documentNamePlaceholder: 'Ej: Análisis de Sangre',
    documentDate: 'Fecha del Documento',
    documentDatePlaceholder: 'DD/MM/AAAA',
    doctorInstitution: 'Médico/Institución',
    doctorPlaceholder: 'Nombre del médico o institución',
    selectFile: 'Seleccionar Archivo',
    supportedFormats: 'Formatos soportados: PDF, JPG, PNG',
    saveDocument: 'Guardar Documento',
    measurementSaved: 'Medición guardada con éxito',
    documentSaved: 'Documento guardado con éxito',
    failedToSave: 'Error al guardar',
    selectHealthRecordType: 'Seleccionar Tipo de Registro',
    selectSection: 'Seleccionar Sección',
    selectSectionPlaceholder: 'Seleccionar una sección...',
    searchSections: 'Buscar secciones...',
    noSectionsFound: 'No se encontraron secciones',
    createNewSection: 'Crear Nueva Sección',
    sectionName: 'Nombre de la Sección',
    sectionNamePlaceholder: 'ej., Hematología',
    sectionDescription: 'Descripción',
    sectionDescriptionPlaceholder: 'Descripción de la sección...',
    selectMetric: 'Seleccionar Métrica',
    selectMetricPlaceholder: 'Buscar o escribir nombre de métrica...',
    searchMetrics: 'Buscar métricas...',
    noMetricsFound: 'No se encontraron métricas',
    createCustomMetric: 'Crear Métrica Personalizada',
    metricName: 'Nombre de la Métrica',
    metricNamePlaceholder: 'ej., glucosa',
    metricDisplayName: 'Nombre para Mostrar',
    metricDisplayNamePlaceholder: 'ej., Glucosa en Sangre',
    metricUnit: 'Unidad',
    metricUnitPlaceholder: 'ej., mg/dL, mmol/L, %',
    referenceRange: 'Rango de Referencia',
    referenceRangeMin: 'Mín',
    referenceRangeMax: 'Máx',
    referenceRangeMinPlaceholder: 'ej., 70',
    referenceRangeMaxPlaceholder: 'ej., 100',
    metricDescription: 'Descripción',
    metricDescriptionPlaceholder: 'Descripción de la métrica...',
    createSection: 'Crear Sección',
    createMetric: 'Crear Métrica',
    creating: 'Creando...',
    sectionCreated: 'Sección creada con éxito',
    metricCreated: 'Métrica creada con éxito',
    failedToCreateSection: 'Error al crear sección',
    failedToCreateMetric: 'Error al crear métrica',
    pleaseSelectSection: 'Por favor selecciona una sección',
    pleaseEnterMetricName: 'Por favor introduce un nombre de métrica',
    pleaseEnterValidNumbers: 'Por favor introduce números válidos',
    minMustBeLessThanMax: 'El valor mínimo debe ser menor que el máximo',
    fromTemplate: 'Del Modelo',
    custom: 'Personalizada',
    existing: 'Métricas Existentes',
    addActivity: 'Añadir Actividad',
    nextVaccines: 'Próximas Vacunas',
    administeredVaccines: 'Vacunas Administradas',
    addVaccine: 'Añadir Vacuna',
    annual: 'Anual',
    every10Years: 'Cada 10 años',
    dose: 'Dosis',
    statusNormal: 'Normal',
    statusAbnormal: 'Anormal',
    reference: 'Ref',
    lastMeasurement: 'Última medición',
    height: 'Altura',
    weight: 'Peso',
    bmi: 'IMC',
    bodyFat: 'Grasa Corporal',
    muscleMass: 'Masa Muscular',
    waterPercentage: 'Porcentaje de Agua',
    steps: 'Pasos',
    sleepQuality: 'Calidad del Sueño',
    stressLevel: 'Nivel de Estrés',
    screenTime: 'Tiempo de Pantalla',
    exerciseMinutes: 'Minutos de Ejercicio',
    
    // Exams
    exams: 'Exámenes',
    medicalExams: 'Exámenes Médicos',
    aiMedicalExamsAnalysis: 'Análisis de Exámenes Médicos por IA',
    examType: 'Tipo de Examen',
    examDate: 'Fecha',
    examRegion: 'Región',
    conclusion: 'Conclusión',
    risk: 'Riesgo',
    lowRiskFindings: 'Hallazgos de Bajo Riesgo',
    moderateRiskFindings: 'Hallazgos de Riesgo Moderado',
    highRiskFindings: 'Hallazgos de Alto Riesgo',
    viewExam: 'Ver',
    editExam: 'Editar',
    uploadExam: 'Cargar Examen',
    aiExamsDisclaimer: 'Los resúmenes de salud generados por IA tienen un carácter meramente informativo y no sustituyen el asesoramiento, diagnóstico o tratamiento médico. Consulte siempre a un profesional de salud cualificado para obtener asesoramiento médico personalizado.',
    
    // Appointments page
    upcoming: 'Próximas',
    past: 'Anteriores',
    cancelled: 'Canceladas',
    addAppointment: 'Agendar Cita',
    inPerson: 'Presencial',
    byVideo: 'Video',
    byPhone: 'Teléfono',
    noAppointments: 'No hay citas',
    cancelAppointment: 'Cancelar Cita',
    rescheduleAppointment: 'Reagendar',
    
    // Metabolic Age
    good: 'BIEN',
    attention: 'ATENCIÓN',
    
    // AI Insights
    aiEvaluation: 'Evaluación General',
    bloodAnalysis: 'Análisis Sanguíneos',
    vitalSigns: 'Signos Vitales',
    bodyComposition: 'Composición Corporal',
    lifestyleInsight: 'Estilo de Vida',
    slightlyElevatedGlucose: 'Niveles de glucosa ligeramente elevados',
    activityBelowTarget: 'Actividad física por debajo del objetivo',
    bloodPressureNormal: 'Presión arterial dentro de los valores normales',
    sleepQualityImproved: 'Calidad del sueño mejorada',
    cholesterolStable: 'Niveles de colesterol estables',
    reduceRefinedSugars: 'Reducir el consumo de azúcares refinados',
    increaseDailyWalks: 'Aumentar las caminatas diarias',
    maintainSleepRoutine: 'Mantener la rutina de sueño regular',
    glucoseTrending: 'Tendencia de aumento en los últimos 3 meses',
    hdlPositive: 'HDL (colesterol bueno) con tendencia positiva',
    ldlDecreasing: 'LDL (colesterol malo) con tendencia a disminuir',
    increaseFiber: 'Aumentar la actividad física',
    improveInsulinSensitivity: 'Mejorar la sensibilidad a la insulina',
    repeatGlucoseTest: 'Repetir análisis de glucosa en 3 meses',
    bloodPressureVariations: 'Ligeras variaciones en la presión arterial durante el día',
    heartRateStable: 'Frecuencia cardíaca estable y dentro de los valores normales',
    oxygenSaturationExcellent: 'Saturación de oxígeno excelente',
    bodyTempConsistent: 'Temperatura corporal consistentemente normal',
    monitorBloodPressure: 'Continuar monitoreando la presión arterial regularmente',
    moderateExercise: 'Mantener la práctica de ejercicio físico moderado',
    avoidExcessSalt: 'Evitar el consumo excesivo de sal',
    bmiIdeal: 'IMC dentro del rango ideal',
    bodyFatAdequate: 'Porcentaje de grasa corporal adecuado',
    waistHeightHealthy: 'Relación cintura-altura saludable',
    maintainActivity: 'Mantener la actividad física regular',
    adequateProtein: 'Garantizar ingesta adecuada de proteínas',
    balancedDiet: 'Continuar con alimentación equilibrada',
    activityBelowGoal: 'Actividad física por debajo del objetivo (8.500 pasos vs. 10.000)',
    screenTimeHigh: 'Tiempo de pantalla ocasionalmente por encima de lo recomendado',
    sleepImproved: 'Calidad del sueño mejorada en las últimas semanas',
    stressLow: 'Niveles de estrés generalmente bajos',
    exerciseConsistent: 'Buena consistencia en la práctica de ejercicios',
    includeMoreWalking: 'Incluir más caminatas en el día a día',
    regularBreaks: 'Implementar pausas regulares durante el uso de dispositivos electrónicos',
    
    // Health plan
    dailyWalk: 'Caminata diaria',
    reduceSaturatedFat: 'Reducir consumo de grasas saturadas',
    increaseFiberIntake: 'Aumentar consumo de fibra',
    reduceSalt: 'Reducir consumo de sal',
    relaxationTechniques: 'Practicar técnicas de relajación',
    daily: 'Diariamente',
    weekly: 'Semanalmente',
    minutes: 'minutos',
    duringDay: 'Durante el día',
    atMeals: 'En las comidas',
    completed: 'Completo',
    notCompleted: 'No completo',
    in: 'en',
    
    // Medication
    medicationName: 'Nombre del Medicamento',
    dosage: 'Dosificación',
    frequency: 'Frecuencia',
    time: 'Hora',
    instructions: 'Instrucciones',
    addMedication: 'Añadir Medicamento',
    takeMedication: 'Tomar Medicamento',
    
    // Common time related
    morning: 'Mañana',
    afternoon: 'Tarde',
    evening: 'Final de la tarde',
    night: 'Noche',
  },
  'en-US': {
    // Tab names
    tabPanel: 'Dashboard',
    tabRecords: 'Records',
    tabPlans: 'Plan',
    tabMedications: 'Medication',
    tabAppointments: 'Appointments',

    // Profile tabs
    profileTitle: 'Profile and Settings',
    profilePersonalData: 'Personal Data',
    profileEmergency: 'Emergency',
    profileSecurity: 'Security',
    profilePermissions: 'Permissions',
    profileIntegrations: 'Integrations',
    profileNotifications: 'Notifications',
    profilePreferences: 'Preferences',

    // Common
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    save: 'Save',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    loading: 'Loading data...',
    notDefined: 'Not defined',
    none: 'None',
    validationError: 'Validation Error',
    fieldRequired: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    uploadFailed: 'Upload Failed',
    failedToUpdate: 'Failed to update profile',
    permissionRequired: 'Please grant permission to access your photos to upload a profile picture.',
    
    // Auth
    login: 'Login',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    register: 'Register',
    createAccount: 'Create Account',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    forgotPassword: 'Forgot password?',
    continueWithGoogle: 'Continue with Google',
    or: 'or',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterName: 'Enter your name',
    confirmPassword: 'Confirm Password',
    createPassword: 'Create a password',
    yourHealthOnePlace: 'Your Health, In One Place',
    joinSaluso: 'Join Saluso to manage your health',
    fillAllFields: 'Please fill in all fields',
    password: 'Password',
    
    // Dashboard
    healthSummary: 'Health summary - current status and progress',
    generalHealth: 'General Health',
    weekStatus: 'Week status',
    thisWeek: 'This week',
    activities: 'Activities',
    lifestyle: 'Lifestyle',
    latestMeasurements: 'Latest Measurements',
    healthPlan: 'Health Plan',
    metabolicAge: 'Metabolic Age',
    metabolicAgeGood: 'Your metabolic age is {diff} years below your actual age. Excellent!',
    metabolicAgeWarning: 'Your metabolic age is {diff} years above your actual age. Focus on improving!',
    metabolicAgeRecommendations: 'Recommendations to Improve Metabolic Age',
    dailyActivities: 'Daily activities',
    noActivitiesScheduled: 'No activities scheduled for this day.',
    medications: 'Medications',
    appointments: 'Appointments',
    vsPreviousWeek: 'vs previous week',
    planned: 'planned',
    
    // Personal Data
    fullName: 'Full Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    birthDate: 'Date of Birth',
    email: 'Email',
    phone: 'Phone',
    mobileNumber: 'Mobile Number',
    address: 'Address',
    location: 'Location',
    postalCode: 'Postal Code',
    city: 'City',
    gender: 'Gender',
    height: 'Height',
    weight: 'Weight',
    waistDiameter: 'Waist Diameter',
    timezone: 'Timezone',
    
    // Emergency
    emergencyContacts: 'Emergency Contacts',
    addContact: 'Add',
    editContact: 'Edit Contact',
    name: 'Name',
    relationship: 'Relationship',
    relationshipSpouse: 'Spouse/Partner',
    relationshipParent: 'Parent',
    relationshipSibling: 'Sibling',
    relationshipChild: 'Child',
    relationshipFriend: 'Friend',
    relationshipOther: 'Other',
    selectRelationship: 'Select relationship',
    mobilePhone: 'Mobile Phone',
    emailOptional: 'Email (Optional)',
    nameRequired: 'Name is required',
    relationshipRequired: 'Relationship is required',
    phoneRequired: 'Phone number is required',
    failedToSave: 'Failed to save',
    spouse: 'Spouse',
    son: 'Son',
    daughter: 'Daughter',
    emergencyMedicalInfo: 'Emergency Medical Information',
    bloodType: 'Blood Type',
    allergies: 'Allergies',
    conditions: 'Clinical Conditions',
    healthProblems: 'Health Problems',
    currentMedications: 'Current Medications',
    pregnancyStatus: 'Pregnancy Status',
    organDonor: 'Organ Donor',
    willingToDonate: 'Willing to donate',
    notPregnant: 'Not Pregnant',
    pregnant: 'Pregnant',
    unknown: 'Unknown',
    notApplicable: 'Not Applicable',
    pregnancyNotPregnant: 'Not Pregnant',
    pregnancyPregnant: 'Pregnant',
    pregnancyUnknown: 'Unknown',
    pregnancyNotApplicable: 'Not Applicable',
    selectStatus: 'Select status',
    
    // Security
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    currentPasswordRequired: 'Current password is required',
    newPasswordRequired: 'New password is required',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordChangedSuccessfully: 'Password changed successfully',
    failedToChangePassword: 'Failed to change password',
    lastChanged: 'Last changed',
    twoFactorAuth: 'Two-Factor Authentication',
    twoFactorDescription: 'Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.',
    twoFactorEnabledInfo: 'Two-factor authentication is currently enabled. You will be asked for a verification code when signing in.',
    disableTwoFactorConfirm: 'Are you sure you want to disable two-factor authentication?',
    enableTwoFactorInfo: 'To enable two-factor authentication, you will need to scan a QR code with an authenticator app.',
    twoFactorSetupComingSoon: 'Two-factor authentication setup is coming soon',
    twoFactorDisabled: 'Two-factor authentication has been disabled',
    twoFactorComingSoonDescription: 'Two-factor authentication is currently under development. This feature will be available in a future update to help keep your account even more secure.',
    twoFactorFeature1: 'Authenticator app support (Google Authenticator, Authy, etc.)',
    twoFactorFeature2: 'SMS backup codes for account recovery',
    twoFactorFeature3: 'Enhanced security for your health data',
    understood: 'Understood',
    comingSoon: 'Coming Soon',
    continue: 'Continue',
    disable: 'Disable',
    enable: 'Enable',
    enabled: 'Enabled',
    disabled: 'Disabled',
    connectedDevices: 'Connected Devices',
    activeDevices: 'active devices',
    success: 'Success',
    error: 'Error',
    ok: 'OK',
    
    // Permissions
    currentAccess: 'Current Access',
    revokedAccess: 'Revoked Access',
    accessLogs: 'Access Logs',
    healthProfessionals: 'Health Professionals',
    familyFriends: 'Family & Friends',
    accessGranted: 'Access granted on',
    accessExpires: 'Expires on',
    revoked: 'Revoked',
    revoke: 'Revoke',
    restoreAccess: 'Restore Access',
    addNewAccess: 'Add New Access',
    sharingOptions: 'Sharing Options',
    
    // Integrations
    connected: 'Connected',
    notConnected: 'Not connected',
    healthConnect: 'Health Connect',
    appleHealth: 'Apple Health',
    fitbit: 'Fitbit',
    garmin: 'Garmin',
    polar: 'Polar',
    samsungHealth: 'Samsung Health',
    withings: 'Withings',
    strava: 'Strava',
    googleFit: 'Google Fit',
    omronConnect: 'Omron Connect',
    suunto: 'Suunto',
    oura: 'Oura',
    iHealth: 'iHealth',
    beurer: 'Beurer',
    huaweiHealth: 'Huawei Health',
    dexcom: 'Dexcom',
    whoop: 'Whoop',
    decathlon: 'Decathlon',
    androidOnly: 'Android Only',
    iosOnly: 'iOS Only',
    
    // Notifications
    emailNotifications: 'Email',
    pushNotifications: 'Push',
    appointmentReminders: 'Appointment Reminders',
    appointmentRemindersDesc: 'Receive reminders 24h before your appointments',
    medicationReminders: 'Medication Reminders',
    medicationRemindersDesc: 'Receive reminders to take your medications',
    messages: 'Messages',
    messagesDesc: 'Receive notifications for new messages',
    healthRecommendations: 'Health Recommendations',
    healthRecommendationsDesc: 'Receive personalized tips and recommendations',
    
    // Preferences
    language: 'Language',
    portuguesePortugal: 'Português (Portugal)',
    spanishSpain: 'Español (España)',
    englishUsa: 'English (USA)',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    accessibility: 'Accessibility',
    textSize: 'Text Size',
    small: 'Small',
    normal: 'Normal',
    large: 'Large',
    higherContrast: 'Higher Contrast',
    higherContrastDesc: 'Increases contrast for better visibility',
    reduceMotion: 'Reduce Motion',
    reduceMotionDesc: 'Reduces animations and visual effects',
    
    // Logout
    logout: 'Log Out',
    endSession: 'End Session',
    endSessionConfirm: 'Are you sure you want to end your session?',
    areYouSure: 'Are you sure?',
    
    // Days
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    
    // Months
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',

    // Records page
    healthRecords: 'Health Records',
    summary: 'Summary',
    history: 'History',
    analyses: 'Analysis',
    vitals: 'Vitals',
    body: 'Body',
    vaccines: 'Vaccines',
    assessment: 'General Assessment',
    areasOfConcern: 'Areas of Concern',
    positiveProgress: 'Positive Progress',
    recommendations: 'Recommendations',
    noDataAvailable: 'No data available',
    recommendedForYou: 'Recommended for You',
    recentlyUpdated: 'Recently Updated',
    medicalData: 'Medical Data',
    wellbeing: 'Wellbeing',
    wellness: 'Wellness',
    wellnessDescription: 'Body, Vitals, and Lifestyle',
    analysis: 'Analysis',
    analysisDescription: 'Health analysis and insights',
    currentMedicalConditions: 'Current Medical Conditions',
    previousMedicalConditions: 'Previous Medical Conditions',
    familyHistory: 'Family History',
    additionalInfo: 'Additional Information',
    surgeries: 'Surgeries',
    regularMedication: 'Regular Medication',
    hematology: 'Hematology',
    biochemistry: 'Biochemistry',
    documents: 'Documents',
    addMetric: 'Add Metric',
    uploadDocument: 'Upload Document',
    addMeasurement: 'Add Measurement',
    addMetricTitle: 'Add Measurement',
    measurementType: 'Measurement Type',
    enterValue: 'Enter value',
    notesOptional: 'Notes (optional)',
    addNotes: 'Add notes or observations',
    saveMeasurement: 'Save',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    glucose: 'Glucose',
    bodyFat: 'Body Fat',
    steps: 'Steps',
    sleep: 'Sleep',
    uploadDocumentTitle: 'Upload Document',
    documentType: 'Document Type',
    documentDetails: 'Document Details',
    documentName: 'Document Name',
    documentNamePlaceholder: 'e.g., Blood Test',
    documentDate: 'Document Date',
    documentDatePlaceholder: 'MM/DD/YYYY',
    doctorInstitution: 'Doctor/Institution',
    doctorPlaceholder: 'Doctor or institution name',
    selectFile: 'Select File',
    supportedFormats: 'Supported formats: PDF, JPG, PNG',
    saveDocument: 'Save Document',
    measurementSaved: 'Measurement saved successfully',
    documentSaved: 'Document saved successfully',
    failedToSave: 'Failed to save',
    selectHealthRecordType: 'Select Health Record Type',
    selectSection: 'Select Section',
    selectSectionPlaceholder: 'Select a section...',
    searchSections: 'Search sections...',
    noSectionsFound: 'No sections found',
    createNewSection: 'Create New Section',
    sectionName: 'Section Name',
    sectionNamePlaceholder: 'e.g., Hematology',
    sectionDescription: 'Description',
    sectionDescriptionPlaceholder: 'Section description...',
    selectMetric: 'Select Metric',
    selectMetricPlaceholder: 'Search or type metric name...',
    searchMetrics: 'Search metrics...',
    noMetricsFound: 'No metrics found',
    createCustomMetric: 'Create Custom Metric',
    metricName: 'Metric Name',
    metricNamePlaceholder: 'e.g., glucose',
    metricDisplayName: 'Display Name',
    metricDisplayNamePlaceholder: 'e.g., Blood Glucose',
    metricUnit: 'Unit',
    metricUnitPlaceholder: 'e.g., mg/dL, mmol/L, %',
    referenceRange: 'Reference Range',
    referenceRangeMin: 'Min',
    referenceRangeMax: 'Max',
    referenceRangeMinPlaceholder: 'e.g., 70',
    referenceRangeMaxPlaceholder: 'e.g., 100',
    metricDescription: 'Description',
    metricDescriptionPlaceholder: 'Metric description...',
    createSection: 'Create Section',
    createMetric: 'Create Metric',
    creating: 'Creating...',
    sectionCreated: 'Section created successfully',
    metricCreated: 'Metric created successfully',
    failedToCreateSection: 'Failed to create section',
    failedToCreateMetric: 'Failed to create metric',
    pleaseSelectSection: 'Please select a section',
    pleaseEnterMetricName: 'Please enter a metric name',
    pleaseEnterValidNumbers: 'Please enter valid numbers',
    minMustBeLessThanMax: 'Minimum value must be less than maximum',
    fromTemplate: 'From Template',
    custom: 'Custom',
    existing: 'Existing Metrics',
    addActivity: 'Add Activity',
    nextVaccines: 'Upcoming Vaccines',
    administeredVaccines: 'Administered Vaccines',
    addVaccine: 'Add Vaccine',
    annual: 'Annual',
    every10Years: 'Every 10 years',
    dose: 'Dose',
    statusNormal: 'Normal',
    statusAbnormal: 'Abnormal',
    reference: 'Ref',
    lastMeasurement: 'Last measurement',
    height: 'Height',
    weight: 'Weight',
    bmi: 'BMI',
    bodyFat: 'Body Fat',
    muscleMass: 'Muscle Mass',
    waterPercentage: 'Water Percentage',
    steps: 'Steps',
    sleepQuality: 'Sleep Quality',
    stressLevel: 'Stress Level',
    screenTime: 'Screen Time',
    exerciseMinutes: 'Exercise Minutes',
    
    // Exams
    exams: 'Exams',
    medicalExams: 'Medical Exams',
    aiMedicalExamsAnalysis: 'AI Medical Exams Analysis',
    examType: 'Exam Type',
    examDate: 'Date',
    examRegion: 'Region',
    conclusion: 'Conclusion',
    risk: 'Risk',
    lowRiskFindings: 'Low Risk Findings',
    moderateRiskFindings: 'Moderate Risk Findings',
    highRiskFindings: 'High Risk Findings',
    viewExam: 'View',
    editExam: 'Edit',
    uploadExam: 'Upload Exam',
    aiExamsDisclaimer: 'AI-generated health summaries are for informational purposes only and do not replace medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for personalized medical advice.',
    
    // Appointments page
    upcoming: 'Upcoming',
    past: 'Past',
    cancelled: 'Cancelled',
    addAppointment: 'Schedule Appointment',
    inPerson: 'In Person',
    byVideo: 'Video',
    byPhone: 'Phone',
    noAppointments: 'No appointments',
    cancelAppointment: 'Cancel Appointment',
    rescheduleAppointment: 'Reschedule',
    
    // Metabolic Age
    good: 'GOOD',
    attention: 'ATTENTION',
    
    // AI Insights
    aiEvaluation: 'General Assessment',
    bloodAnalysis: 'Blood Analysis',
    vitalSigns: 'Vital Signs',
    bodyComposition: 'Body Composition',
    lifestyleInsight: 'Lifestyle',
    slightlyElevatedGlucose: 'Slightly elevated glucose levels',
    activityBelowTarget: 'Physical activity below target',
    bloodPressureNormal: 'Blood pressure within normal values',
    sleepQualityImproved: 'Sleep quality improved',
    cholesterolStable: 'Cholesterol levels stable',
    reduceRefinedSugars: 'Reduce refined sugar intake',
    increaseDailyWalks: 'Increase daily walks',
    maintainSleepRoutine: 'Maintain regular sleep routine',
    glucoseTrending: 'Trending up over the last 3 months',
    hdlPositive: 'HDL (good cholesterol) with positive trend',
    ldlDecreasing: 'LDL (bad cholesterol) trending down',
    increaseFiber: 'Increase physical activity',
    improveInsulinSensitivity: 'Improve insulin sensitivity',
    repeatGlucoseTest: 'Repeat glucose test in 3 months',
    bloodPressureVariations: 'Slight variations in blood pressure during the day',
    heartRateStable: 'Heart rate stable and within normal values',
    oxygenSaturationExcellent: 'Oxygen saturation excellent',
    bodyTempConsistent: 'Body temperature consistently normal',
    monitorBloodPressure: 'Continue to monitor blood pressure regularly',
    moderateExercise: 'Maintain moderate physical exercise practice',
    avoidExcessSalt: 'Avoid excessive salt consumption',
    bmiIdeal: 'BMI within ideal range',
    bodyFatAdequate: 'Adequate body fat percentage',
    waistHeightHealthy: 'Healthy waist-to-height ratio',
    maintainActivity: 'Maintain regular physical activity',
    adequateProtein: 'Ensure adequate protein intake',
    balancedDiet: 'Continue with balanced diet',
    activityBelowGoal: 'Physical activity below goal (8,500 steps vs. 10,000)',
    screenTimeHigh: 'Screen time occasionally above recommended',
    sleepImproved: 'Sleep quality improved in recent weeks',
    stressLow: 'Stress levels generally low',
    exerciseConsistent: 'Good consistency in exercise practice',
    includeMoreWalking: 'Include more walking in daily routine',
    regularBreaks: 'Implement regular breaks during electronic device use',
    
    // Health plan
    dailyWalk: 'Daily walk',
    reduceSaturatedFat: 'Reduce saturated fat intake',
    increaseFiberIntake: 'Increase fiber intake',
    reduceSalt: 'Reduce salt intake',
    relaxationTechniques: 'Practice relaxation techniques',
    daily: 'Daily',
    weekly: 'Weekly',
    minutes: 'minutes',
    duringDay: 'During the day',
    atMeals: 'At meals',
    completed: 'Completed',
    notCompleted: 'Not completed',
    in: 'in',
    
    // Medication
    medicationName: 'Medication Name',
    dosage: 'Dosage',
    frequency: 'Frequency',
    time: 'Time',
    instructions: 'Instructions',
    addMedication: 'Add Medication',
    takeMedication: 'Take Medication',
    
    // Common time related
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
  },
};

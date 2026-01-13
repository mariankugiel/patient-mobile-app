export type Language = 'pt-PT' | 'es-ES' | 'en-US';

export interface Translations {
  // Tab names
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
  mobileHealthServices: string;
  webServices: string;
  healthConnect: string;
  appleHealth: string;
  samsungHealth: string;
  googleFit: string;
  connecting: string;
  connectionSuccess: string;
  connectionFailed: string;
  permissionDenied: string;
  serviceUnavailable: string;
  disconnectConfirm: string;
  integrationsDescription: string;
  disconnected: string;
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
  salusoSupport: string;
  aiAssistant: string;
  typeMessage: string;
  send: string;
  noConversations: string;
  noMessages: string;
  typing: string;
  messageSent: string;
  failedToSend: string;
  attachFile: string;
  uploading: string;
  startConversation: string;
  noMessagesYet: string;
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
  surgeriesHospitalizations: string;
  activeConditions: string;
  resolvedConditions: string;
  familyConditions: string;
  previousSurgeriesDesc: string;
  surgery: string;
  hospitalization: string;
  bodyArea: string;
  reason: string;
  diagnosed: string;
  treatment: string;
  resolved: string;
  resolvedDate: string;
  ageOfOnset: string;
  relation: string;
  outcome: string;
  notes: string;
  currentStatus: string;
  statusControlled: string;
  statusPartiallyControlled: string;
  statusUncontrolled: string;
  recoveryFull: string;
  recoveryPartial: string;
  recoveryNone: string;
  date: string;
  noSurgeriesHospitalizations: string;
  noSurgeriesHospitalizationsDesc: string;
  noCurrentConditions: string;
  noCurrentConditionsDesc: string;
  noPastConditions: string;
  noPastConditionsDesc: string;
  noFamilyHistory: string;
  noFamilyHistoryDesc: string;
  loadingCurrentConditions: string;
  loadingPastConditions: string;
  loadingFamilyHistory: string;
  errorLoadingCurrentConditions: string;
  errorLoadingPastConditions: string;
  errorLoadingFamilyHistory: string;
  deceased: string;
  alive: string;
  ageAtDeath: string;
  causeOfDeath: string;
  currentAge: string;
  chronicDiseases: string;
  diagnosedAtAge: string;
  condition: string;
  conditionName: string;
  conditionNameRequired: string;
  dateDiagnosed: string;
  dateDiagnosedRequired: string;
  dateResolved: string;
  dateResolvedRequired: string;
  conditionUpdated: string;
  deleteCurrentConditionConfirm: string;
  deletePastConditionConfirm: string;
  deleteFamilyHistoryConfirm: string;
  deleteSurgeryConfirm: string;
  surgeryUpdated: string;
  procedureNameRequired: string;
  procedureDateRequired: string;
  conditionDetails: string;
  familyHistoryDetails: string;
  surgeryDetails: string;
  editCondition: string;
  editFamilyHistory: string;
  editSurgeryHospitalization: string;
  relationRequired: string;
  enterConditionName: string;
  enterProcedureName: string;
  enterReason: string;
  enterTreatment: string;
  enterBodyArea: string;
  procedureType: string;
  procedureName: string;
  procedureDate: string;
  recoveryStatus: string;
  currentTreatment: string;
  additionalNotes: string;
  enterRelation: string;
  disease: string;
  diseaseName: string;
  ageAtDiagnosis: string;
  comments: string;
  enterCauseOfDeath: string;
  selectRelation: string;
  familyHistoryUpdated: string;
  relationMother: string;
  relationFather: string;
  relationMaternalGrandmother: string;
  relationMaternalGrandfather: string;
  relationPaternalGrandmother: string;
  relationPaternalGrandfather: string;
  relationSister: string;
  relationBrother: string;
  relationSon: string;
  relationDaughter: string;
  chronicDiseaseHypertension: string;
  chronicDiseaseIschemicHeartDisease: string;
  chronicDiseaseStroke: string;
  chronicDiseaseType2Diabetes: string;
  chronicDiseaseType1Diabetes: string;
  chronicDiseaseCancer: string;
  chronicDiseaseCopd: string;
  chronicDiseaseAsthma: string;
  chronicDiseaseArthritis: string;
  chronicDiseaseBackProblems: string;
  chronicDiseaseChronicKidneyDisease: string;
  chronicDiseaseHighCholesterol: string;
  chronicDiseaseObesity: string;
  chronicDiseaseDepression: string;
  chronicDiseaseOsteoporosis: string;
  chronicDiseaseNeurodegenerative: string;
  chronicDiseaseChronicLiverDisease: string;
  chronicDiseaseChronicGastrointestinal: string;
  chronicDiseaseThyroidDisorders: string;
  chronicDiseaseAsthmaChronicBronchitis: string;
  chronicDiseaseChronicSkin: string;
  chronicDiseaseChronicDigestive: string;
  chronicDiseaseChronicPain: string;
  chronicDiseaseNeurologicalBeyondDementia: string;
  chronicDiseaseChronicMentalHealth: string;
  chronicDiseaseChronicEyeDiseases: string;
  chronicDiseaseChronicHearing: string;
  chronicDiseaseChronicOralDental: string;
  chronicDiseaseChronicRespiratoryAllergies: string;
  chronicDiseaseChronicUrogenital: string;
  chronicDiseaseChronicMetabolic: string;
  chronicDiseaseOthers: string;
  regularMedication: string;
  hematology: string;
  biochemistry: string;
  documents: string;
  addMetric: string;
  uploadDocument: string;
  addMeasurement: string;
  addMetricTitle: string;
  measurementType: string;
  metrics: string;
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
  aiDisclaimer: string;
  
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
  appointmentsUpcoming: string;
  appointmentsPast: string;
  appointmentsCancelled: string;
  appointmentsNoUpcoming: string;
  appointmentsNoPast: string;
  appointmentsNoCancelled: string;
  appointmentsLoading: string;
  appointmentsJoinCall: string;
  appointmentsViewDetails: string;
  appointmentsViewReport: string;
  appointmentsBookAppointment: string;
  appointmentsDate: string;
  appointmentsTime: string;
  appointmentsType: string;
  appointmentsLocation: string;
  appointmentsNotes: string;
  appointmentsConfirmCancel: string;
  appointmentsCancelConfirmDesc: string;
  appointmentsCancelledSuccess: string;
  
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
  medications: string;
  medicationName: string;
  addMedication: string;
  medicationsAddNewMedication: string;
  medicationsEnterDetails: string;
  medicationsName: string;
  medicationsNamePlaceholder: string;
  medicationsDosage: string;
  medicationsDosagePlaceholder: string;
  medicationsFrequency: string;
  medicationsFrequencyPlaceholder: string;
  medicationsPurpose: string;
  medicationsPurposePlaceholder: string;
  medicationsPrescribedBy: string;
  medicationsPrescribedByPlaceholder: string;
  medicationsSelf: string;
  medicationsStartDate: string;
  medicationsEndDate: string;
  medicationsInstructions: string;
  medicationsInstructionsPlaceholder: string;
  medicationsPrescription: string;
  medicationsPrescriptionInfo: string;
  medicationsRxNumber: string;
  medicationsRxNumberPlaceholder: string;
  medicationsPharmacy: string;
  medicationsPharmacyPlaceholder: string;
  medicationsQuantity: string;
  medicationsQuantityPlaceholder: string;
  medicationsRefillsRemaining: string;
  medicationsRefillsRemainingPlaceholder: string;
  medicationsLastFilled: string;
  medicationsLastRefillDate: string;
  medicationsCurrentMedications: string;
  medicationsPreviousMedications: string;
  medicationsNoCurrentMedications: string;
  medicationsNoCurrentMedicationsDesc: string;
  medicationsNoPreviousMedications: string;
  medicationsNoPreviousMedicationsDesc: string;
  medicationsLoading: string;
  medicationsEndMedication: string;
  medicationsEndMedicationDescription: string;
  medicationsEndNow: string;
  medicationsEnding: string;
  medicationsReasonEnded: string;
  medicationsEndDateMustBeAfterStartDate: string;
  medicationsPleaseFillInName: string;
  medicationsPleaseFillInDosage: string;
  medicationsPleaseFillInFrequency: string;
  medicationsPleaseFillInStartDate: string;
  medicationsPleaseFillInEndDate: string;
  medicationsSaving: string;
  medicationAddedSuccessfully: string;
  medicationAddFailed: string;
  deleteMedicationConfirm: string;
  deleteMedicationConfirmDesc: string;
  retry: string;
  dosage: string;
  frequency: string;
  time: string;
  instructions: string;
  takeMedication: string;
  
  // Common time related
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  
  // Lab document types
  completeBloodCount: string;
  comprehensiveMetabolicPanel: string;
  lipidPanel: string;
  hemoglobinA1C: string;
  other: string;
  
  // Lab documents
  labDocuments: string;
  noDate: string;
  noProvider: string;
  deleteDocument: string;
  deleteDocumentConfirm: string;
  failedToDelete: string;
  noLabDocumentsYet: string;
  uploadLabDocument: string;
  provider: string;
  type: string;
  file: string;
  description: string;
  optional: string;
  selectDocumentType: string;
  healthcareProviderName: string;
  pdfFilesOnly: string;
  addDescriptionPlaceholder: string;
  analyzing: string;
  uploadAndAnalyze: string;
  uploadToHealthRecords: string;
  viewExtractedResults: string;
  metricsFound: string;
  analysisResults: string;
  rejectResults: string;
  confirmResults: string;
  value: string;
  referenceRange: string;
  section: string;
  editHealthRecord: string;
  metricName: string;
  unit: string;
  noMetricsFound: string;
  noResultsToUpload: string;
  duplicateFile: string;
  duplicateFileMessage: string;
  continue: string;
  noUploadResult: string;
  noResults: string;
  noResultsMessage: string;
  failedToAnalyze: string;
    abnormal: string;
    normal: string;
    
    // Medical exams
    uploadMedicalExam: string;
    examDetails: string;
    imageType: string;
    selectImageType: string;
    bodyPart: string;
    bodyPartPlaceholder: string;
    imageDate: string;
    findings: string;
    selectFindings: string;
    interpretation: string;
    interpretationPlaceholder: string;
    conclusions: string;
    conclusionsPlaceholder: string;
    doctorName: string;
    doctorNamePlaceholder: string;
    doctorNumber: string;
    doctorNumberPlaceholder: string;
    xRay: string;
    ultrasound: string;
    mri: string;
    ctScan: string;
    ecg: string;
    others: string;
    noFindings: string;
    lowRiskFindings: string;
    relevantFindings: string;
    fileUploadedAnalyzed: string;
    medicalImageSavedSuccess: string;
    noMedicalExamsYet: string;
    failedToLoadDocument: string;
    documentDeleted: string;
    loadingDocuments: string;
    uploadExam: string;
}

export const translations: Record<Language, Translations> = {
  'pt-PT': {
    // Tab names
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
    mobileHealthServices: 'Serviços de Saúde Móveis',
    webServices: 'Serviços Web',
    healthConnect: 'Health Connect',
    appleHealth: 'Apple Health',
    samsungHealth: 'Samsung Health',
    googleFit: 'Google Fit',
    connecting: 'A conectar...',
    connectionSuccess: 'Ligação bem-sucedida',
    connectionFailed: 'Falha na ligação',
    permissionDenied: 'Permissão negada',
    serviceUnavailable: 'Serviço não disponível neste dispositivo',
    disconnectConfirm: 'Tem a certeza de que deseja desconectar',
    integrationsDescription: 'Conecte os seus dispositivos wearables e aplicações de saúde para sincronizar automaticamente os seus dados de saúde.',
    disconnected: 'Desconectado com sucesso',
    fitbit: 'Fitbit',
    garmin: 'Garmin',
    polar: 'Polar',
    withings: 'Withings',
    strava: 'Strava',
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
    salusoSupport: 'Saluso Support',
    aiAssistant: 'Assistente IA',
    typeMessage: 'Escreva uma mensagem...',
    send: 'Enviar',
    noConversations: 'Nenhuma conversa ainda',
    noMessages: 'Nenhuma mensagem ainda',
    typing: 'a escrever...',
    messageSent: 'Mensagem enviada',
    failedToSend: 'Falha ao enviar mensagem',
    attachFile: 'Anexar ficheiro',
    uploading: 'A carregar...',
    startConversation: 'Iniciar uma conversa com o Saluso Support',
    noMessagesYet: 'Ainda não há mensagens',
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
    surgeriesHospitalizations: 'Cirurgias e Hospitalizações',
    activeConditions: 'Condições ativas que requerem gestão contínua',
    resolvedConditions: 'Condições previamente diagnosticadas que foram resolvidas',
    familyConditions: 'Historial médico de membros da família',
    previousSurgeriesDesc: 'Procedimentos cirúrgicos anteriores e hospitalizações',
    surgery: 'Cirurgia',
    hospitalization: 'Hospitalização',
    bodyArea: 'Área do Corpo',
    reason: 'Motivo',
    diagnosed: 'Diagnosticado',
    treatment: 'Tratamento',
    resolved: 'Resolvido',
    resolvedDate: 'Data de Resolução',
    ageOfOnset: 'Idade de Início',
    relation: 'Relação',
    outcome: 'Resultado',
    notes: 'Notas',
    currentStatus: 'Estado Atual',
    statusControlled: 'Controlado',
    statusPartiallyControlled: 'Parcialmente Controlado',
    statusUncontrolled: 'Não Controlado',
    recoveryFull: 'Recuperação Completa',
    recoveryPartial: 'Recuperação Parcial',
    recoveryNone: 'Sem Recuperação',
    date: 'Data',
    noSurgeriesHospitalizations: 'Nenhuma cirurgia ou hospitalização registada',
    noSurgeriesHospitalizationsDesc: 'Adicione os seus procedimentos cirúrgicos e hospitalizações anteriores',
    noCurrentConditions: 'Nenhuma condição médica atual',
    noCurrentConditionsDesc: 'Adicione as suas condições médicas atuais',
    noPastConditions: 'Nenhuma condição médica anterior',
    noPastConditionsDesc: 'Adicione as suas condições médicas anteriores',
    noFamilyHistory: 'Nenhum historial familiar',
    noFamilyHistoryDesc: 'Adicione o historial médico da sua família',
    loadingCurrentConditions: 'A carregar condições atuais...',
    loadingPastConditions: 'A carregar condições anteriores...',
    loadingFamilyHistory: 'A carregar historial familiar...',
    errorLoadingCurrentConditions: 'Erro ao carregar condições atuais',
    errorLoadingPastConditions: 'Erro ao carregar condições anteriores',
    errorLoadingFamilyHistory: 'Erro ao carregar historial familiar',
    deceased: 'Falecido',
    alive: 'Vivo',
    ageAtDeath: 'Idade à Morte',
    causeOfDeath: 'Causa da Morte',
    currentAge: 'Idade Atual',
    chronicDiseases: 'Doenças Crónicas',
    diagnosedAtAge: 'Diagnosticado aos',
    condition: 'Condição',
    conditionName: 'Nome da Condição',
    conditionNameRequired: 'O nome da condição é obrigatório',
    dateDiagnosed: 'Data de Diagnóstico',
    dateDiagnosedRequired: 'A data de diagnóstico é obrigatória',
    dateResolved: 'Data de Resolução',
    dateResolvedRequired: 'A data de resolução é obrigatória',
    conditionUpdated: 'Condição atualizada com sucesso',
    deleteCurrentConditionConfirm: 'Tem certeza de que deseja excluir esta condição médica? Esta ação não pode ser desfeita.',
    deletePastConditionConfirm: 'Tem certeza de que deseja excluir esta condição médica anterior? Esta ação não pode ser desfeita.',
    deleteFamilyHistoryConfirm: 'Tem certeza de que deseja excluir esta entrada do histórico familiar? Esta ação não pode ser desfeita.',
    deleteSurgeryConfirm: 'Tem certeza de que deseja excluir esta cirurgia/hospitalização? Esta ação não pode ser desfeita.',
    surgeryUpdated: 'Cirurgia/hospitalização atualizada com sucesso',
    procedureNameRequired: 'O nome do procedimento é obrigatório',
    procedureDateRequired: 'A data do procedimento é obrigatória',
    conditionDetails: 'Detalhes da Condição',
    familyHistoryDetails: 'Detalhes do Histórico Familiar',
    surgeryDetails: 'Detalhes da Cirurgia',
    editCondition: 'Editar Condição',
    editFamilyHistory: 'Editar Histórico Familiar',
    editSurgeryHospitalization: 'Editar Cirurgia/Hospitalização',
    relationRequired: 'A relação é obrigatória',
    enterConditionName: 'Digite o nome da condição',
    enterProcedureName: 'Digite o nome do procedimento',
    enterReason: 'Digite o motivo do procedimento',
    enterTreatment: 'Digite os detalhes do tratamento',
    enterBodyArea: 'Digite a área do corpo',
    procedureType: 'Tipo de Procedimento',
    procedureName: 'Nome do Procedimento',
    procedureDate: 'Data do Procedimento',
    recoveryStatus: 'Status de Recuperação',
    currentTreatment: 'Tratamento atual',
    additionalNotes: 'Notas adicionais sobre a condição',
    enterRelation: 'Digite a relação (ex: Pai, Mãe)',
    disease: 'Doença',
    diseaseName: 'Nome da Doença',
    ageAtDiagnosis: 'Idade no Diagnóstico',
    comments: 'Comentários',
    enterCauseOfDeath: 'Digite a causa da morte',
    selectRelation: 'Selecionar relação',
    familyHistoryUpdated: 'Histórico familiar atualizado com sucesso',
    relationMother: 'Mãe',
    relationFather: 'Pai',
    relationMaternalGrandmother: 'Avó Materna',
    relationMaternalGrandfather: 'Avô Materno',
    relationPaternalGrandmother: 'Avó Paterna',
    relationPaternalGrandfather: 'Avô Paterno',
    relationSister: 'Irmã',
    relationBrother: 'Irmão',
    relationSon: 'Filho',
    relationDaughter: 'Filha',
    chronicDiseaseHypertension: 'Hipertensão (pressão arterial alta)',
    chronicDiseaseIschemicHeartDisease: 'Doença Isquémica / Coronária / outras Doenças Cardíacas (ataque cardíaco, doença cardíaca crónica)',
    chronicDiseaseStroke: 'Acidente Vascular Cerebral / Doença Cerebrovascular',
    chronicDiseaseType2Diabetes: 'Diabetes Tipo 2 / Diabetes mellitus',
    chronicDiseaseType1Diabetes: 'Diabetes Tipo 1',
    chronicDiseaseCancer: 'Cancro (vários tipos)',
    chronicDiseaseCopd: 'Doença Pulmonar Obstrutiva Crónica (DPOC)',
    chronicDiseaseAsthma: 'Asma (e outras doenças respiratórias crónicas inferiores)',
    chronicDiseaseArthritis: 'Artrite / Osteoartrite / Artrite Reumatóide (musculoesquelética)',
    chronicDiseaseBackProblems: 'Problemas nas costas / dor crónica nas costas / problemas na coluna (musculoesquelética)',
    chronicDiseaseChronicKidneyDisease: 'Doença Renal Crónica (DRC) / doença renal (frequentemente associada à diabetes)',
    chronicDiseaseHighCholesterol: 'Colesterol Alto / Dislipidemia (como fator de risco / condição crónica)',
    chronicDiseaseObesity: 'Obesidade (como condição crónica / fator de risco)',
    chronicDiseaseDepression: 'Depressão e outros Transtornos Mentais / Comportamentais',
    chronicDiseaseOsteoporosis: 'Osteoporose (e outras doenças ósseas)',
    chronicDiseaseNeurodegenerative: 'Doenças neurodegenerativas (ex. doença de Alzheimer / demência / outras demências)',
    chronicDiseaseChronicLiverDisease: 'Doença Hepática Crónica / fígado gordo / doença hepática associada ao metabolismo',
    chronicDiseaseChronicGastrointestinal: 'Doenças Gastrointestinais Crónicas (ex. gastrite crónica, refluxo / esofagite, distúrbios ácidos crónicos)',
    chronicDiseaseThyroidDisorders: 'Distúrbios da Tiróide (ex. hipo ou hipertiroidismo)',
    chronicDiseaseAsthmaChronicBronchitis: 'Asma / Bronquite Crónica / outras doenças respiratórias crónicas das vias aéreas',
    chronicDiseaseChronicSkin: 'Doenças Cutâneas / Dermatológicas Crónicas (ex. eczema crónico ou dermatite, dermatite atópica)',
    chronicDiseaseChronicDigestive: 'Condições Digestivas Crónicas (ex. doença de úlcera péptica, gastrite crónica)',
    chronicDiseaseChronicPain: 'Distúrbios de Dor Crónica / Fibromialgia / dor crónica generalizada',
    chronicDiseaseNeurologicalBeyondDementia: 'Distúrbios neurológicos além da demência (ex. doença de Parkinson, neuropatias, outras condições neurológicas crónicas)',
    chronicDiseaseChronicMentalHealth: 'Distúrbios de Saúde Mental Crónicos além da depressão (ex. distúrbios de ansiedade, transtorno bipolar, esquizofrenia crónica, etc.)',
    chronicDiseaseChronicEyeDiseases: 'Doenças Oculares Crónicas (ex. glaucoma, degeneração macular)',
    chronicDiseaseChronicHearing: 'Distúrbios Auditivos Crónicos / Perda Auditiva',
    chronicDiseaseChronicOralDental: 'Doenças Orais / Dentárias Crónicas (ex. cárie dentária, doença gengival)',
    chronicDiseaseChronicRespiratoryAllergies: 'Alergias Respiratórias Crónicas / Rinite Crónica / Sinusite',
    chronicDiseaseChronicUrogenital: 'Doenças Urogenitais Crónicas',
    chronicDiseaseChronicMetabolic: 'Doenças Metabólicas Crónicas',
    chronicDiseaseOthers: 'Outros',
    hematology: 'Hematologia',
    biochemistry: 'Bioquímica',
    documents: 'Documentos',
    addMetric: 'Adicionar Métrica',
    uploadDocument: 'Carregar Documento',
    addMeasurement: 'Adicionar Medição',
    metrics: 'Métricas',
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
    aiDisclaimer: 'Os resumos de saúde gerados por IA têm um carácter meramente informativo e não substituem o aconselhamento, diagnóstico ou tratamento médico. Consulte sempre um profissional de saúde qualificado para obter aconselhamento médico personalizado.',
    
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
    appointmentsUpcoming: 'Próximas',
    appointmentsPast: 'Passadas',
    appointmentsCancelled: 'Canceladas',
    appointmentsNoUpcoming: 'Não tem consultas agendadas',
    appointmentsNoPast: 'Não tem consultas passadas',
    appointmentsNoCancelled: 'Não tem consultas canceladas',
    appointmentsLoading: 'A carregar consultas...',
    appointmentsJoinCall: 'Entrar na Consulta',
    appointmentsViewDetails: 'Ver Detalhes',
    appointmentsViewReport: 'Ver Relatório',
    appointmentsBookAppointment: 'Marcar Consulta',
    appointmentsDate: 'Data',
    appointmentsTime: 'Hora',
    appointmentsType: 'Tipo',
    appointmentsLocation: 'Localização',
    appointmentsNotes: 'Notas',
    appointmentsConfirmCancel: 'Confirmar Cancelamento',
    appointmentsCancelConfirmDesc: 'Tem a certeza que deseja cancelar esta consulta?',
    appointmentsCancelledSuccess: 'Consulta cancelada com sucesso',
    
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
    medications: 'Medicações',
    medicationName: 'Nome do Medicamento',
    addMedication: 'Adicionar Medicamento',
    medicationsAddNewMedication: 'Adicionar Novo Medicamento',
    medicationsEnterDetails: 'Introduza os detalhes do seu novo medicamento.',
    medicationsName: 'Nome',
    medicationsNamePlaceholder: 'Introduza o nome do medicamento',
    medicationsDosage: 'Dosagem',
    medicationsDosagePlaceholder: 'Introduza a dosagem (ex: 10mg)',
    medicationsFrequency: 'Frequência',
    medicationsFrequencyPlaceholder: 'Introduza a frequência (ex: Uma vez por dia)',
    medicationsPurpose: 'Finalidade',
    medicationsPurposePlaceholder: 'Para que serve este medicamento?',
    medicationsPrescribedBy: 'Prescrito Por',
    medicationsPrescribedByPlaceholder: 'Nome do médico',
    medicationsSelf: 'Auto',
    medicationsStartDate: 'Data de Início',
    medicationsEndDate: 'Data de Fim',
    medicationsInstructions: 'Instruções',
    medicationsInstructionsPlaceholder: 'Introduza as instruções',
    medicationsPrescription: 'Prescrição',
    medicationsPrescriptionInfo: 'Informações da Prescrição',
    medicationsRxNumber: 'Número Rx',
    medicationsRxNumberPlaceholder: 'Número da prescrição',
    medicationsPharmacy: 'Farmácia',
    medicationsPharmacyPlaceholder: 'Nome da farmácia',
    medicationsQuantity: 'Quantidade',
    medicationsQuantityPlaceholder: 'Quantidade original',
    medicationsRefillsRemaining: 'Refeições Restantes',
    medicationsRefillsRemainingPlaceholder: 'Número de refeições',
    medicationsLastFilled: 'Última Compra',
    medicationsLastRefillDate: 'Data da Última Compra',
    medicationsCurrentMedications: 'Medicações Atuais',
    medicationsPreviousMedications: 'Medicações Anteriores',
    medicationsNoCurrentMedications: 'Sem Medicações Atuais',
    medicationsNoCurrentMedicationsDesc: 'Não tem medicações ativas. Clique no botão acima para adicionar a sua primeira medicação.',
    medicationsNoPreviousMedications: 'Sem Medicações Anteriores',
    medicationsNoPreviousMedicationsDesc: 'Não tem medicações anteriores. As medicações que terminar aparecerão aqui.',
    medicationsLoading: 'A carregar medicações...',
    medicationsEndMedication: 'Terminar Medicamento',
    medicationsEndMedicationDescription: 'Tem a certeza que deseja terminar esta medicação? Pode opcionalmente fornecer um motivo.',
    medicationsEndNow: 'Terminar Agora',
    medicationsEnding: 'A terminar...',
    medicationsReasonEnded: 'Motivo do Término',
    medicationsEndDateMustBeAfterStartDate: 'A data de fim deve ser posterior à data de início.',
    medicationsPleaseFillInName: 'Por favor, preencha o nome do medicamento.',
    medicationsPleaseFillInDosage: 'Por favor, preencha a dosagem.',
    medicationsPleaseFillInFrequency: 'Por favor, preencha a frequência.',
    medicationsPleaseFillInStartDate: 'Por favor, preencha a data de início.',
    medicationsPleaseFillInEndDate: 'Por favor, preencha a data de fim.',
    medicationsSaving: 'A guardar...',
    medicationAddedSuccessfully: 'Medicação adicionada com sucesso!',
    medicationAddFailed: 'Falha ao adicionar medicação. Por favor, tente novamente.',
    deleteMedicationConfirm: 'Tem a certeza que deseja eliminar',
    deleteMedicationConfirmDesc: 'Esta ação não pode ser desfeita.',
    retry: 'Tentar Novamente',
    dosage: 'Dosagem',
    frequency: 'Frequência',
    time: 'Hora',
    instructions: 'Instruções',
    takeMedication: 'Tomar Medicamento',
    
    // Common time related
    morning: 'Manhã',
    afternoon: 'Tarde',
    evening: 'Fim de tarde',
    night: 'Noite',
    
    // Lab document types
    completeBloodCount: 'Hemograma Completo',
    comprehensiveMetabolicPanel: 'Painel Metabólico Completo',
    lipidPanel: 'Painel de Lípidos',
    hemoglobinA1C: 'Hemoglobina A1C',
    other: 'Outro',
    
    // Lab documents
    labDocuments: 'Documentos de Laboratório',
    noDate: 'Sem data',
    noProvider: 'Sem fornecedor',
    deleteDocument: 'Eliminar Documento',
    deleteDocumentConfirm: 'Tem a certeza que deseja eliminar este documento? Esta ação não pode ser desfeita.',
    failedToDelete: 'Falha ao eliminar',
    noLabDocumentsYet: 'Ainda não há documentos de laboratório',
    uploadLabDocument: 'Carregar Documento de Laboratório',
    provider: 'Fornecedor',
    type: 'Tipo',
    file: 'Ficheiro',
    description: 'Descrição',
    optional: 'opcional',
    selectDocumentType: 'Selecionar Tipo de Documento',
    healthcareProviderName: 'Nome do fornecedor de cuidados de saúde',
    pdfFilesOnly: 'Apenas ficheiros PDF, máximo 10MB',
    addDescriptionPlaceholder: 'Adicionar descrição ou observações',
    analyzing: 'A analisar...',
    uploadAndAnalyze: 'Carregar e Analisar',
    uploadToHealthRecords: 'Carregar para Registos de Saúde',
    viewExtractedResults: 'Ver Resultados Extraídos',
    metricsFound: 'métricas encontradas',
    analysisResults: 'Resultados da Análise',
    rejectResults: 'Rejeitar Resultados',
    confirmResults: 'Confirmar Resultados',
    value: 'Valor',
    referenceRange: 'Intervalo de Referência',
    section: 'Secção',
    editHealthRecord: 'Editar Registo de Saúde',
    metricName: 'Nome da Métrica',
    unit: 'Unidade',
    noMetricsFound: 'Nenhuma métrica encontrada',
    noResultsToUpload: 'Nenhum resultado para carregar',
    duplicateFile: 'Ficheiro Duplicado',
    duplicateFileMessage: 'Já existe um ficheiro com o mesmo nome. Deseja continuar?',
    continue: 'Continuar',
    noUploadResult: 'Resultado de carregamento não disponível',
    noResults: 'Sem Resultados',
    noResultsMessage: 'Não foram encontrados resultados de laboratório no documento. Por favor, verifique o ficheiro e tente novamente.',
    failedToAnalyze: 'Falha ao analisar documento',
    abnormal: 'Anormal',
    normal: 'Normal',
    
    // Medical exams
    uploadMedicalExam: 'Carregar Exame Médico',
    examDetails: 'Detalhes do Exame',
    imageType: 'Tipo de Imagem',
    selectImageType: 'Selecionar Tipo de Imagem',
    bodyPart: 'Parte do Corpo',
    bodyPartPlaceholder: 'ex: Peito, Abdómen superior',
    imageDate: 'Data da Imagem',
    findings: 'Achados',
    selectFindings: 'Selecionar Achados',
    interpretation: 'Interpretação',
    interpretationPlaceholder: 'Interpretação médica da imagem...',
    conclusions: 'Conclusões',
    conclusionsPlaceholder: 'Conclusões e achados...',
    doctorName: 'Nome do Médico',
    doctorNamePlaceholder: 'Nome do médico',
    doctorNumber: 'Número do Médico',
    doctorNumberPlaceholder: 'Número de licença do médico',
    xRay: 'Raio-X',
    ultrasound: 'Ecografia',
    mri: 'Ressonância Magnética',
    ctScan: 'TAC',
    ecg: 'ECG',
    others: 'Outros',
    noFindings: 'Sem Achados',
    lowRiskFindings: 'Achados de Baixo Risco',
    relevantFindings: 'Achados Relevantes',
    fileUploadedAnalyzed: 'Ficheiro carregado e analisado com sucesso!',
    medicalImageSavedSuccess: 'Exame médico guardado com sucesso!',
    noMedicalExamsYet: 'Ainda não há exames médicos',
    failedToLoadDocument: 'Falha ao carregar documento',
    documentDeleted: 'Documento eliminado com sucesso',
    loadingDocuments: 'A carregar exames...',
    uploadExam: 'Carregar Exame',
  },
  'es-ES': {
    // Tab names
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
    mobileHealthServices: 'Servicios de Salud Móviles',
    webServices: 'Servicios Web',
    healthConnect: 'Health Connect',
    appleHealth: 'Apple Health',
    samsungHealth: 'Samsung Health',
    googleFit: 'Google Fit',
    connecting: 'Conectando...',
    connectionSuccess: 'Conexión exitosa',
    connectionFailed: 'Error de conexión',
    permissionDenied: 'Permiso denegado',
    serviceUnavailable: 'Servicio no disponible en este dispositivo',
    disconnectConfirm: '¿Está seguro de que desea desconectar',
    integrationsDescription: 'Conecte sus dispositivos portátiles y aplicaciones de salud para sincronizar automáticamente sus datos de salud.',
    disconnected: 'Desconectado con éxito',
    fitbit: 'Fitbit',
    garmin: 'Garmin',
    polar: 'Polar',
    withings: 'Withings',
    strava: 'Strava',
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
    salusoSupport: 'Saluso Support',
    aiAssistant: 'Asistente IA',
    typeMessage: 'Escribe un mensaje...',
    send: 'Enviar',
    noConversations: 'No hay conversaciones aún',
    noMessages: 'No hay mensajes aún',
    typing: 'escribiendo...',
    messageSent: 'Mensaje enviado',
    failedToSend: 'Error al enviar mensaje',
    attachFile: 'Adjuntar archivo',
    uploading: 'Subiendo...',
    startConversation: 'Iniciar una conversación con Saluso Support',
    noMessagesYet: 'Aún no hay mensajes',
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
    surgeriesHospitalizations: 'Cirugías y Hospitalizaciones',
    activeConditions: 'Condiciones activas que requieren gestión continua',
    resolvedConditions: 'Condiciones previamente diagnosticadas que han sido resueltas',
    familyConditions: 'Historial médico de miembros de la familia',
    previousSurgeriesDesc: 'Procedimientos quirúrgicos anteriores y hospitalizaciones',
    surgery: 'Cirugía',
    hospitalization: 'Hospitalización',
    bodyArea: 'Área del Cuerpo',
    reason: 'Motivo',
    diagnosed: 'Diagnosticado',
    treatment: 'Tratamiento',
    resolved: 'Resuelto',
    resolvedDate: 'Fecha de Resolución',
    ageOfOnset: 'Edad de Inicio',
    relation: 'Relación',
    outcome: 'Resultado',
    notes: 'Notas',
    currentStatus: 'Estado Actual',
    statusControlled: 'Controlado',
    statusPartiallyControlled: 'Parcialmente Controlado',
    statusUncontrolled: 'No Controlado',
    recoveryFull: 'Recuperación Completa',
    recoveryPartial: 'Recuperación Parcial',
    recoveryNone: 'Sin Recuperación',
    date: 'Fecha',
    noSurgeriesHospitalizations: 'No hay cirugías u hospitalizaciones registradas',
    noSurgeriesHospitalizationsDesc: 'Agregue sus procedimientos quirúrgicos y hospitalizaciones anteriores',
    noCurrentConditions: 'No hay condiciones médicas actuales',
    noCurrentConditionsDesc: 'Agregue sus condiciones médicas actuales',
    noPastConditions: 'No hay condiciones médicas anteriores',
    noPastConditionsDesc: 'Agregue sus condiciones médicas anteriores',
    noFamilyHistory: 'No hay historial familiar',
    noFamilyHistoryDesc: 'Agregue el historial médico de su familia',
    loadingCurrentConditions: 'Cargando condiciones actuales...',
    loadingPastConditions: 'Cargando condiciones anteriores...',
    loadingFamilyHistory: 'Cargando historial familiar...',
    errorLoadingCurrentConditions: 'Error al cargar condiciones actuales',
    errorLoadingPastConditions: 'Error al cargar condiciones anteriores',
    errorLoadingFamilyHistory: 'Error al cargar historial familiar',
    deceased: 'Fallecido',
    alive: 'Vivo',
    ageAtDeath: 'Edad al Fallecer',
    causeOfDeath: 'Causa de la Muerte',
    currentAge: 'Edad Actual',
    chronicDiseases: 'Enfermedades Crónicas',
    diagnosedAtAge: 'Diagnosticado a los',
    condition: 'Condición',
    conditionName: 'Nombre de la Condición',
    conditionNameRequired: 'El nombre de la condición es obligatorio',
    dateDiagnosed: 'Fecha de Diagnóstico',
    dateDiagnosedRequired: 'La fecha de diagnóstico es obligatoria',
    dateResolved: 'Fecha de Resolución',
    dateResolvedRequired: 'La fecha de resolución es obligatoria',
    conditionUpdated: 'Condición actualizada con éxito',
    deleteCurrentConditionConfirm: '¿Está seguro de que desea eliminar esta condición médica? Esta acción no se puede deshacer.',
    deletePastConditionConfirm: '¿Está seguro de que desea eliminar esta condición médica anterior? Esta acción no se puede deshacer.',
    deleteFamilyHistoryConfirm: '¿Está seguro de que desea eliminar esta entrada del historial familiar? Esta acción no se puede deshacer.',
    deleteSurgeryConfirm: '¿Está seguro de que desea eliminar esta cirugía/hospitalización? Esta acción no se puede deshacer.',
    surgeryUpdated: 'Cirugía/hospitalización actualizada con éxito',
    procedureNameRequired: 'El nombre del procedimiento es obligatorio',
    procedureDateRequired: 'La fecha del procedimiento es obligatoria',
    conditionDetails: 'Detalles de la Condición',
    familyHistoryDetails: 'Detalles del Historial Familiar',
    surgeryDetails: 'Detalles de la Cirugía',
    editCondition: 'Editar Condición',
    editFamilyHistory: 'Editar Historial Familiar',
    editSurgeryHospitalization: 'Editar Cirugía/Hospitalización',
    relationRequired: 'La relación es obligatoria',
    enterConditionName: 'Ingrese el nombre de la condición',
    enterProcedureName: 'Ingrese el nombre del procedimiento',
    enterReason: 'Ingrese el motivo del procedimiento',
    enterTreatment: 'Ingrese los detalles del tratamiento',
    enterBodyArea: 'Ingrese el área del cuerpo',
    procedureType: 'Tipo de Procedimiento',
    procedureName: 'Nombre del Procedimiento',
    procedureDate: 'Fecha del Procedimiento',
    recoveryStatus: 'Estado de Recuperación',
    currentTreatment: 'Tratamiento actual',
    additionalNotes: 'Notas adicionales sobre la condición',
    enterRelation: 'Ingrese la relación (ej: Padre, Madre)',
    disease: 'Enfermedad',
    diseaseName: 'Nombre de la Enfermedad',
    ageAtDiagnosis: 'Edad en el Diagnóstico',
    comments: 'Comentarios',
    enterCauseOfDeath: 'Ingrese la causa de la muerte',
    selectRelation: 'Seleccionar relación',
    familyHistoryUpdated: 'Historial familiar actualizado con éxito',
    relationMother: 'Madre',
    relationFather: 'Padre',
    relationMaternalGrandmother: 'Abuela Materna',
    relationMaternalGrandfather: 'Abuelo Materno',
    relationPaternalGrandmother: 'Abuela Paterna',
    relationPaternalGrandfather: 'Abuelo Paterno',
    relationSister: 'Hermana',
    relationBrother: 'Hermano',
    relationSon: 'Hijo',
    relationDaughter: 'Hija',
    chronicDiseaseHypertension: 'Hipertensión (presión arterial alta)',
    chronicDiseaseIschemicHeartDisease: 'Enfermedad Isquémica / Coronaria / otras Enfermedades Cardíacas (ataque cardíaco, enfermedad cardíaca crónica)',
    chronicDiseaseStroke: 'Accidente Cerebrovascular / Enfermedad Cerebrovascular',
    chronicDiseaseType2Diabetes: 'Diabetes Tipo 2 / Diabetes mellitus',
    chronicDiseaseType1Diabetes: 'Diabetes Tipo 1',
    chronicDiseaseCancer: 'Cáncer (varios tipos)',
    chronicDiseaseCopd: 'Enfermedad Pulmonar Obstructiva Crónica (EPOC)',
    chronicDiseaseAsthma: 'Asma (y otras enfermedades respiratorias crónicas inferiores)',
    chronicDiseaseArthritis: 'Artritis / Osteoartritis / Artritis Reumatoide (musculoesquelética)',
    chronicDiseaseBackProblems: 'Problemas de espalda / dolor crónico de espalda / problemas de columna (musculoesquelética)',
    chronicDiseaseChronicKidneyDisease: 'Enfermedad Renal Crónica (ERC) / enfermedad renal (a menudo relacionada con la diabetes)',
    chronicDiseaseHighCholesterol: 'Colesterol Alto / Dislipidemia (como factor de riesgo / condición crónica)',
    chronicDiseaseObesity: 'Obesidad (como condición crónica / factor de riesgo)',
    chronicDiseaseDepression: 'Depresión y otros Trastornos Mentales / Conductuales',
    chronicDiseaseOsteoporosis: 'Osteoporosis (y otras enfermedades óseas)',
    chronicDiseaseNeurodegenerative: 'Enfermedades neurodegenerativas (ej. enfermedad de Alzheimer / demencia / otras demencias)',
    chronicDiseaseChronicLiverDisease: 'Enfermedad Hepática Crónica / hígado graso / enfermedad hepática asociada al metabolismo',
    chronicDiseaseChronicGastrointestinal: 'Enfermedades Gastrointestinales Crónicas (ej. gastritis crónica, reflujo / esofagitis, trastornos ácidos crónicos)',
    chronicDiseaseThyroidDisorders: 'Trastornos de la Tiroides (ej. hipo o hipertiroidismo)',
    chronicDiseaseAsthmaChronicBronchitis: 'Asma / Bronquitis Crónica / otras enfermedades respiratorias crónicas de las vías aéreas',
    chronicDiseaseChronicSkin: 'Enfermedades Cutáneas / Dermatológicas Crónicas (ej. eczema crónico o dermatitis, dermatitis atópica)',
    chronicDiseaseChronicDigestive: 'Condiciones Digestivas Crónicas (ej. enfermedad de úlcera péptica, gastritis crónica)',
    chronicDiseaseChronicPain: 'Trastornos de Dolor Crónico / Fibromialgia / dolor crónico generalizado',
    chronicDiseaseNeurologicalBeyondDementia: 'Trastornos neurológicos más allá de la demencia (ej. enfermedad de Parkinson, neuropatías, otras condiciones neurológicas crónicas)',
    chronicDiseaseChronicMentalHealth: 'Trastornos de Salud Mental Crónicos más allá de la depresión (ej. trastornos de ansiedad, trastorno bipolar, esquizofrenia crónica, etc.)',
    chronicDiseaseChronicEyeDiseases: 'Enfermedades Oculares Crónicas (ej. glaucoma, degeneración macular)',
    chronicDiseaseChronicHearing: 'Trastornos Auditivos Crónicos / Pérdida Auditiva',
    chronicDiseaseChronicOralDental: 'Enfermedades Orales / Dentales Crónicas (ej. caries dental, enfermedad de las encías)',
    chronicDiseaseChronicRespiratoryAllergies: 'Alergias Respiratorias Crónicas / Rinitis Crónica / Sinusitis',
    chronicDiseaseChronicUrogenital: 'Enfermedades Urogenitales Crónicas',
    chronicDiseaseChronicMetabolic: 'Enfermedades Metabólicas Crónicas',
    chronicDiseaseOthers: 'Otros',
    hematology: 'Hematología',
    biochemistry: 'Bioquímica',
    documents: 'Documentos',
    addMetric: 'Añadir Métrica',
    uploadDocument: 'Cargar Documento',
    addMeasurement: 'Añadir Medición',
    metrics: 'Métricas',
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
    aiDisclaimer: 'Los resúmenes de salud generados por IA tienen un carácter meramente informativo y no sustituyen el asesoramiento, diagnóstico o tratamiento médico. Consulte siempre a un profesional de salud cualificado para obtener asesoramiento médico personalizado.',
    
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
    appointmentsUpcoming: 'Próximas',
    appointmentsPast: 'Pasadas',
    appointmentsCancelled: 'Canceladas',
    appointmentsNoUpcoming: 'No hay citas próximas',
    appointmentsNoPast: 'No hay citas pasadas',
    appointmentsNoCancelled: 'No hay citas canceladas',
    appointmentsLoading: 'Cargando citas...',
    appointmentsJoinCall: 'Unirse a la Consulta',
    appointmentsViewDetails: 'Ver Detalles',
    appointmentsViewReport: 'Ver Informe',
    appointmentsBookAppointment: 'Agendar Cita',
    appointmentsDate: 'Fecha',
    appointmentsTime: 'Hora',
    appointmentsType: 'Tipo',
    appointmentsLocation: 'Ubicación',
    appointmentsNotes: 'Notas',
    appointmentsConfirmCancel: 'Confirmar Cancelación',
    appointmentsCancelConfirmDesc: '¿Está seguro de que desea cancelar esta cita?',
    appointmentsCancelledSuccess: 'Cita cancelada con éxito',
    
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
    medications: 'Medicamentos',
    medicationName: 'Nombre del Medicamento',
    addMedication: 'Añadir Medicamento',
    medicationsAddNewMedication: 'Añadir Nuevo Medicamento',
    medicationsEnterDetails: 'Ingrese los detalles de su nuevo medicamento.',
    medicationsName: 'Nombre',
    medicationsNamePlaceholder: 'Ingrese el nombre del medicamento',
    medicationsDosage: 'Dosificación',
    medicationsDosagePlaceholder: 'Ingrese la dosificación (ej: 10mg)',
    medicationsFrequency: 'Frecuencia',
    medicationsFrequencyPlaceholder: 'Ingrese la frecuencia (ej: Una vez al día)',
    medicationsPurpose: 'Propósito',
    medicationsPurposePlaceholder: '¿Para qué es este medicamento?',
    medicationsPrescribedBy: 'Prescrito Por',
    medicationsPrescribedByPlaceholder: 'Nombre del médico',
    medicationsSelf: 'Auto',
    medicationsStartDate: 'Fecha de Inicio',
    medicationsEndDate: 'Fecha de Fin',
    medicationsInstructions: 'Instrucciones',
    medicationsInstructionsPlaceholder: 'Ingrese las instrucciones',
    medicationsPrescription: 'Prescripción',
    medicationsPrescriptionInfo: 'Información de la Prescripción',
    medicationsRxNumber: 'Número Rx',
    medicationsRxNumberPlaceholder: 'Número de prescripción',
    medicationsPharmacy: 'Farmacia',
    medicationsPharmacyPlaceholder: 'Nombre de la farmacia',
    medicationsQuantity: 'Cantidad',
    medicationsQuantityPlaceholder: 'Cantidad original',
    medicationsRefillsRemaining: 'Recargas Restantes',
    medicationsRefillsRemainingPlaceholder: 'Número de recargas',
    medicationsLastFilled: 'Última Compra',
    medicationsLastRefillDate: 'Fecha de Última Compra',
    medicationsCurrentMedications: 'Medicamentos Actuales',
    medicationsPreviousMedications: 'Medicamentos Anteriores',
    medicationsNoCurrentMedications: 'Sin Medicamentos Actuales',
    medicationsNoCurrentMedicationsDesc: 'No tiene medicamentos activos. Haga clic en el botón de arriba para agregar su primer medicamento.',
    medicationsNoPreviousMedications: 'Sin Medicamentos Anteriores',
    medicationsNoPreviousMedicationsDesc: 'No tiene medicamentos anteriores. Los medicamentos que termine aparecerán aquí.',
    medicationsLoading: 'Cargando medicamentos...',
    medicationsEndMedication: 'Terminar Medicamento',
    medicationsEndMedicationDescription: '¿Está seguro de que desea terminar este medicamento? Opcionalmente puede proporcionar un motivo.',
    medicationsEndNow: 'Terminar Ahora',
    medicationsEnding: 'Terminando...',
    medicationsReasonEnded: 'Motivo del Término',
    medicationsEndDateMustBeAfterStartDate: 'La fecha de fin debe ser posterior a la fecha de inicio.',
    medicationsPleaseFillInName: 'Por favor, complete el nombre del medicamento.',
    medicationsPleaseFillInDosage: 'Por favor, complete la dosificación.',
    medicationsPleaseFillInFrequency: 'Por favor, complete la frecuencia.',
    medicationsPleaseFillInStartDate: 'Por favor, complete la fecha de inicio.',
    medicationsPleaseFillInEndDate: 'Por favor, complete la fecha de fin.',
    medicationsSaving: 'Guardando...',
    medicationAddedSuccessfully: '¡Medicamento agregado exitosamente!',
    medicationAddFailed: 'Error al agregar medicamento. Por favor, intente nuevamente.',
    deleteMedicationConfirm: '¿Está seguro de que desea eliminar',
    deleteMedicationConfirmDesc: 'Esta acción no se puede deshacer.',
    retry: 'Reintentar',
    dosage: 'Dosificación',
    frequency: 'Frecuencia',
    time: 'Hora',
    instructions: 'Instrucciones',
    takeMedication: 'Tomar Medicamento',
    
    // Common time related
    morning: 'Mañana',
    afternoon: 'Tarde',
    evening: 'Final de la tarde',
    night: 'Noche',
    
    // Lab document types
    completeBloodCount: 'Hemograma Completo',
    comprehensiveMetabolicPanel: 'Panel Metabólico Completo',
    lipidPanel: 'Panel de Lípidos',
    hemoglobinA1C: 'Hemoglobina A1C',
    other: 'Otro',
    
    // Lab documents
    labDocuments: 'Documentos de Laboratorio',
    noDate: 'Sin fecha',
    noProvider: 'Sin proveedor',
    deleteDocument: 'Eliminar Documento',
    deleteDocumentConfirm: '¿Está seguro de que desea eliminar este documento? Esta acción no se puede deshacer.',
    failedToDelete: 'Error al eliminar',
    noLabDocumentsYet: 'Aún no hay documentos de laboratorio',
    uploadLabDocument: 'Subir Documento de Laboratorio',
    provider: 'Proveedor',
    type: 'Tipo',
    file: 'Archivo',
    description: 'Descripción',
    optional: 'opcional',
    selectDocumentType: 'Seleccionar Tipo de Documento',
    healthcareProviderName: 'Nombre del proveedor de atención médica',
    pdfFilesOnly: 'Solo archivos PDF, máximo 10MB',
    addDescriptionPlaceholder: 'Agregar descripción u observaciones',
    analyzing: 'Analizando...',
    uploadAndAnalyze: 'Subir y Analizar',
    uploadToHealthRecords: 'Subir a Registros de Salud',
    viewExtractedResults: 'Ver Resultados Extraídos',
    metricsFound: 'métricas encontradas',
    analysisResults: 'Resultados del Análisis',
    rejectResults: 'Rechazar Resultados',
    confirmResults: 'Confirmar Resultados',
    value: 'Valor',
    referenceRange: 'Rango de Referencia',
    section: 'Sección',
    editHealthRecord: 'Editar Registro de Salud',
    metricName: 'Nombre de la Métrica',
    unit: 'Unidad',
    noMetricsFound: 'No se encontraron métricas',
    noResultsToUpload: 'No hay resultados para subir',
    duplicateFile: 'Archivo Duplicado',
    duplicateFileMessage: 'Ya existe un archivo con el mismo nombre. ¿Desea continuar?',
    continue: 'Continuar',
    noUploadResult: 'Resultado de carga no disponible',
    noResults: 'Sin Resultados',
    noResultsMessage: 'No se encontraron resultados de laboratorio en el documento. Por favor, verifique el archivo e intente nuevamente.',
    failedToAnalyze: 'Error al analizar documento',
    abnormal: 'Anormal',
    normal: 'Normal',
    
    // Medical exams
    uploadMedicalExam: 'Subir Examen Médico',
    examDetails: 'Detalles del Examen',
    imageType: 'Tipo de Imagen',
    selectImageType: 'Seleccionar Tipo de Imagen',
    bodyPart: 'Parte del Cuerpo',
    bodyPartPlaceholder: 'ej: Pecho, Abdomen superior',
    imageDate: 'Fecha de la Imagen',
    findings: 'Hallazgos',
    selectFindings: 'Seleccionar Hallazgos',
    interpretation: 'Interpretación',
    interpretationPlaceholder: 'Interpretación médica de la imagen...',
    conclusions: 'Conclusiones',
    conclusionsPlaceholder: 'Conclusiones y hallazgos...',
    doctorName: 'Nombre del Médico',
    doctorNamePlaceholder: 'Nombre del médico',
    doctorNumber: 'Número del Médico',
    doctorNumberPlaceholder: 'Número de licencia del médico',
    xRay: 'Rayos X',
    ultrasound: 'Ultrasonido',
    mri: 'Resonancia Magnética',
    ctScan: 'TAC',
    ecg: 'ECG',
    others: 'Otros',
    noFindings: 'Sin Hallazgos',
    lowRiskFindings: 'Hallazgos de Bajo Riesgo',
    relevantFindings: 'Hallazgos Relevantes',
    fileUploadedAnalyzed: '¡Archivo subido y analizado con éxito!',
    medicalImageSavedSuccess: '¡Examen médico guardado con éxito!',
    noMedicalExamsYet: 'Aún no hay exámenes médicos',
    failedToLoadDocument: 'Error al cargar documento',
    documentDeleted: 'Documento eliminado con éxito',
    loadingDocuments: 'Cargando exámenes...',
    uploadExam: 'Subir Examen',
  },
  'en-US': {
    // Tab names
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
    mobileHealthServices: 'Mobile Health Services',
    webServices: 'Web Services',
    healthConnect: 'Health Connect',
    appleHealth: 'Apple Health',
    samsungHealth: 'Samsung Health',
    googleFit: 'Google Fit',
    connecting: 'Connecting...',
    connectionSuccess: 'Connected successfully',
    connectionFailed: 'Connection failed',
    permissionDenied: 'Permission denied',
    serviceUnavailable: 'Service not available on this device',
    disconnectConfirm: 'Are you sure you want to disconnect',
    integrationsDescription: 'Connect your wearable devices and health apps to automatically sync your health data.',
    disconnected: 'Disconnected successfully',
    fitbit: 'Fitbit',
    garmin: 'Garmin',
    polar: 'Polar',
    withings: 'Withings',
    strava: 'Strava',
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
    salusoSupport: 'Saluso Support',
    aiAssistant: 'AI Assistant',
    typeMessage: 'Type a message...',
    send: 'Send',
    noConversations: 'No conversations yet',
    noMessages: 'No messages yet',
    typing: 'typing...',
    messageSent: 'Message sent',
    failedToSend: 'Failed to send message',
    attachFile: 'Attach file',
    uploading: 'Uploading...',
    startConversation: 'Start a conversation with Saluso Support',
    noMessagesYet: 'No messages yet',
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
    surgeriesHospitalizations: 'Surgeries & Hospitalizations',
    activeConditions: 'Active conditions requiring ongoing management',
    resolvedConditions: 'Previously diagnosed conditions that have been resolved',
    familyConditions: 'Medical history of family members',
    previousSurgeriesDesc: 'Previous surgical procedures and hospitalizations',
    surgery: 'Surgery',
    hospitalization: 'Hospitalization',
    bodyArea: 'Body Area',
    reason: 'Reason',
    diagnosed: 'Diagnosed',
    treatment: 'Treatment',
    resolved: 'Resolved',
    resolvedDate: 'Resolved Date',
    ageOfOnset: 'Age of Onset',
    relation: 'Relation',
    outcome: 'Outcome',
    notes: 'Notes',
    currentStatus: 'Current Status',
    statusControlled: 'Controlled',
    statusPartiallyControlled: 'Partially Controlled',
    statusUncontrolled: 'Uncontrolled',
    recoveryFull: 'Full Recovery',
    recoveryPartial: 'Partial Recovery',
    recoveryNone: 'No Recovery',
    date: 'Date',
    noSurgeriesHospitalizations: 'No surgeries or hospitalizations recorded',
    noSurgeriesHospitalizationsDesc: 'Add your previous surgical procedures and hospitalizations',
    noCurrentConditions: 'No current medical conditions',
    noCurrentConditionsDesc: 'Add your current medical conditions',
    noPastConditions: 'No past medical conditions',
    noPastConditionsDesc: 'Add your past medical conditions',
    noFamilyHistory: 'No family history',
    noFamilyHistoryDesc: 'Add your family medical history',
    loadingCurrentConditions: 'Loading current conditions...',
    loadingPastConditions: 'Loading past conditions...',
    loadingFamilyHistory: 'Loading family history...',
    errorLoadingCurrentConditions: 'Error loading current conditions',
    errorLoadingPastConditions: 'Error loading past conditions',
    errorLoadingFamilyHistory: 'Error loading family history',
    deceased: 'Deceased',
    alive: 'Alive',
    ageAtDeath: 'Age at Death',
    causeOfDeath: 'Cause of Death',
    currentAge: 'Current Age',
    chronicDiseases: 'Chronic Diseases',
    diagnosedAtAge: 'Diagnosed at age',
    condition: 'Condition',
    conditionName: 'Condition Name',
    conditionNameRequired: 'Condition name is required',
    dateDiagnosed: 'Date Diagnosed',
    dateDiagnosedRequired: 'Diagnosed date is required',
    dateResolved: 'Date Resolved',
    dateResolvedRequired: 'Resolved date is required',
    conditionUpdated: 'Condition updated successfully',
    deleteCurrentConditionConfirm: 'Are you sure you want to delete this medical condition? This action cannot be undone.',
    deletePastConditionConfirm: 'Are you sure you want to delete this past medical condition? This action cannot be undone.',
    deleteFamilyHistoryConfirm: 'Are you sure you want to delete this family history entry? This action cannot be undone.',
    deleteSurgeryConfirm: 'Are you sure you want to delete this surgery/hospitalization? This action cannot be undone.',
    surgeryUpdated: 'Surgery/hospitalization updated successfully',
    procedureNameRequired: 'Procedure name is required',
    procedureDateRequired: 'Procedure date is required',
    conditionDetails: 'Condition Details',
    familyHistoryDetails: 'Family History Details',
    surgeryDetails: 'Surgery Details',
    editCondition: 'Edit Condition',
    editFamilyHistory: 'Edit Family History',
    editSurgeryHospitalization: 'Edit Surgery/Hospitalization',
    relationRequired: 'Relation is required',
    enterConditionName: 'Enter condition name',
    enterProcedureName: 'Enter procedure name',
    enterReason: 'Enter reason for procedure',
    enterTreatment: 'Enter treatment details',
    enterBodyArea: 'Enter body area',
    procedureType: 'Procedure Type',
    procedureName: 'Procedure Name',
    procedureDate: 'Procedure Date',
    recoveryStatus: 'Recovery Status',
    currentTreatment: 'Current treatment',
    additionalNotes: 'Additional notes about the condition',
    enterRelation: 'Enter relation (e.g., Father, Mother)',
    disease: 'Disease',
    diseaseName: 'Disease Name',
    ageAtDiagnosis: 'Age at Diagnosis',
    comments: 'Comments',
    enterCauseOfDeath: 'Enter cause of death',
    selectRelation: 'Select relation',
    familyHistoryUpdated: 'Family history updated successfully',
    relationMother: 'Mother',
    relationFather: 'Father',
    relationMaternalGrandmother: 'Maternal Grandmother',
    relationMaternalGrandfather: 'Maternal Grandfather',
    relationPaternalGrandmother: 'Paternal Grandmother',
    relationPaternalGrandfather: 'Paternal Grandfather',
    relationSister: 'Sister',
    relationBrother: 'Brother',
    relationSon: 'Son',
    relationDaughter: 'Daughter',
    chronicDiseaseHypertension: 'Hypertension (high blood pressure)',
    chronicDiseaseIschemicHeartDisease: 'Ischemic / Coronary Heart Disease / other Heart Diseases (heart attack, chronic heart disease)',
    chronicDiseaseStroke: 'Stroke / Cerebrovascular disease',
    chronicDiseaseType2Diabetes: 'Type 2 Diabetes / Diabetes mellitus',
    chronicDiseaseType1Diabetes: 'Type 1 Diabetes',
    chronicDiseaseCancer: 'Cancer (various types)',
    chronicDiseaseCopd: 'Chronic Obstructive Pulmonary Disease (COPD)',
    chronicDiseaseAsthma: 'Asthma (and other chronic lower-respiratory diseases)',
    chronicDiseaseArthritis: 'Arthritis / Osteoarthritis / Rheumatoid Arthritis (musculoskeletal)',
    chronicDiseaseBackProblems: 'Back problems / chronic back pain / spine problems (musculoskeletal)',
    chronicDiseaseChronicKidneyDisease: 'Chronic Kidney Disease (CKD) / kidney disease (often linked to diabetes)',
    chronicDiseaseHighCholesterol: 'High Cholesterol / Dyslipidemia (as risk factor / chronic condition)',
    chronicDiseaseObesity: 'Obesity (as chronic condition / risk factor)',
    chronicDiseaseDepression: 'Depression and other Mental / Behavioural disorders',
    chronicDiseaseOsteoporosis: 'Osteoporosis (and other bone diseases)',
    chronicDiseaseNeurodegenerative: 'Neurodegenerative diseases (e.g. Alzheimer\'s disease / dementia / other dementias)',
    chronicDiseaseChronicLiverDisease: 'Chronic Liver Disease / fatty liver / metabolic-associated liver disease',
    chronicDiseaseChronicGastrointestinal: 'Chronic Gastrointestinal diseases (e.g. chronic gastritis, reflux / esophagitis, chronic acid disorders)',
    chronicDiseaseThyroidDisorders: 'Thyroid Disorders (e.g. hypo- or hyperthyroidism)',
    chronicDiseaseAsthmaChronicBronchitis: 'Asthma / Chronic bronchitis / other chronic respiratory-airway diseases',
    chronicDiseaseChronicSkin: 'Chronic Skin / Dermatological diseases (e.g. chronic eczema or dermatitis, atopic dermatitis)',
    chronicDiseaseChronicDigestive: 'Chronic Digestive Conditions (e.g. peptic ulcer disease, chronic gastritis)',
    chronicDiseaseChronicPain: 'Chronic Pain Disorders / Fibromyalgia / generalized chronic pain',
    chronicDiseaseNeurologicalBeyondDementia: 'Neurological disorders beyond dementia (e.g. Parkinson\'s disease, neuropathies, other chronic neurological conditions)',
    chronicDiseaseChronicMentalHealth: 'Chronic Mental Health Disorders beyond depression (e.g. anxiety disorders, bipolar disorder, chronic schizophrenia, etc.)',
    chronicDiseaseChronicEyeDiseases: 'Chronic Eye Diseases (e.g. glaucoma, macular degeneration)',
    chronicDiseaseChronicHearing: 'Chronic Hearing Disorders / Hearing Loss',
    chronicDiseaseChronicOralDental: 'Chronic Oral / Dental Diseases (e.g. dental decay, gum disease)',
    chronicDiseaseChronicRespiratoryAllergies: 'Chronic Respiratory Allergies / Chronic Rhinitis / Sinusitis',
    chronicDiseaseChronicUrogenital: 'Chronic Urogenital Diseases',
    chronicDiseaseChronicMetabolic: 'Chronic Metabolic Diseases',
    chronicDiseaseOthers: 'Others',
    hematology: 'Hematology',
    biochemistry: 'Biochemistry',
    documents: 'Documents',
    addMetric: 'Add Metric',
    uploadDocument: 'Upload Document',
    addMeasurement: 'Add Measurement',
    addMetricTitle: 'Add Measurement',
    measurementType: 'Measurement Type',
    metrics: 'Metrics',
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
    aiDisclaimer: 'AI-generated health summaries are for informational purposes only and do not replace medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for personalized medical advice.',
    
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
    appointmentsUpcoming: 'Upcoming',
    appointmentsPast: 'Past',
    appointmentsCancelled: 'Cancelled',
    appointmentsNoUpcoming: 'No upcoming appointments',
    appointmentsNoPast: 'No past appointments',
    appointmentsNoCancelled: 'No cancelled appointments',
    appointmentsLoading: 'Loading appointments...',
    appointmentsJoinCall: 'Join Call',
    appointmentsViewDetails: 'View Details',
    appointmentsViewReport: 'View Report',
    appointmentsBookAppointment: 'Book Appointment',
    appointmentsDate: 'Date',
    appointmentsTime: 'Time',
    appointmentsType: 'Type',
    appointmentsLocation: 'Location',
    appointmentsNotes: 'Notes',
    appointmentsConfirmCancel: 'Confirm Cancellation',
    appointmentsCancelConfirmDesc: 'Are you sure you want to cancel this appointment?',
    appointmentsCancelledSuccess: 'Appointment cancelled successfully',
    
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
    medications: 'Medications',
    medicationName: 'Medication Name',
    addMedication: 'Add Medication',
    medicationsAddNewMedication: 'Add New Medication',
    medicationsEnterDetails: 'Enter the details of your new medication.',
    medicationsName: 'Name',
    medicationsNamePlaceholder: 'Enter medication name',
    medicationsDosage: 'Dosage',
    medicationsDosagePlaceholder: 'Enter dosage (e.g., 10mg)',
    medicationsFrequency: 'Frequency',
    medicationsFrequencyPlaceholder: 'Enter frequency (e.g., Once daily)',
    medicationsPurpose: 'Purpose',
    medicationsPurposePlaceholder: 'What is this medication for?',
    medicationsPrescribedBy: 'Prescribed By',
    medicationsPrescribedByPlaceholder: "Doctor's name",
    medicationsSelf: 'Self',
    medicationsStartDate: 'Start Date',
    medicationsEndDate: 'End Date',
    medicationsInstructions: 'Instructions',
    medicationsInstructionsPlaceholder: 'Enter instructions',
    medicationsPrescription: 'Prescription',
    medicationsPrescriptionInfo: 'Prescription Information',
    medicationsRxNumber: 'Rx Number',
    medicationsRxNumberPlaceholder: 'Prescription number',
    medicationsPharmacy: 'Pharmacy',
    medicationsPharmacyPlaceholder: 'Pharmacy name',
    medicationsQuantity: 'Quantity',
    medicationsQuantityPlaceholder: 'Original quantity',
    medicationsRefillsRemaining: 'Refills Remaining',
    medicationsRefillsRemainingPlaceholder: 'Number of refills',
    medicationsLastFilled: 'Last Filled',
    medicationsLastRefillDate: 'Last Refill Date',
    medicationsCurrentMedications: 'Current Medications',
    medicationsPreviousMedications: 'Previous Medications',
    medicationsNoCurrentMedications: 'No Current Medications',
    medicationsNoCurrentMedicationsDesc: "You don't have any active medications. Click the button above to add your first medication.",
    medicationsNoPreviousMedications: 'No Previous Medications',
    medicationsNoPreviousMedicationsDesc: "You don't have any previous medications. Medications you end will appear here.",
    medicationsLoading: 'Loading medications...',
    medicationsEndMedication: 'End Medication',
    medicationsEndMedicationDescription: 'Are you sure you want to end this medication? You can optionally provide a reason.',
    medicationsEndNow: 'End Now',
    medicationsEnding: 'Ending...',
    medicationsReasonEnded: 'Reason Ended',
    medicationsEndDateMustBeAfterStartDate: 'End date must be after start date.',
    medicationsPleaseFillInName: 'Please fill in the medication name.',
    medicationsPleaseFillInDosage: 'Please fill in the dosage.',
    medicationsPleaseFillInFrequency: 'Please fill in the frequency.',
    medicationsPleaseFillInStartDate: 'Please fill in the start date.',
    medicationsPleaseFillInEndDate: 'Please fill in the end date.',
    medicationsSaving: 'Saving...',
    medicationAddedSuccessfully: 'Medication added successfully!',
    medicationAddFailed: 'Failed to add medication. Please try again.',
    deleteMedicationConfirm: 'Are you sure you want to delete',
    deleteMedicationConfirmDesc: 'This action cannot be undone.',
    retry: 'Retry',
    dosage: 'Dosage',
    frequency: 'Frequency',
    time: 'Time',
    instructions: 'Instructions',
    takeMedication: 'Take Medication',
    
    // Common time related
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    
    // Lab document types
    completeBloodCount: 'Complete Blood Count',
    comprehensiveMetabolicPanel: 'Comprehensive Metabolic Panel',
    lipidPanel: 'Lipid Panel',
    hemoglobinA1C: 'Hemoglobin A1C',
    other: 'Other',
    
    // Lab documents
    labDocuments: 'Lab Documents',
    noDate: 'No date',
    noProvider: 'No provider',
    deleteDocument: 'Delete Document',
    deleteDocumentConfirm: 'Are you sure you want to delete this document? This action cannot be undone.',
    failedToDelete: 'Failed to delete',
    noLabDocumentsYet: 'No lab documents yet',
    uploadLabDocument: 'Upload Lab Document',
    provider: 'Provider',
    type: 'Type',
    file: 'File',
    description: 'Description',
    optional: 'optional',
    selectDocumentType: 'Select Document Type',
    healthcareProviderName: 'Healthcare provider name',
    pdfFilesOnly: 'PDF files only, max 10MB',
    addDescriptionPlaceholder: 'Add description or observations',
    analyzing: 'Analyzing...',
    uploadAndAnalyze: 'Upload & Analyze',
    uploadToHealthRecords: 'Upload to Health Records',
    viewExtractedResults: 'View Extracted Results',
    metricsFound: 'metrics found',
    analysisResults: 'Analysis Results',
    rejectResults: 'Reject Results',
    confirmResults: 'Confirm Results',
    value: 'Value',
    referenceRange: 'Reference Range',
    section: 'Section',
    editHealthRecord: 'Edit Health Record Entry',
    metricName: 'Metric Name',
    unit: 'Unit',
    noMetricsFound: 'No metrics found',
    noResultsToUpload: 'No results to upload',
    duplicateFile: 'Duplicate File',
    duplicateFileMessage: 'A file with the same name already exists. Do you want to continue?',
    continue: 'Continue',
    noUploadResult: 'Upload result not available',
    noResults: 'No Results',
    noResultsMessage: 'No lab results were found in the document. Please check the file and try again.',
    failedToAnalyze: 'Failed to analyze document',
    abnormal: 'Abnormal',
    normal: 'Normal',
    
    // Medical exams
    uploadMedicalExam: 'Upload Medical Exam',
    examDetails: 'Exam Details',
    imageType: 'Image Type',
    selectImageType: 'Select Image Type',
    bodyPart: 'Body Part',
    bodyPartPlaceholder: 'e.g., Chest, Upper abdomen',
    imageDate: 'Image Date',
    findings: 'Findings',
    selectFindings: 'Select Findings',
    interpretation: 'Interpretation',
    interpretationPlaceholder: 'Medical interpretation of the image...',
    conclusions: 'Conclusions',
    conclusionsPlaceholder: 'Conclusions and findings...',
    doctorName: 'Doctor Name',
    doctorNamePlaceholder: "Doctor's name",
    doctorNumber: 'Doctor Number',
    doctorNumberPlaceholder: "Doctor's license number",
    xRay: 'X-Ray',
    ultrasound: 'Ultrasound',
    mri: 'MRI',
    ctScan: 'CT Scan',
    ecg: 'ECG',
    others: 'Others',
    noFindings: 'No Findings',
    lowRiskFindings: 'Low Risk Findings',
    relevantFindings: 'Relevant Findings',
    fileUploadedAnalyzed: 'File uploaded and analyzed successfully!',
    medicalImageSavedSuccess: 'Medical exam saved successfully!',
    noMedicalExamsYet: 'No medical exams yet',
    failedToLoadDocument: 'Failed to load document',
    documentDeleted: 'Document deleted successfully',
    loadingDocuments: 'Loading exams...',
    uploadExam: 'Upload Exam',
  },
};

export const language = {
  ESP: {
    totalDuration: 'Duración total',
    workDuration: 'Tiempo de trabajo',
    restDuration: 'Tiempo de descanso',
    hoursTag: 'hrs',
    minutesTag: 'min',
    secondsTag: 'seg',
    starting: 'iniciando',
    restartButton: 'Reiniciar',
    stopButton: 'Parar',
    totalDurationInvalidError: 'Elige una duración válida',
    totalDurationPositiveError: 'La duración debe ser mayor a 0',
    workDurationInvalidError: 'Elige un tiempo de trabajo válido',
    workDurationPositiveError: 'El tiempo de trabajo debe ser mayor a 0',
    restDurationInvalidError: 'Elige un tiempo de descanso válido',
    restDurationPositiveError: 'El tiempo de descanso debe ser mayor a 0',
    changeLanguage: 'Cambiar lenguaje, se reiniciará la aplicación',
    settings: 'Configuración',
  },
  ENG: {
    totalDuration: 'Total duration',
    workDuration: 'Work duration',
    restDuration: 'Rest duration',
    hoursTag: 'hrs',
    minutesTag: 'min',
    secondsTag: 'sec',
    starting: 'starting',
    restartButton: 'Restart',
    stopButton: 'Stop',
    totalDurationInvalidError: 'Pick a valid duration',
    totalDurationPositiveError: 'Total duration must be greater than 0',
    workDurationInvalidError: 'Pick a valid work duration',
    workDurationPositiveError: 'Work duration must be greater 0',
    restDurationInvalidError: 'Pick a valid rest duration',
    restDurationPositiveError: 'Rest duration must be greater 0',
    changeLanguage: 'Change language, app will be restarted',
    settings: 'Settings',
  },
} as const;

export type Language = keyof typeof language;

export type Message = keyof (typeof language)['ESP'];

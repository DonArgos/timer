export const language = {
  es: {
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
    notifications: 'Notificaciones en segundo plano',
    timerFinished: 'El contador ha terminado',
    workTimerFinished: 'Descansa un momento',
    restTimerFinished: 'Volver a trabajar',
    notificationError:
      'Las notificaciones han sido rechazadas, ve a configuración para actualizar los permisos',
  },
  en: {
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
    notifications: 'Background notifications',
    timerFinished: 'Timer has finished',
    workTimerFinished: 'Rest a moment',
    restTimerFinished: 'Back to work',
    notificationError:
      'Notifications have been denied, go to configuration to change the permissions',
  },
} as const;

export type Language = keyof typeof language;

export type Message = keyof (typeof language)['es'];

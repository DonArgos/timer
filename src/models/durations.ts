import {z} from 'zod';

export const durationsSchema = z.object({
  global: z
    .number({invalid_type_error: 'Elige una duración válida'})
    .positive('La duración debe ser mayor a 0'),
  work: z
    .number({invalid_type_error: 'Elige un tiempo de trabajo válido'})
    .positive('El tiempo de trabajo debe ser mayor a 0'),
  rest: z
    .number({invalid_type_error: 'Elige un tiempo de descanso válido'})
    .positive('El tiempo de descanso debe ser mayor a 0'),
});

export type Durations = z.infer<typeof durationsSchema>;

import {z} from 'zod';

export const durationsSchema = z.object({
  global: z
    .number({invalid_type_error: 'totalDurationInvalidError'})
    .positive('totalDurationPositiveError'),
  work: z
    .number({invalid_type_error: 'workDurationInvalidError'})
    .positive('workDurationPositiveError'),
  rest: z
    .number({invalid_type_error: 'restDurationInvalidError'})
    .positive('restDurationPositiveError'),
});

export type Durations = z.infer<typeof durationsSchema>;

import * as yup from 'yup';

export const curatorValidationSchema = yup.object().shape({
  specialization: yup.string().required(),
  experience: yup.number().integer().required(),
  biography: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
  museum_id: yup.string().nullable().required(),
});

import * as yup from 'yup';

export const exhibitValidationSchema = yup.object().shape({
  name: yup.string().required(),
  origin: yup.string().required(),
  age: yup.number().integer().required(),
  description: yup.string().nullable(),
  museum_id: yup.string().nullable().required(),
});

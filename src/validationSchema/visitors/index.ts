import * as yup from 'yup';

export const visitorValidationSchema = yup.object().shape({
  visit_date: yup.date().required(),
  feedback: yup.string().nullable(),
  rating: yup.number().integer().nullable(),
  user_id: yup.string().nullable().required(),
  museum_id: yup.string().nullable().required(),
  exhibit_id: yup.string().nullable().required(),
});

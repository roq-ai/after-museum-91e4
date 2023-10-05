import * as yup from 'yup';

export const ownerValidationSchema = yup.object().shape({
  ownership_date: yup.date().required(),
  ownership_duration: yup.number().integer().required(),
  ownership_status: yup.string().required(),
  user_id: yup.string().nullable().required(),
  museum_id: yup.string().nullable().required(),
});

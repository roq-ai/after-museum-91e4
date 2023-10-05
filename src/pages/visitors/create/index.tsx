import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createVisitor } from 'apiSdk/visitors';
import { visitorValidationSchema } from 'validationSchema/visitors';
import { UserInterface } from 'interfaces/user';
import { MuseumInterface } from 'interfaces/museum';
import { ExhibitInterface } from 'interfaces/exhibit';
import { getUsers } from 'apiSdk/users';
import { getMuseums } from 'apiSdk/museums';
import { getExhibits } from 'apiSdk/exhibits';
import { VisitorInterface } from 'interfaces/visitor';

function VisitorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: VisitorInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createVisitor(values);
      resetForm();
      router.push('/visitors');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<VisitorInterface>({
    initialValues: {
      visit_date: new Date(new Date().toDateString()),
      feedback: '',
      rating: 0,
      user_id: (router.query.user_id as string) ?? null,
      museum_id: (router.query.museum_id as string) ?? null,
      exhibit_id: (router.query.exhibit_id as string) ?? null,
    },
    validationSchema: visitorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Visitors',
              link: '/visitors',
            },
            {
              label: 'Create Visitor',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Visitor
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="visit_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Visit Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.visit_date ? new Date(formik.values?.visit_date) : null}
              onChange={(value: Date) => formik.setFieldValue('visit_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.feedback}
            label={'Feedback'}
            props={{
              name: 'feedback',
              placeholder: 'Feedback',
              value: formik.values?.feedback,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Rating"
            formControlProps={{
              id: 'rating',
              isInvalid: !!formik.errors?.rating,
            }}
            name="rating"
            error={formik.errors?.rating}
            value={formik.values?.rating}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<MuseumInterface>
            formik={formik}
            name={'museum_id'}
            label={'Select Museum'}
            placeholder={'Select Museum'}
            fetcher={getMuseums}
            labelField={'name'}
          />
          <AsyncSelect<ExhibitInterface>
            formik={formik}
            name={'exhibit_id'}
            label={'Select Exhibit'}
            placeholder={'Select Exhibit'}
            fetcher={getExhibits}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/visitors')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'visitor',
    operation: AccessOperationEnum.CREATE,
  }),
)(VisitorCreatePage);

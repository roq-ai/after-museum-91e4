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

import { createExhibit } from 'apiSdk/exhibits';
import { exhibitValidationSchema } from 'validationSchema/exhibits';
import { MuseumInterface } from 'interfaces/museum';
import { getMuseums } from 'apiSdk/museums';
import { ExhibitInterface } from 'interfaces/exhibit';

function ExhibitCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ExhibitInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createExhibit(values);
      resetForm();
      router.push('/exhibits');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ExhibitInterface>({
    initialValues: {
      name: '',
      origin: '',
      age: 0,
      description: '',
      museum_id: (router.query.museum_id as string) ?? null,
    },
    validationSchema: exhibitValidationSchema,
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
              label: 'Exhibits',
              link: '/exhibits',
            },
            {
              label: 'Create Exhibit',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Exhibit
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.name}
            label={'Name'}
            props={{
              name: 'name',
              placeholder: 'Name',
              value: formik.values?.name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.origin}
            label={'Origin'}
            props={{
              name: 'origin',
              placeholder: 'Origin',
              value: formik.values?.origin,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Age"
            formControlProps={{
              id: 'age',
              isInvalid: !!formik.errors?.age,
            }}
            name="age"
            error={formik.errors?.age}
            value={formik.values?.age}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('age', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <TextInput
            error={formik.errors.description}
            label={'Description'}
            props={{
              name: 'description',
              placeholder: 'Description',
              value: formik.values?.description,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<MuseumInterface>
            formik={formik}
            name={'museum_id'}
            label={'Select Museum'}
            placeholder={'Select Museum'}
            fetcher={getMuseums}
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
              onClick={() => router.push('/exhibits')}
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
    entity: 'exhibit',
    operation: AccessOperationEnum.CREATE,
  }),
)(ExhibitCreatePage);

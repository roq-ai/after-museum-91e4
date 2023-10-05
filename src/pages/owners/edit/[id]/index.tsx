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
  Center,
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
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getOwnerById, updateOwnerById } from 'apiSdk/owners';
import { ownerValidationSchema } from 'validationSchema/owners';
import { OwnerInterface } from 'interfaces/owner';
import { UserInterface } from 'interfaces/user';
import { MuseumInterface } from 'interfaces/museum';
import { getUsers } from 'apiSdk/users';
import { getMuseums } from 'apiSdk/museums';

function OwnerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<OwnerInterface>(
    () => (id ? `/owners/${id}` : null),
    () => getOwnerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OwnerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOwnerById(id, values);
      mutate(updated);
      resetForm();
      router.push('/owners');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<OwnerInterface>({
    initialValues: data,
    validationSchema: ownerValidationSchema,
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
              label: 'Owners',
              link: '/owners',
            },
            {
              label: 'Update Owner',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Owner
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="ownership_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Ownership Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.ownership_date ? new Date(formik.values?.ownership_date) : null}
              onChange={(value: Date) => formik.setFieldValue('ownership_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Ownership Duration"
            formControlProps={{
              id: 'ownership_duration',
              isInvalid: !!formik.errors?.ownership_duration,
            }}
            name="ownership_duration"
            error={formik.errors?.ownership_duration}
            value={formik.values?.ownership_duration}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('ownership_duration', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <TextInput
            error={formik.errors.ownership_status}
            label={'Ownership Status'}
            props={{
              name: 'ownership_status',
              placeholder: 'Ownership Status',
              value: formik.values?.ownership_status,
              onChange: formik.handleChange,
            }}
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
              onClick={() => router.push('/owners')}
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
    entity: 'owner',
    operation: AccessOperationEnum.UPDATE,
  }),
)(OwnerEditPage);

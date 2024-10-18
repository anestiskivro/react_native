import { Link, router } from 'expo-router';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { images } from '../../constants';
import { createUser } from '../../lib/appwrite';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledText = styled(Text);
const StyledLink = styled(Link);

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLogged } = useGlobalContext();
  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setisLogged(true);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', "There has been an error while creating the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledSafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <StyledView className='w-full justify-center min-h-[82vh] px-4 my-6'>
          <StyledImage
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />
          <StyledText className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Sign up to Aora
          </StyledText>
          <FormField
            title="Username"
            value={form.username}
            placeholder="username"
            handleChangeText={(text) => setForm(prev => ({ ...prev, username: text }))}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            placeholder="email"
            handleChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="password"
            handleChangeText={(text) => setForm(prev => ({ ...prev, password: text }))}
            otherStyles="mt-7"
            secureTextEntry
          />
          <CustomButton
            title="Sign up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            textStyles=""
          />
          <StyledView className='justify-center pt-5 flex-row gap-2'>
            <StyledText className='text-lg text-gray-100 font-pregular'>
              Have an account already?
            </StyledText>
            <StyledLink href="/sign-in" className='text-lg font-psemibold text-secondary-100'>
              Sign In
            </StyledLink>
          </StyledView>
        </StyledView>
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default SignUp;

import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { Link, useRouter } from 'expo-router'; // Import useRouter to use router functionality
import { styled } from 'nativewind';
import React, { useState } from 'react';
import { Image, ScrollView, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { getCurrentUser, signIn } from '../../lib/appwrite';
import {useGlobalContext} from '../../context/GlobalProvider';
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledText = styled(Text);
const StyledLink = styled(Link);

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setisLoggedIn } = useGlobalContext();

  const router = useRouter();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setisLoggedIn(true);
      Alert.alert("Success", "User signed in successfully");
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.message || "There has been an error during sign in");
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
            Log in to Aora
          </StyledText>
          <FormField
            title="Email"
            value={form.email}
            placeholder="email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />
          <CustomButton
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            textStyles=""
          />
          <StyledView className='justify-center pt-5 flex-row gap-2'>
            <StyledText className='text-lg text-gray-100 font-pregular'>
              Don't have an account?
            </StyledText>
            <StyledLink href="/sign-up" className='text-lg font-psemibold text-secondary-100'>
              Sign Up
            </StyledLink>
          </StyledView>
        </StyledView>
      </ScrollView>
    </StyledSafeAreaView>
  );
}

export default SignIn;

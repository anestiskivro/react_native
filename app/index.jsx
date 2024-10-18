import CustomButton from '../components/CustomButton';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { useGlobalContext } from '../context/GlobalProvider';
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const Index = () => {
  const {isLoading,isLoggedIn} = useGlobalContext();
  if(!isLoading && isLoggedIn) return <Redirect href="/home"/>
  return (
    <StyledSafeAreaView className="bg-primary flex-1">
      <StyledScrollView contentContainerStyle={{height:"100%"}}>
        <StyledView className="w-full justify-center items-center min-h-[85vh] px-4">
          <StyledImage
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <StyledImage
            source={images.cards}
            className="max-w-[380px] w-full h-[300px] mt-4"
            resizeMode="contain"
          />
          <StyledView className="relative mt-5">
            <StyledText className="text-4xl text-white font-bold text-center ">
              Discover Endless Possibilities with{' '}
              <StyledText className="text-secondary-200">Aora</StyledText>
            </StyledText>
            <StyledImage
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </StyledView>
          <StyledText className='text-sm  font-pregular text-gray-100 mt-7 text-center'>Where creativity meets innovation:
            embark on a journey of limitless exploration with Aora
          </StyledText>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
            textStyles={''}
            isLoading={''}
          />
        </StyledView>
      </StyledScrollView>
      <StatusBar backgroundColor='#161622' style='light'/>
    </StyledSafeAreaView>
  );
};

export default Index;
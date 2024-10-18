import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'
import FormField from '../../components/FormField';
import { TouchableOpacity } from 'react-native';
import { icons } from '../../constants';
import { ResizeMode, Video } from 'expo-av';
import CustomButton from '../../components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createVideo } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrolledView = styled(ScrollView);
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledVideo = styled(Video);


const Create = () => {
  const {user} = useGlobalContext();
  const [uploading, setuploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  })
  const OpenPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image'? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] })
      }
      if (selectType === 'video') {
        setForm({ ...form, video: result.assets[0] })
      }
    }
  }

  const submit = async () => {
    if (!form.prompt || !form.thumbnail || !form.video || !form.title) {
      return Alert.alert('Please fill in all the fields');
    }
    setuploading(true);
    try {
      await createVideo({
        ...form,userId: user.$id,
      })
      Alert.alert('Success','Post uploaded succesfully');
      router.push('/home');
    } catch (error) {
      Alert.alert('Error',error.message);
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
      })
      setuploading(false);
    }
  
  }
  return (
    <StyledSafeAreaView className='bg-primary h-full'>
      <StyledScrolledView className='px-4 my-6'>
        <StyledText className='text-2xl text-white font-psemibold'>Upload Video</StyledText>
        <FormField title="Video Title" value={form.title} placeholder="Give your video a title..."
          handleChangeText={(e) => setForm({ ...form, title: e })} otherStyles="mt-10" />
        <StyledView className='mt-7 space-y-2'>
          <StyledText className='text-base text-gray-100 font-pmedium'>
            Upload Video
          </StyledText>
          <StyledTouchableOpacity onPress={() => OpenPicker('video')}>
            {form.video ? (
              <StyledVideo
                source={{ uri: form.video.uri }}
                className='w-full h-64 rounded-2xl'
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <StyledView className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                <StyledView className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                  <StyledImage source={icons.upload} resizeMode='contain' className='w-1/2 h-1/2' />
                </StyledView>

              </StyledView>
            )}
          </StyledTouchableOpacity >
        </StyledView>
        <StyledView className='mt-7 space-y-2'>
          <StyledText className='text-base text-gray-100 font-pmedium'>
            Thumbnail Image
          </StyledText>

          <StyledTouchableOpacity onPress={() => OpenPicker('image')}>
            {form.thumbnail ? (
              <StyledImage
                source={{ uri: form.thumbnail.uri }}
                resizeMode='cover'
                className='w-full h-64 rounded-2xl'
              />
            ) : (
              <StyledView className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                <StyledImage source={icons.upload} resizeMode='contain' className='w-5 h-5' />
                <StyledText className='text-gray-100 font-pmedium text-sm'>
                  Choose a file
                </StyledText>
              </StyledView>
            )}
          </StyledTouchableOpacity>
        </StyledView>
        <FormField title="AI Prompt" value={form.prompt} placeholder="The prompt you used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })} otherStyles="mt-7" />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7 "
          isLoading={uploading}
        />
      </StyledScrolledView>
    </StyledSafeAreaView>
  )
}

export default Create
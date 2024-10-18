import { View, Text, FlatList , Image} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import EmptyState from '../../components/EmptyState';
import { getUserPosts, signOut } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import { TouchableOpacity } from 'react-native';
import { icons } from '../../constants';
import InfoBox from '../../components/InfoBox';
import { router } from 'expo-router';

const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);

const Profile = () => {
  const {setUser,user, setisLoggedIn} = useGlobalContext()
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

  const logout =  async ()  => {
    await signOut();
    setUser(null);
    setisLoggedIn(false);
    router.replace('/sign-in');
  }
  return (
    <StyledSafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item.videoUrl}
            title={item.title}
            thumbnail={item.thumbnailUrl}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <StyledView className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <StyledTouchableOpacity className='w-full items-end mb-10' onPress={logout}>
              <StyledImage source={icons.logout} resizeMode='contain' className='w-6 h-6'/>
            </StyledTouchableOpacity>
            <StyledView className='w-16 h-16 border-secondary rounded-lg justify-center items-center'>
              <StyledImage source={{uri:user?.avatar}} className='w-[90%] h-[90%] rounded-lg' resizeMode='cover'/>
            </StyledView>
            <InfoBox title={user?.username} containerStyles='mt-5' titleStyles="text-lg"/>
            <StyledView className='mt-5 flex-row'>
            <InfoBox title={posts.length || 0} subtitle="Posts" containerStyles='mr-10' titleStyles="text-xl"/>
            <InfoBox title="1.2k" subtitle = "Followers" titleStyles="text-xl"/>

            </StyledView>
          </StyledView>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </StyledSafeAreaView>
  );
};

export default Profile;

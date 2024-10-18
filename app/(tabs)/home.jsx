import { View, Text, FlatList, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { RefreshControl } from 'react-native';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

const Home = () => {
  const { user } = useGlobalContext()
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestposts } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefreshing = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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
          <StyledView className='my-6 px-4 space-y-6'>
            <StyledView className='justify-between flex-row items-start mb-6'>
              <StyledView>
                <StyledText className='font-pmedium text-sm text-gray-100'>
                  Welcome back!
                </StyledText>
                <StyledText className='text-2xl font-psemibold text-white'>
                  {user?.username}
                </StyledText>
              </StyledView>
              <StyledView className='mt-1.5'>
                <StyledImage
                  source={images.logoSmall}
                  className='w-9 h-10'
                  resizeMode='contain'
                />
              </StyledView>
            </StyledView>
            <SearchInput />
            <StyledView className='w-full flex-1 pt-5 pb-8'>
              <StyledText className='text-lg text-gray-100 font-pregular mb-3'>
                Latest Videos
              </StyledText>
              <Trending posts={latestposts ?? []} />
            </StyledView>
          </StyledView>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
        }
      />
    </StyledSafeAreaView>
  );
};

export default Home;

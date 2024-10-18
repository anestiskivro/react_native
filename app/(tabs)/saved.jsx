import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { searchPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getLikedVideos } from '../../lib/appwrite';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);

const Saved = () => {
  const { query } = useLocalSearchParams();
  const {user} = useGlobalContext();
  const { data: videos, refetch } = useAppwrite(() => getLikedVideos(user.$id));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    
    <StyledSafeAreaView className='bg-primary h-full'>
      <FlatList
        data={videos}
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
          <StyledView className='my-6 px-4'>
            <StyledText className='font-pmedium text-lg text-gray-100'>
              Saved Videos
            </StyledText>
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

export default Saved;

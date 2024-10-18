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
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);


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
          <StyledView className='my-6 px-4'>
            <StyledText className='font-pmedium text-sm text-gray-100'>
              Search results
            </StyledText>
            <StyledText className='text-2xl font-psemibold text-white'>
              {query}
            </StyledText>
            <StyledView className='mt-6 mb-8'>
              <SearchInput initialQuery={query} />
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

export default Search;

import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styled } from 'nativewind';
import { icons } from "../constants";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useGlobalContext } from "../context/GlobalProvider";
import { createLike } from "../lib/appwrite";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledVideo = styled(Video);

const VideoCard = ({ video, title, thumbnail, creator, avatar }) => {
  const {user} = useGlobalContext();
  const [play, setPlay] = useState(false);

  const handleLike = async () => {
    //Based on title we will find the video in appwrite update in order to add a like by the users'id
    
    await createLike(user.$id,title);
  } 
  return (
    <StyledView className="mb-6">
      <StyledView className="flex flex-row gap-3 items-start">
        <StyledView className="flex justify-center items-center flex-row flex-1">
          <StyledView className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <StyledImage
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </StyledView>
          <StyledView className="flex justify-center flex-1 ml-3 gap-y-1">
            <StyledText
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </StyledText>
            <StyledText
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </StyledText>
          </StyledView>
          <StyledView className="mx-12">
            <TouchableOpacity activeOpacity={0.7} onPress={handleLike}>
              <FontAwesomeIcon icon={faHeart} color={'red'} size={25} />
            </TouchableOpacity>
          </StyledView>
        </StyledView>
        <StyledView className="pt-2">
          <StyledImage source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </StyledView>
      </StyledView>

      {play ? (
        <StyledVideo
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <StyledTouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <StyledImage
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <StyledImage
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </StyledTouchableOpacity>
      )}
    </StyledView>
  );
};

export default VideoCard;

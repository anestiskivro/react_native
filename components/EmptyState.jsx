import { router } from "expo-router";
import { View, Text, Image } from "react-native";
import { styled } from "nativewind";
import { images } from "../constants";
import CustomButton from "./CustomButton";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const EmptyState = ({ title, subtitle }) => {
  return (
    <StyledView className="flex justify-center items-center px-4">
      <StyledImage
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />

      <StyledText className="text-sm font-pmedium text-gray-100">{title}</StyledText>
      <StyledText className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </StyledText>

      <CustomButton
        title="Back to Explore"
        handlePress={() => router.push("/home")}
        containerStyles="w-full my-5"
      />
    </StyledView>
  );
};

export default EmptyState;

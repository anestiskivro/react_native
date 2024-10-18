import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledActivityIndicator = styled(ActivityIndicator);

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <StyledTouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
    >
      <StyledText className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</StyledText>
      {isLoading && <StyledActivityIndicator animating={isLoading} color="#fff" size="small" className="ml-2" />}
    </StyledTouchableOpacity>
  );
};

export default CustomButton;

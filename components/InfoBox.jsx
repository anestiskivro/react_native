import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <StyledView className={containerStyles}>
      <StyledText className={`text-white text-center font-psemibold ${titleStyles}`}>{title}</StyledText>
      <StyledText className="text-sm text-gray-100 text-center font-pregular">{subtitle}</StyledText>
    </StyledView>
  );
};

export default InfoBox;

import React, {FC} from 'react';
import {FadeAnimatedView} from './FadeAnimatedView';
import {Layout} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';
import {useTimer} from '../hooks/useTimerContext';
import {TextButton} from './TextButton';
import {TextInput} from './TextInput';
import {useLanguage} from '../hooks/useLanguageContext';

type Props = {
  layout: Layout;
};

export const DurationsForm: FC<Props> = ({layout}) => {
  const {
    durationText,
    setDurationText,
    workText,
    setWorkText,
    restText,
    setRestText,
    toggleGlobalTimeMode,
    toggleWorkTimeMode,
    toggleRestTimeMode,
    globalTimeMode,
    workTimeMode,
    restTimeMode,
  } = useTimer();

  const {label} = useLanguage();

  return (
    <FadeAnimatedView layout={layout}>
      <View style={styles.container}>
        <TextInput
          placeholder={label('totalDuration')}
          value={durationText}
          maxLength={9}
          onChangeText={setDurationText}
          inputMode="decimal"
          style={styles.textInput}
          testID="total-duration-input"
        />
        <TextButton
          style={styles.button}
          underline
          onPress={toggleGlobalTimeMode}>
          {globalTimeMode === 'minutes'
            ? label('minutesTag')
            : label('hoursTag')}
        </TextButton>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder={label('workDuration')}
          value={workText}
          maxLength={9}
          onChangeText={setWorkText}
          inputMode="decimal"
          style={styles.textInput}
          testID="work-duration-input"
        />
        <TextButton
          style={styles.button}
          underline
          onPress={toggleWorkTimeMode}>
          {workTimeMode === 'minutes'
            ? label('minutesTag')
            : label('secondsTag')}
        </TextButton>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder={label('restDuration')}
          value={restText}
          maxLength={9}
          onChangeText={setRestText}
          inputMode="decimal"
          style={styles.textInput}
          testID="rest-duration-input"
        />
        <TextButton
          style={styles.button}
          underline
          onPress={toggleRestTimeMode}>
          {restTimeMode === 'minutes'
            ? label('minutesTag')
            : label('secondsTag')}
        </TextButton>
      </View>
    </FadeAnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInputContainer: {
    marginLeft: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
  },
  button: {
    width: 70,
  },
});

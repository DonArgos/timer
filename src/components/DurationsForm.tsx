import React, {FC, useContext} from 'react';
import {FadeAnimatedView} from './FadeAnimatedView';
import {Layout} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';
import {TimerContext} from '../hooks/useTimerContext';
import {TextButton} from './TextButton';
import {TextInput} from './TextInput';
import {useAtom} from 'jotai';
import {
  globalTimeModeAtom,
  restTimeModeAtom,
  workTimeModeAtom,
} from '../atoms/timer';
import {useLanguage} from '../hooks/useLanguage';

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
  } = useContext(TimerContext) || {};

  const {label} = useLanguage();

  const [globalTimeMode, setGlobalTimeMode] = useAtom(globalTimeModeAtom);
  const [workTimeMode, setWorkTimeMode] = useAtom(workTimeModeAtom);
  const [restTimeMode, setRestTimeMode] = useAtom(restTimeModeAtom);

  return (
    <FadeAnimatedView layout={layout}>
      <View style={styles.container}>
        <TextInput
          placeholder={label('totalDuration')}
          value={durationText}
          maxLength={9}
          onChangeText={text => setDurationText?.(text)}
          inputMode="decimal"
          style={styles.textInput}
        />
        <TextButton
          style={styles.button}
          underline
          onPress={() =>
            setGlobalTimeMode(value => {
              if (value === 'minutes') {
                return 'hours';
              }
              return 'minutes';
            })
          }>
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
          onChangeText={text => setWorkText?.(text)}
          inputMode="decimal"
          style={styles.textInput}
        />
        <TextButton
          style={styles.button}
          underline
          onPress={() =>
            setWorkTimeMode(value => {
              if (value === 'minutes') {
                return 'seconds';
              }
              return 'minutes';
            })
          }>
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
          onChangeText={text => setRestText?.(text)}
          inputMode="decimal"
          style={styles.textInput}
        />
        <TextButton
          style={styles.button}
          underline
          onPress={() =>
            setRestTimeMode(value => {
              if (value === 'minutes') {
                return 'seconds';
              }
              return 'minutes';
            })
          }>
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

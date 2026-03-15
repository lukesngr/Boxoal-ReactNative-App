import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  startBackgroundWork(timebox: string, schedule: string, recordingStartTime: string): void;
  stopBackgroundWork(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'BackgroundModule',
);

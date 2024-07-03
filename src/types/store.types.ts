import {Action, ThunkAction, ThunkDispatch} from '@reduxjs/toolkit';
import {GlobalState} from './global.types';
import {SettingsStateProps} from './settings.types';
import {AuthenticationState} from './authentication.types';
import {UserProfileState} from './user.types';

export interface RootReduxState {
  global: GlobalState;
  settings: SettingsStateProps;
  authentication: AuthenticationState;
  userProfile: UserProfileState;
}

export type AppDispatch = ThunkDispatch<
  RootReduxState,
  unknown,
  Action<string>
>;

export type AppThunk<T = Promise<void> | void> = ThunkAction<
  T,
  RootReduxState,
  unknown,
  Action<string>
>;

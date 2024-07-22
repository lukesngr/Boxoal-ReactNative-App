import React from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react-native';
import { configureAmplify } from '../modules/awsConfig';

configureAmplify();

export default function Login() {
  return (
    <Authenticator.Provider>
      <Authenticator>
        </Authenticator>
    </Authenticator.Provider>
  );
}
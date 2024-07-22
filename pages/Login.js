import React from 'react';
import { Amplify } from 'aws-amplify';

import { configureAmplify } from '../modules/awsConfig';
import { Button, StyleSheet, Text, View } from 'react-native';
import { signIn } from 'aws-amplify/auth';
configureAmplify();

export default function Login() {
    
  return (
    <></>
  );
}

/**
 * @jest-environment jsdom
 */

import { Dialog } from "react-native-paper";
import CorrectModalDisplayer from "../../components/modals/CorrectModalDisplayer";
import { renderWithProviders } from "../renderWithProviders";
import { Text } from "react-native";


jest.mock('react-native', () => ({
    Image: 'Image',
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    BackHandler: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn(),
    },
    StyleSheet: {
      create: jest.fn(),
    },
    Animated: {
      View: 'Animated.View',
      createAnimatedComponent: (component) => component,
      timing: jest.fn(),
      spring: jest.fn(),
      Value: jest.fn(),
    },
  }));

  jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  }));
  
  jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  }));
  
  jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) => children,
      Screen: ({ children }) => children,
    }),
  }));

  jest.mock('aws-amplify', () => ({
    Amplify: {
      configure: jest.fn(),
    },
    Auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      currentAuthenticatedUser: jest.fn(),
    },
    API: {
      graphql: jest.fn(),
    },
  }));

  jest.mock('aws-amplify/auth', () => ({
    signOut: jest.fn(),
    signIn: jest.fn(),
  }));

  jest.mock('@notifee/react-native', () => ({
    notifee: {
      requestPermission: jest.fn(),
      createChannel: jest.fn(),
    },
  }));

  jest.mock('@aws-amplify/ui-react-native', () => ({
    useAuthenticator: jest.fn().mockReturnValue({
      signOut: jest.fn(),
      user: {
        username: 'testUser',
        // add other user properties you need
      },
      authStatus: 'authenticated', // or 'unauthenticated', etc
      // add other properties your code uses from useAuthenticator
    })
  }));

  jest.mock('react-native-paper', () => {
    const Dialog = (props) => props.children;
    Dialog.Title = (props) => props.children;
    Dialog.Content = (props) => props.children;
    Dialog.Actions = (props) => props.children;

    return {
      Dialog,
      Button: 'Button',
      Card: 'Card',
      Text: 'Text',
      Modal: 'Modal',
      Portal: 'Portal',
    };
  });

  jest.mock('react-native-paper/react-navigation', () => ({
    createMaterialBottomTabNavigator: () => ({
      Navigator: 'Navigator',
      Screen: 'Screen',
    })
  }));

  jest.mock('react-native-date-picker', () => ({
    DatePicker: 'DatePicker',
  }));
  jest.mock('react-native-svg', () => ({
    Svg: 'Svg',
    Circle: 'Circle',
    Text: 'Text',
  }));

describe('CorrectModalDisplayerIntTest', () => {
    describe('CorrectModalDisplayer CreateTimeboxForm', () => {
        test('CreateTimeboxForm renders correctly', () => {
            const initialState = {modalVisible: 
            {value: 
              {visible: true, 
                props: {date: "20/11", dayName: "Wed", time: "21:30"}
              }
            }};
            const { getByText } = renderWithProviders(<CorrectModalDisplayer/>, {
                preloadedState: initialState
            })
            
            const element = getByText('Create Timebox');
            expect(element).toBeInTheDocument();
        });
    });
});
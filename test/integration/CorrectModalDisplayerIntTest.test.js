import CorrectModalDisplayer from "../../components/modals/CorrectModalDisplayer";
import { renderWithProviders } from "../renderWithProviders";

import 'react-native-gesture-handler/jestSetup';

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

  jest.mock('react-native-paper', () => ({
    Button: 'Button',
    Card: 'Card',
    Text: 'Text',
    Modal: 'Modal',
    Portal: 'Portal',
    // Add any other components you're using
  }));

  jest.mock('react-native-paper/react-navigation', () => ({
    createMaterialBottomTabNavigator: () => ({
      Navigator: 'Navigator',
      Screen: 'Screen',
    })
  }));

  jest.mock('react-native-date-picker', () => ({
    DatePicker: 'DatePicker',
  }));

describe('CorrectModalDisplayerIntTest', () => {
    describe('CorrectModalDisplayer CreateTimeboxForm', () => {
        test('CreateTimeboxForm renders correctly', () => {
            const modalVisible = {"props": {"date": "20/11", "dayName": "Wed", "time": "21:30"}, "visible": true}
            const { getByText } = renderWithProviders(<CorrectModalDisplayer/>, {
                preloadedState: {
                    modalVisible: modalVisible
                }
            })
            
            const element = getByText('Create Timebox');
            expect(element).toBeInTheDocument();
        });
    });
});
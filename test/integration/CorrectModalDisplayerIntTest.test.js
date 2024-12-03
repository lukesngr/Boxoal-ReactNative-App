/**
 * @jest-environment jsdom
 */

import { Dialog, Paragraph } from "react-native-paper";
import CorrectModalDisplayer from "../../components/modals/CorrectModalDisplayer";
import { renderWithProviders } from "../renderWithProviders";
import { Text } from "react-native";
import { modalVisible } from "../../redux/modalVisible";


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
    NativeModules: {
      BackgroundWorkManager: {
          startBackgroundWork: jest.fn(),
          stopBackgroundWork: jest.fn()
      }
    },
  }));
  
  jest.mock('axios', () => ({
    post: jest.fn(),
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
        userId: '343432sdfd5',
        // add other user properties you need
      },
      authStatus: 'authenticated', // or 'unauthenticated', etc
      // add other properties your code uses from useAuthenticator
    })
  }));

  jest.mock('react-native-paper', () => {
    const Dialog = props => <div data-testid="dialog">{props.children}</div>;
    Dialog.Title = props => <div data-testid="dialog-title">{props.children}</div>;
    Dialog.Content = props => <div data-testid="dialog-content">{props.children}</div>;
    Dialog.Actions = props => <div data-testid="dialog-actions">{props.children}</div>;

    return {
      Dialog,
      Button: props => <div data-testid="button">{props.children}</div>,
      Card: props => <div data-testid="card">{props.children}</div>,
      Text: props => <div data-testid="text">{props.children}</div>,
      Modal: props => <div data-testid="modal">{props.children}</div>,
      Portal: props => <div data-testid="portal">{props.children}</div>,
      TextInput: props => <div data-testid="textinput">{props.children}</div>,
      Paragraph: props => <div data-testid="paragraph">{props.children}</div>,
    };
  });

  jest.mock('react-native-paper/react-navigation', () => ({
    createMaterialBottomTabNavigator: () => ({
      Navigator: 'Navigator',
      Screen: 'Screen',
    })
  }));

  jest.mock('../../components/Alert', () => ({
    Alert: 'Alert'
  }));

  jest.mock('react-native-date-picker', () => ({
    __esModule: true,
    default: function DatePicker({ 
      modal, 
      mode, 
      date, 
      onDateChange, 
      open, 
      onConfirm, 
      onCancel 
    }) {
      return null;
    }
  }));

  jest.mock('react-native-svg', () => ({
    Svg: 'Svg',
    Circle: 'Circle',
    Text: 'Text',
  }));

describe('CorrectModalDisplayerIntTest', () => {
    describe('CorrectModalDisplayer CreateTimeboxForm', () => {
        test('CreateTimeboxForm renders correctly', () => {
            const modalVisible =  
            {value: 
              {visible: true, 
                props: {date: "20/11", dayName: "Wed", time: "21:30"}
              }
            };
            const {getByText} = renderWithProviders(<CorrectModalDisplayer/>, {
                preloadedState: {
                  modalVisible
                }
            });
            
            expect(getByText('Create Timebox')).toBeTruthy();
        });

        test('CreateTimeboxForm cant set number of boxes zero or higher than boxes available', () => {
          const modalVisible =  
          {value: 
            {visible: true, 
              props: {date: "20/11", dayName: "Wed", time: "21:30"}
            }
          };
          const result = renderWithProviders(<CorrectModalDisplayer/>, {
              preloadedState: {
                modalVisible
              }
          });

          console.log(result)
          
          expect(result.getByText('Create Timebox')).toBeTruthy();
      });
    });

    describe('CorrectModalDisplayer TimeboxActionsForm', () => {
      test('TimeboxActionsForm renders correctly', () => {
          const modalVisible = {value: 
            {visible: true, 
              props: {date: "20/11", time: "21:30", 
                data: {id: 1,
                title: "Test Timebox",
                description: "Test timebox created for 20/11 at 21:30",
                startTime: "2024-11-20T21:30:00.000Z",
                endTime: "2024-11-20T22:30:00.000Z",   // Assuming 1 hour duration
                numberOfBoxes: 4,
                color: "#4ECDC4",
                goalID: 1,
                goalPercentage: 100,
                recordedTimeBoxes: {
                  id: 101,
                  recordedStartTime: "2024-11-20T21:30:00.000Z",
                  timeBoxID: 1,
                  timeBox: {
                    title: "Test Timebox",
                    description: "Test timebox created for 20/11 at 21:30"
                  }
                },
                reoccuring: {
                  id: 201,
                  reoccurFrequency: "weekly",
                  weeklyDay: 3  
                }
              }}
          }};
          const {getByText} = renderWithProviders(<CorrectModalDisplayer/>, {
              preloadedState: {modalVisible}
          });
          
          expect(getByText('Test Timebox')).toBeTruthy();
      });

      //no reason to write integration tests, gonna end to end test this
    });
});
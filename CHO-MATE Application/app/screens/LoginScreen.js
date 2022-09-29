import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, ImageBackground, View, Image, Button } from 'react-native';
import { TextInput } from 'react-native-paper';

import AppButton from '../components/AppButton';
import { FormErrorMessage } from '../components/FormErrorMessage';
import colors from '../config/colors';
import { auth } from '../config/firebase';
import { loginValidationSchema } from '../utils';

function LoginScreen({ navigation }) {
  const [errorState, setErrorState] = React.useState('');
  const handleLogin = (values) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      if (error.code === 'auth/wrong-password') {
        setErrorState('Error: Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorState('Error: User not found. Check the email provided.');
      } else {
        setErrorState(error.message);
      }
    });
  };

  function clearState() {
    setErrorState('');
  }

  return (
    <>
      <ImageBackground
        blurRadius={10}
        style={styles.background}
        source={require('../assets/background.jpg')}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../assets/CHO-Mate-No-Tag.png')} />
          <Image style={styles.tagline} source={require('../assets/CHO-Mate-Name.png')} />
        </View>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => handleLogin(values)}>
          {({ values, errors, handleChange, handleSubmit, handleBlur }) => (
            <>
              {/* Input fields */}
              <View style={styles.textContainer}>
                <TextInput
                  style={styles.input}
                  theme={{ roundness: 5 }}
                  selectionColor={colors.primary}
                  underlineColor={colors.primary}
                  activeUnderlineColor={colors.primary}
                  autoFocus
                  keyboardType="email-address"
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  onFocus={clearState}
                />
                <TextInput
                  theme={{ roundness: 5 }}
                  secureTextEntry
                  selectionColor={colors.secondary}
                  underlineColor={colors.secondary}
                  activeUnderlineColor={colors.secondary}
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  onFocus={clearState}
                />
              </View>
              <FormErrorMessage
                error={errors.email || errors.password}
                visible={errors.email || errors.password}
              />
              {errorState !== '' ? <FormErrorMessage error={errorState} visible /> : null}
              <View style={{ width: '45%' }}>
                <AppButton textSize={25} title="Login" onPress={handleSubmit} />
              </View>
              <Button
                color={colors.secondary}
                title="Forgot your password?"
                onPress={() => navigation.navigate('ForgotPassword')}
              />
              <Button
                color={colors.medium}
                title="Create a new account"
                onPress={() => navigation.navigate('Signup')}
              />
            </>
          )}
        </Formik>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  input: {
    marginVertical: 15,
  },
  textContainer: {
    padding: 20,
    width: '90%',
  },
  logo: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    top: 70,
    alignItems: 'center',
    marginBottom: 70,
  },
  tagline: {
    paddingVertical: 20,
    resizeMode: 'contain',
    height: 55,
  },
});

export default LoginScreen;

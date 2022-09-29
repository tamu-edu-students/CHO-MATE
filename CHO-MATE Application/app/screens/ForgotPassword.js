import { sendPasswordResetEmail } from 'firebase/auth';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, ImageBackground, View, Image, Button, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

import AppButton from '../components/AppButton';
import { FormErrorMessage } from '../components/FormErrorMessage';
import colors from '../config/colors';
import { auth } from '../config/firebase';
import { passwordResetSchema } from '../utils';

function ForgotPassword({ navigation }) {
  const [errorState, setErrorState] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const resetPassword = (email) => {
    sendPasswordResetEmail(auth, email)
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          setErrorState('Error: Invalid email address.');
          setIsError(true);
          console.log(error.code);
        } else if (error.code === 'auth/user-not-found') {
          setErrorState('Error: User not found. Check the email provided.');
          setIsError(true);
          console.log(error.code);
        } else {
          setErrorState(error.message);
          setIsError(true);
          console.log(error);
        }
      })
      .then(() => {
        if (!isError) {
          setSuccess(true);
          setErrorState('Success! Password reset email sent.');
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
          }}
          validationSchema={passwordResetSchema}
          onSubmit={(values) => resetPassword(values.email)}>
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
              </View>
              <FormErrorMessage error={errors.email} visible={errors.email} />
              {isError ? <FormErrorMessage error={errorState} visible /> : null}
              {success ? (
                <FormErrorMessage error={errorState} visible={success} color={colors.success} />
              ) : null}
              <View style={{ width: '60%' }}>
                <AppButton textSize={25} title="Reset Password" onPress={handleSubmit} />
              </View>
              <Button
                color={colors.medium}
                title="Login"
                onPress={() => navigation.navigate('Login')}
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

export default ForgotPassword;

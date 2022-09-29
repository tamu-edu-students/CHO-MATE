import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, ImageBackground, View, Image, Button } from 'react-native';
import { TextInput } from 'react-native-paper';

import AppButton from '../components/AppButton';
import { FormErrorMessage } from '../components/FormErrorMessage';
import colors from '../config/colors';
import { auth } from '../config/firebase';
import { signupValidationSchema } from '../utils';

function SignupScreen({ navigation }) {
  const [errorState, setErrorState] = React.useState('');
  const handleSignup = async (values) => {
    const { name, email, password } = values;

    createUserWithEmailAndPassword(auth, email, password)
      .then((UserCredential) =>
        updateProfile(UserCredential.user, {
          displayName: String(name),
        })
      )
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setErrorState('Error: User already exists. Try logging in instead.');
        } else {
          setErrorState(error.message);
        }
      });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {});

    return unsubscribe;
  }, [navigation]);

  return (
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
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={signupValidationSchema}
        onSubmit={(values) => handleSignup(values)}>
        {({ values, touched, errors, handleChange, handleSubmit, handleBlur }) => (
          <>
            <View style={styles.textContainer}>
              <TextInput
                theme={{ roundness: 5 }}
                style={styles.input}
                selectionColor={colors.primary}
                underlineColor={colors.primary}
                activeUnderlineColor={colors.primary}
                label="First Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              <TextInput
                theme={{ roundness: 5 }}
                style={styles.input}
                selectionColor={colors.primary}
                underlineColor={colors.primary}
                activeUnderlineColor={colors.primary}
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <TextInput
                theme={{ roundness: 5 }}
                style={styles.input}
                secureTextEntry
                selectionColor={colors.secondary}
                underlineColor={colors.secondary}
                activeUnderlineColor={colors.secondary}
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <TextInput
                theme={{ roundness: 5 }}
                secureTextEntry
                selectionColor={colors.secondary}
                underlineColor={colors.secondary}
                activeUnderlineColor={colors.secondary}
                label="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
              />
            </View>
            <FormErrorMessage
              error={errors.name || errors.email || errors.password || errors.confirmPassword}
              visible={touched.name || touched.email || touched.password || touched.confirmPassword}
            />
            {errorState !== '' ? <FormErrorMessage error={errorState} visible /> : null}
            <View style={{ width: '45%' }}>
              <AppButton onPress={handleSubmit} textSize={25} title="Sign Up" />
            </View>
          </>
        )}
      </Formik>
      <Button color={colors.medium} title="Login" onPress={() => navigation.goBack()} />
    </ImageBackground>
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
    marginBottom: 15,
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

export default SignupScreen;

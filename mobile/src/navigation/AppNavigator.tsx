import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { StudentFormScreen } from '../screens/StudentFormScreen';
import { TeacherFormScreen } from '../screens/TeacherFormScreen';
import { SubjectFormScreen } from '../screens/SubjectFormScreen';
import { GradesScreen } from '../screens/GradesScreen';
import { theme } from '../styles/theme';
import { StudentListScreen } from '../screens/StudentListScreen';
import { TeacherListScreen } from '../screens/TeacherListScreen';
import { SubjectListScreen } from '../screens/SubjectListScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'App Scholar', headerLeft: () => null }} />
            <Stack.Screen name="StudentForm" component={StudentFormScreen} options={{ title: 'Cadastro de Aluno' }} />
            <Stack.Screen name="StudentList" component={StudentListScreen} options={{ title: 'Alunos Cadastrados' }} />
            <Stack.Screen name="TeacherForm" component={TeacherFormScreen} options={{ title: 'Cadastro de Professor' }} />
            <Stack.Screen name="TeacherList" component={TeacherListScreen} options={{ title: 'Professores Cadastrados' }} />
            <Stack.Screen name="SubjectForm" component={SubjectFormScreen} options={{ title: 'Cadastro de Disciplina' }} />
            <Stack.Screen
              name="SubjectList"
              component={SubjectListScreen}
              options={{ title: 'Disciplinas Cadastradas' }}
            />

            <Stack.Screen name="Grades" component={GradesScreen} options={{ title: 'Boletim' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
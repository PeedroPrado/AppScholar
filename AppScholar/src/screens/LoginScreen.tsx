import React, {useState} from 'react';
import {
    View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../style/theme';

export function LoginScreen () {
    const { signIn } = useAuth();

    const [ email, setEmail ] = useState ('');
    const [ password, setPassword ] = useState ('');
    const [ emailError, setEmailError ] = useState('');
    const [ passwordError, setPasswordError ] = useState('');
    const [ loading, setLoading ] = useState(false);

    function validade(): boolean{
        let valid = true;
        setEmailError('');
        setPasswordError('');

        if(!email.trim()) {
            setEmailError('Email é obrigatório');
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('E-mail inválido');
            valid = false;
        }
        if(!password.trim()) {
            setPasswordError('Senha é obrigatória');
            valid = false;
        }
        return valid;
    }

    async function handleLogin(){
        if (!validade ()) return;
        setLoading(true);
        const sucess = await signIn(email, password);
        setLoading(false);
        if (!sucess){
            Alert.alert('Erro', 'Credencial inválidas. Tente novamente')
        }
        // Se success === true, o AuthContext atualiza o user e o Navigator redireciona automaticamente
    }
    return (
        <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>📚</Text>
          <Text style={styles.title}>App Scholar</Text>
          <Text style={styles.subtitle}>Fatec Jacareí</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>
          <Input
            label="E-mail institucional"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="admin@fatec.sp.gov.br"
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
            placeholder="••••••••"
          />
          <Button title="Entrar" onPress={handleLogin} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.lg },
  header: { alignItems: 'center', marginBottom: theme.spacing.xl },
  logo: { fontSize: 56 },
  title: { fontSize: theme.fontSize.xxl, fontWeight: '800', color: theme.colors.primary, marginTop: 8 },
  subtitle: { fontSize: theme.fontSize.md, color: theme.colors.textLight },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.lg },
});
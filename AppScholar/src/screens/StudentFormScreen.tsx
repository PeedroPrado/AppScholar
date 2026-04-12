import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../style/theme';
import { Student } from '../types';
import { useData } from '../context/DataContext';

// Gera um ID único simples (na Parte 2 virá do banco)
function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

// Estado inicial limpo — facilita o reset do formulário
const EMPTY_FORM = {
  name: '',
  enrollment: '',
  course: '',
  email: '',
  phone: '',
  zipCode: '',
  address: '',
  city: '',
  state: '',
};

export function StudentFormScreen() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [loading, setLoading] = useState(false);

  // Atualiza apenas o campo alterado, mantendo o restante intacto
  function handleChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    // Remove o erro do campo assim que o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }

  // Busca endereço automaticamente pelo CEP usando a API pública ViaCEP
  async function handleZipCode(cep: string) {
    handleChange('zipCode', cep);
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            address: data.logradouro,
            city: data.localidade,
            state: data.uf,
          }));
        }
      } catch {
        // Se a API falhar, o usuário preenche manualmente
      }
    }
  }

  function validate(): boolean {
    const newErrors: Partial<typeof EMPTY_FORM> = {};

    if (!form.name.trim())       newErrors.name = 'Nome é obrigatório';
    if (!form.enrollment.trim()) newErrors.enrollment = 'Matrícula é obrigatória';
    if (!form.course.trim())     newErrors.course = 'Curso é obrigatório';

    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!form.zipCode.trim())  newErrors.zipCode = 'CEP é obrigatório';
    if (!form.address.trim())  newErrors.address = 'Endereço é obrigatório';
    if (!form.city.trim())     newErrors.city = 'Cidade é obrigatória';
    if (!form.state.trim())    newErrors.state = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

const { addStudent } = useData();

  // Substitua o handleSubmit completo:
async function handleSubmit() {
  if (!validate()) return;
  setLoading(true);
  await new Promise(resolve => setTimeout(resolve, 800));

  const newStudent: Student = {
    id: generateId(),
    ...form,
  };

  addStudent(newStudent); // salva no contexto global
  console.log('Aluno cadastrado:', newStudent);

  setLoading(false);
  Alert.alert(
    'Sucesso! 🎓',
    `Aluno "${newStudent.name}" cadastrado com matrícula ${newStudent.enrollment}.`,
    [{ text: 'OK', onPress: () => setForm(EMPTY_FORM) }]
  );
}
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Seção: Dados Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Dados Pessoais</Text>

          <Input
            label="Nome completo *"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
            error={errors.name}
            placeholder="Ex: João da Silva"
            autoCapitalize="words"
          />
          <Input
            label="Matrícula *"
            value={form.enrollment}
            onChangeText={v => handleChange('enrollment', v)}
            error={errors.enrollment}
            placeholder="Ex: DSM2025001"
            autoCapitalize="characters"
          />
          <Input
            label="Curso *"
            value={form.course}
            onChangeText={v => handleChange('course', v)}
            error={errors.course}
            placeholder="Ex: Desenvolvimento de Software Multiplataforma"
            autoCapitalize="words"
          />
        </View>

        {/* Seção: Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contato</Text>

          <Input
            label="E-mail *"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            error={errors.email}
            placeholder="joao@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Telefone *"
            value={form.phone}
            onChangeText={v => handleChange('phone', v)}
            error={errors.phone}
            placeholder="(12) 99999-0000"
            keyboardType="phone-pad"
          />
        </View>

        {/* Seção: Endereço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Endereço</Text>

          <Input
            label="CEP *"
            value={form.zipCode}
            onChangeText={handleZipCode}
            error={errors.zipCode}
            placeholder="12345-678"
            keyboardType="numeric"
            maxLength={9}
          />

          {/* Dica visual para o usuário */}
          <Text style={styles.hint}>
            💡 Digite o CEP para preencher endereço automaticamente
          </Text>

          <Input
            label="Endereço *"
            value={form.address}
            onChangeText={v => handleChange('address', v)}
            error={errors.address}
            placeholder="Rua, número, bairro"
          />

          {/* Cidade e Estado lado a lado */}
          <View style={styles.row}>
            <View style={styles.rowFlex}>
              <Input
                label="Cidade *"
                value={form.city}
                onChangeText={v => handleChange('city', v)}
                error={errors.city}
                placeholder="Jacareí"
              />
            </View>
            <View style={styles.rowSmall}>
              <Input
                label="UF *"
                value={form.state}
                onChangeText={v => handleChange('state', v.toUpperCase())}
                error={errors.state}
                placeholder="SP"
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <Button title="Cadastrar Aluno" onPress={handleSubmit} loading={loading} />
        <Button
          title="Limpar formulário"
          onPress={() => { setForm(EMPTY_FORM); setErrors({}); }}
          variant="secondary"
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
    marginTop: -theme.spacing.sm,
    fontStyle: 'italic',
  },
  row: { flexDirection: 'row', gap: theme.spacing.sm },
  rowFlex: { flex: 3 },
  rowSmall: { flex: 1 },
  bottomSpacing: { height: theme.spacing.xl },
});
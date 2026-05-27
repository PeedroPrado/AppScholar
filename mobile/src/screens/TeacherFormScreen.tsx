import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import { createTeacher } from '../services/teacherService';



// Opções de titulação para o seletor customizado
const TITULATIONS = ['Graduação', 'Especialização', 'Mestrado', 'Doutorado', 'Pós-Doutorado'];

const EMPTY_FORM = {
  nome: '',
  titulacao: '',
  area: '',
  tempoDocencia: '',
  email: '',
};

export function TeacherFormScreen() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [loading, setLoading] = useState(false);
  // Controla se o seletor de titulação está visível
  const [showTitulationPicker, setShowTitulationPicker] = useState(false);

  function handleChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function selectTitulation(title: string) {
    handleChange('titulacao', title);
    setShowTitulationPicker(false);
  }

  function validate(): boolean {
    const newErrors: Partial<typeof EMPTY_FORM> = {};

    if (!form.nome.trim())  newErrors.nome = 'Nome é obrigatório';
    if (!form.titulacao.trim()) newErrors.titulacao = 'Titulação é obrigatória';
    if (!form.area.trim())  newErrors.area = 'Área de atuação é obrigatória';

    if (!form.tempoDocencia.trim()) {
      newErrors.tempoDocencia = 'Tempo de docência é obrigatório';
    } else if (isNaN(Number(form.tempoDocencia)) || Number(form.tempoDocencia) < 0) {
      newErrors.tempoDocencia = 'Informe um número válido';
    }

    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }



 async function handleSubmit() {

  if (!validate()) return;

  setLoading(true);

  try {

    const newTeacher =
      await createTeacher({

        nome: form.nome,

        titulacao: form.titulacao,

        area: form.area,

        tempoDocencia:
          Number(form.tempoDocencia),

        email: form.email,
      });

    Alert.alert(
      "Sucesso 👨‍🏫",
      `Professor "${newTeacher.nome}" cadastrado com sucesso!`
    );

    setForm(EMPTY_FORM);

  } catch (error) {

    console.log(error);

    Alert.alert(
      "Erro",
      "Não foi possível cadastrar professor"
    );

  } finally {

    setLoading(false);
  }
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🏫 Dados do Professor</Text>

          <Input
            label="Nome completo *"
            value={form.nome}
            onChangeText={v => handleChange('nome', v)}
            error={errors.nome}
            placeholder="Ex: Prof. Dr. Carlos Mendes"
            autoCapitalize="words"
          />

          {/* Seletor customizado de titulação */}
          <Text style={styles.label}>Titulação *</Text>
          <TouchableOpacity
            style={[
              styles.selector,
              errors.titulacao ? styles.selectorError : null,
            ]}
            onPress={() => setShowTitulationPicker(!showTitulationPicker)}
            activeOpacity={0.8}
          >
            <Text style={form.titulacao ? styles.selectorText : styles.selectorPlaceholder}>
              {form.titulacao || 'Selecione a titulação'}
            </Text>
            <Text style={styles.selectorIcon}>
              {showTitulationPicker ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          {errors.titulacao ? (
            <Text style={styles.errorText}>{errors.titulacao}</Text>
          ) : null}

          {/* Lista de opções */}
          {showTitulationPicker && (
            <View style={styles.pickerList}>
              {TITULATIONS.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.pickerItem,
                    form.titulacao === t && styles.pickerItemSelected,
                  ]}
                  onPress={() => selectTitulation(t)}
                >
                  <Text style={[
                    styles.pickerItemText,
                    form.titulacao === t && styles.pickerItemTextSelected,
                  ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Input
            label="Área de atuação *"
            value={form.area}
            onChangeText={v => handleChange('area', v)}
            error={errors.area}
            placeholder="Ex: Desenvolvimento Web, Mobile"
            autoCapitalize="words"
          />

          <Input
            label="Tempo de docência (anos) *"
            value={form.tempoDocencia}
            onChangeText={v => handleChange('tempoDocencia', v)}
            error={errors.tempoDocencia}
            placeholder="Ex: 5"
            keyboardType="numeric"
          />

          <Input
            label="E-mail *"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            error={errors.email}
            placeholder="professor@fatec.sp.gov.br"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Card de preview antes de salvar */}
        {form.nome || form.titulacao ? (
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Preview</Text>
            <Text style={styles.previewName}>{form.nome || '—'}</Text>
            <Text style={styles.previewSub}>
              {form.titulacao} {form.area ? `· ${form.area}` : ''}
            </Text>
          </View>
        ) : null}

        <Button title="Cadastrar Professor" onPress={handleSubmit} loading={loading} />
        <Button
          title="Limpar formulário"
          onPress={() => { setForm(EMPTY_FORM); setErrors({}); }}
          variant="secondary"
        />
        <View style={{ height: theme.spacing.xl }} />
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
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    marginBottom: theme.spacing.xs,
  },
  selectorError: { borderColor: theme.colors.error },
  selectorText: { fontSize: theme.fontSize.md, color: theme.colors.text },
  selectorPlaceholder: { fontSize: theme.fontSize.md, color: theme.colors.textLight },
  selectorIcon: { color: theme.colors.textLight },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  pickerList: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerItemSelected: { backgroundColor: theme.colors.primary + '15' },
  pickerItemText: { fontSize: theme.fontSize.md, color: theme.colors.text },
  pickerItemTextSelected: { color: theme.colors.primary, fontWeight: '700' },
  preview: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  previewTitle: { fontSize: 11, fontWeight: '700', color: theme.colors.primary, marginBottom: 4 },
  previewName: { fontSize: theme.fontSize.lg, fontWeight: '700', color: theme.colors.text },
  previewSub: { fontSize: theme.fontSize.sm, color: theme.colors.textLight, marginTop: 2 },
});
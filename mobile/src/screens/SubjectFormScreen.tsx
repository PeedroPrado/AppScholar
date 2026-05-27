import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import { Teacher } from '../types';
import { createSubject }
  from "../services/subjectService";
  import { getTeachers }
  from "../services/teacherService";

const SEMESTERS = ['1º Semestre', '2º Semestre', '3º Semestre', '4º Semestre', '5º Semestre', '6º Semestre'];

const EMPTY_FORM = {
  nome: '',
  cargaHoraria: '',
  professorId: '',
  curso: '',
  semestre: '',
};

export function SubjectFormScreen() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showTeacherPicker, setShowTeacherPicker] = useState(false);
  const [showSemesterPicker, setShowSemesterPicker] = useState(false);

  // useEffect carrega a lista de professores ao abrir a tela

  useEffect(() => {

  async function loadTeachers() {

    try {

      const data =
        await getTeachers();

      console.log(data);

      setTeachers(data);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar professores"
      );
    }
  }

  loadTeachers();

}, []);
  // Na Parte 2, aqui vai a chamada: fetch('http://api/teachers')


  function handleChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  // Helpers para os seletores
  const selectedTeacher = teachers.find(t => t.id === form.professorId);
  const selectedSemester = form.semestre;

  function validate(): boolean {
    const newErrors: Partial<typeof EMPTY_FORM> = {};

    if (!form.nome.trim()) newErrors.nome = 'Nome da disciplina é obrigatório';

    if (!form.cargaHoraria.trim()) {
      newErrors.cargaHoraria = 'Carga horária é obrigatória';
    } else if (isNaN(Number(form.cargaHoraria)) || Number(form.cargaHoraria) <= 0) {
      newErrors.cargaHoraria = 'Informe uma carga horária válida';
    }

    if (!form.professorId) newErrors.professorId = 'Selecione o professor responsável';
    if (!form.curso.trim()) newErrors.curso = 'Curso é obrigatório';
    if (!form.semestre) newErrors.semestre = 'Semestre é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {

  if (!validate()) return;

  setLoading(true);

  try {

    const newSubject =
      await createSubject({

        nome: form.nome,

        cargaHoraria:
          Number(form.cargaHoraria),

        professorId:
          form.professorId,

        curso: form.curso,

        semestre:
          Number(form.semestre),
      });

    Alert.alert(
      "Sucesso 📚",
      `Disciplina "${newSubject.nome}" cadastrada com sucesso!`
    );

    setForm(EMPTY_FORM);

  } catch (error) {

    console.log(error);

    Alert.alert(
      "Erro",
      "Não foi possível cadastrar disciplina"
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
          <Text style={styles.sectionTitle}>📖 Dados da Disciplina</Text>

          <Input
            label="Nome da disciplina *"
            value={form.nome}
            onChangeText={v => handleChange('nome', v)}
            error={errors.nome}
            placeholder="Ex: Programação para Dispositivos Móveis I"
            autoCapitalize="words"
          />

          <Input
            label="Carga horária (horas) *"
            value={form.cargaHoraria}
            onChangeText={v => handleChange('cargaHoraria', v)}
            error={errors.cargaHoraria}
            placeholder="Ex: 80"
            keyboardType="numeric"
          />

          <Input
            label="Curso *"
            value={form.curso}
            onChangeText={v => handleChange('curso', v)}
            error={errors.curso}
            placeholder="Ex: Desenvolvimento de Software Multiplataforma"
            autoCapitalize="words"
          />
        </View>

        {/* Seletor de Professor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🏫 Professor Responsável</Text>

          <Text style={styles.label}>Professor *</Text>
          <TouchableOpacity
            style={[styles.selector, errors.professorId ? styles.selectorError : null]}
            onPress={() => {
              setShowTeacherPicker(!showTeacherPicker);
              setShowSemesterPicker(false);
            }}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              {selectedTeacher ? (
                <>
                  <Text style={styles.selectorText}>{selectedTeacher.nome}</Text>
                  <Text style={styles.selectorSub}>{selectedTeacher.area} · {selectedTeacher.titulacao}</Text>
                </>
              ) : (
                <Text style={styles.selectorPlaceholder}>Selecione o professor</Text>
              )}
            </View>
            <Text style={styles.selectorIcon}>{showTeacherPicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {errors.professorId ? <Text style={styles.errorText}>{errors.professorId}</Text> : null}

          {showTeacherPicker && (
            <View style={styles.pickerList}>
              {teachers.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.pickerItem, form.professorId === t.id && styles.pickerItemSelected]}
                  onPress={() => {
                    handleChange('professorId', t.id);
                    setShowTeacherPicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, form.professorId === t.id && styles.pickerItemTextSelected]}>
                    {t.nome}
                  </Text>
                  <Text style={styles.pickerItemSub}>{t.area} · {t.titulacao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Seletor de Semestre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Semestre</Text>

          <Text style={styles.label}>Semestre *</Text>
          <TouchableOpacity
            style={[styles.selector, errors.semestre ? styles.selectorError : null]}
            onPress={() => {
              setShowSemesterPicker(!showSemesterPicker);
              setShowTeacherPicker(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={selectedSemester ? styles.selectorText : styles.selectorPlaceholder}>
              {selectedSemester || 'Selecione o semestre'}
            </Text>
            <Text style={styles.selectorIcon}>{showSemesterPicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {errors.semestre ? <Text style={styles.errorText}>{errors.semestre}</Text> : null}

          {showSemesterPicker && (
            <View style={styles.semesterGrid}>
              {SEMESTERS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.semesterChip, form.semestre === s && styles.semesterChipSelected]}
                  onPress={() => {
                    handleChange('semestre', s);
                    setShowSemesterPicker(false);
                  }}
                >
                  <Text style={[styles.semesterChipText, form.semestre === s && styles.semesterChipTextSelected]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Preview da disciplina */}
        {form.nome ? (
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Preview da Disciplina</Text>
            <Text style={styles.previewName}>{form.nome}</Text>
            <View style={styles.previewRow}>
              {form.cargaHoraria ? (
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>⏱ {form.cargaHoraria}h</Text>
                </View>
              ) : null}
              {form.semestre ? (
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>📅 {form.semestre}</Text>
                </View>
              ) : null}
              {selectedTeacher ? (
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>👨‍🏫 {selectedTeacher.nome.split(' ')[1]}</Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        <Button title="Cadastrar Disciplina" onPress={handleSubmit} loading={loading} />
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
  selectorSub: { fontSize: 12, color: theme.colors.textLight, marginTop: 2 },
  selectorPlaceholder: { fontSize: theme.fontSize.md, color: theme.colors.textLight },
  selectorIcon: { color: theme.colors.textLight, marginLeft: theme.spacing.sm },
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
  pickerItemText: { fontSize: theme.fontSize.md, color: theme.colors.text, fontWeight: '600' },
  pickerItemTextSelected: { color: theme.colors.primary },
  pickerItemSub: { fontSize: 12, color: theme.colors.textLight, marginTop: 2 },
  semesterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  semesterChip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  semesterChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  semesterChipText: { fontSize: theme.fontSize.sm, color: theme.colors.text, fontWeight: '600' },
  semesterChipTextSelected: { color: '#fff' },
  preview: {
    backgroundColor: theme.colors.secondary + '12',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  previewTitle: { fontSize: 11, fontWeight: '700', color: theme.colors.secondary, marginBottom: 4 },
  previewName: { fontSize: theme.fontSize.lg, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  previewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  previewBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewBadgeText: { fontSize: 12, color: theme.colors.text, fontWeight: '600' },
});
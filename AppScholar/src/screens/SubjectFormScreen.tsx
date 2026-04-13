import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import { Subject, Teacher } from '../types';
import { useData } from '../context/DataContext';


function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

// Professores mockados — na Parte 2 virão da API
const MOCK_TEACHERS: Teacher[] = [
  { id: 'T1', name: 'Prof. André Olímpio',    title: 'Mestrado', area: 'Mobile',   yearsTeaching: 8,  email: 'andre@fatec.sp.gov.br' },
  { id: 'T2', name: 'Prof. Carlos Mendes',    title: 'Doutorado', area: 'Backend', yearsTeaching: 12, email: 'carlos@fatec.sp.gov.br' },
  { id: 'T3', name: 'Prof. Marina Oliveira',  title: 'Mestrado', area: 'Frontend', yearsTeaching: 5,  email: 'marina@fatec.sp.gov.br' },
];

const SEMESTERS = ['1º Semestre', '2º Semestre', '3º Semestre', '4º Semestre', '5º Semestre', '6º Semestre'];

const EMPTY_FORM = {
  name: '',
  workload: '',
  teacherId: '',
  course: '',
  semester: '',
};

export function SubjectFormScreen() {
  const { addSubject } = useData();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showTeacherPicker, setShowTeacherPicker] = useState(false);
  const [showSemesterPicker, setShowSemesterPicker] = useState(false);

  // useEffect carrega a lista de professores ao abrir a tela
  // Na Parte 2, aqui vai a chamada: fetch('http://api/teachers')
  useEffect(() => {
    const timer = setTimeout(() => {
      setTeachers(MOCK_TEACHERS);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  function handleChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  // Helpers para os seletores
  const selectedTeacher = teachers.find(t => t.id === form.teacherId);
  const selectedSemester = form.semester;

  function validate(): boolean {
    const newErrors: Partial<typeof EMPTY_FORM> = {};

    if (!form.name.trim()) newErrors.name = 'Nome da disciplina é obrigatório';

    if (!form.workload.trim()) {
      newErrors.workload = 'Carga horária é obrigatória';
    } else if (isNaN(Number(form.workload)) || Number(form.workload) <= 0) {
      newErrors.workload = 'Informe uma carga horária válida';
    }

    if (!form.teacherId) newErrors.teacherId = 'Selecione o professor responsável';
    if (!form.course.trim()) newErrors.course = 'Curso é obrigatório';
    if (!form.semester) newErrors.semester = 'Semestre é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newSubject: Subject = {
      id: generateId(),
      name: form.name,
      workload: Number(form.workload),
      teacherId: form.teacherId,
      course: form.course,
      semester: Number(form.semester.charAt(0)),
    };

    addSubject(newSubject);

    setLoading(false);
    Alert.alert(
      'Sucesso! 📖',
      `Disciplina "${newSubject.name}" cadastrada com sucesso.`,
      [{ text: 'OK', onPress: () => { setForm(EMPTY_FORM); setErrors({}); } }]
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Dados da Disciplina</Text>

          <Input
            label="Nome da disciplina *"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
            error={errors.name}
            placeholder="Ex: Programação para Dispositivos Móveis I"
            autoCapitalize="words"
          />

          <Input
            label="Carga horária (horas) *"
            value={form.workload}
            onChangeText={v => handleChange('workload', v)}
            error={errors.workload}
            placeholder="Ex: 80"
            keyboardType="numeric"
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

        {/* Seletor de Professor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🏫 Professor Responsável</Text>

          <Text style={styles.label}>Professor *</Text>
          <TouchableOpacity
            style={[styles.selector, errors.teacherId ? styles.selectorError : null]}
            onPress={() => {
              setShowTeacherPicker(!showTeacherPicker);
              setShowSemesterPicker(false);
            }}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              {selectedTeacher ? (
                <>
                  <Text style={styles.selectorText}>{selectedTeacher.name}</Text>
                  <Text style={styles.selectorSub}>{selectedTeacher.area} · {selectedTeacher.title}</Text>
                </>
              ) : (
                <Text style={styles.selectorPlaceholder}>Selecione o professor</Text>
              )}
            </View>
            <Text style={styles.selectorIcon}>{showTeacherPicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {errors.teacherId ? <Text style={styles.errorText}>{errors.teacherId}</Text> : null}

          {showTeacherPicker && (
            <View style={styles.pickerList}>
              {teachers.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.pickerItem, form.teacherId === t.id && styles.pickerItemSelected]}
                  onPress={() => {
                    handleChange('teacherId', t.id);
                    setShowTeacherPicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, form.teacherId === t.id && styles.pickerItemTextSelected]}>
                    {t.name}
                  </Text>
                  <Text style={styles.pickerItemSub}>{t.area} · {t.title}</Text>
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
            style={[styles.selector, errors.semester ? styles.selectorError : null]}
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
          {errors.semester ? <Text style={styles.errorText}>{errors.semester}</Text> : null}

          {showSemesterPicker && (
            <View style={styles.semesterGrid}>
              {SEMESTERS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.semesterChip, form.semester === s && styles.semesterChipSelected]}
                  onPress={() => {
                    handleChange('semester', s);
                    setShowSemesterPicker(false);
                  }}
                >
                  <Text style={[styles.semesterChipText, form.semester === s && styles.semesterChipTextSelected]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Preview da disciplina */}
        {form.name ? (
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Preview da Disciplina</Text>
            <Text style={styles.previewName}>{form.name}</Text>
            <View style={styles.previewRow}>
              {form.workload ? (
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>⏱ {form.workload}h</Text>
                </View>
              ) : null}
              {form.semester ? (
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>📅 {form.semester}</Text>
                </View>
              ) : null}
              {selectedTeacher ? (
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>👨‍🏫 {selectedTeacher.name.split(' ')[1]}</Text>
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
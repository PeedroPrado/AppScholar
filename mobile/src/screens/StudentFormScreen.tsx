import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform,
  TouchableOpacity
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import { buscarCEP } from '../services/viaCepService';
import { createStudent } from "../services/studentService";
import { Picker } from "@react-native-picker/picker";
import { getEstados, getCidades } from "../services/ibgeService";


// Estado inicial limpo — facilita o reset do formulário
const EMPTY_FORM = {
  nome: '',
  matricula: '',
  curso: '',
  email: '',
  telefone: '',
  cep: '',
  endereco: '',
  cidade: '',
  estado: '',
  semestre:''
};

export function StudentFormScreen() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);

  useEffect(() => {

  async function loadEstados() {

    const data =
      await getEstados();

    setEstados(data);
  }

  loadEstados();

}, []);

  // Atualiza apenas o campo alterado, mantendo o restante intacto
  function handleChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    // Remove o erro do campo assim que o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }
  

  async function handleZipCode(cep: string) {

  handleChange('cep', cep);

  const cleaned = cep.replace(/\D/g, '');

  if (cleaned.length === 8) {

    try {

      const data = await buscarCEP(cleaned);

     if (!data.erro) {

  setForm(prev => ({
    ...prev,
    endereco: data.logradouro,
    cidade: data.localidade,
    estado: data.uf,
  }));

  const cidadesData =
    await getCidades(data.uf);

  setCidades(cidadesData);
}

    } catch (error) {

      console.log(error);
    }
  }
}

async function handleEstado(
  uf: string
) {

  try {

    console.log("UF:", uf);

    handleChange(
      "estado",
      uf
    );

    const cidadesData =
      await getCidades(uf);

    console.log(
      "CIDADES:",
      cidadesData
    );

    setCidades(cidadesData);

    handleChange(
      "cidade",
      ""
    );

  } catch (error) {

    console.log(
      "ERRO CIDADES:",
      error
    );
  }
}

  function validate(): boolean {
    const newErrors: Partial<typeof EMPTY_FORM> = {};

    if (!form.nome.trim())       newErrors.nome = 'Nome é obrigatório';
    if (!form.matricula.trim()) newErrors.matricula = 'Matrícula é obrigatória';
    if (!form.curso.trim())     newErrors.curso = 'Curso é obrigatório';

    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!form.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (form.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!form.cep.trim())  newErrors.cep = 'CEP é obrigatório';
    if (!form.endereco.trim())  newErrors.endereco = 'Endereço é obrigatório';
    if (!form.cidade.trim())     newErrors.cidade = 'Cidade é obrigatória';
    if (!form.estado.trim())    newErrors.estado = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }



async function handleSubmit() {

  if (!validate()) return;

  setLoading(true);

  try {

    const newStudent = await createStudent({
      nome: form.nome,
      matricula: form.matricula,
      curso: form.curso,
      semestre: Number(form.semestre),
      email: form.email,
      telefone: form.telefone,
      cep: form.cep,
      endereco: form.endereco,
      cidade: form.cidade,
      estado: form.estado
    });

    Alert.alert(
      "Sucesso 🎓",
      `Aluno "${newStudent.nome}" cadastrado com sucesso!`
    );

    setForm(EMPTY_FORM);

  } catch (error) {

    console.log(error);

    Alert.alert(
      "Erro",
      "Não foi possível cadastrar aluno"
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
        {/* Seção: Dados Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Dados Pessoais</Text>

          <Input
            label="Nome completo *"
            value={form.nome}
            onChangeText={v => handleChange('nome', v)}
            error={errors.nome}
            placeholder="Ex: João da Silva"
            autoCapitalize="words"
          />
          <Input
            label="Matrícula *"
            value={form.matricula}
            onChangeText={v => handleChange('matricula', v)}
            error={errors.matricula}
            placeholder="Ex: DSM2025001"
            autoCapitalize="characters"
          />
          <Input
            label="Curso *"
            value={form.curso}
            onChangeText={v => handleChange('curso', v)}
            error={errors.curso}
            placeholder="Ex: Desenvolvimento de Software Multiplataforma"
            autoCapitalize="words"
          />
          <Text style={styles.sectionTitle}>
  📚 Semestre
</Text>

<View style={styles.semesterContainer}>

  {[1,2,3,4,5,6].map(semester => (

    <TouchableOpacity

      key={semester}

      style={[

        styles.semesterButton,

        Number(form.semestre) ===
          semester &&

        styles.semesterSelected
      ]}

      onPress={() =>

        handleChange(
          "semestre",
          String(semester)
        )
      }
    >

      <Text
        style={{
          fontWeight: "700"
        }}
      >
        {semester}º
      </Text>

    </TouchableOpacity>
  ))}
</View>
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
            value={form.telefone}
            onChangeText={v => handleChange('telefone', v)}
            error={errors.telefone}
            placeholder="(12) 99999-0000"
            keyboardType="phone-pad"
          />
        </View>

        {/* Seção: Endereço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Endereço</Text>

          <Input
            label="CEP *"
            value={form.cep}
            onChangeText={handleZipCode}
            error={errors.cep}
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
            value={form.endereco}
            onChangeText={v => handleChange('endereco', v)}
            error={errors.endereco}
            placeholder="Rua, número, bairro"
          />

          {/* Cidade e Estado lado a lado */}
          <Text style={styles.label}>
  Estado *
</Text>

<View style={styles.pickerContainer}>
  <Picker
    selectedValue={form.estado}
    onValueChange={handleEstado}
  >
    <Picker.Item
      label="Selecione um estado"
      value=""
    />

    {estados.map((estado) => (
      <Picker.Item
        key={estado.id}
        label={`${estado.sigla} - ${estado.nome}`}
        value={estado.sigla}
      />
    ))}
  </Picker>
</View>

{!!errors.estado && (
  <Text style={styles.errorText}>
    {errors.estado}
  </Text>
)}

<Text style={styles.label}>
  Cidade *
</Text>

<View style={styles.pickerContainer}>
  <Picker
    selectedValue={form.cidade}
    onValueChange={(value) =>
      handleChange("cidade", value)
    }
  >
    <Picker.Item
      label="Selecione uma cidade"
      value=""
    />

    {cidades.map((cidade) => (
      <Picker.Item
        key={cidade.id}
        label={cidade.nome}
        value={cidade.nome}
      />
    ))}
  </Picker>
</View>

{!!errors.cidade && (
  <Text style={styles.errorText}>
    {errors.cidade}
  </Text>
)}
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
  semesterContainer: {

  flexDirection: "row",

  flexWrap: "wrap",

  gap: 10,

  marginBottom: 16,
},

semesterButton: {

  backgroundColor:
    theme.colors.background,

  padding: 12,

  borderRadius: 8,

  minWidth: 60,

  alignItems: "center",
},

semesterSelected: {

  borderWidth: 2,

  borderColor:
    theme.colors.primary,
},
label: {
  fontWeight: "700",
  marginBottom: 6,
  color: theme.colors.text,
},

pickerContainer: {
  backgroundColor: "#fff",
  borderRadius: 8,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: theme.colors.border,
},

errorText: {
  color: theme.colors.error,
  marginBottom: 10,
  fontSize: 12,
},
});
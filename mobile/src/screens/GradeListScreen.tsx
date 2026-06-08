import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import {
  getGrades,
  deleteGrade
} from "../services/gradeService";

import { theme } from "../styles/theme";

export function GradeListScreen() {

  const [grades, setGrades] =
    useState<any[]>([]);

  const navigation =
    useNavigation<any>();

  async function loadGrades() {

    try {

      const data =
        await getGrades();

      setGrades(data);

    } catch (error) {

      console.log(error);
    }
  }

  useEffect(() => {

    const unsubscribe =
      navigation.addListener(
        "focus",
        loadGrades
      );

    return unsubscribe;

  }, [navigation]);

  async function handleDelete(
    id: string
  ) {

    Alert.alert(
      "Excluir Nota",
      "Deseja excluir esta nota?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {

            await deleteGrade(id);

            loadGrades();
          }
        }
      ]
    );
  }

  function renderItem({
    item
  }: any) {

    return (

      <View style={styles.card}>

        <Text style={styles.title}>
          {item.aluno}
        </Text>

        <Text style={styles.text}>
          📚 {item.disciplina}
        </Text>

        <Text style={styles.text}>
          Nota 1: {item.nota1}
        </Text>

        <Text style={styles.text}>
          Nota 2: {item.nota2}
        </Text>

        <Text style={styles.text}>
          Média: {item.media}
        </Text>

        <Text style={styles.text}>
          Status: {item.status}
        </Text>

        <View style={styles.actions}>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate(
                "EditGrade",
                {
                  grade: item
                }
              )
            }
          >
            <Text style={styles.btnText}>
              ✏️ Editar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() =>
              handleDelete(
                item.id
              )
            }
          >
            <Text style={styles.btnText}>
              🗑 Excluir
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  }

  return (

    <FlatList
      data={grades}
      keyExtractor={(item) =>
        String(item.id)
      }
      renderItem={renderItem}
      contentContainerStyle={{
        padding: 16
      }}
    />
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor:
      theme.colors.surface,

    padding: 16,

    marginBottom: 12,

    borderRadius: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  text: {
    marginBottom: 4,
  },

  actions: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginTop: 12,
  },

  editBtn: {
    padding: 10,
  },

  deleteBtn: {
    padding: 10,
  },

  btnText: {
    fontWeight: "600",
  },
});
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import allverses from "../../assets/data/verse.json";
import { useNavigation } from "@react-navigation/native";

export const Read = () => {
  const [verses, setVerses] = useState([]);
  const [chapter, setChapter] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setVerses(allverses.filter((verse) => verse["chapter_number"] === chapter));
  }, [chapter]);

  const handleChapterChange = (newChapter) => {
    setChapter(newChapter);
    setModalVisible(false);
  };

  const handleVersePress = (verse) => {
    navigation.navigate("VerseDetail", { verse });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bhagwat Gita Chapter {chapter}</Text>
      <ScrollView style={styles.verseContainer}>
        {verses.map((verse, index) => (
          <TouchableOpacity
            key={index}
            style={styles.verse}
            onPress={() => handleVersePress(verse)}
          >
            <Text style={styles.verseNumber}>{index + 1}.</Text>
            <Text style={styles.verseText}>{verse.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() => handleChapterChange(chapter - 1)}
        >
          <Text style={styles.paginationButtonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.paginationButtonText}>{chapter}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() => handleChapterChange(chapter + 1)}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Chapter</Text>
            <View style={styles.chapterSelector}>
              {[...Array(18).keys()].map((ch) => (
                <TouchableOpacity
                  key={ch}
                  style={styles.chapterButton}
                  onPress={() => handleChapterChange(ch + 1)}
                >
                  <Text style={styles.chapterButtonText}>{ch + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  verseContainer: {
    flex: 1,
  },
  verse: {
    marginBottom: 10,
    flexDirection: "row",
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  verseText: {
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  paginationButtonText: {
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chapterSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  chapterButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  chapterButtonText: {
    color: "#000",
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

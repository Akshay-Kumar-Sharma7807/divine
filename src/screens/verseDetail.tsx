import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import translations from "../../assets/data/translation.json";
import commentary from "../../assets/data/commentary.json";

export const VerseDetail = ({ route }) => {
  const { verse } = route.params;
  const [activeTab, setActiveTab] = useState("hindi");
  const [sound, setSound] = useState();

  const trans = translations.filter(
    (translation) => translation.verse_id === verse.id
  );

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/data/verse_recitation/1/1.mp3"),
      { shouldPlay: true }
    );
    setSound(sound);
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{verse.title}</Text>
        <Text style={styles.verseText}>{verse.text}</Text>
        <Text style={styles.transliterationText}>{verse.transliteration}</Text>
        <Text style={styles.wordMeaningsText}>{verse.word_meanings}</Text>
        <TouchableOpacity onPress={playSound}>
          <Text style={styles.playButton}>Play Audio</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Translations</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "hindi" && styles.activeTab]}
            onPress={() => setActiveTab("hindi")}
          >
            <Text style={styles.tabText}>Hindi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "english" && styles.activeTab]}
            onPress={() => setActiveTab("english")}
          >
            <Text style={styles.tabText}>English</Text>
          </TouchableOpacity>
        </View>
        {activeTab === "hindi" && (
          <Text style={styles.translationText}>
            {trans.filter((t) => t.lang === "hindi")[0].description}
          </Text>
        )}
        {activeTab === "english" && (
          <Text style={styles.translationText}>
            {trans.filter((t) => t.lang === "english")[0].description}
          </Text>
        )}
        <Text style={styles.title}>Commentary</Text>
        <Text style={styles.commentaryText}>
          {commentary.filter((c) => c.verse_id === verse.id)[0].description}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  verseText: {
    fontSize: 18,
    textAlign: "center",
  },
  transliterationText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  wordMeaningsText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  commentaryText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  tab: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    color: "#007AFF",
  },
  translationText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  playButton: {
    fontSize: 16,
    color: "#007AFF",
    marginTop: 20,
    textAlign: "center",
  },
});

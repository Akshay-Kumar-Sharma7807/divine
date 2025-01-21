import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Keyboard,
} from "react-native";
import "react-native-get-random-values";
import { useContext, useState, useRef } from "react";
import { ThemeContext, AppContext } from "../context";
import {
  getEventSource,
  getFirstN,
  getFirstNCharsOrLess,
  getChatType,
} from "../utils";
import { v4 as uuid } from "uuid";
import Ionicons from "@expo/vector-icons/Ionicons";
import { IOpenAIMessages, IOpenAIStateWithIndex } from "../../types";
import * as Clipboard from "expo-clipboard";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Markdown from "@ronradtke/react-native-markdown-display";

import axios from "axios";

export function Chat() {
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const scrollViewRef = useRef<ScrollView | null>(null);
  const { showActionSheetWithOptions } = useActionSheet();
  const [sessionId, setSessionId] = useState<string>("");
  const [res, setRes] = useState<any[]>([]);
  // claude state management
  const [claudeAPIMessages, setClaudeAPIMessages] = useState("");
  const [claudeResponse, setClaudeResponse] = useState({
    messages: [],
    index: uuid(),
  });

  // openAI state management
  const [openaiMessages, setOpenaiMessages] = useState<IOpenAIMessages[]>([]);
  const [openaiResponse, setOpenaiResponse] = useState<IOpenAIStateWithIndex>({
    messages: [],
    index: uuid(),
  });

  // cohere state management
  const [cohereResponse, setCohereResponse] = useState({
    messages: [],
    index: uuid(),
  });

  // mistral state management
  const [mistralAPIMessages, setMistralAPIMessages] = useState("");
  const [mistralResponse, setMistralResponse] = useState({
    messages: [],
    index: uuid(),
  });

  // Gemini state management
  const [geminiAPIMessages, setGeminiAPIMessages] = useState("");
  const [geminiResponse, setGeminiResponse] = useState({
    messages: [],
    index: uuid(),
  });

  const { theme } = useContext(ThemeContext);
  const { chatType } = useContext(AppContext);
  const styles = getStyles(theme);

  // Function to create a chat session
  async function createChatSession(apikey, externalUserId) {
    try {
      const response = await axios.post(
        "https://api.on-demand.io/chat/v1/sessions",
        {
          pluginIds: [],
          externalUserId: externalUserId,
        },
        {
          headers: { apikey: apikey },
        }
      );

      if (response.status === 201) {
        // Extract session ID from the response
        const sessionId = response.data.data.id;
        return sessionId;
      }
    } catch (error) {
      console.error("Error creating chat session:", error);
    }
  }

  // Function to submit a query
  async function submitQuery(apikey, sessionId, query) {
    try {
      setLoading(true);
      setInput("");
      const response = await axios.post(
        `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
        {
          endpointId: "predefined-openai-gpt4o",
          query: query,
          pluginIds: [
            "plugin-1712327325",
            "plugin-1713962163",
            "plugin-1717443236",
            "plugin-1717442737",
            "plugin-1717438583",
          ],
          responseMode: "sync",
        },
        {
          headers: { apikey: apikey },
        }
      );
      setLoading(false);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error submitting query:", error);
    }
  }

  // Sample usage
  async function initializeChat(apikey, externalUserId, query) {
    const sessionId = await createChatSession(apikey, externalUserId);
    setSessionId(sessionId);
    if (sessionId) {
      const queryResponse = await submitQuery(apikey, sessionId, query);
      setRes((prev) => [...prev, { assistant: queryResponse.data.answer }]);
      console.log("Query Response:", queryResponse);
    }
  }

  async function chat() {
    if (!input) return;
    Keyboard.dismiss();
    setRes((prev) => [...prev, { user: input }]);

    if (sessionId) {
      initializeChat("VMbjA485zg0O4lDAk8BXit5fnyzJyDik", uuid(), input);
    } else {
      const queryResponse = await submitQuery(
        "VMbjA485zg0O4lDAk8BXit5fnyzJyDik",
        sessionId,
        input
      );
      setRes((prev) => [...prev, { assistant: queryResponse.data.answer }]);
      console.log("Query Response:", queryResponse);
    }
    // if (chatType.label.includes("claude")) {
    //   generateClaudeResponse();
    // } else if (chatType.label.includes("cohere")) {
    //   generateCohereResponse();
    // } else if (chatType.label.includes("mistral")) {
    //   generateMistralResponse();
    // } else if (chatType.label.includes("gemini")) {
    //   generateGeminiResponse();
    // } else {
    //   generateOpenaiResponse();
    // }
  }

  async function copyToClipboard(text) {
    await Clipboard.setStringAsync(text);
  }

  async function showClipboardActionsheet(text) {
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options: ["Copy to clipboard", "Clear chat", "cancel"],
        cancelButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex === Number(0)) {
          copyToClipboard(text);
        }
        if (selectedIndex === 1) {
          clearChat();
        }
      }
    );
  }

  async function clearChat() {
    if (loading) return;
    if (chatType.label.includes("claude")) {
      setClaudeResponse({
        messages: [],
        index: uuid(),
      });
      setClaudeAPIMessages("");
    } else if (chatType.label.includes("cohere")) {
      setCohereResponse({
        messages: [],
        index: uuid(),
      });
    } else if (chatType.label.includes("mistral")) {
      setMistralResponse({
        messages: [],
        index: uuid(),
      });
      setMistralAPIMessages("");
    } else if (chatType.label.includes("gemini")) {
      setGeminiResponse({
        messages: [],
        index: uuid(),
      });
      setGeminiAPIMessages("");
    } else {
      setOpenaiResponse({
        messages: [],
        index: uuid(),
      });
      setOpenaiMessages([]);
    }
  }

  function renderItem({ item, index }: { item: any; index: number }) {
    return (
      <View style={styles.promptResponse} key={index}>
        {item.user && (
          <View style={styles.promptTextContainer}>
            <View style={styles.promptTextWrapper}>
              <Text style={styles.promptText}>{item.user}</Text>
            </View>
          </View>
        )}
        {item.assistant && (
          <View style={styles.textStyleContainer}>
            <Markdown style={styles.markdownStyle as any}>
              {item.assistant}
            </Markdown>
            <TouchableHighlight
              onPress={() => showClipboardActionsheet(item.assistant)}
              underlayColor={"transparent"}
            >
              <View style={styles.optionsIconWrapper}>
                <Ionicons name="apps" size={20} color={theme.textColor} />
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }

  const callMade = (() => {
    if (chatType.label.includes("claude")) {
      return claudeResponse.messages.length > 0;
    }
    if (chatType.label.includes("cohere")) {
      return cohereResponse.messages.length > 0;
    }
    if (chatType.label.includes("mistral")) {
      return mistralResponse.messages.length > 0;
    }
    if (chatType.label.includes("gemini")) {
      return geminiResponse.messages.length > 0;
    }
    return res.length > 0;
  })();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={110}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
        contentContainerStyle={!callMade && styles.scrollContentContainer}
      >
        {!callMade && (
          <View style={styles.midChatInputWrapper}>
            <View style={styles.midChatInputContainer}>
              <TextInput
                onChangeText={(v) => setInput(v)}
                style={styles.midInput}
                placeholder="Message"
                placeholderTextColor={theme.placeholderTextColor}
                autoCorrect={true}
              />
              <TouchableHighlight onPress={chat} underlayColor={"transparent"}>
                <View style={styles.midButtonStyle}>
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={22}
                    color={theme.tintTextColor}
                  />
                  <Text style={styles.midButtonText}>
                    Start {chatType.name} Chat
                  </Text>
                </View>
              </TouchableHighlight>
              <Text style={styles.chatDescription}>
                Chat with a variety of different language models.
              </Text>
            </View>
          </View>
        )}
        {callMade && (
          <>
            {chatType.label.includes("gpt") && (
              <FlatList
                data={res}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            )}
            {chatType.label.includes("claude") && (
              <FlatList
                data={claudeResponse.messages}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            )}
            {chatType.label.includes("cohere") && (
              <FlatList
                data={cohereResponse.messages}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            )}
            {chatType.label.includes("mistral") && (
              <FlatList
                data={mistralResponse.messages}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            )}
            {chatType.label.includes("gemini") && (
              <FlatList
                data={geminiResponse.messages}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            )}
          </>
        )}
        {loading && <ActivityIndicator style={styles.loadingContainer} />}
      </ScrollView>
      {callMade && (
        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(v) => setInput(v)}
            placeholder="Message"
            placeholderTextColor={theme.placeholderTextColor}
            value={input}
          />
          <TouchableHighlight
            underlayColor={"transparent"}
            activeOpacity={0.65}
            onPress={chat}
          >
            <View style={styles.chatButton}>
              <Ionicons
                name="arrow-up-outline"
                size={20}
                color={theme.tintTextColor}
              />
            </View>
          </TouchableHighlight>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    optionsIconWrapper: {
      padding: 10,
      paddingTop: 9,
      alignItems: "flex-end",
    },
    scrollContentContainer: {
      flex: 1,
    },
    chatDescription: {
      color: theme.textColor,
      textAlign: "center",
      marginTop: 15,
      fontSize: 13,
      paddingHorizontal: 34,
      opacity: 0.8,
      fontFamily: theme.regularFont,
    },
    midInput: {
      marginBottom: 8,
      borderWidth: 1,
      paddingHorizontal: 25,
      marginHorizontal: 10,
      paddingVertical: 15,
      borderRadius: 99,
      color: theme.textColor,
      borderColor: theme.borderColor,
      fontFamily: theme.mediumFont,
    },
    midButtonStyle: {
      flexDirection: "row",
      marginHorizontal: 14,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 99,
      backgroundColor: theme.tintColor,
      justifyContent: "center",
      alignItems: "center",
    },
    midButtonText: {
      color: theme.tintTextColor,
      marginLeft: 10,
      fontFamily: theme.boldFont,
      fontSize: 16,
    },
    midChatInputWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    midChatInputContainer: {
      width: "100%",
      paddingTop: 5,
      paddingBottom: 5,
    },
    loadingContainer: {
      marginTop: 25,
    },
    promptResponse: {
      marginTop: 10,
    },
    textStyleContainer: {
      borderWidth: 1,
      marginRight: 25,
      borderColor: theme.borderColor,
      padding: 15,
      paddingBottom: 6,
      paddingTop: 5,
      margin: 10,
      borderRadius: 13,
    },
    promptTextContainer: {
      flex: 1,
      alignItems: "flex-end",
      marginRight: 15,
      marginLeft: 24,
    },
    promptTextWrapper: {
      borderRadius: 8,
      borderTopRightRadius: 0,
      backgroundColor: theme.tintColor,
    },
    promptText: {
      color: theme.tintTextColor,
      fontFamily: theme.regularFont,
      paddingVertical: 5,
      paddingHorizontal: 9,
      fontSize: 16,
    },
    chatButton: {
      marginRight: 14,
      padding: 5,
      borderRadius: 99,
      backgroundColor: theme.tintColor,
    },
    chatInputContainer: {
      paddingTop: 5,
      borderColor: theme.borderColor,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 5,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 99,
      color: theme.textColor,
      marginHorizontal: 10,
      paddingVertical: 10,
      paddingHorizontal: 21,
      paddingRight: 39,
      borderColor: theme.borderColor,
      fontFamily: theme.semiBoldFont,
    },
    container: {
      backgroundColor: theme.backgroundColor,
      flex: 1,
    },
    markdownStyle: {
      body: {
        color: theme.textColor,
        fontFamily: theme.regularFont,
      },
      paragraph: {
        color: theme.textColor,
        fontSize: 16,
        fontFamily: theme.regularFont,
      },
      heading1: {
        color: theme.textColor,
        fontFamily: theme.semiBoldFont,
        marginVertical: 5,
      },
      heading2: {
        marginTop: 20,
        color: theme.textColor,
        fontFamily: theme.semiBoldFont,
        marginBottom: 5,
      },
      heading3: {
        marginTop: 20,
        color: theme.textColor,
        fontFamily: theme.mediumFont,
        marginBottom: 5,
      },
      heading4: {
        marginTop: 10,
        color: theme.textColor,
        fontFamily: theme.mediumFont,
        marginBottom: 5,
      },
      heading5: {
        marginTop: 10,
        color: theme.textColor,
        fontFamily: theme.mediumFont,
        marginBottom: 5,
      },
      heading6: {
        color: theme.textColor,
        fontFamily: theme.mediumFont,
        marginVertical: 5,
      },
      list_item: {
        marginTop: 7,
        color: theme.textColor,
        fontFamily: theme.regularFont,
        fontSize: 16,
      },
      ordered_list_icon: {
        color: theme.textColor,
        fontSize: 16,
        fontFamily: theme.regularFont,
      },
      bullet_list: {
        marginTop: 10,
      },
      ordered_list: {
        marginTop: 7,
      },
      bullet_list_icon: {
        color: theme.textColor,
        fontSize: 16,
        fontFamily: theme.regularFont,
      },
      code_inline: {
        color: theme.secondaryTextColor,
        backgroundColor: theme.secondaryBackgroundColor,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, .1)",
        fontFamily: theme.lightFont,
      },
      hr: {
        backgroundColor: "rgba(255, 255, 255, .1)",
        height: 1,
      },
      fence: {
        marginVertical: 5,
        padding: 10,
        color: theme.secondaryTextColor,
        backgroundColor: theme.secondaryBackgroundColor,
        borderColor: "rgba(255, 255, 255, .1)",
        fontFamily: theme.regularFont,
      },
      tr: {
        borderBottomWidth: 1,
        borderColor: "rgba(255, 255, 255, .2)",
        flexDirection: "row",
      },
      table: {
        marginTop: 7,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, .2)",
        borderRadius: 3,
      },
      blockquote: {
        backgroundColor: "#312e2e",
        borderColor: "#CCC",
        borderLeftWidth: 4,
        marginLeft: 5,
        paddingHorizontal: 5,
        marginVertical: 5,
      },
    } as any,
  });

// filepath: /d:/aks/ai/chatai/app/src/navigation/ReadStackNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Read, VerseDetail } from "../screens";

const Stack = createNativeStackNavigator();

const ReadStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Read" component={Read} />
      <Stack.Screen
        name="VerseDetail"
        component={VerseDetail}
        options={{ title: "Verse Details" }}
      />
    </Stack.Navigator>
  );
};

export default ReadStackNavigator;

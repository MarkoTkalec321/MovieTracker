import React from "react";
import { TouchableOpacity, Text } from "react-native";

const GenreFAB = ({ item, selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      className={`h-9 px-3 mx-1 mb-2 rounded-full flex items-center justify-center ${
        selected ? "bg-[#f5c518]" : "bg-white"
      }`}
    >
      <Text className="text-sm text-black">{item.name}</Text>
    </TouchableOpacity>
  );
};

export default GenreFAB;

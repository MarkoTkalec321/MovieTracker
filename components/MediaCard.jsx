import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const MediaCard = ({
  type,
  id,
  posterPath,
  title,
  overview,
  details,
  saved,
  onSave,
  formatPrimaryInfo,
  children,
}) => {
  const router = useRouter();

  // Calculate number of lines
  const numberOfOverviewLines =
    details?.genres?.length >= 4 && title.length > 26
      ? 1
      : details?.genres?.length >= 4 || title.length > 26
      ? 2
      : 3;

  const handlePress = () => {
    router.push(`/details/${type}/${id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="flex-row mb-4 bg-gray-100 rounded-2xl overflow-hidden h-48 relative"
    >
      {/* Poster */}
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${posterPath}` }}
        className="w-28 h-full rounded-lg"
        resizeMode="cover"
      />
      
      {/* Details */}
      <View className="flex-1 pl-3 pr-4 pt-3 pb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold flex-1">{title}</Text>
          <TouchableOpacity onPress={onSave} className="ml-2">
            <Icon name={saved ? "close-circle" : "bookmark-outline"} size={24} />
          </TouchableOpacity>
        </View>

        {details && (
          <Text className="text-sm text-gray-600">
            {formatPrimaryInfo(details)}
          </Text>
        )}

        {children}

        <Text
          className="text-sm text-gray-600 mt-2"
          numberOfLines={numberOfOverviewLines}
        >
          {overview}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MediaCard;

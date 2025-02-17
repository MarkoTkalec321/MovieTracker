import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Feather'


const FormField = ({ title, value, 
    handleChangeText, otherStyles, ...props}) => {
        const [showPassword, setShowPassword] = useState(false)
        const [isFocused, setIsFocused] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-textPrimary ml-1">{title}</Text>

      <View
        className={`border-2 w-full h-16 px-4 rounded-2xl flex-row items-center mt-1 ${
          isFocused ? 'border-primary' : 'border-gray-500'
        } bg-gray-900`}
      >
        <TextInput
            className="flex-1 text-white text-base"
            value={value}
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye' : 'eye-off'} size={24} color="#b3b3b3" />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
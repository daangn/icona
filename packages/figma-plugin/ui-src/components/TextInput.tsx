import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import * as React from "react";

interface TextInputProps {
  value: string;
  label: string;
  placeholder: string;
  helperText: string;
  errorMessage: string;
  isError: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput = ({
  value,
  label,
  placeholder,
  helperText,
  errorMessage,
  isError,
  handleChange,
}: TextInputProps) => {
  return (
    <FormControl onChange={handleChange} isInvalid={isError}>
      <FormLabel>{label}</FormLabel>
      <Input placeholder={placeholder} type="text" value={value} />
      {!isError ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};

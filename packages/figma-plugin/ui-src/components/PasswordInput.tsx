import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import * as React from "react";

interface PasswordInputProps {
  value: string;
  label: string;
  helperText: string;
  placeholder: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput = ({
  value,
  label,
  helperText,
  placeholder,
  handleChange,
}: PasswordInputProps) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

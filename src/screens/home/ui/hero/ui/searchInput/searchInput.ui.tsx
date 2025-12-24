import theme from '@/shared/theme';
import { Box, Button, Input } from '@mantine/core';
import { LuSearch } from 'react-icons/lu';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

function SearchInput({ value, onChange, onSubmit }: SearchInputProps) {
  const rightSection = (
    <Box w={90} style={{ borderRadius: 30, overflow: 'hidden' }}>
      <Button
        fullWidth
        h={44}
        px="md"
        color="blue"
        size="sm"
        onClick={onSubmit}
      >
        Qidiruv
      </Button>
    </Box>
  );

  return (
    <Box w="100%" h="100%">
      <Input
        placeholder="Qidirish"
        value={value}
        onChange={event => onChange(event.currentTarget.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
          }
        }}
        leftSection={<LuSearch />}
        rightSection={rightSection}
        rightSectionWidth={94}
        rightSectionPointerEvents="auto"
        size="lg"
        radius={30}
        styles={{
          input: {
            border: `1px solid ${theme.colors?.blue?.[6]}`,
            fontSize: 14,
            paddingLeft: 36,
            '::placeholder': {
              fontSize: 14,
              color: theme.colors?.gray?.[5],
            },
          },
        }}
      />
    </Box>
  );
}

export default SearchInput;

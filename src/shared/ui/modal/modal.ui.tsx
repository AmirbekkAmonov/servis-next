import { Modal as MantineModal, type ModalProps } from '@mantine/core';
import theme from '@/shared/theme';

type UniversalModalProps = Omit<ModalProps, 'opened' | 'onClose'> & {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

function Modal({
  opened,
  onClose,
  title,
  children,
  size = 'md',
  radius = 'md',
  centered = true,
  ...props
}: UniversalModalProps) {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      radius={radius}
      centered={centered}
      styles={{
        header: {
          backgroundColor: theme.other?.mainWhite,
          borderBottom: `1px solid ${theme.colors?.gray?.[2]}`,
        },
        body: {
          backgroundColor: theme.other?.mainWhite,
        },
        content: {
          borderRadius: radius === 'md' ? 12 : undefined,
        },
      }}
      {...props}
    >
      {children}
    </MantineModal>
  );
}

export default Modal;

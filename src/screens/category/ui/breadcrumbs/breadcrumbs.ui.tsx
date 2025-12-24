import { Breadcrumbs as MantineBreadcrumbs, Anchor, Text } from '@mantine/core';
import { Link } from '@/shared/lib/router';
import theme from '@/shared/theme';
import { IoChevronForward } from 'react-icons/io5';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <MantineBreadcrumbs
      separator={<IoChevronForward size={14} color={theme.colors?.gray?.[5]} />}
      mb="lg"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.href) {
          return (
            <Text
              key={index}
              fz={14}
              c={isLast ? theme.colors?.gray?.[8] : theme.colors?.gray?.[6]}
              fw={isLast ? 500 : 400}
            >
              {item.label}
            </Text>
          );
        }

        return (
          <Anchor
            key={index}
            component={Link}
            to={item.href}
            fz={14}
            c={theme.colors?.gray?.[6]}
            style={{
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e =>
              (e.currentTarget.style.color = theme.colors?.blue?.[6] || '')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.color = theme.colors?.gray?.[6] || '')
            }
          >
            {item.label}
          </Anchor>
        );
      })}
    </MantineBreadcrumbs>
  );
}

export default Breadcrumbs;


import {
  Box,
  Flex,
  Text,
  Card,
  Stack,
  Group,
  Avatar,
  Rating,
  Badge,
} from '@mantine/core';
import theme from '@/shared/theme';
import type { IReview } from '../../profile.const';
import { formatDate } from '../../profile.const';

interface ReviewsProps {
  reviews: IReview[];
}

function Reviews({ reviews }: ReviewsProps) {
  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb="xl"
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'md' }}
      >
        <Text fw={700} fz={{ base: 18, sm: 22 }} c={theme.colors?.gray?.[9]}>
          Sharhlar
        </Text>
        <Badge
          size="lg"
          radius="xl"
          color="blue"
          variant="light"
          style={{
            backgroundColor: theme.colors?.blue?.[0],
            border: `1px solid ${theme.colors?.blue?.[2]}`,
          }}
        >
          {reviews.length} ta
        </Badge>
      </Flex>

      <Stack gap="lg">
        {reviews.map(review => (
          <Card
            key={review.id}
            p={{ base: 'md', sm: 'lg' }}
            radius="md"
            style={{
              backgroundColor: theme.other?.mainWhite,
              border: `1px solid ${theme.colors?.gray?.[2]}`,
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
            styles={{
              root: {
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${theme.colors?.gray?.[3]}`,
                  borderColor: theme.colors?.blue?.[4],
                },
              },
            }}
          >
            <Stack gap="md">
              <Flex
                justify="space-between"
                align="flex-start"
                gap="md"
                direction={{ base: 'column', sm: 'row' }}
              >
                <Group gap="sm">
                  <Avatar
                    src={review.userAvatar}
                    alt={review.userName}
                    radius="xl"
                    size="lg"
                    style={{
                      border: `2px solid ${theme.colors?.blue?.[1]}`,
                    }}
                  >
                    {review.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Stack gap={2}>
                    <Text
                      fw={600}
                      fz={{ base: 14, sm: 16 }}
                      c={theme.colors?.gray?.[9]}
                    >
                      {review.userName}
                    </Text>
                    <Text fz={{ base: 11, sm: 12 }} c={theme.colors?.gray?.[6]}>
                      {formatDate(review.createdAt)}
                    </Text>
                  </Stack>
                </Group>
                <Rating value={review.rating} readOnly size="md" />
              </Flex>

              <Box
                p={{ base: 'sm', sm: 'md' }}
                style={{
                  backgroundColor: theme.colors?.gray?.[0],
                  borderRadius: 12,
                  border: `1px solid ${theme.colors?.gray?.[2]}`,
                }}
              >
                <Badge
                  size="sm"
                  color="blue"
                  variant="light"
                  radius="xl"
                  mb="xs"
                  style={{
                    backgroundColor: theme.colors?.blue?.[0],
                    border: `1px solid ${theme.colors?.blue?.[2]}`,
                  }}
                >
                  {review.serviceName}
                </Badge>
                <Text
                  fz={{ base: 13, sm: 14 }}
                  c={theme.colors?.gray?.[9]}
                  lh={1.7}
                >
                  {review.comment}
                </Text>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default Reviews;

import {
  Box,
  Flex,
  Text,
  Title,
  Button,
  Card,
  Badge,
  Stack,
  List,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import Container from '@/shared/ui/Container';
import theme from '@/shared/theme';
import { LuCrown, LuCheck } from 'react-icons/lu';
import {
  benefits,
  faq,
  formatPrice,
  gradientBg,
  pricingPlans,
  type Benefit,
  type FAQItem,
  type PricingPlan,
} from './premium.const';

function Premium() {
  const handleSelectPlan = (planId: string) => {
    console.log('Selected plan:', planId);
    // TODO: Implement plan selection logic
  };

  return (
    <Box w="100%" bg={theme.colors?.gray?.[0]}>
      {/* Hero Section */}
      <Box
        w="100%"
        py={{ base: 60, md: 100 }}
        style={{
          background: gradientBg(),
        }}
        c={theme.other?.mainWhite}
      >
        <Container>
          <Flex direction="column" align="center" gap="md" ta="center">
            <Badge
              size="lg"
              radius="xl"
              p="md"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Flex align="center" gap={8}>
                <LuCrown size={20} />
                <Text fw={600} fz={14}>
                  Premium A'zolik
                </Text>
              </Flex>
            </Badge>

            <Title
              order={1}
              fz={{ base: 32, sm: 42, md: 56 }}
              fw={800}
              lh={1.2}
              maw={800}
            >
              Xizmatlaringizni Keyingi Darajaga Olib Chiqing
            </Title>

            <Text
              fz={{ base: 16, sm: 18, md: 20 }}
              fw={400}
              c={theme.colors?.gray?.[1]}
              maw={600}
              lh={1.6}
            >
              Premium a'zolik bilan xizmatlaringizni ko'proq mijozlarga
              yetkazing, statistikalarni kuzating va biznesingizni
              rivojlantiring.
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py={{ base: 40, md: 60 }} bg={theme.other?.mainWhite}>
        <Container>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
            {benefits.map((benefit: Benefit, index: number) => (
              <Card
                key={index}
                p="xl"
                radius="lg"
                bg={theme.colors?.gray?.[0]}
                style={{ border: `1px solid ${theme.colors?.gray?.[2]}` }}
              >
                <Flex direction="column" align="center" gap="md">
                  <Box
                    p="md"
                    style={{
                      borderRadius: 12,
                      backgroundColor: theme.colors?.blue?.[0],
                      color: theme.colors?.blue?.[6],
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Title
                    order={4}
                    fw={800}
                    c={theme.colors?.gray?.[9]}
                    ta="center"
                  >
                    {benefit.title}
                  </Title>
                  <Text
                    fz={14}
                    c={theme.colors?.gray?.[6]}
                    ta="center"
                    lh={1.6}
                  >
                    {benefit.description}
                  </Text>
                </Flex>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Pricing Plans */}
      <Box py={{ base: 40, md: 80 }} bg={theme.colors?.gray?.[0]}>
        <Container>
          <Flex direction="column" align="center" gap="xl">
            <Box ta="center" maw={600}>
              <Title order={2} fw={800} c={theme.colors?.gray?.[9]} mb="sm">
                Tarif Rejalar
              </Title>
              <Text fz={16} c={theme.colors?.gray?.[6]} lh={1.6}>
                O'zingizga mos tarifni tanlang va biznesingizni rivojlantiring
              </Text>
            </Box>

            <Flex
              gap="xl"
              wrap="wrap"
              justify="center"
              align="stretch"
              w="100%"
            >
              {pricingPlans.map((plan: PricingPlan) => (
                <Box
                  key={plan.id}
                  w={{ base: '100%', sm: '48%', md: '31%' }}
                  style={{ position: 'relative', display: 'flex' }}
                >
                  {plan.popular && (
                    <Badge
                      pos="absolute"
                      top={-16}
                      left="50%"
                      style={{
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                        color: theme.other?.mainWhite,
                        fontWeight: 700,
                        fontSize: 13,
                        padding: '8px 20px',
                        borderRadius: 20,
                        boxShadow: `0 6px 20px ${plan.color}50`,
                        border: `2px solid ${theme.other?.mainWhite}`,
                      }}
                    >
                      ⭐ Mashhur Tanlov
                    </Badge>
                  )}

                  <Card
                    p={0}
                    radius="xl"
                    data-card
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: plan.popular
                        ? `linear-gradient(135deg, ${plan.color}08 0%, ${plan.color}03 100%)`
                        : theme.other?.mainWhite,
                      border: plan.popular
                        ? `2px solid ${plan.color}`
                        : `1px solid ${theme.colors?.gray?.[2]}`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: plan.popular
                        ? `0 8px 32px ${plan.color}20`
                        : '0 4px 16px rgba(0, 0, 0, 0.08)',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform =
                        'translateY(-16px) scale(1.03)';
                      e.currentTarget.style.boxShadow = plan.popular
                        ? `0 28px 56px ${plan.color}40`
                        : '0 24px 48px rgba(0, 0, 0, 0.18)';
                      e.currentTarget.style.borderColor = plan.color;
                      const glow = e.currentTarget.querySelector(
                        '[data-glow]'
                      ) as HTMLElement;
                      if (glow) glow.style.opacity = '1';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = plan.popular
                        ? `0 8px 32px ${plan.color}20`
                        : '0 4px 16px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = plan.popular
                        ? plan.color
                        : theme.colors?.gray?.[2] || '';
                      const glow = e.currentTarget.querySelector(
                        '[data-glow]'
                      ) as HTMLElement;
                      if (glow) glow.style.opacity = '0';
                    }}
                    styles={{
                      root: {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    {/* Decorative gradient overlay */}
                    {plan.popular && (
                      <Box
                        pos="absolute"
                        top={0}
                        left={0}
                        right={0}
                        h={120}
                        data-popular-overlay
                        style={{
                          background: `linear-gradient(135deg, ${plan.color}15 0%, transparent 100%)`,
                          opacity: 0.6,
                          transition: 'opacity 0.4s ease',
                        }}
                      />
                    )}

                    {/* Hover glow effect */}
                    <Box
                      pos="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      data-glow
                      style={{
                        background: `radial-gradient(circle at center, ${plan.color}15 0%, transparent 70%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    />

                    <Stack
                      gap="lg"
                      p="xl"
                      align="center"
                      pos="relative"
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Icon with gradient background */}
                      <Box
                        pos="relative"
                        style={{
                          width: 80,
                          height: 80,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          pos="absolute"
                          inset={0}
                          style={{
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${plan.color}20 0%, ${plan.color}10 100%)`,
                            filter: 'blur(20px)',
                            opacity: 0.8,
                          }}
                        />
                        <Box
                          p="lg"
                          style={{
                            borderRadius: 20,
                            background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                            color: theme.other?.mainWhite,
                            boxShadow: `0 8px 24px ${plan.color}40`,
                            position: 'relative',
                            zIndex: 1,
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform =
                              'rotate(8deg) scale(1.15)';
                            e.currentTarget.style.boxShadow = `0 12px 32px ${plan.color}60`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform =
                              'rotate(0deg) scale(1)';
                            e.currentTarget.style.boxShadow = `0 8px 24px ${plan.color}40`;
                          }}
                        >
                          {plan.icon}
                        </Box>
                      </Box>

                      <Box
                        ta="center"
                        style={{
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <Title
                          order={3}
                          fw={800}
                          c={theme.colors?.gray?.[9]}
                          mb={4}
                          style={{
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {plan.name}
                        </Title>
                        <Text
                          fz={13}
                          c={theme.colors?.gray?.[6]}
                          ta="center"
                          lh={1.5}
                          fw={500}
                        >
                          {plan.description}
                        </Text>
                      </Box>

                      {/* Price with decorative elements */}
                      <Box
                        ta="center"
                        my="md"
                        p="md"
                        style={{
                          borderRadius: 16,
                          background: `${plan.color}08`,
                          width: '100%',
                          position: 'relative',
                        }}
                      >
                        <Flex
                          align="baseline"
                          justify="center"
                          gap={4}
                          wrap="nowrap"
                        >
                          <Text
                            fz={42}
                            fw={900}
                            c={plan.color}
                            style={{
                              lineHeight: 1,
                              background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}cc 100%)`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {formatPrice(plan.price).split(' ')[0]}
                          </Text>
                          <Text fz={18} c={theme.colors?.gray?.[6]} fw={600}>
                            so'm
                          </Text>
                        </Flex>
                        <Text
                          fz={11}
                          c={theme.colors?.gray?.[5]}
                          mt={4}
                          fw={500}
                          style={{
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                          }}
                        >
                          oyiga
                        </Text>
                      </Box>

                      {/* Features list with enhanced styling */}
                      <Box
                        w="100%"
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <List
                          spacing="md"
                          size="sm"
                          icon={
                            <Box
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: theme.other?.mainWhite,
                              }}
                            >
                              <LuCheck size={12} />
                            </Box>
                          }
                          styles={{
                            item: {
                              color: theme.colors?.gray?.[7],
                              fontWeight: 500,
                              paddingLeft: 8,
                              '&:hover': {
                                color: plan.color,
                                transform: 'translateX(4px)',
                                transition: 'all 0.2s ease',
                              },
                            },
                          }}
                        >
                          {plan.features.map((feature: string, idx: number) => (
                            <List.Item key={idx}>{feature}</List.Item>
                          ))}
                        </List>
                      </Box>

                      {/* Enhanced CTA Button */}
                      <Button
                        fullWidth
                        size="lg"
                        radius="md"
                        style={{
                          marginTop: 'auto',
                          background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                          color: theme.other?.mainWhite,
                          fontWeight: 700,
                          fontSize: 15,
                          height: 48,
                          boxShadow: `0 4px 16px ${plan.color}40`,
                          border: 'none',
                        }}
                        styles={{
                          root: {
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background:
                                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                              transition: 'left 0.5s ease',
                            },
                            '&:hover': {
                              transform: 'translateY(-2px) scale(1.02)',
                              boxShadow: `0 8px 24px ${plan.color}60`,
                              '&::before': {
                                left: '100%',
                              },
                            },
                            '&:active': {
                              transform: 'translateY(0) scale(0.98)',
                            },
                          },
                        }}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {plan.popular ? 'Hoziroq Boshlash' : 'Tanlash'}
                      </Button>
                    </Stack>
                  </Card>
                </Box>
              ))}
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        py={{ base: 60, md: 80 }}
        style={{
          background: gradientBg(),
        }}
        c={theme.other?.mainWhite}
      >
        <Container>
          <Flex direction="column" align="center" gap="lg" ta="center">
            <Title order={2} fw={800} fz={{ base: 28, md: 36 }} maw={600}>
              Hoziroq Premium bo'ling!
            </Title>
            <Text
              fz={{ base: 14, md: 16 }}
              c={theme.colors?.gray?.[1]}
              maw={500}
              lh={1.6}
            >
              7 kunlik bepul sinov davri. Hech qanday majburiyat yo'q.
            </Text>
            <Button
              size="lg"
              radius="md"
              px="xl"
              styles={{
                root: {
                  backgroundColor: theme.other?.mainWhite,
                  color: theme.colors?.blue?.[6],
                  fontWeight: 800,
                  fontSize: 16,
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  },
                },
              }}
              onClick={() => handleSelectPlan('professional')}
            >
              Bepul Sinovni Boshlash
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box py={{ base: 50, md: 70 }} bg={theme.other?.mainWhite}>
        <Container>
          <Flex direction="column" gap="lg" maw={860} mx="auto">
            <Box ta="center">
              <Title order={2} fw={800} c={theme.colors?.gray?.[9]}>
                Savol-javob
              </Title>
              <Text fz={15} c={theme.colors?.gray?.[6]} mt={8}>
                Eng ko‘p beriladigan savollarga qisqa javoblar
              </Text>
            </Box>

            <Card
              radius="lg"
              p="xl"
              style={{ border: `1px solid ${theme.colors?.gray?.[2]}` }}
            >
              <Stack gap="lg">
                {faq.map((item: FAQItem, idx: number) => (
                  <Box key={idx}>
                    <Text fw={700} c={theme.colors?.gray?.[9]} fz={15}>
                      {item.q}
                    </Text>
                    <Text c={theme.colors?.gray?.[6]} fz={14} mt={6} lh={1.6}>
                      {item.a}
                    </Text>
                    {idx !== faq.length - 1 ? (
                      <Divider mt="lg" color={theme.colors?.gray?.[2]} />
                    ) : null}
                  </Box>
                ))}
              </Stack>
            </Card>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default Premium;

import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Window focus bo'lganda refetch qilmaslik
      refetchOnMount: true, // Component mount bo'lganda refetch qilish
      refetchOnReconnect: true, // Internet qayta ulanganda refetch qilish
      staleTime: 5 * 60 * 1000, // 5 daqiqa - ma'lumot fresh hisoblanadi
      gcTime: 10 * 60 * 1000, // 10 daqiqa - cache saqlanadi
      retry: 1, // Muvaffaqiyatsiz bo'lsa 1 marta qayta urinish
    },
  },
});

export default queryClient;
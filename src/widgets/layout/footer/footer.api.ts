import { queryOptions } from '@tanstack/react-query';

import { getFooter } from '@/shared/api/services/footer';

export const FOOTER_QUERY_KEY = 'footer';

export const useGetFooter = () => {
  return queryOptions({
    queryKey: [FOOTER_QUERY_KEY],
    queryFn: () => getFooter(),
  });
};

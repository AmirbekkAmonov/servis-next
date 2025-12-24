import { Box, Text, Select, Skeleton } from '@mantine/core';
import theme from '@/shared/theme';

type Region = {
  id: number;
  name: string;
  slug: string;
};

type District = {
  id: number;
  name: string;
  slug: string;
};

type RegionSelectProps = {
  regions: Region[];
  districts: District[];
  selectedRegion: string | null;
  selectedDistrict: string | null;
  onRegionChange: (value: string | null) => void;
  onDistrictChange: (value: string | null) => void;
  isLoadingRegions?: boolean;
  isLoadingDistricts?: boolean;
};

function RegionSelect({
  regions,
  districts,
  selectedRegion,
  selectedDistrict,
  onRegionChange,
  onDistrictChange,
  isLoadingRegions = false,
  isLoadingDistricts = false,
}: RegionSelectProps) {
  const regionOptions = regions.map(r => ({
    value: r.slug,
    label: r.name,
  }));

  const districtOptions = districts.map(d => ({
    value: d.slug,
    label: d.name,
  }));

  return (
    <Box>
      <Text fw={600} fz={14} c={theme.colors?.gray?.[8]} mb="sm">
        Hudud
      </Text>

      {isLoadingRegions ? (
        <Skeleton height={36} radius="sm" mb="sm" />
      ) : (
        <Select
          placeholder="Viloyatni tanlang"
          data={regionOptions}
          value={selectedRegion}
          onChange={onRegionChange}
          clearable
          searchable
          mb="sm"
          styles={{
            input: {
              borderColor: theme.colors?.gray?.[3],
            },
          }}
        />
      )}

      {isLoadingDistricts ? (
        <Skeleton height={36} radius="sm" />
      ) : (
        <Select
          placeholder="Tumanni tanlang"
          data={districtOptions}
          value={selectedDistrict}
          onChange={onDistrictChange}
          clearable
          searchable
          disabled={!selectedRegion}
          styles={{
            input: {
              borderColor: theme.colors?.gray?.[3],
              opacity: selectedRegion ? 1 : 0.6,
            },
          }}
        />
      )}
    </Box>
  );
}

export default RegionSelect;

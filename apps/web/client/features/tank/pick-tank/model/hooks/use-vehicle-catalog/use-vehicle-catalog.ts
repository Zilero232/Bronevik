'use client';

import { useQuery } from '@tanstack/react-query';

import { vehicleCatalogQuery } from '@/entities/tank/tank';

export const useVehicleCatalog = () => useQuery(vehicleCatalogQuery());

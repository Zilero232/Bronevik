import { createVehicleSourceSchema, vehicleSourceIdParamsSchema, vehicleSourceSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class VehicleSourceDto extends createZodDto(vehicleSourceSchema) {}
export class CreateVehicleSourceDto extends createZodDto(createVehicleSourceSchema) {}
export class VehicleSourceIdParamsDto extends createZodDto(vehicleSourceIdParamsSchema) {}

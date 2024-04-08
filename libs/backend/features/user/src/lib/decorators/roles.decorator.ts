import { SetMetadata } from '@nestjs/common';

export const IS_TRAINEE = 'Roles';
export const Trainer = () => SetMetadata(IS_TRAINEE, true);

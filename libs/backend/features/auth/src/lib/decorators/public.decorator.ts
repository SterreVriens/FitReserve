
import { SetMetadata } from '@nestjs/common';

// Definieer een constant IS_PUBLIC_KEY met als waarde de string 'isPublic'
export const IS_PUBLIC_KEY = 'isPublic';

// Definieer een decorator genaamd Public die SetMetadata(IS_PUBLIC_KEY, true) toepast
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

// export function Authorize(...roles: Role[]) {
//   return applyDecorators(
//     SetMetadata('roles', roles),
//     UseGuards(AuthGuard, RolesGuard),
//     ApiBearerAuth(),
//     ApiUnauthorizedResponse({ description: 'unauthorized' }),
//   );
// }

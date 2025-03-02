import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from "../../common/enums/rol.enum";
import { RolesGuard } from "../guard/roles.guard";
import { AuthGuard } from "../guard/auth.guard";

export const Auth = (...roles: Role[]) => {
    return applyDecorators(
        SetMetadata('roles', roles), 
        UseGuards(AuthGuard, RolesGuard)
    );
  };
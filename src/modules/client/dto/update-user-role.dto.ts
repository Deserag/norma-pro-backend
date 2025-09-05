import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class UpdateUserRoleDTO {
    @IsString() @ApiProperty({ example: 'id администратора' }) adminId: string;
    @IsString() @ApiProperty({ example: 'id membership' }) userClientId: string;
    @IsIn(['USER','MANAGER','ADMIN']) @ApiProperty({ example: 'ADMIN' }) newRole: 'USER' | 'MANAGER' | 'ADMIN';
  }
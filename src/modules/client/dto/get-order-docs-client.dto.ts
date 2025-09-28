import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class getOrderDocsClientDTO {
    @IsString() @ApiProperty({ example: 'id заказа' }) orderId: string;
    deletedAt;
    size;
    page;
    
    

  }

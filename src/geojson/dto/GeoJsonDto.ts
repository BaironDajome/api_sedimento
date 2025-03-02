import { IsNotEmpty, IsString } from 'class-validator';

export class GeoJsonDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la tabla es obligatorio' })
  tableName: string;
}
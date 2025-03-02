import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GeoJsonFiltroDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la tabla es obligatorio' })
  tableName: string;

  @IsOptional()
  @IsString()
  filter?: string; // Filtro opcional en formato SQL
}
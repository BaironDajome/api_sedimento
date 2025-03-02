import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GeojsonService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getGeoJsonData(tableName: string): Promise<any> { 
    this.valididaNombre(tableName);
    const geometry = 'wkb_geometry';
  
    try {
      // Obtener conexión a la base de datos
      const db = this.databaseService.getConnection();
  
      // Consulta para obtener los datos en formato GeoJSON
      const query = `
        SELECT COALESCE(json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
            json_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(${geometry})::json,
              'properties', to_jsonb(t) - '${geometry}'
            )
          )
        ), '{}'::json) AS geojson
        FROM ${tableName} t;
      `;

      const result = await db.query(query);
  
      // Verifica si hay datos en el resultado
      if (!result || result.length === 0 || !result[0].geojson) {
        throw new InternalServerErrorException('No se encontraron datos.');
      }
  
      return result[0].geojson;  // Acceder correctamente al objeto JSON
    } catch (error) {
      console.error('Error al obtener datos GeoJSON:', error);
      throw new InternalServerErrorException('Error al obtener datos GeoJSON');
    }
  }

  async getGeoJsonFitroData(tableName: string, filter?: string): Promise<any> {
    this.valididaNombre(tableName);
    try {
      const db = this.databaseService.getConnection();
      const geometry = 'wkb_geometry';
      let whereClause = '';
  
      if (filter) {
        whereClause = `WHERE ${filter}`;
      }
      const query = `
        SELECT COALESCE(json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
            json_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(${geometry})::json,
              'properties', to_jsonb(t) - '${geometry}'
            )
          )
        ), '{}'::json) AS geojson
        FROM ${tableName} t ${whereClause};
      `;
  

      const result = await db.query(query);
  
      // Verifica si hay datos en el resultado
      if (!result || result.length === 0 || !result[0].geojson) {
        throw new InternalServerErrorException('No se encontraron datos.');
      }
  
      return result[0].geojson; 
    } catch (error) {
      console.error('Error al obtener datos GeoJSON:', error);
      throw new InternalServerErrorException('Error al obtener datos GeoJSON');
    }
  }

  private valididaNombre(tableName: string) {
    if (!tableName || tableName.trim() === '') {
      throw new BadRequestException('El nombre de la tabla es obligatorio.');
    }
  
    // Validación del nombre de la tabla para evitar inyección SQL
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      throw new BadRequestException('Nombre de tabla inválido.');
    }
  }

}

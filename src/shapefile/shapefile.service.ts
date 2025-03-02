import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { DatabaseService } from 'src/database/database.service';

const execAsync = promisify(exec);

@Injectable()
export class ShapefileService {
  constructor(private readonly databaseService: DatabaseService) { }

  async loadShapefile(fileBuffer: Buffer, tableName: string, filePath: string) {
    // Validar que el archivo fue recibido
    if (!fileBuffer) {
      throw new BadRequestException('No se recibió ningún archivo.');
    }

    // Validar que el nombre de la tabla fue proporcionado
    if (!tableName || tableName.trim() === '') {
      throw new BadRequestException('El nombre de la tabla es obligatorio.');
    }

    // Validar que se proporciona una ruta de archivo válida
    if (!filePath || filePath.trim() === '') {
      throw new BadRequestException('La ruta del archivo es obligatoria.');
    }

    try {
      // Validar si el archivo existe y es accesible
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
      throw new BadRequestException(`El archivo no existe o no es accesible: ${filePath}`);
    }

    try {
      const dbConfig = this.databaseService.getDatabaseConfig();
      const { user, database, password } = dbConfig;
      const ogr2ogrPath = path.join('C:', 'OSGeo4W', 'bin', 'ogr2ogr.exe');

      // Verificar si ogr2ogr.exe realmente existe
      if (!fs.existsSync(ogr2ogrPath)) {
        throw new InternalServerErrorException('ogr2ogr.exe no se encuentra en la ruta especificada.');
      }

      // Construir el comando `ogr2ogr`
      const command = `"${ogr2ogrPath}" -f "PostgreSQL" PG:"dbname=${database} user=${user} password=${password}" -nlt PROMOTE_TO_MULTI -nln ${tableName} "${filePath}"`;

      console.log('Ejecutando comando:', command);

      // Ejecutar el proceso
      const {stderr } = await execAsync(command);

      if (stderr) {
        console.error('Error ejecutando ogr2ogr:', stderr);
        throw new InternalServerErrorException(`Error cargando el shapefile: ${stderr}`);
      }
      return { message: 'Shapefile cargado correctamente en la tabla', tableName };

    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      throw new InternalServerErrorException(`Error al procesar el archivo: ${error.message}`);
    }
  }
}

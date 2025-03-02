import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ShapefileService } from './shapefile.service';

@Controller('shapefile')
export class ShapefileController {
  constructor(private readonly shapefileService: ShapefileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadShapefile(
    @UploadedFile() file: Express.Multer.File,
    @Body('tableName') tableName: string,
    @Body('filePath') filePath: string ) 
  {
    return this.shapefileService.loadShapefile(file.buffer, tableName,filePath);
  }
}


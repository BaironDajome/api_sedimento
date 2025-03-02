import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { GeojsonService } from './geojson.service';
import { GeoJsonDto } from './dto/GeoJsonDto';

@Controller('geojson')
export class GeojsonController {
  constructor(private readonly geojsonService: GeojsonService) {}
  
  
  @Get(':tableName')
  async getGeoJson(@Param('tableName') tableName: string) {
    return await this.geojsonService.getGeoJsonData(tableName);
  }

  @Post()
  async getGeoJsonWithFilter(@Body() body: { tableName: string; filter?: string }) {
    return this.geojsonService.getGeoJsonFitroData(body.tableName,body.filter);
  }
  
}

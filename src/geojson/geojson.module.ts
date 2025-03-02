import { Module } from '@nestjs/common';
import { GeojsonService } from './geojson.service';
import { GeojsonController } from './geojson.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GeojsonController],
  providers: [GeojsonService],
})
export class GeojsonModule {}

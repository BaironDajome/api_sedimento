import { Module } from '@nestjs/common';
import { ShapefileService } from './shapefile.service';
import { ShapefileController } from './shapefile.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ShapefileController],
  providers: [ShapefileService],
})
export class ShapefileModule {}

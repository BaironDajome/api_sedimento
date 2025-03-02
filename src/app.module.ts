
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ShapefileModule } from './shapefile/shapefile.module';
import { GeojsonModule } from './geojson/geojson.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ShapefileModule,
    GeojsonModule
  ],
})
export class AppModule {}

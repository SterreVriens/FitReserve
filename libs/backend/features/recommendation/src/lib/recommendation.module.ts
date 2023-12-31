import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j/dist';
import { Neo4jConfig } from 'nest-neo4j/dist/interfaces/neo4j-config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule.forRootAsync({
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME') || 'neo4j',
        host: configService.get('NEO4J_HOST') || '127.0.0.1',
        port: configService.get('NEO4J_PORT') || 7687,
        username: configService.get('NEO4J_USERNAME') || 'neo4j',
        password: configService.get('NEO4J_PASSWORD') || 'ikhaatkaas',
        database: configService.get('NEO4J_DATABASE') || 'neo4j',
      })}),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationsModule {}

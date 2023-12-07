/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get,  Param, Delete, Logger } from "@nestjs/common";
import { RecommendationService } from './recommendation.service';
import { Neo4jService } from "nest-neo4j/dist";
import { Public } from '@fit-reserve/decorators';

@Controller('recommendations')
export class RecommendationController {
  private readonly logger = new Logger(RecommendationController.name);
  constructor(
    private readonly recommendationsService: RecommendationService,
    private readonly neo4jService: Neo4jService
  ) {}

  @Public()
  @Get()
  async getHello() : Promise<any>{
    this.logger.log(`getHello`);
    const res = await this.neo4jService.read('MATCH (n) RETURN n LIMIT 25', {});
    this.logger.log(`got result: ${JSON.stringify(res)}`);
    //return `There are nodes in the database`;
    return `There are ${res.records[0].get('count')} nodes in the database`;
  }

//   @Post()
//   create(@Body() createRecommendationDto: CreateRecommendationDto) {
//     return this.recommendationsService.create(createRecommendationDto);
//   }

  @Public()
  @Get()
  async findAll() {
    this.logger.log(`in findAll`);
    return await this.recommendationsService.findAllMeals();
  }

  @Get(':type')
  async findMealsByType(@Param('type') mealType: string) {
    return await this.recommendationsService.findMealsByType(mealType);
  }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateRecommendationDto: UpdateRecommendationDto) {
//     return this.recommendationsService.update(+id, updateRecommendationDto);
//   }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recommendationsService.remove(+id);
  }
}

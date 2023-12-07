
import { Injectable, Logger } from "@nestjs/common";
// import { CreateRecommendationDto } from './dto/create-recommendation.dto';
// import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class RecommendationService {

  private readonly logger:Logger = new Logger(RecommendationService.name);

  constructor(private readonly neo4jService: Neo4jService) {
  }
//   create(createRecommendationDto: CreateRecommendationDto) {
//     return 'This action adds a new recommendation';
//   }

  async findAll() {
    return this.findAllMeals();
  }

  async findAllMeals() {
    const result = await this.neo4jService.read('match(meal:Meal) return meal',{});
    this.logger.log(`got result: ${JSON.stringify(result)}`);

    return result?.records;
  }

  async findMealsByType(mealType: string) {
    const query = `match(meal:Meal) where meal.type = '${mealType}' return meal`;

    const result = await this.neo4jService.read(query,{});

    return result?.records;
  }

  findOne(id: number) {
    return `This action returns a #${id} recommendation`;
  }

//   update(id: number, updateRecommendationDto: UpdateRecommendationDto) {
//     return `This action updates a #${id} recommendation`;
//   }

  remove(id: number) {
    return `This action removes a #${id} recommendation`;
  }
}

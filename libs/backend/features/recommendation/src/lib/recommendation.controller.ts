/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Logger, Param } from "@nestjs/common";
import { RecommendationService } from './recommendation.service';
import { ITraining } from "@fit-reserve/shared/api";


@Controller('recommendations')
export class RecommendationController {
  private readonly logger = new Logger(RecommendationController.name);
  constructor(
    private readonly recommendationsService: RecommendationService,
  ) {}

  @Get(':id')
  getAll(@Param('id') id: string):Promise<ITraining[]>{
      return this.recommendationsService.getRecommendations(id);
  }

}

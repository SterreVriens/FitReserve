/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Logger } from "@nestjs/common";
import { RecommendationService } from './recommendation.service';


@Controller('recommendations')
export class RecommendationController {
  private readonly logger = new Logger(RecommendationController.name);
  constructor(
    private readonly recommendationsService: RecommendationService,
  ) {}

}

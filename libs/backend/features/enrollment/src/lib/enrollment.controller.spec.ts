import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { getModelToken } from '@nestjs/mongoose';
import { Enrollment } from './schemas/enrollment.schemas';
import { IEnrollment } from '@fit-reserve/shared/api';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;
  let enrollmentService: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        EnrollmentService,
        {
          provide: getModelToken(Enrollment.name),
          useValue: {}, // Mock the model, you can add more realistic mock if needed
        },
      ],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
    enrollmentService = module.get<EnrollmentService>(EnrollmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne', () => {
    it('should return a single enrollment', async () => {
      const result = {} as IEnrollment;
      jest.spyOn(enrollmentService, 'getOne').mockResolvedValue(result);

      expect(await controller.getOne('1')).toBe(result);
    });
  });

  // Add more tests for other controller methods...

});

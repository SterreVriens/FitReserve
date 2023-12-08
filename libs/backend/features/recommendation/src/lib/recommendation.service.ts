
import { Injectable, Logger } from "@nestjs/common";

import { Neo4jService } from "nest-neo4j/dist";
import {IEnrollment, ITraining, IUser, Id} from '@fit-reserve/shared/api' 

@Injectable()
export class RecommendationService {

  private readonly logger:Logger = new Logger(RecommendationService.name);

  constructor(private readonly neo4jService: Neo4jService) {
  }

  async createOrUpdateUser(user: IUser) {
    this.logger.log(`Creating user`);
  
    const result = await this.neo4jService.write(`
      MERGE (u:User {
        _id: $id
      })
      ON CREATE SET
        u.Username = $Username,
        u.Password = $Password,
        u.Role = $Role,
        u.Date = $Date,
      ON MATCH SET
        u.Username = $Username,
        u.Password = $Password,
        u.Role = $Role,
        u.Date = $Date,
      RETURN u
    `, {
      id: user._id?.toString(),
      username: user.UserName?.toString(),
      password: user.Password?.toString(), 
      role: user.Role?.toString(),
      date: user.Date?.toString(),
    });
  
    return result;
  }
  
  async deleteUser(id: Id) {
    this.logger.log(`Deleting user`);
  
    const result = await this.neo4jService.write(`
      MATCH (u:User {_id: $id})
      DETACH DELETE u
    `, {
      id,
    });
  
    return result;
  }

  async createOrUpdateEnrollment(enrollment: IEnrollment) {
    this.logger.log(`Creating enrollment`);

    const result = await this.neo4jService.write(`
      MERGE (e:Enrollment {
        _id: $id
      })
      ON CREATE SET
        e.TrainingId = $TrainingId,
        e.UserId = $UserId,
        e.Level = $Level,
      ON MATCH SET
        e.TrainingId = $TrainingId,
        e.UserId = $UserId,
        e.Level = $Level,
      RETURN e
    `, {
      id: enrollment._id?.toString(), 
      TrainingId: enrollment.TrainingId.toString(),
      UserId: enrollment.UserId.toString(),
      Level: enrollment.Level.toString(),
    });

    return result;
  }

  async deleteEnrollment(id: Id) {
    this.logger.log(`Deleting enrollment`);

    const result = await this.neo4jService.write(`
      MATCH (e:Enrollment {_id: $id})
      DETACH DELETE e
    `, {
      id,
    });

    return result;
  }

  async createOrUpdateTraining(training: ITraining) {
    this.logger.log(`Creating training`);

    const result = await this.neo4jService.write(`
      MERGE (t:Training {
        _id: $id
      })
      ON CREATE SET
        t.SessionName = $SessionName,
        t.Date = $Date,
        t.Duration = $Duration,
        t.Description = $Description,
        t.Location = $Location,
        t.Places = $Places,
        t.UserId = $UserId,
      ON MATCH SET
        t.SessionName = $SessionName,
        t.Date = $Date,
        t.Duration = $Duration,
        t.Description = $Description,
        t.Location = $Location,
        t.Places = $Places,
        t.UserId = $UserId,
      RETURN t
    `, {
      id: training._id?.toString(), // Use optional chaining
      SessionName: training.SessionName?.toString(),
      Date: training.Date?.toString(),
      Duration: training.Duration?.toString(),
      Description: training.Description?.toString(),
      Location: training.Location?.toString(),
      Places: training.Places?.toString(),
      UserId: training.UserId?.toString(),
    });

    return result;
  }

  async deleteTraining(id: Id) {
    this.logger.log(`Deleting training`);

    const result = await this.neo4jService.write(`
      MATCH (t:Training {_id: $id})
      DETACH DELETE t
    `, {
      id,
    });

    return result;
  }

  async getRecommendations(enrollment: IEnrollment) {
    this.logger.log(`Getting recommendations for user with enrollment ${enrollment._id}`);

    const result = await this.neo4jService.read(`
      MATCH (e:Enrollment {TrainingId: $trainingId})<-[:FOR_TRAINING]-(t:Training)<-[:ENROLLED_IN]-(u:User)
      MATCH (u)-[:ENROLLED_IN]->(otherEnrollment:Enrollment)-[:FOR_TRAINING]->(otherTraining:Training)
      WHERE e <> otherEnrollment
      RETURN DISTINCT otherTraining
    `, {
      trainingId: enrollment.TrainingId,
    });

    return result.records.map(record => record.get('otherTraining').properties as ITraining);
  }
  
}

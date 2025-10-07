import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('FinanceController (e2e)', () => {
  let app: INestApplication;
  let createdFinanceId: string;
  const testUserId = 'test-user-id';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/finance (POST)', () => {
    it('should create a new finance record', () => {
      return request(app.getHttpServer())
        .post('/finance')
        .send({
          userId: testUserId,
          description: 'Test Income',
          amount: 1000.50,
          type: 'income',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.userId).toBe(testUserId);
          expect(response.body.description).toBe('Test Income');
          expect(response.body.amount).toBe(1000.50);
          expect(response.body.type).toBe('income');
          createdFinanceId = response.body.id;
        });
    });

    it('should fail to create finance with invalid amount', () => {
      return request(app.getHttpServer())
        .post('/finance')
        .send({
          userId: testUserId,
          description: 'Test Income',
          amount: -100,
          type: 'income',
        })
        .expect(400);
    });

    it('should fail to create finance with missing fields', () => {
      return request(app.getHttpServer())
        .post('/finance')
        .send({
          userId: testUserId,
          amount: 100,
        })
        .expect(400);
    });
  });

  describe('/finance (GET)', () => {
    it('should return all finance records', () => {
      return request(app.getHttpServer())
        .get('/finance')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/finance/user/:userId (GET)', () => {
    it('should return finance records for a specific user', () => {
      return request(app.getHttpServer())
        .get(`/finance/user/${testUserId}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          if (response.body.length > 0) {
            expect(response.body[0].userId).toBe(testUserId);
          }
        });
    });

    it('should return empty array for user with no records', () => {
      return request(app.getHttpServer())
        .get('/finance/user/non-existent-user')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });

  describe('/finance/:id (GET)', () => {
    it('should return a finance record by id', () => {
      return request(app.getHttpServer())
        .get(`/finance/${createdFinanceId}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.id).toBe(createdFinanceId);
        });
    });

    it('should return 404 for non-existent finance record', () => {
      return request(app.getHttpServer())
        .get('/finance/non-existent-id')
        .expect(404);
    });
  });

  describe('/finance/:id (PUT)', () => {
    it('should update a finance record', () => {
      return request(app.getHttpServer())
        .put(`/finance/${createdFinanceId}`)
        .send({
          description: 'Updated Income',
          amount: 1500.75,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.description).toBe('Updated Income');
          expect(response.body.amount).toBe(1500.75);
        });
    });

    it('should fail to update with invalid data', () => {
      return request(app.getHttpServer())
        .put(`/finance/${createdFinanceId}`)
        .send({
          amount: -100,
        })
        .expect(400);
    });
  });

  describe('/finance/:id (DELETE)', () => {
    it('should delete a finance record', () => {
      return request(app.getHttpServer())
        .delete(`/finance/${createdFinanceId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent finance record', () => {
      return request(app.getHttpServer())
        .delete('/finance/non-existent-id')
        .expect(404);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;

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

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe('Test User');
          expect(response.body.email).toBe('test@example.com');
          createdUserId = response.body.id;
        });
    });

    it('should fail to create user with invalid email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('should fail to create user with missing fields', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
        })
        .expect(400);
    });
  });

  describe('/users (GET)', () => {
    it('should return all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.id).toBe(createdUserId);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/non-existent-id')
        .expect(404);
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update a user', () => {
      return request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .send({
          name: 'Updated User',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Updated User');
        });
    });

    it('should fail to update with invalid data', () => {
      return request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .send({
          email: 'invalid-email',
        })
        .expect(400);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/users/non-existent-id')
        .expect(404);
    });
  });
});

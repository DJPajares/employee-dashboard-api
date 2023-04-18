import request from 'supertest';
import app from '../../index';

describe('Employees API', () => {
  describe('POST /employees', () => {
    it('should upload a CSV file and create or update employees', async () => {
      const csvData = 'id,login,name,salary\n1,alice,Alice,30';

      const response = await request(app)
        .post('/api/employees')
        .attach('file', Buffer.from(csvData), { filename: 'employees.csv' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should return status 400 if CSV file is missing', async () => {
      const response = await request(app).post('/api/employees');

      expect(response.status).toBe(400);
    });

    it('should return status 400 if CSV file have less number of columns', async () => {
      const csvData = 'id,login,name,salary\n1,alice,Alice\n2,bob,Bob,35';

      const response = await request(app)
        .post('/api/employees')
        .attach('file', Buffer.from(csvData), { filename: 'employees.csv' });

      expect(response.status).toBe(400);
    });

    it('should return status 400 if CSV file have more number of columns', async () => {
      const csvData = 'id,login,name,salary\n1,alice,Alice,50,25\n2,bob,Bob,35';

      const response = await request(app)
        .post('/api/employees')
        .attach('file', Buffer.from(csvData), { filename: 'employees.csv' });

      expect(response.status).toBe(400);
    });

    it('should return status 400 if CSV file have invalid incorrectly formatted salaries', async () => {
      const csvData = 'id,login,name,salary\n1,alice,Alice,five\n2,bob,Bob,35';

      const response = await request(app)
        .post('/api/employees')
        .attach('file', Buffer.from(csvData), { filename: 'employees.csv' });

      expect(response.status).toBe(400);
    });

    it('should return status 400 if CSV file have a salary value of less than 0', async () => {
      const csvData = 'id,login,name,salary\n1,alice,Alice,-50\n2,bob,Bob,35';

      const response = await request(app)
        .post('/api/employees')
        .attach('file', Buffer.from(csvData), { filename: 'employees.csv' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /employees', () => {
    it('should return status 200 if all request params are present', async () => {
      const res = await request(app).get(
        '/api/employees?minSalary=0&maxSalary=4000&offset=0&limit=30&sort=+name'
      );

      expect(res.status).toEqual(200);
    });

    it('should return status 400 if any of the request params is missing', async () => {
      const res = await request(app).get(
        '/api/employees?maxSalary=4000&offset=0&limit=30&sort=+name'
      );

      expect(res.status).toEqual(400);
    });

    it('should return status 400 if any of the request params data format is invalid', async () => {
      const res = await request(app).get(
        '/api/employees?minSalary=0&maxSalary=4000&offset=0&limit=abc&sort=+name'
      );

      expect(res.status).toEqual(400);
    });
  });

  describe('PUT /employees', () => {
    it('should return status 200 if all request params are present', async () => {
      const res = await request(app).put('/api/employees/1').send({
        name: 'Alice',
        salary: 1000
      });

      expect(res.status).toEqual(200);
    });

    it('should return status 400 if any of the request params data format is invalid', async () => {
      const res = await request(app).put('/api/employees/1').send({
        name: 'Alice',
        salary: 'abc'
      });

      expect(res.status).toEqual(400);
    });
  });

  describe('DELETE /employees', () => {
    it('should return status 400 if id is formatted wrongly', async () => {
      const res = await request(app).delete('/api/employees').send([1]);

      expect(res.status).toEqual(400);
    });

    it('should return status 200 if request body is an id of array of strings', async () => {
      const res = await request(app).delete('/api/employees').send(['1']);

      expect(res.status).toEqual(200);
    });
  });
});

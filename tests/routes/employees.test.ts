import request from 'supertest';
import app from '../../src/index';

const employees = [
  {
    id: '1',
    login: 'test1',
    name: 'Test 1',
    salary: '1000'
  },
  {
    id: '2',
    login: 'test2',
    name: 'Test 2',
    salary: '2000'
  }
];

describe('Employees API', () => {
  describe('POST /employees', () => {
    it('should return 200 OK', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ csvData: employees });

      expect(res.status).toEqual(200);
      expect(res.body).toEqual(employees);
    });
  });
});

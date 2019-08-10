import request from 'supertest';
import app from '../app/app';
import { User } from '../app/models/user.model'
import * as TestDB from './fixtures/db';

beforeEach(TestDB.setup);

test('Should signup a new user', async () => {
    await request(app).post('/user/signup').send({
        username: "jde5f3dbdf",
        password : "sdfdfsdfdAA11",
        email : "sbjdf@d3gmail.com"
    }).expect(201);
});

test('Should login existing user', async () => {
    await request(app).post('/user/login').send({
        username: TestDB.testUser1.username,
        password : TestDB.testUser1.password
    }).expect(200);
});

test('Should not login not existing user', async () => {
    await request(app).post('/user/login').send({
        username: '234',
        password : '4234'
    }).expect(400);
});

test('User get self', async () => {
    await request(app).get('/user/me')
        .set('Authorization', `Bearer ${TestDB.testUser1.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Not authentificate user cant get self', async () => {
    await request(app).get('/user/me')
        .set('Authorization', `Bearer 123`)
        .send()
        .expect(401);
});

test('Should delete self', async () => {
    await request(app).delete('/user/me')
        .set('Authorization', `Bearer ${TestDB.testUser1.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not delete self', async () => {
    await request(app).delete('/user/me')
        .set('Authorization', `sdf`)
        .send()
        .expect(401);
});

test('Should upload avatar', async () => {
    const response = await request(app).delete('/user/me/avatar')
        .set('Authorization', `Bearer ${TestDB.testUser1.tokens[0].token}`)
        .send();

    expect(response.body).not.toBeNull();
});

test('Should get avatar', async () => {
    await request(app)
        .post('/user/me/avatar')
        .set('Authorization', `Bearer ${TestDB.testUser1.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(TestDB.testUserId1);
    expect(user!.avatar).toEqual(expect.any(Buffer));
});

test('Should update username', async () => {
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${TestDB.testUser1.tokens[0].token}`)
        .send({
            username: '234',
        })
        .expect(200);

    const user = await User.findById(TestDB.testUserId1);
    expect(user!.username).toEqual('234');
});


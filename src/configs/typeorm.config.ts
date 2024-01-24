import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: '123',
  database: 'manager_studio_db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};

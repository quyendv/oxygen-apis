import { Sequelize, DataTypes } from 'sequelize';
import fs from "fs";
import { Model } from 'sequelize';


const data = JSON.parse(fs.readFileSync('./divisions.json', 'utf8', ));
const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'oxygen',
  username: 'postgres',
  password: '123321asdson',
  host: 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  logging: false,
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
// await sequelize.drop();





// District.associate();
// Ward.associate();

// await sequelize.sync({force: true});

async function importData() {

  try {
    for (const city of data) {
      //  await City.create(city);

      for (const district of city.districts) {
        // district.city_code = city.code;
        // await District.create(district);

        for (const ward of district.wards) {
          ward.district_code = district.code;
          await Ward.create(ward);
        }
      }
    }

  console.log('Data imported successfully.');
} catch (error) {
  
  console.error('Failed to import data:', error);

}
}

connectDB().then(() => {
  // importData()
  // sequelize.drop()
});

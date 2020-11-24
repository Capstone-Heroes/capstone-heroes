const bcrypt = require('bcrypt');
const driver = require('./server/db/db');
const { NEO4J_DATABASE } = require('./constants');


const seed = async (db) => {
    console.log('in seed')

    let today = new Date()
    today = today.toString();

    const hashedPW = await bcrypt.hash('test', 10);

    try {
        // create database session
        const session = db.session({ database: NEO4J_DATABASE });

        // drop existing db records (similar to force: true in sequelize)
        await session.run('MATCH (n) DETACH DELETE n');
        
        // create 4 new users
        await session.run(
            'MERGE (u:User { username:$username, password:$password, householdSize:$householdSize, \
                covidPosContact:$covidPosContact, covidTest:$covidTest, testDate:$testDate }) RETURN u', 
            {
                username: 'zoe',
                password: hashedPW,
                householdSize: 2,
                covidPosContact: false,
                covidTest: 'negative', 
                testDate: '2020-11-23' 
            }
        );
        await session.run(
            'MERGE (u:User { username:$username, password:$password, householdSize:$householdSize, \
                covidPosContact:$covidPosContact }) RETURN u', 
            {
                username: 'zaina',
                password: hashedPW,
                householdSize: 4,
                covidPosContact: false,
            }
        );
        await session.run(
            'MERGE (u:User { username:$username, password:$password, householdSize:$householdSize, \
                covidPosContact:$covidPosContact, covidTest:$covidTest, testDate:$testDate }) RETURN u', 
            {
                username: 'rehab',
                password: hashedPW,
                householdSize: 3,
                covidPosContact: false,
                covidTest: 'negative', 
                testDate: '2020-11-02' 
            }
        );
        await session.run(
            'MERGE (u:User { username:$username, password:$password, householdSize:$householdSize, \
                covidPosContact:$covidPosContact, covidTest:$covidTest, testDate:$testDate }) RETURN u', 
            {
                username: 'ranffi',
                password: hashedPW,
                householdSize: 2,
                covidPosContact: false,
                covidTest: 'negative', 
                testDate: '2020-11-01'
            }
        );

        // create friend/follow relationship
        await session.run(
            'MATCH (zoe:User {username:$zoe}) \
            MATCH (zaina:User {username:$zaina}) \
            CREATE (zoe)-[rel:FOLLOWS]->(zaina)',
            {
                zoe: 'zoe',
                zaina: 'zaina'
            }
        );

        // create contact relationship
        await session.run(
            'MATCH (rehab:User {username:$rehab}) \
            MATCH (ranffi:User {username:$ranffi}) \
            CREATE (rehab)-[rel1:CONTACTED]->(ranffi) \
            CREATE (ranffi)-[rel2:CONTACTED]->(rehab) \
            SET rel1.contactDate = $contactDate \
            SET rel2.contactDate = $contactDate',
            {
                rehab: 'rehab',
                ranffi: 'ranffi',
                contactDate: '2020-11-01'
            }
        );

        session.close();
    }
    catch(err) {
        console.log(err);
    }

}

seed(driver);
import pool from '@/lib/db';

async function query(){

    const connection = await pool.getConnection();
    
    try {
        const [results, fields] = await connection.query(
            'SELECT * FROM Child'
        );

        return results;

    } catch (err) {
        return err;
    }
}


export default query;
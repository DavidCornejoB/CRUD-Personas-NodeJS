import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: 'sql9.freemysqlhosting.net',
    port: '3306',
    user: 'sql9652888',
    password: '5xp5THRip9',
    database: 'sql9652888',
    
});

export default pool;
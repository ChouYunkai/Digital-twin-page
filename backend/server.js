const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const port = 3000;

// SQL Server 配置
const config = {
  user: 'sa',
  password: '1234',
  server: 'LAPTOP-GOVJ4SK7',
  database: '轴承',
  options: {
    enableArithAbort: true,
    encrypt: false,
    trustServerCertificate: true,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }
};

// 使用 CORS 中间件
app.use(cors());

// 用于存储最新数据的缓存
let latestData = null;

// 定时任务函数：每秒查询一次数据库
async function fetchLatestData() {
  let pool;
  try {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server');

    // 执行查询，获取两个表中的最新数据
    const [result1, result2] = await Promise.all([
      pool.request().query(`
        SELECT TOP 1 [Id], [Channel1], [Channel2], [Channel3], [Channel4], 
        [Channel5], [Channel6], [Channel7], [Channel8], [Channel9], 
        [Channel10], [Channel11], [Channel12], [Timestamp]
        FROM [轴承].[dbo].[RTUData]
        ORDER BY [Timestamp] DESC
      `),
      pool.request().query(`
        SELECT TOP 100 [Id], [Channel1], [Channel2], [Channel3], 
        [Channel4], [Channel5], [Timestamp]
        FROM [轴承].[dbo].[ADCData]
        ORDER BY [Timestamp] DESC
      `)
    ]);

    console.log('Queries executed successfully');

    // 更新缓存数据
    latestData = {
      rtuData: {
        categories: result1.recordset.map(row => row.Timestamp),
        series: [
          { name: 'Channel1', data: result1.recordset.map(row => row.Channel1) },
          { name: 'Channel2', data: result1.recordset.map(row => row.Channel2) },
          { name: 'Channel3', data: result1.recordset.map(row => row.Channel3) },
          { name: 'Channel4', data: result1.recordset.map(row => row.Channel4) },
          { name: 'Channel5', data: result1.recordset.map(row => row.Channel5) },
          { name: 'Channel6', data: result1.recordset.map(row => row.Channel6) },
          { name: 'Channel7', data: result1.recordset.map(row => row.Channel7) },
          { name: 'Channel8', data: result1.recordset.map(row => row.Channel8) },
          { name: 'Channel9', data: result1.recordset.map(row => row.Channel9) },
          { name: 'Channel10', data: result1.recordset.map(row => row.Channel10) },
          { name: 'Channel11', data: result1.recordset.map(row => row.Channel11) },
          { name: 'Channel12', data: result1.recordset.map(row => row.Channel12) }
        ]
      },
      adcData: {
        categories: result2.recordset.map(row => row.Timestamp),
        series: [
          { name: 'Channel1', data: result2.recordset.map(row => row.Channel1) },
          { name: 'Channel2', data: result2.recordset.map(row => row.Channel2) },
          { name: 'Channel3', data: result2.recordset.map(row => row.Channel3) },
          { name: 'Channel4', data: result2.recordset.map(row => row.Channel4) },
          { name: 'Channel5', data: result2.recordset.map(row => row.Channel5) }
        ]
      }
    };
  } catch (err) {
    console.error('Database query failed', err);
  } finally {
    if (pool) {
      pool.close();
    }
  }
}

// 启动定时任务
setInterval(fetchLatestData, 1000); // 改为每秒查询一次

// 根路由
app.get('/', (req, res) => {
  res.send('Welcome to the server. Use /api/chart-data to get the latest chart data.');
});

// 获取数据的 API 路由
app.get('/api/chart-data', (req, res) => {
  if (latestData) {
    res.json(latestData);
  } else {
    res.status(500).send('No data available');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

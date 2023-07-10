const jsonServer = require('json-server')
const http = require('http')
const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const server = http.createServer(app)
const { Server } = require('socket.io');
const Tesseract = require('node-tesseract-ocr');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const io = new Server(server, {
    cors: { origin: '*' },
});
//db.defaults({ Login: [], User: [], XeTrongXuong: [], XeDaGiao: [], ThongTinXe: [] }).write();
  
io.on('connection', async (socket) => {
    console.log('Client connected', socket.id);
    
});//io

// Set default middlewares (logger, static, cors and no-cache)
app.use(middlewares)
// Add custom routes before JSON Server router
app.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
app.use(jsonServer.bodyParser)
app.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router

app.post('/ocr', upload.single('image'), async (req, res) => {
    try {
        const config = {
            lang: 'eng', // Ngôn ngữ được sử dụng cho OCR
            oem: 1, // Engin mode, 1 là LSTM
            psm: 1,// Page segmentation mode, 3 là 
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        };
        const imageBuffer = req.file.buffer;
      const result = await Tesseract.recognize(imageBuffer, config);
        console.log({result})
      res.json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});



app.use(router)




server.listen(process.env.PORT || 3000, () => {
  console.log('JSON Server is run')
})
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for images
    fieldSize: 50 * 1024 * 1024, // 50MB for text fields (like content)
    fieldNameSize: 100,
    fields: 10,
    files: 5
  }
});

const uploadSingleImage = upload.single('image');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ 
  extended: true, 
  limit: '50mb' // افزایش حد مجاز برای محتوای طولانی
}));
app.use(express.json({ 
  limit: '50mb' // افزایش حد مجاز برای JSON
}));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
// Serve existing static site assets (index.html, css, js, fonts, img)
app.use(express.static(__dirname));

// Auth helpers
function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) return next();
  return res.redirect('/admin/login');
}

// Seed ensure default admin exists
async function ensureDefaultAdmin() {
  const username = process.env.ADMIN_DEFAULT_USERNAME || 'admin';
  const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  const existing = await prisma.admin.findFirst({ where: { username } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { username, passwordHash } });
    console.log(`Seeded default admin: ${username}`);
  }
}

// API routes
app.get('/api/articles', async (req, res) => {
  const take = req.query.limit ? Number(req.query.limit) : undefined;
  const where = {};
  if (req.query.type) where.type = req.query.type === 'NEWS' ? 'NEWS' : 'ARTICLE';
  if (req.query.featured === '1' || req.query.featured === 'true') where.featured = true;
  const articles = await prisma.article.findMany({ where, orderBy: { createdAt: 'desc' }, take });
  res.json(articles);
});

app.get('/api/articles/:id', async (req, res) => {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

app.post('/api/articles', requireAuth, upload.single('image'), async (req, res) => {
  const { title, summary, content } = req.body;
  const imagePath = req.file ? path.posix.join('public', 'uploads', path.basename(req.file.path)) : null;
  const article = await prisma.article.create({
    data: { title, summary, content, image: imagePath || undefined },
  });
  res.status(201).json(article);
});

app.put('/api/articles/:id', requireAuth, upload.single('image'), async (req, res) => {
  const id = Number(req.params.id);
  const { title, summary, content } = req.body;
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });

  let image = existing.image;
  if (req.file) {
    image = path.posix.join('public', 'uploads', path.basename(req.file.path));
  }

  const updated = await prisma.article.update({
    where: { id },
    data: { title, summary, content, image },
  });
  res.json(updated);
});

app.delete('/api/articles/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });
  await prisma.article.delete({ where: { id } });
  // Optional: delete file from disk
  if (existing.image) {
    const diskPath = path.join(__dirname, existing.image);
    fs.unlink(diskPath, () => {});
  }
  res.json({ success: true });
});

// Admin routes
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.adminId) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.admin.findFirst({ where: { username } });
  if (!admin) return res.render('admin/login', { error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.render('admin/login', { error: 'Invalid credentials' });
  req.session.adminId = admin.id;
  res.redirect('/admin');
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

app.get('/admin', requireAuth, async (_req, res) => {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
  res.render('admin/dashboard', { articles });
});

app.get('/admin/articles/new', requireAuth, (_req, res) => {
  res.render('admin/form', { mode: 'create', article: null, action: '/admin/articles' });
});

app.post('/admin/articles', requireAuth, uploadSingleImage, async (req, res) => {
  const { title, summary, content, type, featured } = req.body;
  const imagePath = req.file ? path.posix.join('public', 'uploads', path.basename(req.file.path)) : null;
  await prisma.article.create({ data: { title, summary, content, image: imagePath || undefined, type: (type === 'NEWS' ? 'NEWS' : 'ARTICLE'), featured: featured === '1' } });
  res.redirect('/admin');
});

// Editor image upload endpoint
app.post('/admin/articles/editor-upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imagePath = path.posix.join('public', 'uploads', path.basename(req.file.path));
    res.json({ 
      location: `/${imagePath}`,
      filename: path.basename(req.file.path)
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/admin/articles/:id/edit', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({ where: { id }, include: { images: true } });
  if (!article) return res.redirect('/admin');
  res.render('admin/form', { mode: 'edit', article, action: `/admin/articles/${id}` });
});

app.post('/admin/articles/:id', requireAuth, uploadSingleImage, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return res.redirect('/admin');
  const { title, summary, content, deleteCover, type, featured } = req.body;
  const coverFile = req.file;

  let image = existing.image;
  if (deleteCover === '1') {
    // delete previous file on disk
    if (image) { try { fs.unlink(path.join(__dirname, image), () => {}); } catch (_e) {} }
    image = null;
  } else if (coverFile) {
    image = path.posix.join('public', 'uploads', path.basename(coverFile.path));
  }

  await prisma.article.update({ where: { id }, data: { title, summary, content, image, type: (type === 'NEWS' ? 'NEWS' : 'ARTICLE'), featured: featured === '1' } });
  res.redirect('/admin');
});
// Removed gallery image endpoints

app.post('/admin/articles/:id/delete', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.article.findUnique({ where: { id } });
  if (existing) {
    await prisma.article.delete({ where: { id } });
    if (existing.image) {
      const diskPath = path.join(__dirname, existing.image);
      fs.unlink(diskPath, () => {});
    }
  }
  res.redirect('/admin');
});

// Root route serves existing index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Public article pages
app.get('/articles', async (_req, res) => {
  const articles = await prisma.article.findMany({ where: { type: 'ARTICLE' }, orderBy: { createdAt: 'desc' } });
  res.render('articles/index', { articles, isNews: false });
});

// News listing
app.get('/news', async (_req, res) => {
  const articles = await prisma.article.findMany({ where: { type: 'NEWS' }, orderBy: { createdAt: 'desc' } });
  res.render('articles/index', { articles, isNews: true });
});

app.get('/articles/:id', async (req, res) => {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({ where: { id }, include: { images: true } });
  if (!article) return res.status(404).send('Not found');
  res.render('articles/show', { article });
});

// News detail (same template)
app.get('/news/:id', async (req, res) => {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({ where: { id }, include: { images: true } });
  if (!article) return res.status(404).send('Not found');
  res.render('articles/show', { article });
});

async function start() {
  await ensureDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});



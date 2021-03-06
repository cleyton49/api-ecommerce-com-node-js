/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';

import * as router from './routes/index.js';

dotenv.config();

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('./src/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.disable('x-powered-by');

app.use(cors());

app.use(compression());

app.use('/usuarios', router.usersRouter);
app.use('/lojas', router.storesRouter);
app.use('/clientes', router.clientsRouter);
app.use('/categorias', router.categoriesRouter);
app.use('/produtos', router.productsRouter);
app.use('/variacoes', router.variationsRouter);
app.use('/avaliacoes', router.ratingsRouter);
app.use('/pedidos', router.requestsRouter);
app.use('/entregas', router.deliverysRouter);
app.use('/pagamentos', router.paymentsRouter);

// ROUTE 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// ROUTE - 422, 500, 401
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.status !== 404) {
    console.log('Error', err);
  }

  res.status(err.status || 500).json(err);
});

app.listen(process.env.PORT, (err) => {
  if (!err) {
    console.log('Server On, PORT ', process.env.PORT);
  } else {
    console.log(err);
  }
});

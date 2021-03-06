import expressValidation from 'express-validation';

import Products from '../models/Products.js';
import Variations from '../models/Variations.js';

const { Joi, validate } = expressValidation;

export const getByIdValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const payValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    senderHash: Joi.string().optional(),
  }),
});

export const updateValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    status: Joi.string().optional(),
  }),
});

export const checkTotalValue = async ({ cart, delivery, payment }) => {
  try {
    const cartList = await Promise.all(
      cart.map(async (item) => {
        item.product = await Products.findById(item.product);
        item.variation = await Variations.findById(item.variation);

        return item;
      }),
    );

    let totalValue = delivery.cost;
    totalValue += cartList.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    );

    return (
      totalValue.toFixed(2) === payment.value.toFixed(2) &&
      (!payment.parceled || payment.parceled <= 6)
    );
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const checkCard = (payment) => {
  if (payment.form === 'creditCard') {
    return (
      payment.card.fullName &&
      typeof payment.card.fullName === 'string' &&
      payment.card.areaCode &&
      typeof payment.card.areaCode === 'string' &&
      payment.card.phone &&
      typeof payment.card.phone === 'string' &&
      payment.card.dateOfBirth &&
      typeof payment.card.dateOfBirth === 'string' &&
      payment.card.credit_card_token &&
      typeof payment.card.credit_card_token === 'string' &&
      payment.card.cpf &&
      typeof payment.card.cpf === 'string'
    );
  }

  if (payment.form === 'boleto') return true;

  return false;
};

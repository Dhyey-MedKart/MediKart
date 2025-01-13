import prisma from "../db/db.js";
import { OrderStatus } from "@prisma/client"; // Assuming you have defined OrderStatus enum

// Service to place an order
export const placeOrder = async (userId, items) => {
  // Validate items and calculate total price
  const orderItems = [];
  let totalPrice = 0;

  for (let item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.salesPrice, // Assuming price is taken from product
    });

    totalPrice += product.salesPrice * item.quantity;
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      total: totalPrice,
      items: {
        create: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  return order;
};

// Service to get orders by user ID
export const getOrdersByUser = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true, // Include order items in the response
    },
  });

  return orders;
};

// Service to get a single order by ID
export const getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: true, // Include order items in the response
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

// Service to update order status (for admin)
export const updateOrderStatus = async (orderId, status, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Check if user is admin (optional)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user.role !== "ADMIN") {
    throw new Error("Only admins can update order status");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status, // status should be one of the OrderStatus enum values
    },
  });

  return updatedOrder;
};

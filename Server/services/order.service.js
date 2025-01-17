import prisma from "../db/db.js";
import { OrderStatus } from "@prisma/client"; // Assuming you have defined OrderStatus enum
import * as CartService from "../services/cart.service.js";
// Service to place an order
export const placeOrder = async (userId, items) => {
  // Validate items and calculate total price
  const orderItems = [];
  let totalPrice = 0;
  //console.log(items);
  for (let item of items.items) {
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
  try
  {
    const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true, // Include order items in the response
    },
  });

  return orders;
}
  catch (error) {
    throw new Error(" service Error fetching orders: " + error.message);
  }
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

export const getAllOrder = async () => {
  try {
    // Fetch all users from the database
    const users = await prisma.order.findMany({
    });
    const fetchedUserIds = new Set();  // Set to store userIds that have already been processed
    const allOrders = await Promise.all(
      users.map((userObj) => {
        if (fetchedUserIds.has(userObj.userId)) {
          return null;  // Skip fetching orders for this user if already processed
        }
        fetchedUserIds.add(userObj.userId);  // Mark this userId as processed
        return getOrdersByUser(userObj.userId);  // Fetch orders for the user
      }).filter((order) => order !== null)  // Remove any null values (skipped requests)
    );
    const combinedOrders = allOrders.flat();
    return combinedOrders;
    
    //console.log(users);
  }
  catch (error) {
    console.error("Service error: " + error.message);
    throw new Error("Service error fetching USERS: " + error.message);
  }

   
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

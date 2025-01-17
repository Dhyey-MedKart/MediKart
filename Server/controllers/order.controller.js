import * as OrderService from "../services/order.service.js";
import prisma from "../db/db.js";
import * as CartService from "../services/cart.service.js";

// Controller to place an order
export const placeOrderController = async (req, res) => {

  let userId = req.user.email;
  userId = await prisma.User.findFirst({
    where: { email : userId},
  }); // Assuming the user is authenticated
  userId = userId.id;
  try {
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });
    //console.log(cart);
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.userId },
      // include: { productId: true,
      //   quantity: true, }, // You can include the product details if needed
    });
    const items = {
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
    //console.log(items);
    // Call the service to create an order
    const order = await OrderService.placeOrder(userId, items);

    res.status(200).json({ order });
  } catch (error) {
    console.log("Error in placeOrderController:", error.message);
    res.status(500).json({ message: "Error placing order" });
  }
};

// Controller to get orders by user
export const getOrdersByUserController = async (req, res) => {
  let userId = req.user.email;
  userId = await prisma.User.findFirst({
    where: { email : userId},
  }); // Assuming the user is authenticated
  userId = userId.id;
  try {
    const orders = await OrderService.getOrdersByUser(userId);

    res.status(200).json({ orders });
  } catch (error) {
    console.log("Error in getOrdersByUserController:", error.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
};



export const getAllOrderController = async (req, res) => {
  //console.log(req);
  try {
    const orderDetailsForUsers = await OrderService.getAllOrder(); // Fetch the orders data
    return res.status(200).json(orderDetailsForUsers); // Send response with status 200 and data
  } catch (error) {
    console.log("Error in getAllOrderController:", error.message);
    res.status(500).json({ message: "Error fetching all orders" }); // Return 500 on error
  }
};

// Controller to get a single order by ID
export const getOrderController = async (req, res) => {
  const { id } = req.params;
  let userId = req.user.email;
  userId = await prisma.User.findFirst({
    where: { email : userId},
  }); // Assuming the user is authenticated
  userId = userId.id;
  try {
    const order = await OrderService.getOrderById(userId, parseInt(id));
    res.status(200).json({ order });
  } catch (error) {
    console.log("Error in getOrderController:", error.message);
  }
};


// Controller to update order status (for admin)
export const updateOrderStatusController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let userId = req.user.email;
  userId = await prisma.User.findFirst({
    where: { email : userId},
  });
  userId = userId.id; // Assuming the user is authenticated

  try {
    const updatedOrder = await OrderService.updateOrderStatus(parseInt(id), status, userId);

    res.status(200).json({ updatedOrder });
  } catch (error) {
    console.log("Error in updateOrderStatusController:", error.message);
    res.status(500).json({ message: "Error updating order status" });
  }
};

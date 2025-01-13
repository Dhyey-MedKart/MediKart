import * as OrderService from "../services/order.service.js";

// Controller to place an order
export const placeOrderController = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
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
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    const orders = await OrderService.getOrdersByUser(userId);

    res.status(200).json({ orders });
  } catch (error) {
    console.log("Error in getOrdersByUserController:", error.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Controller to get a single order by ID
export const getOrderController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    const order = await OrderService.getOrderById(userId, parseInt(id));
    res.status(200).json({ order });
  } catch (error) {
    console.log("Error in getOrderController:", error.message);
    res.status(500).json({ message: "Error fetching order" });
  }
};

// Controller to update order status (for admin)
export const updateOrderStatusController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    const updatedOrder = await OrderService.updateOrderStatus(parseInt(id), status, userId);

    res.status(200).json({ updatedOrder });
  } catch (error) {
    console.log("Error in updateOrderStatusController:", error.message);
    res.status(500).json({ message: "Error updating order status" });
  }
};

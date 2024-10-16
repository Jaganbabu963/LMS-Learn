import paypal from "../helpers/paypal.js";
import Order from "../models/order.js";
import StudentCourses from "../models/studentCourses.js";
import Course from "../models/courses.js";

// console.log("CLIENT_URL:", process.env.CLIENT_URI);

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing, // This may be a string; convert it to a number.
    } = req.body;

    // Convert coursePricing to a number and validate it

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URI}/payment-return`,
        cancel_url: `${process.env.CLIENT_URI}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: coursePricing.toFixed(2), // Ensure price is a string.
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: coursePricing.toFixed(2), // Ensure total is a string.
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("PayPal Error: ", error.response || error);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment!",
          error: error.response?.details || "Unknown error",
        });
      }

      const newlyCreatedCourseOrder = new Order({
        userId,
        userName,
        userEmail,
        orderStatus: "pending",
        paymentMethod: "paypal",
        paymentStatus: "initiated",
        orderDate: new Date(),
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing, // Store the numeric value in the database.
      });

      await newlyCreatedCourseOrder.save();

      const approveUrl = paymentInfo.links?.find(
        (link) => link.rel === "approval_url"
      )?.href;

      if (!approveUrl) {
        return res.status(500).json({
          success: false,
          message: "Approval URL not found!",
        });
      }

      res.status(201).json({
        success: true,
        data: {
          approveUrl,
          orderId: newlyCreatedCourseOrder._id,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

export const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();

    //update out student course model
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some Error Occured",
    });
  }
};

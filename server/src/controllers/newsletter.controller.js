import * as newsletterService from "../services/newsletter.service.js";

// 1. PUBLIC: Subscribe email
export const subscribe = async (req, res, next) => {
  try {
    const { email, source } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const result = await newsletterService.subscribeEmail(email, source);
    res.status(200).json({
      success: true,
      alreadySubscribed: result.alreadySubscribed,
      message: result.message,
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};

// 2. PUBLIC: Unsubscribe email
export const unsubscribe = async (req, res, next) => {
  try {
    const email = req.query.email || req.body.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const result = await newsletterService.unsubscribeEmail(email);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// 3. ADMIN: Get subscribers list & metrics
export const getSubscribers = async (req, res, next) => {
  try {
    const data = await newsletterService.getSubscribersList();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 4. ADMIN: Delete a subscriber
export const deleteSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await newsletterService.deleteSubscriber(id);
    res.status(200).json({
      success: true,
      message: "Subscriber removed successfully.",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

// 5. ADMIN: Get past broadcast history
export const getBroadcastHistory = async (req, res, next) => {
  try {
    const history = await newsletterService.getBroadcastHistory();
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

// 6. ADMIN: Send mass email broadcast
export const sendBroadcast = async (req, res, next) => {
  try {
    const { subject, body, isTest, testEmail } = req.body;

    const result = await newsletterService.sendBroadcast({
      subject,
      body,
      adminUser: req.user,
      isTest: Boolean(isTest),
      testEmail,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

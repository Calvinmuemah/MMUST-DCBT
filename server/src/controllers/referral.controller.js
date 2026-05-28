import {
  applyReferralCode,
  getReferralOverview,
  validateReferralCode,
} from "../services/referral.service.js";

export const getMyReferral = async (req, res) => {
  try {
    const data = await getReferralOverview(req.user.dbId);

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const checkReferralCode = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await validateReferralCode(code, req.user?.dbId || null);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const applyReferral = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await applyReferralCode(req.user.dbId, code);

    res.json({
      message: "Referral code applied successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

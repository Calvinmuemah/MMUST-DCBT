import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntry,
  getJournalDashboard,
  getJournalReports,
  listJournalEntries,
  updateJournalEntry,
  createReflection as createReflectionEntry,
  listReflections,
  getReflection,
  updateReflection,
  deleteReflection,
} from "../services/journal.service.js";

export const createEntry = async (req, res) => {
  try {
    const result = await createJournalEntry(req.user.dbId, req.body);

    res.status(201).json({
      message: "Journal entry created successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const getEntries = async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10);
    const offset = Number.parseInt(req.query.offset, 10);

    const entries = await listJournalEntries(req.user.dbId, limit, offset);

    res.json({
      data: entries,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getEntryById = async (req, res) => {
  try {
    const entry = await getJournalEntry(req.user.dbId, req.params.entryId);

    if (!entry) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    return res.json({
      data: entry,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const editEntry = async (req, res) => {
  try {
    const entry = await updateJournalEntry(req.user.dbId, req.params.entryId, req.body);

    if (!entry) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    return res.json({
      message: "Journal entry updated successfully",
      data: entry,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const removeEntry = async (req, res) => {
  try {
    const deleted = await deleteJournalEntry(req.user.dbId, req.params.entryId);

    if (!deleted) {
      return res.status(404).json({
        message: "Journal entry not found",
      });
    }

    return res.json({
      message: "Journal entry deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const filter = req.query.filter || "weekly";
    const reports = await getJournalReports(req.user.dbId, filter);

    res.json({
      data: reports,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const filter = req.query.filter || "weekly";
    const dashboard = await getJournalDashboard(req.user.dbId, filter);

    res.json({
      data: dashboard,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const filter = req.query.filter || "weekly";
    const dashboard = await getJournalDashboard(req.user.dbId, filter);

    res.json({
      data: {
        feelings: dashboard.journalEntries,
        chats: dashboard.chatHistory,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const createReflection = async (req, res) => {
  try {
    const result = await createReflectionEntry(req.user.dbId, req.body);

    res.status(201).json({
      message: "Reflection saved",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getReflections = async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10);
    const offset = Number.parseInt(req.query.offset, 10);
    const tag = req.query.tag ? String(req.query.tag) : undefined;
    const sessionId = req.query.sessionId ? String(req.query.sessionId) : undefined;

    const items = await listReflections(req.user.dbId, limit, offset, { tag, sessionId });

    res.json({ data: items });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getReflectionById = async (req, res) => {
  try {
    const item = await getReflection(req.user.dbId, req.params.reflectionId);

    if (!item) {
      return res.status(404).json({ message: "Reflection not found" });
    }

    res.json({ data: item });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const editReflection = async (req, res) => {
  try {
    const updated = await updateReflection(req.user.dbId, req.params.reflectionId, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Reflection not found' });
    }

    res.json({ message: 'Reflection updated', data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeReflection = async (req, res) => {
  try {
    const deleted = await deleteReflection(req.user.dbId, req.params.reflectionId);

    if (!deleted) {
      return res.status(404).json({ message: 'Reflection not found' });
    }

    res.json({ message: 'Reflection deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

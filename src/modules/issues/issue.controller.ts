import type { Request, Response } from "express";
import { issueService } from "./issue.service.js";

// POST /api/issues
const createIssue = async (req: Request, res: Response) => {
  try {
    // reporter id comes from the JWT token, not the request body
    const reporterId = req.user?.id;

    const result = await issueService.createIssueIntoDB(req.body, reporterId);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/issues
const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query as {
      sort?: string;
      type?: string;
      status?: string;
    };

    const result = await issueService.getAllIssuesFromDB(sort, type, status);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/issues/:id
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issueService.getSingleIssueFromDB(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/issues/:id
const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    // check if issue exists
    const existing = await issueService.getSingleIssueFromDB(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    // contributor permission checks
    if (userRole === "contributor") {
      // contributor cannot change status
      if (req.body.status) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Only maintainers can change issue status",
        });
      }

      // contributor can only edit their own issue
      if (existing.reporter?.id !== userId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only edit your own issues",
        });
      }

      // contributor can only edit open issues
      if (existing.status !== "open") {
        return res.status(409).json({
          success: false,
          message: "Conflict: You can only edit issues with status open",
        });
      }
    }

    const result = await issueService.updateIssueInDB(id, req.body);

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/issues/:id — maintainer only
const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issueService.deleteIssueFromDB(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};

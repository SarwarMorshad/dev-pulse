import type { Request, Response } from "express";
import { issueService } from "./issue.service.js";
import sendResponse from "../../utils/sendResponse.js";

// POST /api/issues
const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = req.user?.id;
    const result = await issueService.createIssueIntoDB(req.body, reporterId);
    sendResponse(res, 201, true, "Issue created successfully", result);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
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
    sendResponse(res, 200, true, "Issues fetched successfully", result);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// GET /api/issues/:id
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await issueService.getSingleIssueFromDB(id);

    if (!result) {
      return sendResponse(res, 404, false, "Issue not found");
    }

    sendResponse(res, 200, true, "Issue fetched successfully", result);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// PATCH /api/issues/:id
const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const existing = await issueService.getSingleIssueFromDB(id);

    if (!existing) {
      return sendResponse(res, 404, false, "Issue not found");
    }

    if (userRole === "contributor") {
      if (req.body.status) {
        return sendResponse(res, 403, false, "Forbidden: Only maintainers can change issue status");
      }

      if (existing.reporter?.id !== userId) {
        return sendResponse(res, 403, false, "Forbidden: You can only edit your own issues");
      }

      if (existing.status !== "open") {
        return sendResponse(res, 409, false, "Conflict: You can only edit issues with status open");
      }
    }

    const result = await issueService.updateIssueInDB(id, req.body);
    sendResponse(res, 200, true, "Issue updated successfully", result);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// DELETE /api/issues/:id — maintainer only
const deleteIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await issueService.deleteIssueFromDB(id);

    if (!result) {
      return sendResponse(res, 404, false, "Issue not found");
    }

    sendResponse(res, 200, true, "Issue deleted successfully");
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};

import { Router } from "express";
import { issueController } from "./issue.controller.js";
import auth from "../../middleware/auth.js";
import authorizeRole from "../../middleware/authorizeRole.js";

const router = Router();

// create issue — authenticated users only
router.post("/", auth(), issueController.createIssue);

// get all issues — public
router.get("/", issueController.getAllIssues);

// get single issue — public
router.get("/:id", issueController.getSingleIssue);

// update issue — authenticated (permission logic handled in controller)
router.patch("/:id", auth(), issueController.updateIssue);

// delete issue — maintainer only
router.delete("/:id", auth(), authorizeRole("maintainer"), issueController.deleteIssue);

export const issueRoute = router;

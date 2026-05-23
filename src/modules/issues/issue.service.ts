import { pool } from "../../db/index.js";
import type { ICreateIssue, IUpdateIssue } from "./issue.interface.js";

// create a new issue
const createIssueIntoDB = async (payload: ICreateIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId]
  );

  return result.rows[0];
};

// get all issues with optional sort and filter
const getAllIssuesFromDB = async (sort?: string, type?: string, status?: string) => {
  const conditions: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (type) {
    conditions.push(`type = $${i}`);
    values.push(type);
    i++;
  }

  if (status) {
    conditions.push(`status = $${i}`);
    values.push(status);
    i++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderClause = sort === "oldest" ? "ORDER BY created_at ASC" : "ORDER BY created_at DESC";

  const issuesResult = await pool.query(
    `SELECT * FROM issues ${whereClause} ${orderClause}`,
    values
  );

  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  // get reporter info separately — no JOIN allowed
  const reporterIds = [...new Set(issues.map((issue: any) => issue.reporter_id))];
  const placeholders = reporterIds.map((_: any, idx: number) => `$${idx + 1}`).join(", ");

  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    reporterIds
  );

  // map users by id for quick lookup
  const usersMap: any = {};
  usersResult.rows.forEach((user: any) => {
    usersMap[user.id] = user;
  });

  // attach reporter to each issue
  return issues.map((issue: any) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: usersMap[issue.reporter_id] || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
};

// get single issue by id
const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );

  if (issueResult.rows.length === 0) return null;

  const issue = issueResult.rows[0];

  // get reporter info separately — no JOIN allowed
  const userResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );

  const reporter = userResult.rows[0] || null;

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

// update an issue
const updateIssueInDB = async (id: string, payload: IUpdateIssue) => {
  const { title, description, type, status } = payload;

  const result = await pool.query(
    `UPDATE issues
     SET
       title       = COALESCE($1, title),
       description = COALESCE($2, description),
       type        = COALESCE($3, type),
       status      = COALESCE($4, status),
       updated_at  = NOW()
     WHERE id = $5
     RETURNING *`,
    [title || null, description || null, type || null, status || null, id]
  );

  return result.rows[0];
};

// delete an issue
const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  deleteIssueFromDB,
};

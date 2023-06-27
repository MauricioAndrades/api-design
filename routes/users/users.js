const express = require("express");
const { db } = require("../../db/db");

const router = express.Router();
const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("./controller");
const { validateCreateUser, validateUpdateUser } = require("./validators");

/**
 * Create a new user.
 *
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @returns {object} 201 - User created successfully.
 * @returns {object} 500 - Failed to create user.
 * @route POST /api/users
 * @group Users
 */
router.post("/", async (req, res) => {
  try {
    console.log(req, res);
    const { name, email } = req.body;

    const validationResult = validateCreateUser(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    }

    // Insert the user into the database
    const userId = await createUser(name, email);

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * Get a list of users with optional pagination, filtering, and sorting.
 *
 * @example
 *     GET /api/users?page=1&pageSize=10
 *
 * @param {number} req.query.page - The page number.
 * @param {number} req.query.pageSize - The number of users per page.
 * @param {string} req.query.name - The name to filter users.
 * @param {string} req.query.sortBy - The field to sort users by.
 * @param {string} req.query.sortOrder - The sort order (ascending or descending).
 * @returns {object} 200 - The list of users.
 * @returns {object} 500 - Internal server error.
 * @route GET /api/users
 * @group Users
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const { name } = req.query;
    const { sortBy } = req.query;
    const { sortOrder } = req.query;

    const users = await getUsers(page, pageSize, name, sortBy, sortOrder);

    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const validationResult = validateUpdateUser(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    }
    const user = await updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

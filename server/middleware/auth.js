const express = require("express");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const authentication = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(" ")[1];
  if (!token) {
    res.status(401).json({
      error: true,
      message: "Not Authorization",
    });
  } else {
    try {
      let decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      req.token_decoded = decode;
      next();
    } catch (error) {
      res.json({
        error: {
          status: error.status || 500,
          message: error.message || "Internal Server Error",
        },
      });
    }
  }
};

module.exports = authentication;

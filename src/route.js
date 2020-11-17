const express = require("express");
const router = express.Router();

const helper = require("./helper");

const aliases = require(__dirname + "/../aliases.json").aliases;
const modes = require(__dirname + "/../modes.json").modes;

function error(res, message) {
  return res.status(400).json({
    error: true,
    message: message,
  });
}

router.get("/format/:str", async (req, res) => {
    return res.status(200).json({
       result: helper.formatString(req.params.str)
    })
});

router.get("/mode/:mode", async (req, res) => {
    const mode = req.params.mode;
    if (!(mode in modes)) {
        return error (res, "Unknown mode");
    }

    const { color, display } = modes[mode];

    return res.status(200).json({
        error: false,
        color: color,
        display: display
    })
});

router.get("/", async (req, res) => {
  let { type, first, last } = req.query;
  
  let result = {
    error: false,
    first: "",
    last: "",
    alias: {
      used: false,
      alias: "",
    },
    loginUrl: "",
  };

  result.first = first;
  result.last = last;

  if (result.first != undefined && result.first.length > 0) {
    result.first = helper.formatString(result.first);
  } else {
    return error(res, "First name not supplied");
  }

  // check if alias?
  if (first.startsWith("*")) {
    const a = first.substring(1).toLowerCase().trim();

    if (!(a in aliases)) {
      return error(res, "Unknown alias");
    }

    const alias = aliases[a];

    // update values
    type = alias.mode;

    result.first = helper.formatString(alias.first);
    result.last = helper.formatString(alias.last);
    result.alias.used = true;
    result.alias.alias = alias;
  }

  let ami = result.first;

  if (result.last != undefined && result.last.length > 0) {
    result.last = helper.formatString(result.last);
    ami += "." + result.last;
  }

  // Type not found
  if (!(type in modes)) {
    return error(res, "Unknown type");
  }

  const mode = modes[type];
  result.loginUrl = mode.url.replace("{ami}", ami);

  console.log(result);
  return res.status(200).json(result);
});

module.exports = router;
import JSBI from "jsbi";

export const getError = (error: any) => {
  let errorMsg =
    error && error.message ? error.message : "Something went wrong";
  if (errorMsg.indexOf("Internal JSON-RPC error") > -1) {
    let msg = errorMsg.replace("Internal JSON-RPC error.", "");
    msg = JSON.parse(msg);
    console.log("msg.message", msg.message);
    msg.message =
      msg.message === "header not found"
        ? "Server is not responding please try again"
        : msg.message.split(":")[2];
    return msg.message;
  } else if (errorMsg.indexOf("execution reverted:") > -1) {
    errorMsg = error.message.split("{")[0].split(":")[1];
    return errorMsg;
  } else if (errorMsg.indexOf("INVALID_ARGUMENT") > -1) {
    return errorMsg.split("(")[0];
  } else if (errorMsg.split(" ")[1] === "insufficient") {
    return "You have insufficient balance";
  } else if (errorMsg.split(" ")[1] === "rejected") {
    return "User rejected signing";
  } else {
    return errorMsg;
  }
};

/**CONVERT NUMBER WITH DECIMALS FOR CONTRACT CALL */
export const convertWithDecimal = (value: any, decimal: any) => {
  const decimalBigN = JSBI.BigInt(decimal);
  const convertedDecimal = JSBI.exponentiate(JSBI.BigInt(10), decimalBigN);
  return toWei(value, String(convertedDecimal));
};

// Function to convert into wei
function toWei(input: any, unit: any) {
  var ether = numberToString(input); // eslint-disable-line
  var base = unit;
  var baseLength = base.length - 1 || 1;
  if (ether === ".") {
    throw new Error(
      "[ethjs-unit] while converting number " + input + " to wei, invalid value"
    );
  }

  // Is it negative?
  var negative = ether.substring(0, 1) === "-";

  if (negative) {
    ether = ether.substring(1);
  }
  // Split it into a whole and fractional part
  var comps = ether.split("."); // eslint-disable-line
  if (comps.length > 2) {
    throw new Error(
      "[ethjs-unit] while converting number " +
        input +
        " to wei,  too many decimal points"
    );
  }
  var whole = comps[0],
    fraction = comps[1]; // eslint-disable-line
  if (!whole) {
    whole = "0";
  }
  if (!fraction) {
    fraction = "0";
  }
  if (fraction.length > baseLength) {
    throw new Error(
      "[ethjs-unit] while converting number " +
        input +
        " to wei, too many decimal places"
    );
  }

  while (fraction.length < baseLength) {
    fraction += "0";
  }

  if (!parseInt(whole)) {
    return fraction.replace(/^0*(?=[1-9])/g, "");
  }

  if (negative) {
    return "-" + whole + fraction;
  }

  return whole + fraction;
}

function numberToString(arg: any) {
  if (typeof arg === "string") {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(
        "while converting number to string, invalid number value '" +
          arg +
          "', should be a number matching (^-?[0-9.]+)."
      );
    }
    return arg;
  } else if (typeof arg === "number") {
    return String(arg);
  } else if (
    typeof arg === "object" &&
    arg.toString &&
    (arg.toTwos || arg.dividedToIntegerBy)
  ) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    } else {
      // eslint-disable-line
      return arg.toString(10);
    }
  }
  throw new Error(
    "while converting number to string, invalid number value '" +
      arg +
      "' type " +
      typeof arg +
      "."
  );
}

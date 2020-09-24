export var deliverySlots = [
  "11:30",
  "14:00",
  "17:00"
]

export var deliveryTimingsUI = [
  { 
    orderBy: "11:30 AM",
    period: "12:30 - 2:30"
  },
  { 
    orderBy: "2:00 PM",
    period: "3 - 5"
  },
  { 
    orderBy: "5:00  PM",
    period: "6 - 8"
  }
]

export var deliveryTimingsData = [
  { 
    slot: "11:30",
    period: "12:30 - 2:30"
  },
  { 
    slot: "14:00",
    period: "3 - 5"
  },
  { 
    slot: "17:00",
    period: "6 - 8"
  }
];

export var deliveryTimingsOnly = ["12:30 - 2:30", "3 - 5", "6 - 8"];

export var lastOrderTimings = [
  { 
    slot: "11:25",
    period: "12:30 - 2:30",
  },
  { 
    slot: "13:55",
    period: "3 - 5",
  },
  { 
    slot: "16:55",
    period: "6 - 8",
  }
]

export function isEmpty(obj) {
    for(var key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}

/** Checks if each store that customer has ordered from has a minimum purchase of S$4 */
export function isMinimumPurchaseAmount(cart, order) {
  var isValid = true;
  for (var storeId in order) {
    var targetItems = order[storeId];
    var finalItems = cart.filter(cartItem => targetItems.includes(cartItem.id));
    var total = finalItems.reduce((acc, currItem) => { 
        return acc + (parseFloat(currItem.price) * parseInt(currItem.qty))
      }, 0)
    if (total < 4.00) {
      isValid = false;
    }
  }
  return isValid;
}
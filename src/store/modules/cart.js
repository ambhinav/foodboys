import { getDistanceFromLatLonInKm } from '@/utils/distanceCalculator';
import { getCurrentDateAndMonth, getTimeStamp } from '@/utils/dateTimeUtil';
import { db } from '@/firebase/init';

export default {
  state: {
    deliveryDetails: {},
    cart: [],
  },
  getters: {
    getDeliveryDetails: (state) => state.deliveryDetails,
    getCart: (state) => state.cart,
    isCartFilled: (state) => state.cart.length > 0,
    getTotalPrice: (state) => {
      return state.cart.reduce((acc, currItem) => { 
        return acc + (parseFloat(currItem.price) * parseInt(currItem.qty))
      }, 0)
    },
    getCartLength: (state) => state.cart.length,
  },
  mutations: {
    addItemToCart(state, item) {
      state.cart.push({
        ...item,
      })
    },
    decrementQty(state, targetItem) {
      var newQty = parseInt(targetItem.qty) - 1;
      var newItem = { ...targetItem, qty: newQty };
      var index = state.cart.findIndex(item => item.id === targetItem.id);
      state.cart.splice(index, 1, newItem);
    },
    incrementQty(state, targetItem) {
      var newQty = parseInt(targetItem.qty) + 1;
      var newItem = { ...targetItem, qty: newQty };
      var index = state.cart.findIndex(item => item.id === targetItem.id);
      state.cart.splice(index, 1, newItem);
    },
    removeItemFromCart(state, targetItem) {
      state.cart = state.cart.filter(item => item.id !== targetItem.id)
    },
    clearCart(state) {
      state.cart = []
    },
    setDeliveryDetails: (state, deliveryDetails) => state.deliveryDetails = { ...deliveryDetails },
    clearDeliveryDetails: (state) => state.deliveryDetails = {},
    setCustomerDetails: (state, customerDetails) => state.deliveryDetails = { ...state.deliveryDetails, ...customerDetails },
    setDeliveryLocation: (state, deliveryLocation) => state.deliveryDetails = { ...state.deliveryDetails, deliveryLocation },
    setDeliveryCost: (state, deliveryCost) => state.deliveryDetails = { ...state.deliveryDetails, deliveryCost }
  },
  actions: {
    getSearchResults(context, searchTerm) {
      return fetch(`https://developers.onemap.sg/commonapi/search?searchVal=${searchTerm}&returnGeom=Y&getAddrDetails=Y&pageNum=1`)
        .then(res => res.json())
        .then(res => {
          if (!res.results) {
            return [];
          }
          return res.results.slice(0, 5) // get first 5 entries
        })
    },
    // finds the geolocation of users address based on OneMap's search results
    // OneMap API: https://docs.onemap.sg/#search
    // then calculates and sets delivery cost
    propogateDeliveryLocationAndCost({ state, commit, getters }, { results, targetAddress }) {
      return new Promise((resolve) => {
        var geoAddress = results.find(res => res["ADDRESS"] == targetAddress);
        commit('setDeliveryLocation', geoAddress);
        var targetMarket = getters.getMarkets.find(market => market.id === state.deliveryDetails.marketId); 
        var distance = getDistanceFromLatLonInKm(
          targetMarket.location.latitude,
          targetMarket.location.longitude,
          geoAddress["LATITUDE"],
          geoAddress["LONGITUDE"]
        )
        let cost = 6;
        if (distance > 8) {
          cost = 9;
        }
        commit("setDeliveryCost", cost);
        resolve()
      })
    },
    addPaynowAndCashOrder({ commit, state }, customerDetails) {
      var { paymentMethod, customerName, phoneNumber } = customerDetails;
      var { deliveryLocation, marketId, deliveryCost } = state.deliveryDetails;
      var shortenedPhoneNumber = phoneNumber.toString().slice(0, 4);
      var invoiceNumber = `${marketId}${shortenedPhoneNumber}${getCurrentDateAndMonth()}`;
      commit("setCustomerDetails", { ...customerDetails, invoiceNumber }); 
      return db.collection("Orders")
        .add({
          invoiceNumber, // a friendlier ID for customer and admin to use
          paid: false,
          paymentMethod,
          customerName,
          customerNumber: phoneNumber,
          deliveryCost,
          deliveryAddress: deliveryLocation["ADDRESS"],
          cart: state.cart,
          timestamp: getTimeStamp() 
        })
    }
  }
};